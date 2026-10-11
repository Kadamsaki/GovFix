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
    assigned_at = Column(DateTime, nullable=True)

    # Resolution SLA deadline & citizen attachments
    resolution_deadline = Column(DateTime, nullable=True)
    attachment_url = Column(Text, nullable=True)
    
    # Resolution details (submitted by officer)
    resolution_remarks = Column(Text, nullable=True)
    resolution_proof_url = Column(Text, nullable=True)
    
    # Rejection reason (if supervisor rejects closure, returning to IN_PROGRESS)
    rejection_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    @property
    def is_overdue(self) -> bool:
        if self.status in ["RESOLVED", "CLOSED"]:
            return False
        if not self.resolution_deadline:
            return False
        return datetime.datetime.utcnow() > self.resolution_deadline

    @property
    def time_remaining_seconds(self) -> int:
        if self.status in ["RESOLVED", "CLOSED"] or not self.resolution_deadline:
            return 0
        diff = (self.resolution_deadline - datetime.datetime.utcnow()).total_seconds()
        return int(diff)

    @property
    def time_remaining_text(self) -> str:
        if self.status in ["RESOLVED", "CLOSED"]:
            return "Resolved within SLA"
        if not self.resolution_deadline:
            return "Awaiting SLA Schedule"
        diff = (self.resolution_deadline - datetime.datetime.utcnow()).total_seconds()
        if diff < 0:
            overdue_sec = abs(int(diff))
            hours = overdue_sec // 3600
            mins = (overdue_sec % 3600) // 60
            return f"Overdue by {hours}h {mins}m"
        else:
            hours = int(diff) // 3600
            mins = (int(diff) % 3600) // 60
            return f"{hours}h {mins}m remaining"

    @property
    def sla_hours(self) -> int:
        sla_map = {"Urgent": 6, "High": 24, "Medium": 48, "Low": 72}
        return sla_map.get(self.priority, 48) if self.priority else 48

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
            "assigned_at": self.assigned_at.isoformat() if self.assigned_at else None,
            "resolution_deadline": self.resolution_deadline.isoformat() if self.resolution_deadline else None,
            "attachment_url": self.attachment_url,
            "is_overdue": self.is_overdue,
            "time_remaining_seconds": self.time_remaining_seconds,
            "time_remaining_text": self.time_remaining_text,
            "sla_hours": self.sla_hours,
            "resolution_remarks": self.resolution_remarks,
            "resolution_proof_url": self.resolution_proof_url,
            "rejection_reason": self.rejection_reason,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
