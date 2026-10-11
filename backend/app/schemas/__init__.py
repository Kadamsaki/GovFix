from datetime import datetime
from typing import Dict, List
from pydantic import BaseModel, Field

from app.schemas.workflow import (
    UserResponse,
    LoginRequest,
    ComplaintCreate,
    ComplaintResponse,
    TransitionRequest,
    TransitionResult,
    AuditLogResponse,
)


class HealthCheckResponse(BaseModel):
    """Schema for service health verification."""

    status: str = Field(default="healthy", description="Current service health status")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the check")
    service: str = Field(default="GovFix Municipal API", description="Service identifier")
    version: str = Field(default="0.1.0", description="API version")
    environment: str = Field(default="development", description="Runtime environment")


class SystemInfoResponse(BaseModel):
    """Schema for initial system metadata and readiness overview."""

    service_name: str
    version: str
    description: str
    status: str
    modules: Dict[str, str]
    grievance_categories_preview: List[str]


__all__ = [
    "HealthCheckResponse",
    "SystemInfoResponse",
    "UserResponse",
    "LoginRequest",
    "ComplaintCreate",
    "ComplaintResponse",
    "TransitionRequest",
    "TransitionResult",
    "AuditLogResponse",
]
