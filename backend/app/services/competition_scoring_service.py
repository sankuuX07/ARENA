from datetime import datetime
from typing import Dict, Any

from app.schemas.competition import CompetitionResult, ParticipantStatus
from app.services.competition_service import competition_service
from app.services.competition_session_service import competition_session_service
from app.services.competition_leaderboard_service import competition_leaderboard_service

class CompetitionScoringService:
    
    def _now(self) -> str:
        return datetime.utcnow().isoformat() + "Z"

    def submit_competition(self, comp_id: str, user_id: str) -> CompetitionResult:
        comp = competition_service.get_competition(comp_id)
        session = competition_session_service.get_session(comp_id, user_id)
        participant = competition_service.get_participant(comp_id, user_id)
        
        if not session or not participant:
            raise ValueError("Participant session not found")
            
        if participant.status in [ParticipantStatus.submitted, ParticipantStatus.completed]:
            raise ValueError("Competition already submitted")

        # Mark session as submitted
        competition_session_service.mark_submitted(comp_id, user_id)
        
        # Calculate time used
        start_time = datetime.fromisoformat(session.startedAt.replace('Z', ''))
        time_used_seconds = int((datetime.utcnow() - start_time).total_seconds())
        
        # Calculate score (Delegates to actual modules in production)
        # Mocking generic scoring based on answer count for simplicity
        answers = session.answers
        challenges_completed = len(answers)
        score = challenges_completed * 10.0 # arbitrary mock scoring
        
        # Update Participant
        participant.status = ParticipantStatus.submitted
        participant.submittedAt = self._now()
        participant.score = score

        # Update Leaderboard
        rank = competition_leaderboard_service.record_score(
            comp_id=comp_id, user_id=user_id, display_name=f"User_{user_id[:4]}",
            score=score, challenges_completed=challenges_completed, time_used_seconds=time_used_seconds
        )
        participant.rank = rank
        
        # Create Result
        result = CompetitionResult(
            competitionId=comp_id, userId=user_id, score=score, rank=rank,
            challengesCompleted=challenges_completed, timeUsedSeconds=time_used_seconds,
            performanceSummary="Submitted successfully."
        )
        
        return result

    def get_result(self, comp_id: str, user_id: str) -> CompetitionResult:
        participant = competition_service.get_participant(comp_id, user_id)
        if not participant or participant.status not in [ParticipantStatus.submitted, ParticipantStatus.completed]:
            raise ValueError("Result not available or competition not submitted")
            
        return CompetitionResult(
            competitionId=comp_id, userId=user_id, score=participant.score or 0.0,
            rank=participant.rank, challengesCompleted=0, timeUsedSeconds=0, # Need to store these if pulling later
            performanceSummary="Loaded historical result."
        )

competition_scoring_service = CompetitionScoringService()
