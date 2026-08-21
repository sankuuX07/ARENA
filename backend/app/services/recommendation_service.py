import uuid
import json
from datetime import datetime
from typing import List, Dict, Optional

from app.schemas.recommendation import (
    StudentRecommendation, RecommendationType, RecommendationPriority,
    RecommendationConfidence, RecommendationStatus, RecommendationOverview,
    RecommendationHistoryItem
)
from app.config.recommendation_config import recommendation_config
from app.services.student_analytics_service import student_analytics_service
# Using existing AI service structure (mocked import)
# from app.services.gemini_service import gemini_service
from app.services.prompts.personalized_recommendations import get_recommendation_prompt

class RecommendationService:
    def __init__(self):
        # In-memory store for active/history. In production, this goes to Firestore.
        self._active_recommendations: Dict[str, List[StudentRecommendation]] = {}
        self._history: Dict[str, List[RecommendationHistoryItem]] = {}

    def _now(self) -> str:
        return datetime.utcnow().isoformat()

    def _generate_fingerprint(self, rec_type: str, category: str, route: str) -> str:
        return f"{rec_type}:{category}:{route}"

    def _build_deterministic_candidates(self, user_id: str) -> List[StudentRecommendation]:
        analytics = student_analytics_service.get_student_overview(user_id)
        candidates: List[StudentRecommendation] = []
        
        # Rule 1: No data handling / Onboarding
        if analytics.coverage.exploredCategories == 0:
            candidates.append(self._create_base_recommendation(
                user_id, RecommendationType.assessment, RecommendationPriority.high,
                RecommendationConfidence.low, "Take a Baseline Assessment",
                "Start with a short aptitude assessment to establish your current preparation baseline.",
                "Based on your empty profile.", "aptitude", "Start Assessment", "/aptitude"
            ))
            return candidates

        # Rule 2: Missing Coverage
        for missing in analytics.coverage.unexploredCategories:
            if missing == "Interviews":
                candidates.append(self._create_base_recommendation(
                    user_id, RecommendationType.coverage, RecommendationPriority.high,
                    RecommendationConfidence.medium, "Start Interview Practice",
                    "You have completed activities, but interview practice has not started yet.",
                    f"No data available for {missing}.", "interviews", "Start AI Interview", "/interview"
                ))
                break # Just recommend one missing coverage area at a time

        # Rule 3: Weak Areas
        for imp in analytics.improvementAreas:
            cat_analytics = next((c for c in analytics.categories if c.name == imp.categoryName), None)
            if cat_analytics and cat_analytics.score is not None and cat_analytics.score < recommendation_config.WEAK_SCORE_THRESHOLD:
                conf = RecommendationConfidence.high if cat_analytics.completedActivities >= recommendation_config.MINIMUM_DATA_ACTIVITIES else RecommendationConfidence.medium
                
                route = f"/{imp.categoryName.lower()}"
                if imp.categoryName == "Technical Knowledge": route = "/technical"
                
                candidates.append(self._create_base_recommendation(
                    user_id, RecommendationType.improvement, RecommendationPriority.high,
                    conf, f"Improve {imp.categoryName}",
                    f"Your recent performance in {imp.categoryName} is currently lower than expected.",
                    f"Average score is below {recommendation_config.WEAK_SCORE_THRESHOLD}.",
                    imp.categoryName.lower(), "Practice Now", route
                ))

        # Rule 4: Strong Areas (Maintenance)
        for strength in analytics.strengths:
            cat_analytics = next((c for c in analytics.categories if c.name == strength.categoryName), None)
            if cat_analytics and cat_analytics.score is not None and cat_analytics.score >= recommendation_config.STRONG_SCORE_THRESHOLD:
                conf = RecommendationConfidence.high if cat_analytics.completedActivities >= recommendation_config.MINIMUM_DATA_ACTIVITIES else RecommendationConfidence.low
                
                if conf == RecommendationConfidence.high:
                    route = f"/{strength.categoryName.lower()}"
                    if strength.categoryName == "Technical Knowledge": route = "/technical"
                    
                    candidates.append(self._create_base_recommendation(
                        user_id, RecommendationType.strength_maintenance, RecommendationPriority.low,
                        conf, f"Keep Your {strength.categoryName} Sharp",
                        f"You have shown consistently strong performance in recent {strength.categoryName} activities.",
                        f"Score consistently above {recommendation_config.STRONG_SCORE_THRESHOLD}.",
                        strength.categoryName.lower(), "Try a Challenge", route
                    ))

        return candidates

    def _create_base_recommendation(self, user_id, type_, priority, conf, title, desc, reason, target, label, route) -> StudentRecommendation:
        return StudentRecommendation(
            recommendationId=str(uuid.uuid4()), userId=user_id, type=type_, priority=priority, confidence=conf,
            title=title, description=desc, reasonSummary=reason, targetCategory=target, actionLabel=label, actionRoute=route,
            status=RecommendationStatus.active, createdAt=self._now(), updatedAt=self._now(),
            fingerprint=self._generate_fingerprint(type_.value, target, route)
        )

    def _rank_and_deduplicate(self, candidates: List[StudentRecommendation], active: List[StudentRecommendation]) -> List[StudentRecommendation]:
        # Simple deduplication against existing active recommendations
        active_fingerprints = {r.fingerprint for r in active}
        new_valid = [c for c in candidates if c.fingerprint not in active_fingerprints]
        
        # Rank: Critical > High > Medium > Low
        priority_weights = {
            RecommendationPriority.critical: 4,
            RecommendationPriority.high: 3,
            RecommendationPriority.medium: 2,
            RecommendationPriority.low: 1
        }
        
        new_valid.sort(key=lambda x: priority_weights.get(x.priority, 0), reverse=True)
        return new_valid[:recommendation_config.MAX_ACTIVE_RECOMMENDATIONS]

    def _enhance_with_ai(self, user_id: str, candidates: List[StudentRecommendation]) -> List[StudentRecommendation]:
        if not candidates:
            return candidates
            
        # Normally we'd call Gemini here. Simulating the fallback / pass-through
        # gemini_service.generate_content(...)
        return candidates

    def refresh_recommendations(self, user_id: str) -> RecommendationOverview:
        # Expire stale logic would go here
        
        active = self._active_recommendations.get(user_id, [])
        active = [r for r in active if r.status == RecommendationStatus.active]
        
        candidates = self._build_deterministic_candidates(user_id)
        ranked = self._rank_and_deduplicate(candidates, active)
        
        enhanced = self._enhance_with_ai(user_id, ranked)
        
        # Add new ones to active
        active.extend(enhanced)
        
        # Sort active to find Next Best Action
        priority_weights = {
            RecommendationPriority.critical: 4,
            RecommendationPriority.high: 3,
            RecommendationPriority.medium: 2,
            RecommendationPriority.low: 1
        }
        active.sort(key=lambda x: priority_weights.get(x.priority, 0), reverse=True)
        
        next_action = active[0] if active else None
        
        self._active_recommendations[user_id] = active
        
        return RecommendationOverview(
            nextBestAction=next_action,
            activeRecommendations=active,
            lastRefreshed=self._now()
        )

    def get_overview(self, user_id: str) -> RecommendationOverview:
        if user_id not in self._active_recommendations:
            return self.refresh_recommendations(user_id)
            
        active = self._active_recommendations.get(user_id, [])
        next_action = active[0] if active else None
        return RecommendationOverview(nextBestAction=next_action, activeRecommendations=active, lastRefreshed=self._now())

    def mark_completed(self, user_id: str, rec_id: str):
        active = self._active_recommendations.get(user_id, [])
        for rec in active:
            if rec.recommendationId == rec_id:
                rec.status = RecommendationStatus.completed
                rec.updatedAt = self._now()
                # Move to history
                history = self._history.get(user_id, [])
                history.append(RecommendationHistoryItem(recommendation=rec, resolvedAt=self._now(), resolutionType="completed"))
                self._history[user_id] = history
                self._active_recommendations[user_id] = [r for r in active if r.recommendationId != rec_id]
                return rec
        raise ValueError("Recommendation not found or not active.")

    def dismiss(self, user_id: str, rec_id: str):
        active = self._active_recommendations.get(user_id, [])
        for rec in active:
            if rec.recommendationId == rec_id:
                rec.status = RecommendationStatus.dismissed
                rec.updatedAt = self._now()
                # Move to history
                history = self._history.get(user_id, [])
                history.append(RecommendationHistoryItem(recommendation=rec, resolvedAt=self._now(), resolutionType="dismissed"))
                self._history[user_id] = history
                self._active_recommendations[user_id] = [r for r in active if r.recommendationId != rec_id]
                return rec
        raise ValueError("Recommendation not found or not active.")

    def get_history(self, user_id: str) -> List[RecommendationHistoryItem]:
        return self._history.get(user_id, [])

recommendation_service = RecommendationService()
