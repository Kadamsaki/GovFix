import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from app.core.database import Base


class AuditLog(Base):
    """
    Immutable audit history record for all workflow attempts.
    Stores both accepted and rejected status transition attempts.
    """

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String(64), nullable=False, index=True)
    user_id = Column(String(64), nullable=False)
    user_name = Column(String(128), nullable=False)
    user_role = Column(String(32), nullable=False)  # citizen, officer, supervisor, admin
    previous_status = Column(String(32), nullable=False)
    requested_status = Column(String(32), nullable=False)
    action = Column(String(64), nullable=False)  # e.g. SUBMIT, REVIEW, ASSIGN, START_WORK, RESOLVE, APPROVE_CLOSE, REJECT_CLOSE
    is_accepted = Column(Boolean, nullable=False)  # True = Accepted, False = Rejected
    reason = Column(Text, nullable=True)  # Explanatory remarks or rejection reason
    metadata_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "complaint_id": self.complaint_id,
            "user_id": self.user_id,
            "user_name": self.user_name,
            "user_role": self.user_role,
            "previous_status": self.previous_status,
            "requested_status": self.requested_status,
            "action": self.action,
            "is_accepted": self.is_accepted,
            "reason": self.reason,
            "metadata_json": self.metadata_json,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
