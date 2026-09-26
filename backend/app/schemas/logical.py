from pydantic import BaseModel
from typing import List, Optional

class LogicalQuestion(BaseModel):
    question_id: str
    question: str
    options: List[str]
    correctOption: int
    explanation: str

class ClientLogicalQuestion(BaseModel):
    question_id: str
    question: str
    options: List[str]

class LogicalStartRequest(BaseModel):
    uid: str
    category: str = "logical"
    topic: str
    difficulty: str
    num_questions: int = 10

class LogicalStartResponse(BaseModel):
    session_id: str
    category: str = "logical"
    topic: str
    difficulty: str
    questions: List[ClientLogicalQuestion]

class LogicalSessionCompleteRequest(BaseModel):
    uid: str
    session_id: str
    category: str = "logical"
    topic: str
    difficulty: str
    questions: List[ClientLogicalQuestion]
    answers: dict[str, int] # question_id -> selected_option

class LogicalSessionSummary(BaseModel):
    session_id: str
    category: str = "logical"
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
    questions_with_answers: Optional[List[LogicalQuestion]] = None
