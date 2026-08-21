from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class InterviewEvaluationStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"

class InterviewPerformanceLevel(str, Enum):
    excellent = "excellent" # 90-100
    strong = "strong" # 75-89
    good = "good" # 60-74
    needs_improvement = "needs_improvement" # 40-59
    needs_significant_improvement = "needs_significant_improvement" # 0-39

class InterviewQuestionEvaluation(BaseModel):
    questionId: str
    question: str
    studentAnswer: str
    score: Optional[int] = None
    strengths: List[str] = []
    improvementAreas: List[str] = []
    feedback: str
    followUpContext: Optional[str] = None

class InterviewPracticeArea(BaseModel):
    area: str
    reason: str

class InterviewEvaluation(BaseModel):
    resultId: str
    sessionId: str
    userId: str
    status: str
    mode: str
    topic: Optional[str] = None
    overallScore: Optional[int] = None
    maxScore: int = 100
    performanceLevel: Optional[str] = None
    
    # Mode-specific or general metrics
    communicationScore: Optional[int] = None
    technicalScore: Optional[int] = None
    relevanceScore: Optional[int] = None
    clarityScore: Optional[int] = None
    structureScore: Optional[int] = None
    
    strengths: List[str] = []
    improvementAreas: List[str] = []
    questionEvaluations: List[InterviewQuestionEvaluation] = []
    summary: Optional[str] = None
    practiceAreas: List[InterviewPracticeArea] = []
    createdAt: str

class InterviewEvaluationSummary(BaseModel):
    resultId: str
    sessionId: str
    status: str
    overallScore: Optional[int] = None
    performanceLevel: Optional[str] = None

class InterviewHistoryItem(BaseModel):
    resultId: str
    sessionId: str
    mode: str
    topic: Optional[str] = None
    status: str
    overallScore: Optional[int] = None
    performanceLevel: Optional[str] = None
    createdAt: str

# Expected JSON output from Gemini
class GeminiInterviewEvaluation(BaseModel):
    overallScore: int
    communicationScore: Optional[int] = None
    technicalScore: Optional[int] = None
    relevanceScore: Optional[int] = None
    clarityScore: Optional[int] = None
    structureScore: Optional[int] = None
    strengths: List[str]
    improvementAreas: List[str]
    questionEvaluations: List[InterviewQuestionEvaluation]
    summary: str
    practiceAreas: List[InterviewPracticeArea]
