from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.fluency import (
    FluencyStartRequest,
    FluencyStartResponse,
    FluencyRespondRequest,
    FluencyRespondResponse,
    FluencyCompleteRequest,
    FluencyCompleteResponse,
)
from app.services.fluency_service import fluency_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()


@router.post("/start", response_model=FluencyStartResponse, summary="Start a new Fluency practice session")
async def start_fluency_session(
    request: FluencyStartRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Initialize a 5-turn AI Spoken/Written Fluency practice session with an opening topic prompt.
    """
    try:
        return await fluency_service.start_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start Fluency session. Please try again.",
        )


@router.post("/respond", response_model=FluencyRespondResponse, summary="Submit response turn for AI Fluency evaluation")
async def evaluate_fluency_turn(
    request: FluencyRespondRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Submit student response for 7-criteria AI Fluency evaluation (0-100) and get next conversational prompt.
    """
    if not request.response_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Response text cannot be blank.",
        )

    try:
        return await fluency_service.evaluate_turn(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate fluency response. Please try again.",
        )


@router.post("/complete", response_model=FluencyCompleteResponse, summary="Complete session and calculate final Fluency score")
async def complete_fluency_session(
    request: FluencyCompleteRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Calculate final overall AI Fluency score, strengths, and areas to improve upon 5-turn session completion.
    """
    try:
        return await fluency_service.complete_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate session completion summary. Please try again.",
        )
