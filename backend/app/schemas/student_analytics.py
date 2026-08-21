from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class AnalyticsPerformanceLevel(str, Enum):
    excellent = "Excellent"
    strong = "Strong"
    good_foundation = "Good Foundation"
    needs_improvement = "Needs Improvement"
    needs_significant_improvement = "Needs Significant Improvement"
    insufficient_data = "Insufficient Data"

class AnalyticsTrend(str, Enum):
    improving = "Improving"
    stable = "Stable"
    declining = "Declining"
    insufficient_data = "Insufficient Data"

class AnalyticsCoverage(BaseModel):
    availableCategories: int
    exploredCategories: int
    coveragePercentage: float
    unexploredCategories: List[str]

class AnalyticsCategory(BaseModel):
    id: str
    name: str
    score: Optional[float]
    performanceLevel: AnalyticsPerformanceLevel
    completedActivities: int
    trend: AnalyticsTrend
    weight: float

class AnalyticsStrength(BaseModel):
    categoryName: str
    score: float

class AnalyticsImprovementArea(BaseModel):
    categoryName: str
    score: float

class AnalyticsActivity(BaseModel):
    activityId: str
    activityName: str
    module: str
    timestamp: str
    score: Optional[float] = None

class AnalyticsInsight(BaseModel):
    id: str
    text: str
    isPositive: bool

class AnalyticsOverview(BaseModel):
    userId: str
    overallScore: float
    performanceLevel: AnalyticsPerformanceLevel
    coverage: AnalyticsCoverage
    categories: List[AnalyticsCategory]
    strengths: List[AnalyticsStrength]
    improvementAreas: List[AnalyticsImprovementArea]
    insights: List[AnalyticsInsight]
    recentActivity: List[AnalyticsActivity]
    lastUpdated: str

# Module Specific Breakdowns
class CommunicationAnalytics(BaseModel):
    overallScore: Optional[float]
    completedSessions: int
    fluencyScore: Optional[float]
    formalScore: Optional[float]
    situationalScore: Optional[float]
    groupDiscussionScore: Optional[float]

class AptitudeAnalytics(BaseModel):
    overallScore: Optional[float]
    questionsAttempted: int
    accuracy: float
    quantScore: Optional[float]
    verbalScore: Optional[float]
    logicalScore: Optional[float]

class CodingLanguageAnalytics(BaseModel):
    language: str
    problemsSolved: int
    successRate: float

class CodingAnalytics(BaseModel):
    overallScore: Optional[float]
    problemsAttempted: int
    problemsSolved: int
    successRate: float
    languages: List[CodingLanguageAnalytics]

class TechnicalAnalytics(BaseModel):
    overallScore: Optional[float]
    completedActivities: int
    cScore: Optional[float]
    cppScore: Optional[float]
    javaScore: Optional[float]
    pythonScore: Optional[float]
    csCoreScore: Optional[float]

class AssessmentAnalytics(BaseModel):
    overallScore: Optional[float]
    totalCompleted: int
    highestScore: Optional[float]
    averageScore: Optional[float]

class InterviewAnalytics(BaseModel):
    overallScore: Optional[float]
    interviewsCompleted: int

class ResumeAnalytics(BaseModel):
    overallScore: Optional[float]
    screeningAttempts: int
    improvementSessions: int
    acceptedImprovements: int

class StudentAnalyticsSnapshot(BaseModel):
    overview: AnalyticsOverview
