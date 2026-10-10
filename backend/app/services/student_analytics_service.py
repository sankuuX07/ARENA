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

from app.services.assessment_result_service import assessment_result_service
from app.services.interview_service import interview_service
from app.services.resume_improvement_service import resume_improvement_service
from app.services.c_service import c_service
from app.services.cpp_service import cpp_service
from app.services.java_service import java_service
from app.services.python_service import python_service
from app.services.cs_core_service import cs_core_service
from app.services.aptitude_service import aptitude_service

class StudentAnalyticsService:
    def __init__(self):
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
        recent_avg = sum(historical_scores[-2:]) / 2
        older_avg = sum(historical_scores[:-2]) / max(1, len(historical_scores) - 2)
        diff = recent_avg - older_avg
        if diff >= 5.0: return AnalyticsTrend.improving
        if diff <= -5.0: return AnalyticsTrend.declining
        return AnalyticsTrend.stable

    def get_student_overview(self, user_id: str, force_refresh: bool = False) -> Optional[AnalyticsOverview]:
        if not force_refresh and user_id in self._snapshots:
            return self._snapshots[user_id].overview

        # Pull actual data from backend services instead of hardcoding
        
        # Assessments
        assessments_history = assessment_result_service.get_history(user_id)
        assessments_scores = [r.percentage for r in assessments_history if r.percentage is not None]
        assessments_score = sum(assessments_scores)/len(assessments_scores) if assessments_scores else None

        # Interviews
        interviews_history = [s for s in interview_service._sessions.values() if s.userId == user_id]
        interviews_scores = [s.overallScore for s in interviews_history if s.overallScore is not None]
        interviews_score = sum(interviews_scores)/len(interviews_scores) if interviews_scores else None

        # Resume
        resume_history = resume_improvement_service.get_user_sessions(user_id)
        resume_scores = [s.originalScore for s in resume_history if s.originalScore is not None]
        resume_score = sum(resume_scores)/len(resume_scores) if resume_scores else None

        # Aptitude
        aptitude_history = [s for s in aptitude_service._results if s.userId == user_id] if hasattr(aptitude_service, '_results') else []
        aptitude_scores = [s.accuracy for s in aptitude_history if s.accuracy is not None]
        aptitude_score = sum(aptitude_scores)/len(aptitude_scores) if aptitude_scores else None

        # Technical (C, C++, Java, Python, CS Core)
        tech_history = []
        tech_history.extend(c_service._sessions.get(user_id, []))
        tech_history.extend(cpp_service._sessions.get(user_id, []))
        tech_history.extend(java_service._sessions.get(user_id, []))
        tech_history.extend(python_service._sessions.get(user_id, []))
        tech_history.extend(cs_core_service._sessions.get(user_id, []))
        tech_scores = [s.score for s in tech_history if getattr(s, 'score', None) is not None]
        tech_score = sum(tech_scores)/len(tech_scores) if tech_scores else None

        # Coding
        coding_history = []
        coding_history.extend(c_service._sessions.get(user_id, []))
        coding_history.extend(cpp_service._sessions.get(user_id, []))
        coding_history.extend(java_service._sessions.get(user_id, []))
        coding_history.extend(python_service._sessions.get(user_id, []))
        coding_scores = [s.score for s in coding_history if getattr(s, 'score', None) is not None]
        coding_score = sum(coding_scores)/len(coding_scores) if coding_scores else None
        
        # Communication - Currently mock empty as they drop sessions or we don't have direct access
        communication_history = []
        communication_scores = []
        communication_score = None

        categories_data = {
            "communication": {"score": communication_score, "activities": len(communication_history), "history": communication_scores},
            "aptitude": {"score": aptitude_score, "activities": len(aptitude_history), "history": aptitude_scores},
            "coding": {"score": coding_score, "activities": len(coding_history), "history": coding_scores},
            "technical": {"score": tech_score, "activities": len(tech_history), "history": tech_scores},
            "assessments": {"score": assessments_score, "activities": len(assessments_history), "history": assessments_scores},
            "interviews": {"score": interviews_score, "activities": len(interviews_history), "history": interviews_scores},
            "resume": {"score": resume_score, "activities": len(resume_history), "history": resume_scores}
        }
        
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
            
        # Return empty state if no data exists
        if explored_categories == 0:
            # We return an overview with no data so frontend can show empty state or handle 0 correctly
            pass

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
            
        valid_cats = [c for c in categories if c.score is not None]
        valid_cats.sort(key=lambda x: x.score, reverse=True)
        
        strengths = [AnalyticsStrength(categoryName=c.name, score=c.score) for c in valid_cats[:2]]
        improvements = [AnalyticsImprovementArea(categoryName=c.name, score=c.score) for c in valid_cats[-2:]]
        
        insights = []
        if explored_categories == 0:
            insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text="Welcome to ARENA! Start completing activities to see your personalized analytics and insights.", isPositive=True))
        else:
            if overall_score >= 80:
                insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text="Your overall preparation is strong. Keep up the consistent work.", isPositive=True))
            if any(c.trend == AnalyticsTrend.improving for c in valid_cats):
                improving_cat = next(c for c in valid_cats if c.trend == AnalyticsTrend.improving)
                insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text=f"Your {improving_cat.name} score is improving across recent activities.", isPositive=True))
            if len(unexplored) > 0:
                insights.append(AnalyticsInsight(id=str(uuid.uuid4()), text=f"Explore missing areas like {unexplored[0]} to build a complete profile.", isPositive=False))
            
        activities = []
        
        overview = AnalyticsOverview(
            userId=user_id,
            overallScore=overall_score if explored_categories > 0 else 0.0,
            performanceLevel=self._get_performance_level(overall_score if explored_categories > 0 else None),
            coverage=coverage,
            categories=categories,
            strengths=strengths,
            improvementAreas=improvements,
            insights=insights,
            recentActivity=activities,
            lastUpdated=self._now()
        )
        
        # Don't cache empty overview to avoid stale state when they first practice
        if explored_categories > 0:
            self._snapshots[user_id] = StudentAnalyticsSnapshot(overview=overview)
        return overview

    def get_communication_analytics(self, user_id: str) -> CommunicationAnalytics:
        return CommunicationAnalytics(overallScore=0.0, completedSessions=0, fluencyScore=0.0, formalScore=0.0, situationalScore=0.0, groupDiscussionScore=0.0)

    def get_aptitude_analytics(self, user_id: str) -> AptitudeAnalytics:
        return AptitudeAnalytics(overallScore=0.0, questionsAttempted=0, accuracy=0.0, quantScore=0.0, verbalScore=0.0, logicalScore=0.0)

    def get_coding_analytics(self, user_id: str) -> CodingAnalytics:
        return CodingAnalytics(overallScore=0.0, problemsAttempted=0, problemsSolved=0, successRate=0.0, languages=[])

    def get_technical_analytics(self, user_id: str) -> TechnicalAnalytics:
        return TechnicalAnalytics(overallScore=0.0, completedActivities=0, cScore=0.0, cppScore=0.0, javaScore=0.0, pythonScore=0.0, csCoreScore=0.0)

    def get_assessment_analytics(self, user_id: str) -> AssessmentAnalytics:
        return AssessmentAnalytics(overallScore=0.0, totalCompleted=0, highestScore=0.0, averageScore=0.0)

    def get_interview_analytics(self, user_id: str) -> InterviewAnalytics:
        return InterviewAnalytics(overallScore=None, interviewsCompleted=0)

    def get_resume_analytics(self, user_id: str) -> ResumeAnalytics:
        return ResumeAnalytics(overallScore=0.0, screeningAttempts=0, improvementSessions=0, acceptedImprovements=0)

    def get_activity_timeline(self, user_id: str) -> List[AnalyticsActivity]:
        overview = self.get_student_overview(user_id)
        return overview.recentActivity if overview else []

student_analytics_service = StudentAnalyticsService()
