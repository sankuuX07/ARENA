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
    Uses local Ollama (gemma4:31b-cloud) on backend to generate response.
    """
    message_text = request.message.strip()
    if not message_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content cannot be empty or blank.",
        )

    # Normalise mode: default to 'general' if missing/empty
    mode = (request.mode or "general").strip().lower()
    if mode not in VALID_MODES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid mode '{mode}'. Supported modes: {', '.join(VALID_MODES)}.",
        )
    request.mode = mode  # ensure service sees normalised value

    try:
        response = await communication_service.process_chat_message(request, student_uid)
        return response
    except ValueError as ve:
        # ValueError from gemini_service carries readable OLLAMA_* codes
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Communication AI error: {str(e)}",
        )

