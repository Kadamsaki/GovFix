import random
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.complaint import Complaint
from app.models.audit import AuditLog
from app.schemas.workflow import (
    ComplaintCreate,
    ComplaintResponse,
    TransitionRequest,
    TransitionResult,
    AuditLogResponse,
)
from app.services.workflow import WorkflowEngine

router = APIRouter(prefix="/complaints", tags=["Complaints & Workflow"])


@router.get("", response_model=List[ComplaintResponse], summary="List Complaints (Role Filtered)")
def list_complaints(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns complaints strictly filtered by the authenticated user's role:
    - Citizen: views only their own complaints.
    - Officer: views only complaints assigned to them.
    - Supervisor: views complaints within their jurisdiction/department.
    - Admin: views all complaints across the municipality.
    """
    query = db.query(Complaint)

    # 1. Role-based scoping
    if current_user.role == "citizen":
        query = query.filter(Complaint.citizen_id == current_user.id)
    elif current_user.role == "officer":
        query = query.filter(Complaint.assigned_officer_id == current_user.id)
    elif current_user.role == "supervisor":
        # Supervisors see complaints in their ward or department if configured, or all within jurisdiction
        if current_user.department and current_user.department != "Public Works & Grievance Cell":
            query = query.filter(
                (Complaint.assigned_department == current_user.department)
                | (Complaint.ward == current_user.ward)
            )
    # Admin sees all complaints without filters

    # 2. Query filters
    if status_filter:
        query = query.filter(Complaint.status == status_filter.upper())
    if category:
        query = query.filter(Complaint.category == category)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Complaint.id.ilike(search_fmt))
            | (Complaint.title.ilike(search_fmt))
            | (Complaint.location.ilike(search_fmt))
            | (Complaint.category.ilike(search_fmt))
        )

    return query.order_by(desc(Complaint.created_at)).all()


@router.get("/stats/summary", summary="Workflow Statistics Overview")
def get_complaint_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Provides high-level counts by status and department for dashboards."""
    total = db.query(Complaint).count()
    submitted = db.query(Complaint).filter(Complaint.status == "SUBMITTED").count()
    under_review = db.query(Complaint).filter(Complaint.status == "UNDER_REVIEW").count()
    assigned = db.query(Complaint).filter(Complaint.status == "ASSIGNED").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "IN_PROGRESS").count()
    resolved = db.query(Complaint).filter(Complaint.status == "RESOLVED").count()
    closed = db.query(Complaint).filter(Complaint.status == "CLOSED").count()

    return {
        "total": total,
        "by_status": {
            "SUBMITTED": submitted,
            "UNDER_REVIEW": under_review,
            "ASSIGNED": assigned,
            "IN_PROGRESS": in_progress,
            "RESOLVED": resolved,
            "CLOSED": closed,
        },
        "user_role": current_user.role,
    }


@router.get("/{complaint_id}", response_model=ComplaintResponse, summary="Get Complaint Details")
def get_complaint(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Retrieves complaint details with RBAC authorization check:
    Citizens can only access their own complaints.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' not found.",
        )

    # Citizen ownership check
    if current_user.role == "citizen" and complaint.citizen_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Citizens can only view their own registered complaints.",
        )

    return complaint


@router.post("", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED, summary="Submit New Complaint")
def submit_complaint(
    payload: ComplaintCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Registers a new citizen complaint.
    Only Citizens (and Admin on behalf of citizen) are authorized to submit complaints.
    Starts at initial status 'SUBMITTED' and logs an audit record.
    """
    if current_user.role not in ["citizen", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User with role '{current_user.role}' cannot submit citizen complaints.",
        )

    # Generate unique complaint ID: GFX-2026-XXXX
    unique_num = random.randint(1000, 9999)
    complaint_id = f"GFX-2026-{unique_num}"
    while db.query(Complaint).filter(Complaint.id == complaint_id).first():
        unique_num = random.randint(1000, 9999)
        complaint_id = f"GFX-2026-{unique_num}"

    new_complaint = Complaint(
        id=complaint_id,
        citizen_id=current_user.id,
        citizen_name=current_user.name,
        citizen_mobile=current_user.mobile,
        category=payload.category,
        title=payload.title,
        description=payload.description,
        ward=payload.ward,
        location=payload.location,
        landmark=payload.landmark,
        priority=payload.priority or "Medium",
        status="SUBMITTED",
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    # Audit logging for initial submission
    WorkflowEngine.record_audit(
        db=db,
        complaint_id=new_complaint.id,
        user=current_user,
        prev_status="NONE",
        req_status="SUBMITTED",
        action="SUBMIT_COMPLAINT",
        is_accepted=True,
        reason="Complaint successfully registered on citizen grievance portal.",
    )

    return new_complaint


@router.post("/{complaint_id}/transition", response_model=TransitionResult, summary="Execute Workflow Status Transition")
def transition_complaint(
    complaint_id: str,
    request: TransitionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Centralized workflow transition endpoint.
    All status changes must go through this endpoint.
    Strictly enforces:
    - Existence of complaint
    - Authenticated user
    - Role authorization for the specific transition
    - Officer assignment ownership
    - Sequential status transitions
    - Mandatory remarks & evidence for resolution
    - Mandatory reason for closure rejection
    - Immutability of CLOSED complaints
    - Full audit trail recording for both accepted and rejected attempts
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' not found.",
        )

    prev_status = complaint.status

    updated_complaint, audit_entry = WorkflowEngine.execute_transition(
        db=db,
        complaint_id=complaint_id,
        user=current_user,
        request=request,
    )

    return TransitionResult(
        success=True,
        message=f"Status successfully transitioned from {prev_status} to {updated_complaint.status}.",
        complaint=ComplaintResponse.model_validate(updated_complaint),
        previous_status=prev_status,
        current_status=updated_complaint.status,
        audit_id=audit_entry.id,
    )


@router.get("/{complaint_id}/audit-logs", response_model=List[AuditLogResponse], summary="Get Complaint Audit Trail")
def get_audit_trail(
    complaint_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns the immutable audit trail for a complaint.
    Includes timestamps, user role, action performed, and both accepted and rejected attempts.
    """
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' not found.",
        )

    # Citizen ownership check
    if current_user.role == "citizen" and complaint.citizen_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Citizens can only inspect audit records of their own complaints.",
        )

    audits = (
        db.query(AuditLog)
        .filter(AuditLog.complaint_id == complaint_id)
        .order_by(AuditLog.id.asc())
        .all()
    )
    return audits
