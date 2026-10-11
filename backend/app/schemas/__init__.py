"""
Data schemas for request validation and API responses.
"""
from datetime import datetime
from typing import Dict, List
from pydantic import BaseModel, Field


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
