import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from app.core.database import Base


class Complaint(Base):
    """Complaint entity tracking municipal grievances and lifecycle status."""

    __tablename__ = "complaints"

    id = Column(String(64), primary_key=True, index=True)
    citizen_id = Column(String(64), ForeignKey("users.id"), nullable=False, index=True)
    citizen_name = Column(String(128), nullable=False)
    citizen_mobile = Column(String(20), nullable=False)
    category = Column(String(128), nullable=False, index=True)
    category_code = Column(String(64), nullable=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    ward = Column(String(128), nullable=False, index=True)
    location = Column(String(256), nullable=False)
    landmark = Column(String(256), nullable=True)
    priority = Column(String(32), default="Medium")  # Low, Medium, High, Urgent
    
    # Workflow status: SUBMITTED -> UNDER_REVIEW -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
    status = Column(String(32), default="SUBMITTED", nullable=False, index=True)
    
    # Assignment details
    assigned_officer_id = Column(String(64), ForeignKey("users.id"), nullable=True, index=True)
    assigned_officer_name = Column(String(128), nullable=True)
    assigned_department = Column(String(128), nullable=True)
    
    # Resolution details (submitted by officer)
    resolution_remarks = Column(Text, nullable=True)
    resolution_proof_url = Column(Text, nullable=True)
    
    # Rejection reason (if supervisor rejects closure, returning to IN_PROGRESS)
    rejection_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "citizen_id": self.citizen_id,
            "citizen_name": self.citizen_name,
            "citizen_mobile": self.citizen_mobile,
            "category": self.category,
            "category_code": self.category_code,
            "title": self.title,
            "description": self.description,
            "ward": self.ward,
            "location": self.location,
            "landmark": self.landmark,
            "priority": self.priority,
            "status": self.status,
            "assigned_officer_id": self.assigned_officer_id,
            "assigned_officer_name": self.assigned_officer_name,
            "assigned_department": self.assigned_department,
            "resolution_remarks": self.resolution_remarks,
            "resolution_proof_url": self.resolution_proof_url,
            "rejection_reason": self.rejection_reason,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
