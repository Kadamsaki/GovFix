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


ROUTE_DEPARTMENT_MAP = {
    "water": "Water Supply Department",
    "jal": "Water Supply Department",
    "pipeline": "Water Supply Department",
    "road": "Roads & Public Works Department",
    "pothole": "Roads & Public Works Department",
    "footpath": "Roads & Public Works Department",
    "street": "Roads & Public Works Department",
    "light": "Electrical Department",
    "pole": "Electrical Department",
    "electricity": "Electrical Department",
    "electrical": "Electrical Department",
    "garbage": "Sanitation Department",
    "sanitation": "Sanitation Department",
    "waste": "Sanitation Department",
    "kachra": "Sanitation Department",
    "safai": "Sanitation Department",
    "drain": "Drainage Department",
    "sewage": "Drainage Department",
    "gutter": "Drainage Department",
    "nalah": "Drainage Department",
}

OFFICER_CATEGORY_MAP = {
    # Water Supply -> Er. Amit Deshmukh (officer-1)
    "water": "officer-1",
    "jal": "officer-1",
    "pipeline": "officer-1",
    # Roads & Public Works -> Er. Rajesh Sharma (officer-2)
    "road": "officer-2",
    "pothole": "officer-2",
    "footpath": "officer-2",
    "street": "officer-2",
    # Electrical & Lighting -> Er. Sandeep More (officer-3)
    "light": "officer-3",
    "pole": "officer-3",
    "electricity": "officer-3",
    "electrical": "officer-3",
    # Sanitation & Solid Waste -> Er. Ramesh Shinde (officer-4)
    "garbage": "officer-4",
    "waste": "officer-4",
    "sanitat": "officer-4",
    "kachra": "officer-4",
    "safai": "officer-4",
    # Drainage & Sewage -> Er. Ganesh Jadhav (officer-5)
    "drain": "officer-5",
    "sewag": "officer-5",
    "gutter": "officer-5",
    "nalah": "officer-5",
}

DEPARTMENT_DEFAULT_OFFICER_MAP = {
    "Water Supply Department": "officer-1",
    "Roads & Public Works Department": "officer-2",
    "Electrical Department": "officer-3",
    "Sanitation Department": "officer-4",
    "Drainage Department": "officer-5",
    "Public Works & Grievance Cell": "officer-2",
}

SLA_HOURS_MAP = {
    "Urgent": 6,
    "High": 24,
    "Medium": 48,
    "Low": 72,
}


def route_department_for_category(category: str) -> str:
    cat = (category or "").lower()
    for key, dept in ROUTE_DEPARTMENT_MAP.items():
        if key in cat:
            return dept
    return "Public Works & Grievance Cell"


def auto_assign_officer_for_category(category: str, department: str, db: Session) -> Optional[User]:
    """
    Automatically selects and assigns the designated municipal field officer
    based on the complaint problem category and department.
    """
    cat = (category or "").lower()
    target_officer_id = None

    for key, off_id in OFFICER_CATEGORY_MAP.items():
        if key in cat:
            target_officer_id = off_id
            break

    if not target_officer_id and department:
        target_officer_id = DEPARTMENT_DEFAULT_OFFICER_MAP.get(department)

    if target_officer_id:
        officer = db.query(User).filter(User.id == target_officer_id).first()
        if officer:
            return officer

    if department:
        dept_clean = department.replace(" Department", "").strip()
        officer = (
            db.query(User)
            .filter(User.role == "officer", User.department.ilike(f"%{dept_clean}%"))
            .first()
        )
        if officer:
            return officer

    return db.query(User).filter(User.role == "officer").first()


def calculate_sla_deadline(created_at: datetime.datetime, priority: str) -> datetime.datetime:
    priority_clean = (priority or "Medium").capitalize()
    hours = SLA_HOURS_MAP.get(priority_clean, 48)
    return created_at + datetime.timedelta(hours=hours)


@router.get("", response_model=List[ComplaintResponse], summary="List Complaints (Role Filtered & SLA Aware)")
def list_complaints(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Returns complaints strictly filtered by the authenticated user's role:
    - Citizen: views only their own complaints.
    - Officer: views only complaints assigned to them, with urgent/overdue highlighted.
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
            dept_clean = current_user.department.replace(" Department", "").strip()
            query = query.filter(
                (Complaint.assigned_department.ilike(f"%{dept_clean}%"))
                | (Complaint.ward == current_user.ward)
            )
    # Admin sees all complaints without filters

    # 2. Query filters
    if status_filter:
        query = query.filter(Complaint.status == status_filter.upper())
    if category:
        query = query.filter(Complaint.category == category)
    if priority:
        query = query.filter(Complaint.priority == priority.capitalize())
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            (Complaint.id.ilike(search_fmt))
            | (Complaint.title.ilike(search_fmt))
            | (Complaint.location.ilike(search_fmt))
            | (Complaint.category.ilike(search_fmt))
        )

    results = query.order_by(desc(Complaint.created_at)).all()

    # For officers, sort urgent and overdue complaints prominently to top
    if current_user.role == "officer":
        def officer_sort_key(c):
            if c.status in ["RESOLVED", "CLOSED"]:
                return (2, 0)
            if c.is_overdue:
                return (0, 0)
            priority_ranks = {"Urgent": 1, "High": 2, "Medium": 3, "Low": 4}
            return (1, priority_ranks.get(c.priority, 5))
        results = sorted(results, key=officer_sort_key)

    return results


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

    assigned_dept = route_department_for_category(payload.category)
    now = datetime.datetime.utcnow()
    clean_priority = (payload.priority or "Medium").capitalize()
    if clean_priority not in SLA_HOURS_MAP:
        clean_priority = "Medium"
    deadline = calculate_sla_deadline(now, clean_priority)

    # Automatically assign the designated municipal field officer according to problem category
    assigned_officer = auto_assign_officer_for_category(payload.category, assigned_dept, db)
    officer_id = assigned_officer.id if assigned_officer else None
    officer_name = assigned_officer.name if assigned_officer else None
    initial_status = "ASSIGNED" if officer_id else "SUBMITTED"

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
        priority=clean_priority,
        status=initial_status,
        assigned_department=assigned_dept,
        assigned_officer_id=officer_id,
        assigned_officer_name=officer_name,
        assigned_at=now if officer_id else None,
        resolution_deadline=deadline,
        attachment_url=payload.attachment_url,
        created_at=now,
        updated_at=now,
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    # Audit logging for initial submission with SLA and department details
    sla_h = SLA_HOURS_MAP.get(clean_priority, 48)
    WorkflowEngine.record_audit(
        db=db,
        complaint_id=new_complaint.id,
        user=current_user,
        prev_status="NONE",
        req_status="SUBMITTED",
        action="SUBMIT_COMPLAINT",
        is_accepted=True,
        reason=f"Complaint registered by citizen. System automatically routed to {assigned_dept} with {clean_priority} SLA ({sla_h}h deadline).",
        metadata={
            "department": assigned_dept,
            "priority": clean_priority,
            "sla_hours": sla_h,
            "resolution_deadline": deadline.isoformat(),
            "has_attachment": bool(payload.attachment_url),
        },
    )

    # Audit logging for automatic officer assignment
    if officer_id:
        WorkflowEngine.record_audit(
            db=db,
            complaint_id=new_complaint.id,
            user=current_user,
            prev_status="SUBMITTED",
            req_status="ASSIGNED",
            action="AUTO_ASSIGN_OFFICER",
            is_accepted=True,
            reason=f"System automatically assigned field officer {officer_name} ({assigned_officer.designation or assigned_dept}) according to problem category '{payload.category}'.",
            metadata={
                "department": assigned_dept,
                "assigned_officer_id": officer_id,
                "assigned_officer_name": officer_name,
                "auto_assigned": True,
            },
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
