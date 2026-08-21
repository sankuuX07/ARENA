from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class FormalStartRequest(BaseModel):
    category: str = Field(..., description="Category of formal communication (e.g., professional_email)")
    difficulty: str = Field("medium", description="Practice difficulty: easy, medium, hard")


class FormalStartResponse(BaseModel):
    session_id: str
    category: str
    difficulty: str
    scenario: str
    timestamp: str


class FormalEvaluation(BaseModel):
    professionalism: int = Field(..., ge=0, le=100)
    clarity: int = Field(..., ge=0, le=100)
    grammar: int = Field(..., ge=0, le=100)
    vocabulary: int = Field(..., ge=0, le=100)
    structure: int = Field(..., ge=0, le=100)
    relevance: int = Field(..., ge=0, le=100)
    tone: int = Field(..., ge=0, le=100)
    conciseness: int = Field(..., ge=0, le=100)
    confidence: int = Field(..., ge=0, le=100)
    overallScore: int = Field(..., ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    originalText: str = ""
    betterVersion: Optional[str] = None
    rewriteReason: Optional[str] = None


class FormalRespondRequest(BaseModel):
    session_id: str
    response_text: str = Field(..., min_length=1, max_length=3000)
    turn_index: int = Field(1, ge=1, le=10)
    category: str
    difficulty: str = Field("medium")
    history: Optional[List[Dict[str, str]]] = Field(default=[])


class FormalRespondResponse(BaseModel):
    session_id: str
    turn_index: int
    evaluation: FormalEvaluation
    next_prompt: str
    is_completed: bool = False
    timestamp: str


class FormalCompleteRequest(BaseModel):
    session_id: str
    category: str
    difficulty: str
    evaluations: List[FormalEvaluation] = Field(default_factory=list)


class FormalCompleteResponse(BaseModel):
    session_id: str
    overall_score: int = Field(..., ge=0, le=100)
    category_breakdown: Dict[str, int]
    strengths: List[str]
    improvements: List[str]
    summary: str
    timestamp: str


class FormalSessionSummary(BaseModel):
    session_id: str
    overall_score: int
    category_breakdown: Dict[str, int]
    timestamp: str
