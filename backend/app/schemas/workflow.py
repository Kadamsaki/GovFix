from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# ================= User Schemas =================
class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    mobile: str
    role: str  # 'citizen' | 'officer' | 'supervisor' | 'admin'
    department: Optional[str] = None
    ward: Optional[str] = None
    designation: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    mobile_or_id: str = Field(..., description="User ID or registered mobile number")
    role: Optional[str] = Field(None, description="Optional role selector for quick login")


# ================= Complaint Schemas =================
class ComplaintCreate(BaseModel):
    category: str = Field(..., min_length=2, description="Grievance service category")
    title: str = Field(..., min_length=5, max_length=256, description="Brief title of the issue")
    description: str = Field(..., min_length=10, description="Detailed description of the issue")
    ward: str = Field(..., description="Municipal Ward / Jurisdiction")
    location: str = Field(..., description="Precise street or area location")
    landmark: Optional[str] = Field(None, description="Prominent landmark nearby")
    priority: Optional[str] = Field("Medium", description="Low, Medium, High, or Urgent")


class ComplaintResponse(BaseModel):
    id: str
    citizen_id: str
    citizen_name: str
    citizen_mobile: str
    category: str
    category_code: Optional[str] = None
    title: str
    description: str
    ward: str
    location: str
    landmark: Optional[str] = None
    priority: str
    status: str
    assigned_officer_id: Optional[str] = None
    assigned_officer_name: Optional[str] = None
    assigned_department: Optional[str] = None
    resolution_remarks: Optional[str] = None
    resolution_proof_url: Optional[str] = None
    rejection_reason: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ================= Transition & Workflow Schemas =================
class TransitionRequest(BaseModel):
    """
    Requested action on a complaint.
    Actions:
    - REVIEW: Move SUBMITTED -> UNDER_REVIEW (Supervisor / Admin)
    - ASSIGN: Move UNDER_REVIEW -> ASSIGNED or Reassign (Supervisor / Admin)
    - START_WORK: Move ASSIGNED -> IN_PROGRESS (Assigned Officer)
    - RESOLVE: Move IN_PROGRESS -> RESOLVED (Assigned Officer, requires remarks & proof)
    - APPROVE_CLOSURE: Move RESOLVED -> CLOSED (Supervisor / Admin)
    - REJECT_CLOSURE: Move RESOLVED -> IN_PROGRESS (Supervisor / Admin, requires rejection reason)
    - DIRECT_STATUS: For testing direct attempts, or when explicit target status is provided
    """
    action: str = Field(..., description="Action to perform (REVIEW, ASSIGN, START_WORK, RESOLVE, APPROVE_CLOSURE, REJECT_CLOSURE)")
    target_status: Optional[str] = Field(None, description="Explicit target status if action is generic or for testing")
    assigned_officer_id: Optional[str] = Field(None, description="Required when assigning an officer")
    resolution_remarks: Optional[str] = Field(None, description="Mandatory when resolving an issue")
    resolution_proof_url: Optional[str] = Field(None, description="Mandatory proof link or description when resolving")
    rejection_reason: Optional[str] = Field(None, description="Mandatory reason when supervisor rejects closure")
    remarks: Optional[str] = Field(None, description="Additional administrative remarks")


class TransitionResult(BaseModel):
    success: bool
    message: str
    complaint: Optional[ComplaintResponse] = None
    previous_status: str
    current_status: str
    audit_id: Optional[int] = None


class AuditLogResponse(BaseModel):
    id: int
    complaint_id: str
    user_id: str
    user_name: str
    user_role: str
    previous_status: str
    requested_status: str
    action: str
    is_accepted: bool
    reason: Optional[str] = None
    metadata_json: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True
