import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

from app.schemas.competition import CompetitionSession, ParticipantStatus, CompetitionStatus
from app.services.competition_service import competition_service

class CompetitionSessionService:
    def __init__(self):
        # Maps userId + competitionId -> active Session
        self._sessions: Dict[str, CompetitionSession] = {}

    def _now(self) -> datetime:
        return datetime.utcnow()

    def _get_session_key(self, comp_id: str, user_id: str) -> str:
        return f"{user_id}:{comp_id}"

    def start_session(self, comp_id: str, user_id: str) -> CompetitionSession:
        comp = competition_service.get_competition(comp_id)
        if comp.status != CompetitionStatus.live:
            raise ValueError("Competition is not live")

        participant = competition_service.get_participant(comp_id, user_id)
        if not participant:
            # Auto-register if live and room available
            participant = competition_service.register_participant(comp_id, user_id)
            
        if participant.status in [ParticipantStatus.submitted, ParticipantStatus.completed, ParticipantStatus.disqualified]:
            raise ValueError(f"Cannot start session. Current status: {participant.status}")

        session_key = self._get_session_key(comp_id, user_id)
        
        # Resuming existing session
        if session_key in self._sessions:
            session = self._sessions[session_key]
            if session.status == "active":
                # Check backend expiration
                if datetime.fromisoformat(session.expiresAt) < self._now():
                    session.status = "expired"
                    participant.status = ParticipantStatus.submitted
                    return session
                return session

        # Create new session
        now = self._now()
        expires_at = now + timedelta(minutes=comp.durationMinutes)
        
        # Ensure it doesn't exceed the global competition end time
        comp_end = datetime.fromisoformat(comp.endTime.replace('Z', ''))
        if expires_at > comp_end:
            expires_at = comp_end

        session = CompetitionSession(
            sessionId=str(uuid.uuid4()), competitionId=comp_id, userId=user_id,
            startedAt=now.isoformat() + "Z", lastActivityAt=now.isoformat() + "Z",
            expiresAt=expires_at.isoformat() + "Z", status="active", answers={}
        )
        
        self._sessions[session_key] = session
        
        participant.status = ParticipantStatus.in_progress
        participant.startedAt = now.isoformat() + "Z"
        
        return session

    def get_session(self, comp_id: str, user_id: str) -> Optional[CompetitionSession]:
        return self._sessions.get(self._get_session_key(comp_id, user_id))

    def update_session(self, comp_id: str, user_id: str, answers: Dict[str, Any]) -> CompetitionSession:
        session = self.get_session(comp_id, user_id)
        if not session:
            raise ValueError("No active session found")
            
        if session.status != "active":
            raise ValueError("Session is no longer active")
            
        # Verify server-side timer
        if datetime.fromisoformat(session.expiresAt.replace('Z', '')) < self._now():
            session.status = "expired"
            raise ValueError("Session has expired")

        session.answers.update(answers)
        session.lastActivityAt = self._now().isoformat() + "Z"
        
        return session

    def mark_submitted(self, comp_id: str, user_id: str) -> CompetitionSession:
        session = self.get_session(comp_id, user_id)
        if not session:
            raise ValueError("No active session found")
            
        session.status = "submitted"
        return session

competition_session_service = CompetitionSessionService()
