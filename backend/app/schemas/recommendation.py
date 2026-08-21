from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class RecommendationType(str, Enum):
    next_action = "next_action"
    practice = "practice"
    improvement = "improvement"
    strength_maintenance = "strength_maintenance"
    coverage = "coverage"
    resume = "resume"
    interview = "interview"
    assessment = "assessment"

class RecommendationPriority(str, Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"

class RecommendationConfidence(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class RecommendationStatus(str, Enum):
    active = "active"
    completed = "completed"
    dismissed = "dismissed"
    expired = "expired"

class StudentRecommendation(BaseModel):
    recommendationId: str
    userId: str
    type: RecommendationType
    priority: RecommendationPriority
    confidence: RecommendationConfidence
    title: str
    description: str
    reasonSummary: str
    targetCategory: str
    actionLabel: str
    actionRoute: str
    status: RecommendationStatus
    createdAt: str
    updatedAt: str
    expiresAt: Optional[str] = None
    fingerprint: str

class RecommendationOverview(BaseModel):
    nextBestAction: Optional[StudentRecommendation]
    activeRecommendations: List[StudentRecommendation]
    lastRefreshed: str

class RecommendationHistoryItem(BaseModel):
    recommendation: StudentRecommendation
    resolvedAt: str
    resolutionType: str # "completed" | "dismissed" | "expired"
