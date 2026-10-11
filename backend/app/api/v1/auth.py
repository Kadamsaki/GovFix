from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.models.user import User
from app.schemas.workflow import UserResponse, LoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])


@router.post("/login", response_model=UserResponse, summary="User Login / Profile Switcher")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates or switches active user profile.
    Supports login via User ID or Mobile number.
    """
    query = req.mobile_or_id.strip()
    user = (
        db.query(User)
        .filter((User.id == query) | (User.mobile == query))
        .first()
    )

    if not user:
        # If role is requested and user doesn't exist yet, we can check by role
        if req.role:
            user = db.query(User).filter(User.role == req.role.lower()).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with identifier '{req.mobile_or_id}' not found.",
        )

    return user


@router.get("/me", response_model=UserResponse, summary="Get Current Authenticated User")
def get_me(current_user: User = Depends(get_current_user)):
    """Returns currently authenticated user profile based on validated session/token."""
    return current_user


from app.models.complaint import Complaint

@router.get("/officers", response_model=List[UserResponse], summary="List Officers for Assignment with Workload")
def get_officers(
    department: Optional[str] = None,
    current_user: User = Depends(require_roles(["supervisor", "admin"])),
    db: Session = Depends(get_db),
):
    """
    Returns municipal officers available for grievance assignment with active workload count.
    Accessible to Supervisors and Admins.
    """
    q = db.query(User).filter(User.role == "officer")
    if department:
        dept_clean = department.replace(" Department", "").strip()
        q = q.filter(User.department.ilike(f"%{dept_clean}%"))
    
    officers = q.all()
    results = []
    for off in officers:
        active_count = (
            db.query(Complaint)
            .filter(
                Complaint.assigned_officer_id == off.id,
                Complaint.status.in_(["ASSIGNED", "IN_PROGRESS"]),
            )
            .count()
        )
        off_resp = UserResponse.model_validate(off)
        off_resp.active_complaints_count = active_count
        results.append(off_resp)
        
    return results


@router.get("/users", response_model=List[UserResponse], summary="List All Users (Admin)")
def list_users(
    role: Optional[str] = None,
    current_user: User = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db),
):
    """Returns all registered users in the system for administrative oversight."""
    q = db.query(User)
    if role:
        q = q.filter(User.role == role.lower())
    return q.all()
