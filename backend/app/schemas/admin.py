from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AdminDashboardResponse(BaseModel):
    totalStudents: int = 0
    activeStudents: int = 0
    totalCompetitions: int = 0
    liveCompetitions: int = 0
    completedAssessments: int = 0
    codingSubmissions: int = 0
    recentActivity: List[Dict[str, Any]] = []

class AdminStudentListItem(BaseModel):
    uid: str
    displayName: str
    email: str
    status: str
    lastActive: Optional[datetime] = None

class AdminStudentDetail(BaseModel):
    uid: str
    displayName: str
    email: str
    status: str
    createdAt: datetime
    lastActive: Optional[datetime] = None
    learningSummary: Dict[str, Any] = {}
    competitionSummary: Dict[str, Any] = {}
    assessmentSummary: Dict[str, Any] = {}

class AdminStudentStatusUpdate(BaseModel):
    status: str = Field(..., description="E.g., active, inactive")

class AdminCompetitionCreate(BaseModel):
    title: str = Field(..., max_length=100)
    description: str = Field(..., max_length=2000)
    competitionType: str = Field(..., max_length=50)
    difficulty: str = Field(..., max_length=50)
    startTime: datetime
    endTime: datetime
    durationMinutes: int = Field(..., gt=0)
    maxParticipants: int = Field(..., gt=0)
    rules: List[str] = []
    leaderboardVisibility: str = "public"
    resultVisibility: str = "public"

class AdminCompetitionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    difficulty: Optional[str] = Field(None, max_length=50)
    durationMinutes: Optional[int] = Field(None, gt=0)
    maxParticipants: Optional[int] = Field(None, gt=0)

class AdminCompetitionStatusUpdate(BaseModel):
    status: str = Field(..., description="E.g., draft, upcoming, live, completed, cancelled")

class AdminCompetitionChallengeCreate(BaseModel):
    challengeId: str
    challengeType: str

class AdminCompetitionResultsSummary(BaseModel):
    competitionId: str
    totalParticipants: int
    completedParticipants: int
    averageScore: Optional[float] = None
    highestScore: Optional[float] = None

class AdminQuestionCreate(BaseModel):
    category: str = Field(..., max_length=50)
    questionText: str = Field(..., max_length=5000)
    options: List[str]
    correctAnswer: str
    difficulty: str = Field(..., max_length=20)

class AdminQuestionUpdate(BaseModel):
    questionText: Optional[str] = Field(None, max_length=5000)
    options: Optional[List[str]] = None
    correctAnswer: Optional[str] = None
    difficulty: Optional[str] = Field(None, max_length=20)
    isActive: Optional[bool] = None

class AdminCodingProblemCreate(BaseModel):
    title: str = Field(..., max_length=100)
    description: str = Field(..., max_length=5000)
    difficulty: str = Field(..., max_length=20)
    supportedLanguages: List[str]
    publicExamples: List[Dict[str, str]] = []
    privateTestCases: List[Dict[str, str]] = []

class AdminCodingProblemUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=5000)
    difficulty: Optional[str] = Field(None, max_length=20)
    supportedLanguages: Optional[List[str]] = None
    publicExamples: Optional[List[Dict[str, str]]] = None
    privateTestCases: Optional[List[Dict[str, str]]] = None
    isActive: Optional[bool] = None

class AdminContentCreate(BaseModel):
    subject: str = Field(..., max_length=100)
    topic: str = Field(..., max_length=100)
    title: str = Field(..., max_length=200)
    difficulty: str = Field(..., max_length=50)
    status: str = Field(..., description="draft, published, archived")

class AdminContentUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    status: Optional[str] = Field(None, description="draft, published, archived")

class AdminActivityItem(BaseModel):
    id: str
    actionType: str
    adminId: str
    timestamp: datetime
    resourceType: str
    resourceId: str

class AdminActivityResponse(BaseModel):
    items: List[AdminActivityItem]
    total: int

class AdminActionResponse(BaseModel):
    success: bool
    message: str
