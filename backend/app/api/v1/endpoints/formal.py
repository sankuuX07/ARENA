from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.formal import (
    FormalStartRequest,
    FormalStartResponse,
    FormalRespondRequest,
    FormalRespondResponse,
    FormalCompleteRequest,
    FormalCompleteResponse,
)
from app.services.formal_communication_service import formal_communication_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()


@router.post("/start", response_model=FormalStartResponse, summary="Start a new Formal Communication session")
async def start_formal_session(
    request: FormalStartRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Initialize a Formal Communication session with a scenario based on category and difficulty.
    """
    try:
        return await formal_communication_service.start_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start Formal Communication session. Please try again.",
        )


@router.post("/respond", response_model=FormalRespondResponse, summary="Submit response for Formal evaluation")
async def evaluate_formal_turn(
    request: FormalRespondRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Submit student response for 9-criteria AI evaluation and get next scenario/question.
    """
    if not request.response_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Response text cannot be blank.",
        )

    try:
        return await formal_communication_service.evaluate_turn(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to evaluate formal response. Please try again.",
        )


@router.post("/complete", response_model=FormalCompleteResponse, summary="Complete Formal session and get final score")
async def complete_formal_session(
    request: FormalCompleteRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Calculate final score, strengths, and improvements for the completed formal session.
    """
    try:
        return await formal_communication_service.complete_session(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to calculate session completion summary. Please try again.",
        )
