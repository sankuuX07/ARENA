from typing import Dict, Any
from app.schemas.admin import AdminDashboardResponse
from app.services.competition_service import competition_service
from app.schemas.competition import CompetitionStatus

class AdminDashboardService:
    def get_dashboard_stats(self) -> AdminDashboardResponse:
        total_competitions = len(competition_service.get_competitions())
        live_competitions = len(competition_service.get_competitions(status=CompetitionStatus.live))
        
        # Mucking up some stats since we don't have global users or assessment DBs mapped in memory
        return AdminDashboardResponse(
            totalStudents=145,
            activeStudents=42,
            totalCompetitions=total_competitions,
            liveCompetitions=live_competitions,
            completedAssessments=87,
            codingSubmissions=324,
            recentActivity=[
                {"id": "1", "action": "Competition created", "time": "1 hour ago"},
                {"id": "2", "action": "New student registered", "time": "2 hours ago"},
                {"id": "3", "action": "Assessment completed", "time": "5 hours ago"}
            ]
        )

admin_dashboard_service = AdminDashboardService()
