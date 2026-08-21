import uuid
from datetime import datetime
from typing import List, Optional, Dict

from app.schemas.competition import (
    Competition, CompetitionStatus, CompetitionType, CompetitionDifficulty,
    CompetitionParticipant, ParticipantStatus, CompetitionHistoryItem,
    CompetitionRules, LeaderboardVisibility, ResultVisibility, CompetitionChallenge
)

class CompetitionService:
    def __init__(self):
        # In-memory mock DB
        self._competitions: Dict[str, Competition] = {}
        self._participants: Dict[str, List[CompetitionParticipant]] = {} # competitionId -> participants
        self._history: Dict[str, List[CompetitionHistoryItem]] = {} # userId -> history
        
        self._seed_mock_data()

    def _now(self) -> str:
        return datetime.utcnow().isoformat()

    def _seed_mock_data(self):
        # Seed an upcoming competition
        comp1_id = "comp_upcoming_1"
        self._competitions[comp1_id] = Competition(
            competitionId=comp1_id, title="Weekly Coding Challenge #42", description="A 3-problem algorithmic coding challenge.",
            type=CompetitionType.coding, difficulty=CompetitionDifficulty.medium, status=CompetitionStatus.upcoming,
            startTime="2026-09-01T10:00:00Z", endTime="2026-09-01T12:00:00Z", durationMinutes=120,
            maxParticipants=500, participantCount=45, rules=CompetitionRules(), challenges=[],
            createdAt=self._now(), updatedAt=self._now()
        )
        
        # Seed a live competition
        comp2_id = "comp_live_1"
        self._competitions[comp2_id] = Competition(
            competitionId=comp2_id, title="Aptitude Sprint", description="Test your quantitative and logical speed.",
            type=CompetitionType.aptitude, difficulty=CompetitionDifficulty.easy, status=CompetitionStatus.live,
            startTime="2020-01-01T00:00:00Z", endTime="2030-01-01T00:00:00Z", durationMinutes=45, # always live for test
            maxParticipants=1000, participantCount=150, rules=CompetitionRules(), challenges=[],
            createdAt=self._now(), updatedAt=self._now()
        )
        self._participants[comp2_id] = []
        self._participants[comp1_id] = []

    def get_competitions(self, status: Optional[CompetitionStatus] = None) -> List[Competition]:
        comps = list(self._competitions.values())
        if status:
            comps = [c for c in comps if c.status == status]
        return comps

    def get_competition(self, comp_id: str) -> Competition:
        if comp_id not in self._competitions:
            raise ValueError("Competition not found")
        return self._competitions[comp_id]

    def register_participant(self, comp_id: str, user_id: str) -> CompetitionParticipant:
        comp = self.get_competition(comp_id)
        
        if comp.status not in [CompetitionStatus.upcoming, CompetitionStatus.live]:
            raise ValueError("Competition is not open for registration")
            
        if comp.participantCount >= comp.maxParticipants:
            raise ValueError("Competition is full")

        participants = self._participants.get(comp_id, [])
        if any(p.userId == user_id for p in participants):
            raise ValueError("Already registered")

        participant = CompetitionParticipant(
            participantId=str(uuid.uuid4()), competitionId=comp_id, userId=user_id,
            status=ParticipantStatus.registered, joinedAt=self._now()
        )
        
        participants.append(participant)
        self._participants[comp_id] = participants
        
        comp.participantCount += 1
        comp.updatedAt = self._now()
        
        return participant

    def get_participant(self, comp_id: str, user_id: str) -> Optional[CompetitionParticipant]:
        participants = self._participants.get(comp_id, [])
        return next((p for p in participants if p.userId == user_id), None)

    def get_user_history(self, user_id: str) -> List[CompetitionHistoryItem]:
        return self._history.get(user_id, [])

    def record_history(self, user_id: str, item: CompetitionHistoryItem):
        history = self._history.get(user_id, [])
        history.append(item)
        self._history[user_id] = history

competition_service = CompetitionService()
