from datetime import datetime
from fastapi import APIRouter
from app.core.config import get_settings
from app.schemas import HealthCheckResponse, SystemInfoResponse
from app.api.v1.auth import router as auth_router
from app.api.v1.complaints import router as complaints_router

api_router = APIRouter()
settings = get_settings()

# Mount feature routers
api_router.include_router(auth_router)
api_router.include_router(complaints_router)


@api_router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Health Check",
    description="Returns the operational status of the GovFix backend service.",
)
async def health_check():
    """Health check endpoint used by frontend widgets and infrastructure health probes."""
    return HealthCheckResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        service=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        environment=settings.ENVIRONMENT,
    )


@api_router.get(
    "/system-info",
    response_model=SystemInfoResponse,
    summary="System Information",
    description="Returns metadata about core modules and municipal grievance categories.",
)
async def get_system_info():
    """Provides system readiness metrics and active module structure."""
    return SystemInfoResponse(
        service_name=settings.PROJECT_NAME,
        version=settings.PROJECT_VERSION,
        description=settings.PROJECT_DESCRIPTION,
        status="operational",
        modules={
            "api_gateway": "Active (FastAPI)",
            "auth_module": "Operational (RBAC - 4 Roles)",
            "grievance_engine": "Operational (Strict Sequential Lifecycle)",
            "workflow_service": "Operational (Audit Trail & ACID State Machine)",
            "officer_dispatch": "Operational (Zonal Officer Assignment)",
            "resolution_approval": "Operational (Two-Step Verification)",
        },
        grievance_categories_preview=[
            "Roads & Potholes",
            "Street Lighting & Electrical",
            "Waste Management & Sanitation",
            "Water Supply & Leakage",
            "Public Health & Drainage",
            "Parks & Civic Amenities",
        ],
    )
