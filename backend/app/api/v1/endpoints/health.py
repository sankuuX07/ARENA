from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def check_health():
    """
    Health-check endpoint verifying backend status.
    """
    return HealthResponse(
        status="ok",
        service="ARENA backend"
    )
