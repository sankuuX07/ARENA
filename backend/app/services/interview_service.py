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
            import google.generativeai as genai
            if not gemini_service.api_key or gemini_service.api_key == "your_gemini_api_key_here":
                return self._fallback_ai_response(session.mode, latest_input)

            genai.configure(api_key=gemini_service.api_key)
            model = genai.GenerativeModel(
                model_name=gemini_service.model_name,
                system_instruction=system_instruction,
            )

            formatted_history = []
            for item in history:
                role = "user" if item.get("role") in ["student", "user"] else "model"
                content = item.get("content", "").strip()
                if content:
                    formatted_history.append({"role": role, "parts": [content]})

            chat = model.start_chat(history=formatted_history)
            response = chat.send_message(latest_input)

            if response and response.text:
                return response.text.strip()
            
            return self._fallback_ai_response(session.mode, latest_input)

        except Exception as e:
            print(f"[InterviewService] Gemini Error: {e}")
            return self._fallback_ai_response(session.mode, latest_input)

    def _fallback_ai_response(self, mode: str, text: str) -> str:
        text_lower = text.lower()
        if "hello" in text_lower or "ready" in text_lower:
            if mode == "technical":
                return "Welcome to the technical interview. Can you briefly explain a technical project you built recently?"
            elif mode == "hr":
                return "Welcome. To start, please tell me a little bit about yourself."
            else:
                return "Hello! Tell me about a time you faced a difficult challenge and how you handled it."
        
        return "Thank you for sharing that. Could you elaborate a bit more on the specific actions you took?"

interview_service = InterviewService()
