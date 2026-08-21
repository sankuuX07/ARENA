import uuid
from datetime import datetime
from typing import List
from app.schemas.admin import (
    AdminCompetitionCreate, AdminCompetitionUpdate, 
    AdminCompetitionStatusUpdate
)
from app.schemas.competition import Competition, CompetitionStatus, CompetitionType, CompetitionDifficulty, CompetitionRules
from app.services.competition_service import competition_service

class AdminCompetitionService:
    def create_competition(self, data: AdminCompetitionCreate) -> Competition:
        comp_id = f"comp_{uuid.uuid4().hex[:8]}"
        comp = Competition(
            competitionId=comp_id,
            title=data.title,
            description=data.description,
            type=CompetitionType(data.competitionType),
            difficulty=CompetitionDifficulty(data.difficulty),
            status=CompetitionStatus.draft,
            startTime=data.startTime.isoformat() + "Z",
            endTime=data.endTime.isoformat() + "Z",
            durationMinutes=data.durationMinutes,
            maxParticipants=data.maxParticipants,
            participantCount=0,
            rules=CompetitionRules(),
            challenges=[],
            createdAt=datetime.utcnow().isoformat() + "Z",
            updatedAt=datetime.utcnow().isoformat() + "Z"
        )
        competition_service._competitions[comp_id] = comp
        competition_service._participants[comp_id] = []
        return comp

    def update_competition(self, comp_id: str, data: AdminCompetitionUpdate) -> Competition:
        comp = competition_service.get_competition(comp_id)
        if data.title is not None: comp.title = data.title
        if data.description is not None: comp.description = data.description
        if data.difficulty is not None: comp.difficulty = CompetitionDifficulty(data.difficulty)
        if data.durationMinutes is not None: comp.durationMinutes = data.durationMinutes
        if data.maxParticipants is not None: comp.maxParticipants = data.maxParticipants
        comp.updatedAt = datetime.utcnow().isoformat() + "Z"
        return comp

    def update_status(self, comp_id: str, data: AdminCompetitionStatusUpdate) -> Competition:
        comp = competition_service.get_competition(comp_id)
        comp.status = CompetitionStatus(data.status)
        comp.updatedAt = datetime.utcnow().isoformat() + "Z"
        return comp

admin_competition_service = AdminCompetitionService()
