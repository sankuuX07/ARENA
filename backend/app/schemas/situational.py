from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class SituationalStartRequest(BaseModel):
    category: str = Field(..., description="Category of situational communication (e.g., conflict)")
    difficulty: str = Field("medium", description="Practice difficulty: easy, medium, hard")


class SituationalStartResponse(BaseModel):
    session_id: str
    category: str
    difficulty: str
    scenario: str
    timestamp: str


class SituationalEvaluation(BaseModel):
    relevance: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    professionalism: int = Field(..., ge=0, le=100)
    tone: int = Field(..., ge=0, le=100)
    appropriateness: int = Field(..., ge=0, le=100)
    empathy: int = Field(..., ge=0, le=100)
    decisionMaking: int = Field(..., ge=0, le=100)
    problemHandling: int = Field(..., ge=0, le=100)
    confidence: int = Field(..., ge=0, le=100)
    communicationQuality: int = Field(..., ge=0, le=100)
    overallScore: int = Field(..., ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    originalText: str = ""
    betterResponse: Optional[str] = None
    followUp: Optional[str] = None


class SituationalRespondRequest(BaseModel):
    session_id: str
    response_text: str = Field(..., min_length=1, max_length=3000)
    turn_index: int = Field(1, ge=1, le=10)
    category: str
    difficulty: str = Field("medium")
    history: Optional[List[Dict[str, str]]] = Field(default=[])


class SituationalRespondResponse(BaseModel):
    session_id: str
    turn_index: int
    evaluation: SituationalEvaluation
    next_prompt: str
    is_completed: bool = False
    timestamp: str


class SituationalCompleteRequest(BaseModel):
    session_id: str
    category: str
    difficulty: str
    evaluations: List[SituationalEvaluation] = Field(default_factory=list)


class SituationalCompleteResponse(BaseModel):
    session_id: str
    overall_score: int = Field(..., ge=0, le=100)
    category_breakdown: Dict[str, int]
    strengths: List[str]
    improvements: List[str]
    summary: str
    timestamp: str


class SituationalSessionSummary(BaseModel):
    session_id: str
    overall_score: int
    category_breakdown: Dict[str, int]
    timestamp: str
