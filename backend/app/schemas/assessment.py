from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class AssessmentCategory(str, Enum):
    aptitude = "aptitude"
    technical = "technical"
    coding = "coding"
    communication = "communication"
    mixed = "mixed"
    placement = "placement"

class AssessmentDifficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class AssessmentStatus(str, Enum):
    draft = "draft"
    published = "published"
    archived = "archived"

class AssessmentSessionStatus(str, Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    submitted = "submitted"
    expired = "expired"
    abandoned = "abandoned"

class AssessmentQuestionSource(str, Enum):
    static = "static"
    ai_generated = "ai_generated"
    module = "module"
    mixed = "mixed"

class AssessmentQuestionType(str, Enum):
    mcq = "mcq"
    coding = "coding"
    communication = "communication"

class AssessmentSection(BaseModel):
    sectionId: str
    title: str
    type: AssessmentCategory
    source: str
    questionCount: int
    marks: float
    negativeMarks: float
    order: int
    required: bool

class AssessmentConfig(BaseModel):
    durationMinutes: int
    questionCount: int
    passingScore: int
    negativeMarking: bool
    allowBackNavigation: bool
    shuffleQuestions: bool
    shuffleOptions: bool
    sections: Optional[List[AssessmentSection]] = []

class Assessment(BaseModel):
    assessmentId: str
    title: str
    description: str
    category: AssessmentCategory
    difficulty: AssessmentDifficulty
    durationMinutes: int
    questionCount: int
    status: AssessmentStatus
    createdAt: str
    updatedAt: str
    config: AssessmentConfig

class AssessmentQuestionReference(BaseModel):
    assessmentQuestionId: str
    assessmentId: str
    sectionId: Optional[str] = None
    questionId: str
    type: AssessmentQuestionType = AssessmentQuestionType.mcq
    source: AssessmentQuestionSource
    order: int
    marks: float
    negativeMarks: float
    # These fields are hydrated during a session so the frontend can render them
    questionText: Optional[str] = None
    options: Optional[List[str]] = None
    codeSnippet: Optional[str] = None
    # For coding and communication specific payloads
    metadata: Optional[dict] = {}

class AssessmentAnswerState(str, Enum):
    unanswered = "unanswered"
    answered = "answered"
    marked_for_review = "marked_for_review"

class AssessmentAnswer(BaseModel):
    sessionId: str
    questionId: str
    selectedOption: Optional[int] = None
    textResponse: Optional[str] = None
    state: AssessmentAnswerState
    answeredAt: Optional[str] = None

class QuestionResult(BaseModel):
    questionId: str
    sectionId: Optional[str] = None
    isCorrect: bool
    marksAwarded: float
    studentAnswer: Optional[str] = None
    correctAnswer: Optional[str] = None
    explanation: Optional[str] = None

class TopicResult(BaseModel):
    topic: str
    score: float
    maxScore: float
    percentage: float

class SectionResult(BaseModel):
    sectionId: str
    title: str
    score: float
    maxScore: float
    percentage: float
    correct: int
    incorrect: int
    unanswered: int
    accuracy: float

class AssessmentResult(BaseModel):
    resultId: str
    sessionId: str
    assessmentId: str
    userId: str
    status: str # "completed", "evaluated"
    score: float
    maxScore: float
    percentage: float
    accuracy: float
    correct: int
    incorrect: int
    unanswered: int
    timeUsedSeconds: int
    totalTimeSeconds: int
    passed: bool
    completedAt: str
    
    sections: List[SectionResult] = []
    topics: List[TopicResult] = []
    strengths: List[str] = []
    improvementAreas: List[str] = []
    performanceClassification: str # "Excellent", "Strong", "Good", "Needs Improvement"
    
    questionResults: Optional[List[QuestionResult]] = None # Populated during /review

class AssessmentHistoryItem(BaseModel):
    resultId: str
    assessmentId: str
    title: str
    category: str
    score: float
    percentage: float
    passed: bool
    completedAt: str

class AssessmentSession(BaseModel):
    sessionId: str
    assessmentId: str
    userId: str
    status: AssessmentSessionStatus
    currentQuestionIndex: int = 0
    startedAt: Optional[str] = None
    submittedAt: Optional[str] = None
    expiresAt: Optional[str] = None
    answers: List[AssessmentAnswer] = []
    questions: List[AssessmentQuestionReference] = []

class AssessmentSubmitRequest(BaseModel):
    pass # Empty, backend derives everything

class AssessmentStatusResponse(BaseModel):
    status: AssessmentSessionStatus
    startedAt: Optional[str] = None
    expiresAt: Optional[str] = None
    serverTime: str

class AssessmentResult(BaseModel):
    sessionId: str
    score: float
    maxScore: float
    accuracy: int
    correct: int
    incorrect: int
    unanswered: int
    passed: bool
