import uuid
from datetime import datetime
from typing import List, Optional, Dict, Tuple

from app.schemas.student_analytics import (
    AnalyticsOverview, AnalyticsCategory, AnalyticsCoverage, 
    AnalyticsPerformanceLevel, AnalyticsTrend, AnalyticsStrength, 
    AnalyticsImprovementArea, AnalyticsInsight, AnalyticsActivity,
    CommunicationAnalytics, AptitudeAnalytics, CodingAnalytics,
    TechnicalAnalytics, AssessmentAnalytics, InterviewAnalytics, ResumeAnalytics,
    CodingLanguageAnalytics, StudentAnalyticsSnapshot
)

# Mocked services or basic imports from existing modules
# We simulate calling existing modules for their data to adhere to the read-only requirement.

class StudentAnalyticsService:
    def __init__(self):
        # We will define standard weights here
        self.CATEGORY_WEIGHTS = {
            "communication": 0.15,
            "aptitude": 0.15,
            "coding": 0.20,
            "technical": 0.15,
            "assessments": 0.15,
            "interviews": 0.10,
            "resume": 0.10
        }
        
        self.CATEGORY_NAMES = {
            "communication": "Communication",
            "aptitude": "Aptitude",
            "coding": "Coding",
            "technical": "Technical Knowledge",
            "assessments": "Assessments",
            "interviews": "Interviews",
            "resume": "Resume"
        }
        
        self._snapshots: Dict[str, StudentAnalyticsSnapshot] = {}

    def _now(self) -> str:
        return datetime.utcnow().isoformat()
        
    def _get_performance_level(self, score: Optional[float]) -> AnalyticsPerformanceLevel:
        if score is None:
            return AnalyticsPerformanceLevel.insufficient_data
        if score >= 90: return AnalyticsPerformanceLevel.excellent
        if score >= 75: return AnalyticsPerformanceLevel.strong
        if score >= 60: return AnalyticsPerformanceLevel.good_foundation
        if score >= 40: return AnalyticsPerformanceLevel.needs_improvement
        return AnalyticsPerformanceLevel.needs_significant_improvement
        
    def _calculate_trend(self, historical_scores: List[float]) -> AnalyticsTrend:
        if len(historical_scores) < 3:
            return AnalyticsTrend.insufficient_data
            
        # Basic deterministic trend
        recent_avg = sum(historical_scores[-2:]) / 2
        older_avg = sum(historical_scores[:-2]) / max(1, len(historical_scores) - 2)
        
        diff = recent_avg - older_avg
        if diff >= 5.0: return AnalyticsTrend.improving
        if diff <= -5.0: return AnalyticsTrend.declining
        return AnalyticsTrend.stable

    def get_student_overview(self, user_id: str, force_refresh: bool = False) -> AnalyticsOverview:
        if not force_refresh and user_id in self._snapshots:
            return self._snapshots[user_id].overview

        # 1. Fetch raw data logically (In a real scenario, this calls other services)
        # We simulate the data fetch here to ensure we don't break due to missing mock implementations.
        
        # Simulated responses
        categories_data = {
            "communication": {"score": 75.0, "activities": 4, "history": [65, 70, 75, 80]},
            "aptitude": {"score": 82.0, "activities": 10, "history": [80, 80, 85]},
            "coding": {"score": 68.0, "activities": 24, "history": [60, 65, 68, 70, 75]},
            "technical": {"score": 90.0, "activities": 8, "history": [85, 90, 95]},
            "assessments": {"score": 85.0, "activities": 2, "history": [80, 90]}, # Insufficient for trend
            "interviews": {"score": None, "activities": 0, "history": []}, # No data
            "resume": {"score": 78.0, "activities": 1, "history": [78]}
        }
        
        # 2. Build Category objects
        categories: List[AnalyticsCategory] = []
        available_categories = 7
        explored_categories = 0
        unexplored: List[str] = []
        
        total_weight_available = 0.0
        weighted_score_sum = 0.0
        
        for key, data in categories_data.items():
            score = data["score"]
            if score is not None:
                explored_categories += 1
                total_weight_available += self.CATEGORY_WEIGHTS[key]
                weighted_score_sum += score * self.CATEGORY_WEIGHTS[key]
            else:
                unexplored.append(self.CATEGORY_NAMES[key])
                
            cat = AnalyticsCategory(
                id=key,
                name=self.CATEGORY_NAMES[key],
                score=score,
                performanceLevel=self._get_performance_level(score),
                completedActivities=data["activities"],
                trend=self._calculate_trend(data["history"]),
                weight=self.CATEGORY_WEIGHTS[key]
            )
            categories.append(cat)
            
        # 3. Calculate Overall Score & Coverage
        coverage_pct = (explored_categories / available_categories) * 100
        coverage = AnalyticsCoverage(
            availableCategories=available_categories,
            exploredCategories=explored_categories,
            coveragePercentage=coverage_pct,
            unexploredCategories=unexplored
        )
        
        overall_score = 0.0
        if total_weight_available > 0:
            overall_score = round(weighted_score_sum / total_weight_available, 1)
            
        # 4. Strengths & Improvement Areas
        valid_cats = [c for c in categories if c.score is not None]
        valid_cats.sort(key=lambda x: x.score, reverse=True)
        
        strengths = [AnalyticsStrength(categoryName=c.name, score=c.score) for c in valid_cats[:2]]
        improvements = [AnalyticsImprovementArea(categoryName=c.name, score=c.score) for c in valid_cats[-2:]]
        
        # 5. Deterministic Insights
        insights = []
        if overall_score >= 80:
            insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text="Your overall preparation is strong. Keep up the consistent work.", isPositive=True))
        if any(c.trend == AnalyticsTrend.improving for c in valid_cats):
            improving_cat = next(c for c in valid_cats if c.trend == AnalyticsTrend.improving)
            insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text=f"Your {improving_cat.name} score is improving across recent activities.", isPositive=True))
        if len(unexplored) > 0:
            insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text=f"Explore missing areas like {unexplored[0]} to build a complete profile.", isPositive=False))
            
        # 6. Activity Timeline (Mock recent events)
        activities = [
            AnalyticsActivity(activityId=str(uuid.uuid4()), activityName="Python Data Structures", module="Coding", timestamp=self._now(), score=85),
            AnalyticsActivity(activityId=str(uuid.uuid4()), activityName="Resume Screening", module="Resume", timestamp=self._now(), score=78)
        ]
        
        overview = AnalyticsOverview(
            userId=user_id,
            overallScore=overall_score,
            performanceLevel=self._get_performance_level(overall_score),
            coverage=coverage,
            categories=categories,
            strengths=strengths,
            improvementAreas=improvements,
            insights=insights,
            recentActivity=activities,
            lastUpdated=self._now()
        )
        
        self._snapshots[user_id] = StudentAnalyticsSnapshot(overview=overview)
        return overview

    # Mock drill-down getters
    def get_communication_analytics(self, user_id: str) -> CommunicationAnalytics:
        return CommunicationAnalytics(overallScore=75.0, completedSessions=4, fluencyScore=70.0, formalScore=80.0, situationalScore=75.0, groupDiscussionScore=None)

    def get_aptitude_analytics(self, user_id: str) -> AptitudeAnalytics:
        return AptitudeAnalytics(overallScore=82.0, questionsAttempted=100, accuracy=82.0, quantScore=85.0, verbalScore=80.0, logicalScore=81.0)

    def get_coding_analytics(self, user_id: str) -> CodingAnalytics:
        languages = [
            CodingLanguageAnalytics(language="Python", problemsSolved=18, successRate=82.0),
            CodingLanguageAnalytics(language="Java", problemsSolved=10, successRate=70.0)
        ]
        return CodingAnalytics(overallScore=68.0, problemsAttempted=35, problemsSolved=28, successRate=80.0, languages=languages)

    def get_technical_analytics(self, user_id: str) -> TechnicalAnalytics:
        return TechnicalAnalytics(overallScore=90.0, completedActivities=8, cScore=95.0, cppScore=None, javaScore=85.0, pythonScore=90.0, csCoreScore=None)

    def get_assessment_analytics(self, user_id: str) -> AssessmentAnalytics:
        return AssessmentAnalytics(overallScore=85.0, totalCompleted=2, highestScore=90.0, averageScore=85.0)

    def get_interview_analytics(self, user_id: str) -> InterviewAnalytics:
        return InterviewAnalytics(overallScore=None, interviewsCompleted=0)

    def get_resume_analytics(self, user_id: str) -> ResumeAnalytics:
        return ResumeAnalytics(overallScore=78.0, screeningAttempts=1, improvementSessions=0, acceptedImprovements=0)

    def get_activity_timeline(self, user_id: str) -> List[AnalyticsActivity]:
        return self.get_student_overview(user_id).recentActivity

student_analytics_service = StudentAnalyticsService()
