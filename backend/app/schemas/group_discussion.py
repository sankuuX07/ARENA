from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class GroupDiscussionStartRequest(BaseModel):
    uid: str
    difficulty: str
    category: str

class GroupDiscussionStartResponse(BaseModel):
    session_id: str
    topic: str
    category: str
    difficulty: str
    moderator_intro: str

class GroupDiscussionResponseRequest(BaseModel):
    uid: str
    session_id: str
    student_message: str
    current_round: int
    messages: List[Dict[str, Any]]

class AIResponseData(BaseModel):
    speaker: str
    content: str

class GroupDiscussionResponseResponse(BaseModel):
    session_id: str
    round: int
    ai_responses: List[AIResponseData]
    is_complete: bool

class GroupDiscussionEvaluation(BaseModel):
    communication: int
    clarity: int
    grammar: int
    vocabulary: int
    relevance: int
    confidence: int
    participation: int
    leadership: int
    teamwork: int
    respectfulness: int
    argumentQuality: int
    responsiveness: int
    adaptability: int
    timeManagement: int
    overallScore: int
    strengths: List[str]
    improvements: List[str]
    improved_responses: Optional[List[Dict[str, str]]] = Field(default_factory=list)

class GroupDiscussionSessionSummary(BaseModel):
    session_id: str
    category: str
    difficulty: str
    topic: str
    evaluation: GroupDiscussionEvaluation
    completed_at: str
