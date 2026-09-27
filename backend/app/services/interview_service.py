import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import json

from app.schemas.interview import (
    InterviewConfig, InterviewSession, InterviewMessage, InterviewResponse
)
from app.services.gemini_service import gemini_service
from app.services.prompts.interview import get_interview_system_prompt

class InterviewService:
    def __init__(self):
        # In-memory store for M30
        self._sessions: Dict[str, InterviewSession] = {}
        # Simple lock simulation per session to avoid duplicate concurrent calls
        self._processing_locks: Dict[str, bool] = {}

    def get_modes(self) -> List[Dict]:
        return [
            {"id": "technical", "name": "Technical Interview"},
            {"id": "hr", "name": "HR Interview"},
            {"id": "behavioral", "name": "Behavioral Interview"},
        ]

    async def start_session(self, user_id: str, config: InterviewConfig) -> InterviewSession:
        session_id = f"int_{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow()
        expires = now + timedelta(minutes=config.durationMinutes)

        session = InterviewSession(
            sessionId=session_id,
            userId=user_id,
            mode=config.mode,
            difficulty=config.difficulty,
            responseMode=config.responseMode,
            topic=config.topic,
            status="in_progress",
            startedAt=now.isoformat() + "Z",
            expiresAt=expires.isoformat() + "Z",
            maxQuestions=config.maxQuestions,
            questionCount=1,
            messages=[]
        )

        # Generate Introduction message using Gemini or fallback
        intro_text = await self._generate_ai_response(session, "Hello! I am ready to begin the interview.")
        
        system_intro = InterviewMessage(
            messageId=f"msg_{uuid.uuid4().hex[:8]}",
            sessionId=session_id,
            role="interviewer",
            content=intro_text,
            timestamp=datetime.utcnow().isoformat() + "Z",
            questionType="introduction"
        )
        
        session.messages.append(system_intro)
        self._sessions[session_id] = session
        return session

    def get_session(self, user_id: str, session_id: str) -> Optional[InterviewSession]:
        session = self._sessions.get(session_id)
        if session and session.userId == user_id:
            # Check expiration
            if session.status == "in_progress" and session.expiresAt:
                expires_dt = datetime.fromisoformat(session.expiresAt.replace("Z", "+00:00")).replace(tzinfo=None)
                if datetime.utcnow() > expires_dt:
                    session.status = "expired"
            return session
        return None

    async def respond(self, user_id: str, session_id: str, content: str) -> InterviewResponse:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        if session.status != "in_progress":
            raise ValueError(f"Session is {session.status}")

        if self._processing_locks.get(session_id, False):
            raise ValueError("Concurrent request detected. Please wait.")
            
        self._processing_locks[session_id] = True
        try:
            # Create Student Message
            student_msg = InterviewMessage(
                messageId=f"msg_{uuid.uuid4().hex[:8]}",
                sessionId=session_id,
                role="student",
                content=content,
                timestamp=datetime.utcnow().isoformat() + "Z"
            )
            session.messages.append(student_msg)

            # Generate AI Response
            ai_text = await self._generate_ai_response(session, content)
            session.questionCount += 1
            
            # Create AI Message
            interviewer_msg = InterviewMessage(
                messageId=f"msg_{uuid.uuid4().hex[:8]}",
                sessionId=session_id,
                role="interviewer",
                content=ai_text,
                timestamp=datetime.utcnow().isoformat() + "Z",
                questionType="follow_up"
            )
            session.messages.append(interviewer_msg)

            if session.questionCount >= session.maxQuestions:
                session.status = "completed"

            return InterviewResponse(
                studentMessage=student_msg,
                interviewerMessage=interviewer_msg,
                nextQuestionType="follow_up",
                currentDifficulty=session.difficulty,
                sessionStatus=session.status
            )
        finally:
            self._processing_locks[session_id] = False

    def end_session(self, user_id: str, session_id: str) -> InterviewSession:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        
        if session.status == "in_progress":
            session.status = "completed"
            
        return session

    async def _generate_ai_response(self, session: InterviewSession, latest_input: str) -> str:
        # Build strict context (recent messages) to avoid massive context windows
        system_instruction = get_interview_system_prompt(session.mode, session.topic, session.difficulty)
        
        # Build history format for Gemini
        history = []
        for msg in session.messages[-6:]: # Last 6 messages to preserve context but limit token usage
            history.append({
                "role": msg.role,
                "content": msg.content
            })

        # We inject the system instruction temporarily by wrapping it into gemini_service
        try:
            return await gemini_service.generate_communication_response(
                message=latest_input,
                mode=session.mode,
                history=history,
                system_prompt_override=system_instruction
            )
        except Exception as e:
            print(f"[InterviewService] Gemini Error: {e}")
            raise ValueError("AI service temporarily unavailable.")

interview_service = InterviewService()
