from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.situational import (
    SituationalStartRequest,
    SituationalStartResponse,
    SituationalRespondRequest,
    SituationalRespondResponse,
    SituationalCompleteRequest,
    SituationalCompleteResponse,
)
from app.services.situational_communication_service import situational_communication_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()


@router.post("/start", response_model=SituationalStartResponse, summary="Start a new Situational Communication session")
async def start_situational_session(
    request: SituationalStartRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Initialize a Situational Communication session with a scenario based on category and difficulty.
    """
    try:
        return await situational_communication_service.start_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start Situational Communication session. Please try again.",
        )


@router.post("/respond", response_model=SituationalRespondResponse, summary="Submit response for Situational evaluation")
async def evaluate_situational_turn(
    request: SituationalRespondRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Submit student response for 10-criteria AI evaluation and get next scenario/question.
    """
    if not request.response_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Response text cannot be blank.",
        )

    try:
        return await situational_communication_service.evaluate_turn(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate situational response. Please try again.",
        )


@router.post("/complete", response_model=SituationalCompleteResponse, summary="Complete Situational session and get final score")
async def complete_situational_session(
    request: SituationalCompleteRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Calculate final score, strengths, and improvements for the completed situational session.
    """
    try:
        return await situational_communication_service.complete_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate session completion summary. Please try again.",
        )
