from pydantic import BaseModel, Field
from typing import List, Optional

class AptitudeQuestion(BaseModel):
    question_id: str
    question: str
    options: List[str]
    correctOption: int
    explanation: str

class ClientAptitudeQuestion(BaseModel):
    question_id: str
    question: str
    options: List[str]

class AptitudeStartRequest(BaseModel):
    uid: str
    category: str
    topic: Optional[str] = None
    difficulty: str
    num_questions: int = 10

class AptitudeStartResponse(BaseModel):
    session_id: str
    category: str
    topic: Optional[str] = None
    difficulty: str
    questions: List[AptitudeQuestion]

class AptitudeAnswerRequest(BaseModel):
    uid: str
    session_id: str
    question_index: int
    selected_option: int

class AptitudeAnswerResponse(BaseModel):
    is_correct: bool
    correct_option: int
    explanation: str

class AptitudeSessionCompleteRequest(BaseModel):
    uid: str
    session_id: str
    category: str
    topic: Optional[str] = None
    difficulty: str
    questions: List[AptitudeQuestion]
    answers: dict[str, int] # question_id -> selected_option

class AptitudeSessionSummary(BaseModel):
    session_id: str
    category: str
    topic: Optional[str] = None
    difficulty: str
    total_questions: int
    correct: int
    incorrect: int
    unanswered: int
    score: int
    accuracy: int
    time_taken: int
    completed_at: str
