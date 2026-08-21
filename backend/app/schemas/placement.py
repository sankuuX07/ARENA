from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class PlacementRound(BaseModel):
    roundId: str
    name: str
    type: str # aptitude, technical, coding, communication, interview
    order: int
    durationMinutes: int
    passingScore: Optional[int] = None
    required: bool = True
    configuration: Dict[str, Any] = {}

class PlacementSimulation(BaseModel):
    simulationId: str
    title: str
    description: str
    estimatedDurationMinutes: int
    totalRounds: int
    rounds: List[PlacementRound]
    isActive: bool = True

class PlacementRoundSession(BaseModel):
    roundSessionId: str
    placementSessionId: str
    roundId: str
    order: int
    status: str # locked, not_started, in_progress, completed, passed, failed, skipped
    moduleSessionId: Optional[str] = None
    startedAt: Optional[str] = None
    completedAt: Optional[str] = None
    resultReference: Optional[str] = None
    passed: Optional[bool] = None
    score: Optional[int] = None

class PlacementSimulationSession(BaseModel):
    sessionId: str
    simulationId: str
    userId: str
    status: str # not_started, in_progress, completed, failed, abandoned, expired
    currentRoundOrder: int
    startedAt: Optional[str] = None
    updatedAt: Optional[str] = None
    completedAt: Optional[str] = None
    failedRoundId: Optional[str] = None
    rounds: List[PlacementRoundSession] = []

class PlacementSimulationHistoryItem(BaseModel):
    sessionId: str
    simulationId: str
    simulationName: str
    startedAt: str
    completedAt: Optional[str] = None
    status: str
    totalRounds: int
    completedRounds: int

class PlacementSimulationSummary(BaseModel):
    sessionId: str
    simulationId: str
    simulationName: str
    status: str
    startedAt: str
    completedAt: str
    rounds: List[PlacementRoundSession]

class PlacementRoundCompleteRequest(BaseModel):
    resultReference: str

class PlacementStartRoundResponse(BaseModel):
    roundSessionId: str
    moduleSessionId: str
    redirectUrl: Optional[str] = None
