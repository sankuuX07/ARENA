from pydantic import BaseModel, Field
from typing import List, Optional, Any
from enum import Enum

class TechnicalLanguage(str, Enum):
    c = "c"
    cpp = "cpp"
    java = "java"
    python = "python"
    cs_core = "cs_core"

class TechnicalQuestionType(str, Enum):
    mcq = "mcq"
    output = "output"
    debugging = "debugging"
    code_completion = "code_completion"
    coding = "coding"
    interview = "interview"

class TechnicalDifficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class TechnicalTopic(BaseModel):
    topicId: str
    name: str
    language: TechnicalLanguage
    description: str
    questionCount: int = 0

class CSTopic(BaseModel):
    topicId: str
    name: str
    subjectId: str
    description: str
    questionCount: int = 0

class CSSubject(BaseModel):
    subjectId: str
    name: str
    description: str
    icon: str
    order: int
    status: str = "active"
    topics: Optional[List[CSTopic]] = []

class TechnicalModule(BaseModel):
    moduleId: str
    language: TechnicalLanguage
    title: str
    description: str
    status: str = "active"
    order: int
    topics: List[TechnicalTopic] = []

class TechnicalQuestion(BaseModel):
    questionId: str
    language: TechnicalLanguage
    topic: str
    difficulty: TechnicalDifficulty
    questionType: TechnicalQuestionType
    question: str
    codeSnippet: Optional[str] = None
    options: Optional[List[str]] = None
    correctOption: Optional[int] = None
    explanation: str

class TechnicalSession(BaseModel):
    sessionId: str
    uid: str
    language: TechnicalLanguage
    topic: str
    difficulty: TechnicalDifficulty
    questionCount: int
    currentQuestionIndex: int = 0
    score: int = 0
    status: str = "active" # active, completed, abandoned
    startedAt: str
    completedAt: Optional[str] = None
    questions: List[TechnicalQuestion] = []

class TechnicalAnswerRequest(BaseModel):
    questionId: str
    selectedOption: Optional[int] = None
    answerText: Optional[str] = None

class TechnicalResult(BaseModel):
    sessionId: str
    score: int
    totalQuestions: int
    accuracy: int
    completedAt: str

class TechnicalProgress(BaseModel):
    uid: str
    questionsAttempted: int = 0
    questionsCorrect: int = 0
    accuracy: int = 0
    topicsCompleted: int = 0
    problemsSolved: int = 0
