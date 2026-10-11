import datetime
from sqlalchemy import Column, String, DateTime
from app.core.database import Base


class User(Base):
    """User entity supporting RBAC roles: citizen, officer, supervisor, admin."""

    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=True)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    role = Column(String(32), nullable=False, index=True)  # 'citizen' | 'officer' | 'supervisor' | 'admin'
    department = Column(String(128), nullable=True)
    ward = Column(String(128), nullable=True)
    designation = Column(String(128), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "mobile": self.mobile,
            "role": self.role,
            "department": self.department,
            "ward": self.ward,
            "designation": self.designation,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
