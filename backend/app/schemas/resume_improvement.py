from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class ResumeImprovementSessionStatus(str, Enum):
    draft = "draft"
    active = "active"
    completed = "completed"
    archived = "archived"

class ResumeImprovementPriority(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class ResumeImprovementSuggestionStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class ResumeImprovementSuggestion(BaseModel):
    suggestionId: str
    sessionId: str
    section: str
    originalText: str
    suggestedText: str
    reason: str
    priority: ResumeImprovementPriority
    status: ResumeImprovementSuggestionStatus
    createdAt: str
    updatedAt: str

class ResumeImprovementDraft(BaseModel):
    draftId: str
    sessionId: str
    resumeId: str
    sections: Dict[str, List[str]] = Field(default_factory=dict)
    createdAt: str
    updatedAt: str

class ResumeImprovementSession(BaseModel):
    sessionId: str
    userId: str
    resumeId: str
    screeningResultId: Optional[str] = None
    status: ResumeImprovementSessionStatus
    createdAt: str
    updatedAt: str
    completedAt: Optional[str] = None
    suggestionsCount: int = 0
    acceptedCount: int = 0
    rejectedCount: int = 0

class GenerateSuggestionRequest(BaseModel):
    section: str
    context: Optional[str] = None

class AcceptSuggestionRequest(BaseModel):
    pass # Empty body for PATCH

class RejectSuggestionRequest(BaseModel):
    pass # Empty body for PATCH

class EditSuggestionRequest(BaseModel):
    editedText: str

class ResumeImprovementSummary(BaseModel):
    session: ResumeImprovementSession
    suggestions: List[ResumeImprovementSuggestion]
    draft: Optional[ResumeImprovementDraft] = None
