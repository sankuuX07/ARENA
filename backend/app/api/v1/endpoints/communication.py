from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.communication import ChatMessageRequest, ChatMessageResponse
from app.services.communication_service import communication_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()

VALID_MODES = ["general", "fluency", "formal", "situational", "group_discussion"]


@router.post("/chat", response_model=ChatMessageResponse, summary="Send message to AI Communication Assistant")
async def chat_with_communication_ai(
    request: ChatMessageRequest,
    student_uid: str = Depends(verify_firebase_token),
):
    """
    Process student chat message for ARENA AI Communication Practice.
    Uses Google Gemini API on backend to generate response without exposing secrets.
    """
    message_text = request.message.strip()
    if not message_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty or blank.",
        )

    if request.mode not in VALID_MODES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid mode '{request.mode}'. Supported modes: {', '.join(VALID_MODES)}.",
        )

    try:
        response = await communication_service.process_chat_message(request, student_uid)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your communication request. Please try again.",
        )
