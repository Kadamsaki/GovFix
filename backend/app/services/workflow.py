import json
import datetime
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.models.complaint import Complaint
from app.models.audit import AuditLog
from app.schemas.workflow import TransitionRequest


class WorkflowEngine:
    """
    Centralized Municipal Workflow Validation and State Machine Service.
    Enforces valid transitions, role-based authorization, required artifacts,
    and immutable audit trails for both accepted and rejected operations.
    """

    # Allowed sequential lifecycle transitions: { CurrentStatus: { TargetStatus: [AllowedRoles] } }
    TRANSITION_MATRIX = {
        "SUBMITTED": {
            "UNDER_REVIEW": ["supervisor", "admin"],
        },
        "UNDER_REVIEW": {
            "ASSIGNED": ["supervisor", "admin"],
        },
        "ASSIGNED": {
            "IN_PROGRESS": ["officer", "admin"],
            "ASSIGNED": ["supervisor", "admin"],  # Officer Reassignment
        },
        "IN_PROGRESS": {
            "RESOLVED": ["officer", "admin"],
        },
        "RESOLVED": {
            "CLOSED": ["supervisor", "admin"],      # Step 2: Supervisor Approval
            "IN_PROGRESS": ["supervisor", "admin"], # Step 2: Supervisor Rejection (returns for rework)
        },
        "CLOSED": {
            # Immutable: NO transitions allowed from CLOSED!
        },
    }

    @classmethod
    def record_audit(
        cls,
        db: Session,
        complaint_id: str,
        user: User,
        prev_status: str,
        req_status: str,
        action: str,
        is_accepted: bool,
        reason: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> AuditLog:
        """
        Creates an immutable audit log record.
        Commits immediately so rejected attempts are preserved even if main request aborts.
        """
        audit_entry = AuditLog(
            complaint_id=complaint_id,
            user_id=user.id,
            user_name=user.name,
            user_role=user.role,
            previous_status=prev_status,
            requested_status=req_status,
            action=action,
            is_accepted=is_accepted,
            reason=reason,
            metadata_json=json.dumps(metadata) if metadata else None,
            timestamp=datetime.datetime.utcnow(),
        )
        db.add(audit_entry)
        db.commit()
        db.refresh(audit_entry)
        return audit_entry

    @classmethod
    def resolve_target_status(cls, complaint: Complaint, request: TransitionRequest) -> Tuple[str, str]:
        """
        Derives target status and action name from the transition request.
        """
        action = request.action.upper()
        
        # If target status is explicitly given (e.g. testing invalid direct transitions)
        if request.target_status:
            return request.target_status.upper(), action

        # Map semantic actions to target statuses
        if action == "REVIEW":
            return "UNDER_REVIEW", "MOVE_TO_UNDER_REVIEW"
        elif action == "ASSIGN":
            return "ASSIGNED", "ASSIGN_OFFICER"
        elif action == "REASSIGN":
            return "ASSIGNED", "REASSIGN_OFFICER"
        elif action == "START_WORK":
            return "IN_PROGRESS", "START_FIELD_WORK"
        elif action == "RESOLVE":
            return "RESOLVED", "OFFICER_RESOLVED"
        elif action == "APPROVE_CLOSURE":
            return "CLOSED", "SUPERVISOR_APPROVED_CLOSURE"
        elif action == "REJECT_CLOSURE":
            return "IN_PROGRESS", "SUPERVISOR_REJECTED_CLOSURE"
        else:
            # Fallback to action string as target status if matching enum
            return action, f"REQUEST_{action}"

    @classmethod
    def execute_transition(
        cls,
        db: Session,
        complaint_id: str,
        user: User,
        request: TransitionRequest,
    ) -> Tuple[Complaint, AuditLog]:
        """
        Validates and executes a complaint status transition with ACID guarantees.
        Logs every attempt (both accepted and rejected) in the immutable audit table.
        """
        # 1. Verification: Does the complaint exist?
        complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if not complaint:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Complaint '{complaint_id}' not found.",
            )

        prev_status = complaint.status.upper()
        target_status, action_name = cls.resolve_target_status(complaint, request)

        # 2. Immutability Check: CLOSED complaints cannot be transitioned
        if prev_status == "CLOSED":
            rejection_reason = "Complaint is CLOSED and immutable. No further status changes are permitted."
            cls.record_audit(
                db, complaint_id, user, prev_status, target_status, action_name,
                is_accepted=False, reason=rejection_reason
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=rejection_reason,
            )

        # 3. Check Citizen restrictions (Citizens can NEVER modify complaint status)
        if user.role == "citizen":
            rejection_reason = "Citizens are not authorized to alter complaint lifecycle status."
            cls.record_audit(
                db, complaint_id, user, prev_status, target_status, action_name,
                is_accepted=False, reason=rejection_reason
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=rejection_reason,
            )

        # 4. Check Valid Transitions in State Machine
        allowed_targets = cls.TRANSITION_MATRIX.get(prev_status, {})
        if target_status not in allowed_targets:
            rejection_reason = (
                f"Invalid status transition from '{prev_status}' to '{target_status}'. "
                f"Skipping workflow stages or backward transitions are prohibited."
            )
            cls.record_audit(
                db, complaint_id, user, prev_status, target_status, action_name,
                is_accepted=False, reason=rejection_reason
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=rejection_reason,
            )

        # 5. Check Role Authorization for this specific transition
        authorized_roles = allowed_targets[target_status]
        if user.role not in authorized_roles and user.role != "admin":
            rejection_reason = (
                f"User role '{user.role}' is not authorized to transition complaints "
                f"from '{prev_status}' to '{target_status}'. Allowed roles: {', '.join(authorized_roles)}."
            )
            cls.record_audit(
                db, complaint_id, user, prev_status, target_status, action_name,
                is_accepted=False, reason=rejection_reason
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=rejection_reason,
            )

        # 6. Officer Assignment Ownership Verification
        # If user is officer, they can only modify complaints assigned to THEM
        if user.role == "officer":
            if complaint.assigned_officer_id != user.id:
                rejection_reason = (
                    f"Officer '{user.name}' ({user.id}) is not the assigned officer for this complaint. "
                    f"Assigned officer is '{complaint.assigned_officer_name or complaint.assigned_officer_id}'."
                )
                cls.record_audit(
                    db, complaint_id, user, prev_status, target_status, action_name,
                    is_accepted=False, reason=rejection_reason
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=rejection_reason,
                )

        # 7. Transition-Specific Condition Verification
        # Condition A: Assignment requires a valid officer ID
        if target_status == "ASSIGNED":
            target_officer_id = request.assigned_officer_id
            if not target_officer_id:
                rejection_reason = "Assignment failed: 'assigned_officer_id' is required."
                cls.record_audit(
                    db, complaint_id, user, prev_status, target_status, action_name,
                    is_accepted=False, reason=rejection_reason
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=rejection_reason,
                )
            
            officer = db.query(User).filter(User.id == target_officer_id).first()
            if not officer or officer.role != "officer":
                rejection_reason = f"Target user '{target_officer_id}' does not exist or is not a Municipal Officer."
                cls.record_audit(
                    db, complaint_id, user, prev_status, target_status, action_name,
                    is_accepted=False, reason=rejection_reason
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=rejection_reason,
                )
            
            complaint.assigned_officer_id = officer.id
            complaint.assigned_officer_name = officer.name
            complaint.assigned_department = officer.department or complaint.assigned_department

        # Condition B: Moving to RESOLVED requires resolution remarks and supporting proof
        elif target_status == "RESOLVED":
            remarks = (request.resolution_remarks or "").strip()
            proof = (request.resolution_proof_url or "").strip()
            if not remarks:
                rejection_reason = "Resolution remarks are mandatory before marking a complaint as RESOLVED."
                cls.record_audit(
                    db, complaint_id, user, prev_status, target_status, action_name,
                    is_accepted=False, reason=rejection_reason
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=rejection_reason,
                )
            if not proof:
                rejection_reason = "Supporting evidence or proof URL is mandatory before marking a complaint as RESOLVED."
                cls.record_audit(
                    db, complaint_id, user, prev_status, target_status, action_name,
                    is_accepted=False, reason=rejection_reason
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=rejection_reason,
                )
            
            complaint.resolution_remarks = remarks
            complaint.resolution_proof_url = proof

        # Condition C: Rejection of closure (RESOLVED -> IN_PROGRESS) requires a rejection reason
        elif prev_status == "RESOLVED" and target_status == "IN_PROGRESS":
            reason_text = (request.rejection_reason or request.remarks or "").strip()
            if not reason_text:
                rejection_reason = "A specific rejection reason is mandatory when supervisor rejects complaint closure."
                cls.record_audit(
                    db, complaint_id, user, prev_status, target_status, action_name,
                    is_accepted=False, reason=rejection_reason
                )
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=rejection_reason,
                )
            complaint.rejection_reason = reason_text

        # 8. All Validations Passed: Update State Atomically
        complaint.status = target_status
        complaint.updated_at = datetime.datetime.utcnow()
        db.add(complaint)
        db.commit()
        db.refresh(complaint)

        # Record Successful Audit
        success_remarks = (
            request.remarks
            or request.resolution_remarks
            or request.rejection_reason
            or f"Status transitioned to {target_status} by {user.name} ({user.role})"
        )
        audit_entry = cls.record_audit(
            db=db,
            complaint_id=complaint_id,
            user=user,
            prev_status=prev_status,
            req_status=target_status,
            action=action_name,
            is_accepted=True,
            reason=success_remarks,
            metadata={
                "officer_assigned": complaint.assigned_officer_name,
                "proof_attached": bool(complaint.resolution_proof_url),
            },
        )

        return complaint, audit_entry
