import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict
import os

from app.schemas.resume_improvement import (
    ResumeImprovementSession, ResumeImprovementSessionStatus,
    ResumeImprovementSuggestion, ResumeImprovementSuggestionStatus,
    ResumeImprovementDraft, ResumeImprovementSummary,
    ResumeImprovementPriority
)
from app.services.resume_service import resume_service
from app.services.gemini_service import gemini_service
from app.services.prompts.resume_improvement import build_resume_improvement_prompt

class ResumeImprovementService:
    def __init__(self):
        # In-memory mock storage mirroring M33 approach
        self._sessions: Dict[str, ResumeImprovementSession] = {}
        self._suggestions: Dict[str, List[ResumeImprovementSuggestion]] = {}
        self._drafts: Dict[str, ResumeImprovementDraft] = {}

    def _generate_id(self) -> str:
        return str(uuid.uuid4())

    def _now(self) -> str:
        return datetime.utcnow().isoformat()

    def get_user_sessions(self, user_id: str) -> List[ResumeImprovementSession]:
        return [s for s in self._sessions.values() if s.userId == user_id]

    def get_session(self, user_id: str, session_id: str) -> Optional[ResumeImprovementSession]:
        session = self._sessions.get(session_id)
        if session and session.userId == user_id:
            return session
        return None

    def create_session(self, user_id: str, resume_id: str, screening_result_id: Optional[str] = None) -> ResumeImprovementSession:
        # Check if resume exists and belongs to user
        resume = resume_service.get_resume(user_id, resume_id)
        if not resume:
            raise ValueError("Resume not found or does not belong to user.")
            
        # Check for existing active session for this resume
        for s in self._sessions.values():
            if s.userId == user_id and s.resumeId == resume_id and s.status == ResumeImprovementSessionStatus.active:
                return s

        session_id = self._generate_id()
        now = self._now()
        
        session = ResumeImprovementSession(
            sessionId=session_id,
            userId=user_id,
            resumeId=resume_id,
            screeningResultId=screening_result_id,
            status=ResumeImprovementSessionStatus.active,
            createdAt=now,
            updatedAt=now
        )
        
        self._sessions[session_id] = session
        self._suggestions[session_id] = []
        
        # Initialize an empty draft
        self._drafts[session_id] = ResumeImprovementDraft(
            draftId=self._generate_id(),
            sessionId=session_id,
            resumeId=resume_id,
            createdAt=now,
            updatedAt=now
        )
        
        return session

    def get_session_suggestions(self, user_id: str, session_id: str) -> List[ResumeImprovementSuggestion]:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        return self._suggestions.get(session_id, [])

    def get_session_draft(self, user_id: str, session_id: str) -> ResumeImprovementDraft:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        return self._drafts[session_id]

    def get_session_summary(self, user_id: str, session_id: str) -> ResumeImprovementSummary:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
            
        suggestions = self.get_session_suggestions(user_id, session_id)
        draft = self.get_session_draft(user_id, session_id)
        
        return ResumeImprovementSummary(
            session=session,
            suggestions=suggestions,
            draft=draft
        )

    async def generate_suggestions(self, user_id: str, session_id: str, section: str, context: Optional[str] = None) -> List[ResumeImprovementSuggestion]:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")

        # Mock extraction of resume content since M34 extraction is not present.
        # In a real scenario, this would read the PDF text.
        resume_content_mock = "Developed a website using React. Worked on the backend using Python. Increased things."
        screening_feedback_mock = "The project descriptions lack actionable verbs and measurable metrics. The technical skills are not well organized."

        prompt = build_resume_improvement_prompt(
            resume_content=resume_content_mock,
            screening_feedback=screening_feedback_mock,
            section=section
        )

        ai_response = await gemini_service.generate_json_response(prompt)
        
        if not ai_response:
            raise ValueError("Failed to generate AI suggestions")
            
        now = self._now()
        new_suggestions = []
        
        try:
            # The AI might return a dictionary with a list, or directly a list. Handle both.
            suggestions_data = ai_response if isinstance(ai_response, list) else ai_response.get("suggestions", [])
            
            for item in suggestions_data:
                suggestion = ResumeImprovementSuggestion(
                    suggestionId=self._generate_id(),
                    sessionId=session_id,
                    section=item.get("section", section),
                    originalText=item.get("originalText", ""),
                    suggestedText=item.get("suggestedText", ""),
                    reason=item.get("reason", ""),
                    priority=ResumeImprovementPriority(item.get("priority", "medium").lower()),
                    status=ResumeImprovementSuggestionStatus.pending,
                    createdAt=now,
                    updatedAt=now
                )
                new_suggestions.append(suggestion)
                
            self._suggestions[session_id].extend(new_suggestions)
            
            # Update session counts
            session.suggestionsCount += len(new_suggestions)
            session.updatedAt = now
            
            return new_suggestions
            
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            raise ValueError("Failed to parse AI suggestions")

    def accept_suggestion(self, user_id: str, session_id: str, suggestion_id: str) -> ResumeImprovementSuggestion:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
            
        for suggestion in self._suggestions.get(session_id, []):
            if suggestion.suggestionId == suggestion_id:
                suggestion.status = ResumeImprovementSuggestionStatus.accepted
                suggestion.updatedAt = self._now()
                
                # Add to draft
                draft = self._drafts[session_id]
                if suggestion.section not in draft.sections:
                    draft.sections[suggestion.section] = []
                draft.sections[suggestion.section].append(suggestion.suggestedText)
                draft.updatedAt = self._now()
                
                session.acceptedCount += 1
                session.updatedAt = self._now()
                return suggestion
                
        raise ValueError("Suggestion not found")

    def reject_suggestion(self, user_id: str, session_id: str, suggestion_id: str) -> ResumeImprovementSuggestion:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
            
        for suggestion in self._suggestions.get(session_id, []):
            if suggestion.suggestionId == suggestion_id:
                suggestion.status = ResumeImprovementSuggestionStatus.rejected
                suggestion.updatedAt = self._now()
                
                session.rejectedCount += 1
                session.updatedAt = self._now()
                return suggestion
                
        raise ValueError("Suggestion not found")

    def edit_suggestion(self, user_id: str, session_id: str, suggestion_id: str, edited_text: str) -> ResumeImprovementSuggestion:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
            
        for suggestion in self._suggestions.get(session_id, []):
            if suggestion.suggestionId == suggestion_id:
                # We update the suggested text with the user's manual edit.
                suggestion.suggestedText = edited_text
                suggestion.updatedAt = self._now()
                return suggestion
                
        raise ValueError("Suggestion not found")

resume_improvement_service = ResumeImprovementService()
