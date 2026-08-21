from pydantic import BaseModel
from typing import List, Optional

class VerbalQuestion(BaseModel):
    question_id: str
    question: str
    options: List[str]
    correctOption: int
    explanation: str

class VerbalStartRequest(BaseModel):
    uid: str
    category: str = "verbal"
    topic: str
    difficulty: str
    num_questions: int = 10

class VerbalStartResponse(BaseModel):
    session_id: str
    category: str = "verbal"
    topic: str
    difficulty: str
    questions: List[VerbalQuestion]

class VerbalSessionCompleteRequest(BaseModel):
    uid: str
    session_id: str
    category: str = "verbal"
    topic: str
    difficulty: str
    questions: List[VerbalQuestion]
    answers: dict[str, int] # question_id -> selected_option

class VerbalSessionSummary(BaseModel):
    session_id: str
    category: str = "verbal"
    topic: str
    difficulty: str
    total_questions: int
    correct: int
    incorrect: int
    unanswered: int
    score: int
    accuracy: int
    time_taken: int
    completed_at: str
