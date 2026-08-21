from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class FluencyStartRequest(BaseModel):
    difficulty: str = Field("medium", description="Fluency practice difficulty: easy, medium, hard")
    topic: Optional[str] = Field(None, description="Optional pre-selected topic or prompt title")


class FluencyStartResponse(BaseModel):
    session_id: str
    topic: str
    prompt: str
    difficulty: str
    timestamp: str


class FluencyEvaluation(BaseModel):
    grammar: int = Field(..., ge=0, le=100)
    vocabulary: int = Field(..., ge=0, le=100)
    sentenceStructure: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    coherence: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    fluency: int = Field(..., ge=0, le=100)
    overallScore: int = Field(..., ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    originalText: str = ""
    betterVersion: Optional[str] = None


class FluencyRespondRequest(BaseModel):
    session_id: str
    response_text: str = Field(..., min_length=1, max_length=2000)
    turn_index: int = Field(1, ge=1, le=10)
    difficulty: str = Field("medium")
    history: Optional[List[Dict[str, str]]] = Field(default=[])


class FluencyRespondResponse(BaseModel):
    session_id: str
    turn_index: int
    evaluation: FluencyEvaluation
    next_prompt: str
    is_completed: bool = False
    timestamp: str


class FluencyCompleteRequest(BaseModel):
    session_id: str
    evaluations: List[FluencyEvaluation] = Field(default_factory=list)


class FluencyCompleteResponse(BaseModel):
    session_id: str
    overall_score: int = Field(..., ge=0, le=100)
    category_breakdown: Dict[str, int]
    strengths: List[str]
    improvements: List[str]
    summary: str
    timestamp: str
