from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    session_id: Optional[str] = Field(None, description="Communication session ID")
    message: str = Field(..., min_length=1, max_length=2000, description="Student chat message content")
    mode: str = Field("general", description="Communication practice mode")
    history: Optional[List[Dict[str, str]]] = Field(
        default=[], description="Recent conversation history messages [{role: 'user'|'model', content: ''}]"
    )


class EvaluationFoundation(BaseModel):
    fluency: Optional[float] = None
    grammar: Optional[float] = None
    vocabulary: Optional[float] = None
    relevance: Optional[float] = None
    confidence: Optional[float] = None
    overallScore: Optional[float] = None


class ChatMessageResponse(BaseModel):
    session_id: str
    message: str
    timestamp: str
    status: str = "success"
    mode: str = "general"
    evaluation: Optional[EvaluationFoundation] = None
