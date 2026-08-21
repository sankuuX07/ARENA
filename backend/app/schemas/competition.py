from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class CompetitionType(str, Enum):
    coding = "coding"
    aptitude = "aptitude"
    technical = "technical"
    mixed = "mixed"

class CompetitionStatus(str, Enum):
    draft = "draft"
    upcoming = "upcoming"
    live = "live"
    completed = "completed"
    cancelled = "cancelled"

class CompetitionDifficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class ParticipantStatus(str, Enum):
    registered = "registered"
    in_progress = "in_progress"
    submitted = "submitted"
    completed = "completed"
    disqualified = "disqualified"

class LeaderboardVisibility(str, Enum):
    live = "live"
    after_submission = "after_submission"
    after_competition = "after_competition"

class ResultVisibility(str, Enum):
    immediate = "immediate"
    after_competition = "after_competition"
    after_results_release = "after_results_release"

class CompetitionRules(BaseModel):
    scoringMethod: str = "standard"
    allowRetries: bool = False
    leaderboardVisibility: LeaderboardVisibility = LeaderboardVisibility.live
    resultVisibility: ResultVisibility = ResultVisibility.after_competition

class CompetitionChallenge(BaseModel):
    challengeId: str
    competitionId: str
    sourceType: str # "coding_problem", "aptitude_question", "technical_question"
    sourceId: str
    title: str
    difficulty: CompetitionDifficulty
    order: int
    points: float
    timeLimit: Optional[int] = None # in minutes

class Competition(BaseModel):
    competitionId: str
    title: str
    description: str
    type: CompetitionType
    difficulty: CompetitionDifficulty
    status: CompetitionStatus
    startTime: str
    endTime: str
    durationMinutes: int
    maxParticipants: int
    participantCount: int
    rules: CompetitionRules
    challenges: List[CompetitionChallenge]
    createdAt: str
    updatedAt: str

class CompetitionParticipant(BaseModel):
    participantId: str
    competitionId: str
    userId: str
    status: ParticipantStatus
    joinedAt: str
    startedAt: Optional[str] = None
    submittedAt: Optional[str] = None
    completedAt: Optional[str] = None
    score: Optional[float] = None
    rank: Optional[int] = None

class CompetitionSession(BaseModel):
    sessionId: str
    competitionId: str
    userId: str
    startedAt: str
    lastActivityAt: str
    expiresAt: str
    status: str # "active", "expired", "submitted"
    answers: Dict[str, Any] = {} # temporary storage for autosave

class CompetitionResult(BaseModel):
    competitionId: str
    userId: str
    score: float
    rank: Optional[int] = None
    challengesCompleted: int
    timeUsedSeconds: int
    performanceSummary: str

class CompetitionLeaderboardEntry(BaseModel):
    userId: str
    displayName: str
    score: float
    challengesCompleted: int
    timeUsedSeconds: int
    status: ParticipantStatus
    rank: Optional[int] = None

class CompetitionLeaderboardResponse(BaseModel):
    competitionId: str
    entries: List[CompetitionLeaderboardEntry]
    lastUpdated: str

class CompetitionHistoryItem(BaseModel):
    competitionId: str
    title: str
    type: CompetitionType
    score: float
    rank: Optional[int] = None
    status: ParticipantStatus
    dateCompleted: str
