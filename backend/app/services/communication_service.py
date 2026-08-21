import uuid
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.communication import ChatMessageRequest, ChatMessageResponse, EvaluationFoundation
from app.services.gemini_service import gemini_service


class CommunicationService:
    async def process_chat_message(
        self, request: ChatMessageRequest, student_uid: str
    ) -> ChatMessageResponse:
        """
        Process incoming student chat message, request AI response from Gemini, and return response.
        """
        session_id = request.session_id or f"session_{uuid.uuid4().hex[:10]}"
        mode = request.mode or "general"

        # Generate response from Gemini API service
        ai_message = await gemini_service.generate_communication_response(
            message=request.message,
            mode=mode,
            history=request.history,
        )

        timestamp_str = datetime.utcnow().isoformat() + "Z"

        # Evaluation data model foundation (null in Milestone 8 until specialized submodules populates scores in Milestones 9-12)
        evaluation = EvaluationFoundation(
            fluency=None,
            grammar=None,
            vocabulary=None,
            relevance=None,
            confidence=None,
            overallScore=None,
        )

        return ChatMessageResponse(
            session_id=session_id,
            message=ai_message,
            timestamp=timestamp_str,
            status="success",
            mode=mode,
            evaluation=evaluation,
        )


communication_service = CommunicationService()
