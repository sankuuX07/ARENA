from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class InterviewConfig(BaseModel):
    mode: str  # technical, hr, behavioral
    difficulty: str  # easy, medium, hard
    durationMinutes: int
    maxQuestions: int
    responseMode: str  # text, voice
    topic: Optional[str] = None

class InterviewMessage(BaseModel):
    messageId: str
    sessionId: str
    role: str  # interviewer, student, system
    content: str
    timestamp: str
    questionType: Optional[str] = None

class InterviewSession(BaseModel):
    sessionId: str
    userId: str
    mode: str
    difficulty: str
    responseMode: str
    topic: Optional[str] = None
    status: str  # not_started, in_progress, completed, expired, abandoned
    startedAt: Optional[str] = None
    expiresAt: Optional[str] = None
    questionCount: int = 0
    maxQuestions: int
    messages: List[InterviewMessage] = []

class InterviewResponseRequest(BaseModel):
    responseMode: str
    content: str

class InterviewResponse(BaseModel):
    studentMessage: InterviewMessage
    interviewerMessage: InterviewMessage
    nextQuestionType: str
    currentDifficulty: str
    sessionStatus: str

class InterviewStatusResponse(BaseModel):
    status: str
    startedAt: Optional[str] = None
    expiresAt: Optional[str] = None
    serverTime: str
