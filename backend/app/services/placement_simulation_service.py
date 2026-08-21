import uuid
from datetime import datetime
from typing import List, Optional, Dict

from app.schemas.placement import (
    PlacementSimulation, PlacementRound, PlacementSimulationSession,
    PlacementRoundSession, PlacementSimulationSummary, PlacementRoundCompleteRequest
)
from app.services.interview_service import interview_service, InterviewConfig
from app.services.interview_evaluation_service import interview_evaluation_service
from app.services.aptitude_service import aptitude_service
from app.services.technical_service import technical_service
# Add other services as needed

# Hardcoded initial simulations
DEFAULT_SIMULATIONS = [
    PlacementSimulation(
        simulationId="sim_software_dev",
        title="Software Developer Simulation",
        description="A complete placement process for Software Engineering roles.",
        estimatedDurationMinutes=90,
        totalRounds=5,
        rounds=[
            PlacementRound(
                roundId="r1_aptitude",
                name="Aptitude Round",
                type="aptitude",
                order=1,
                durationMinutes=20,
                passingScore=60,
                required=True,
                configuration={"categories": ["quantitative", "verbal", "logical"], "questionCount": 20}
            ),
            PlacementRound(
                roundId="r2_technical",
                name="Technical Assessment",
                type="technical",
                order=2,
                durationMinutes=30,
                passingScore=60,
                required=True,
                configuration={"topics": ["python", "java", "dbms", "os"], "questionCount": 20}
            ),
            PlacementRound(
                roundId="r3_coding",
                name="Coding Challenge",
                type="coding",
                order=3,
                durationMinutes=45,
                passingScore=50,
                required=True,
                configuration={"difficulty": "medium", "problemCount": 2}
            ),
            PlacementRound(
                roundId="r4_communication",
                name="Communication Round",
                type="communication",
                order=4,
                durationMinutes=15,
                passingScore=60,
                required=True,
                configuration={"mode": "situational"}
            ),
            PlacementRound(
                roundId="r5_interview",
                name="AI Interview",
                type="interview",
                order=5,
                durationMinutes=20,
                passingScore=0, # Any completion
                required=True,
                configuration={"mode": "technical", "difficulty": "medium", "maxQuestions": 8}
            )
        ]
    ),
    PlacementSimulation(
        simulationId="sim_quick",
        title="Quick Placement Practice",
        description="A shorter version for quick practice.",
        estimatedDurationMinutes=40,
        totalRounds=3,
        rounds=[
            PlacementRound(
                roundId="r1_aptitude",
                name="Aptitude Round",
                type="aptitude",
                order=1,
                durationMinutes=15,
                passingScore=50,
                required=True,
                configuration={}
            ),
            PlacementRound(
                roundId="r2_technical",
                name="Technical Assessment",
                type="technical",
                order=2,
                durationMinutes=15,
                passingScore=50,
                required=True,
                configuration={}
            ),
            PlacementRound(
                roundId="r3_hr",
                name="HR Interview",
                type="interview",
                order=3,
                durationMinutes=10,
                passingScore=0,
                required=True,
                configuration={"mode": "hr", "difficulty": "easy", "maxQuestions": 5}
            )
        ]
    )
]

class PlacementSimulationService:
    def __init__(self):
        self._simulations: Dict[str, PlacementSimulation] = {sim.simulationId: sim for sim in DEFAULT_SIMULATIONS}
        self._sessions: Dict[str, PlacementSimulationSession] = {}
        self._processing_locks: Dict[str, bool] = {}

    def get_simulations(self) -> List[PlacementSimulation]:
        return [sim for sim in self._simulations.values() if sim.isActive]

    def get_simulation(self, simulation_id: str) -> Optional[PlacementSimulation]:
        return self._simulations.get(simulation_id)

    def start_session(self, user_id: str, simulation_id: str) -> PlacementSimulationSession:
        # Enforce one active session rule
        for sess in self._sessions.values():
            if sess.userId == user_id and sess.status in ["not_started", "in_progress"]:
                raise ValueError("You already have an active placement simulation.")

        sim = self.get_simulation(simulation_id)
        if not sim:
            raise ValueError("Simulation not found")

        session_id = f"pses_{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow().isoformat() + "Z"
        
        rounds = []
        for r in sim.rounds:
            rounds.append(PlacementRoundSession(
                roundSessionId=f"rses_{uuid.uuid4().hex[:8]}",
                placementSessionId=session_id,
                roundId=r.roundId,
                order=r.order,
                status="not_started" if r.order == 1 else "locked",
            ))

        session = PlacementSimulationSession(
            sessionId=session_id,
            simulationId=simulation_id,
            userId=user_id,
            status="in_progress",
            currentRoundOrder=1,
            startedAt=now,
            updatedAt=now,
            rounds=rounds
        )
        self._sessions[session_id] = session
        return session

    def get_session(self, user_id: str, session_id: str) -> Optional[PlacementSimulationSession]:
        session = self._sessions.get(session_id)
        if session and session.userId == user_id:
            return session
        return None

    def get_active_session(self, user_id: str) -> Optional[PlacementSimulationSession]:
        for sess in self._sessions.values():
            if sess.userId == user_id and sess.status in ["not_started", "in_progress"]:
                return sess
        return None
        
    def get_history(self, user_id: str) -> List[PlacementSimulationSession]:
        return [sess for sess in self._sessions.values() if sess.userId == user_id and sess.status in ["completed", "failed", "abandoned", "expired"]]

    async def start_round(self, user_id: str, session_id: str, round_id: str) -> str:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        if session.status not in ["in_progress", "not_started"]:
            raise ValueError(f"Cannot start round, session is {session.status}")

        round_session = next((r for r in session.rounds if r.roundId == round_id), None)
        if not round_session:
            raise ValueError("Round not found in session")
        if round_session.status == "locked":
            raise ValueError("Round is locked")
        if round_session.status in ["completed", "passed", "failed"]:
            raise ValueError("Round is already completed")

        # Start integration with existing module
        # Note: M31 delegates full creation to frontend logic for other modules if they need complex setup,
        # but for Interview we can use the backend service directly as an example.
        module_session_id = round_session.moduleSessionId
        
        sim = self.get_simulation(session.simulationId)
        round_def = next(r for r in sim.rounds if r.roundId == round_id)
        
        if not module_session_id:
            if round_def.type == "interview":
                config = InterviewConfig(
                    mode=round_def.configuration.get("mode", "technical"),
                    difficulty=round_def.configuration.get("difficulty", "medium"),
                    durationMinutes=round_def.durationMinutes,
                    maxQuestions=round_def.configuration.get("maxQuestions", 5),
                    responseMode="text",
                    topic=None
                )
                int_session = await interview_service.start_session(user_id, config)
                module_session_id = int_session.sessionId
            else:
                # For others, we might rely on the frontend to call the respective endpoints
                # and just generate a placeholder ID or use a UUID for tracking here
                module_session_id = f"mod_{uuid.uuid4().hex[:8]}"

            round_session.moduleSessionId = module_session_id
            round_session.status = "in_progress"
            round_session.startedAt = datetime.utcnow().isoformat() + "Z"
            session.updatedAt = datetime.utcnow().isoformat() + "Z"

        return module_session_id

    def complete_round(self, user_id: str, session_id: str, round_id: str, req: PlacementRoundCompleteRequest) -> PlacementSimulationSession:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        
        if self._processing_locks.get(session_id, False):
            raise ValueError("Concurrent request detected. Please wait.")
            
        self._processing_locks[session_id] = True
        try:
            round_session = next((r for r in session.rounds if r.roundId == round_id), None)
            if not round_session:
                raise ValueError("Round not found")
            
            if round_session.status in ["completed", "passed", "failed"]:
                return session # Idempotent, already processed

            sim = self.get_simulation(session.simulationId)
            round_def = next((r for r in sim.rounds if r.roundId == round_id))

            # Fetch authoritative score for the round if available
            fetched_score = 80 # Default mock score for other types
            
            if round_def.type == "interview" and req.resultReference:
                evaluation = interview_evaluation_service.get_evaluation(user_id, req.resultReference)
                if evaluation and evaluation.overallScore is not None:
                    fetched_score = evaluation.overallScore
                else:
                    # Fallback if evaluation is missing or score is None (e.g. insufficient data)
                    fetched_score = 0
            
            passed = True
            if round_def.passingScore is not None and fetched_score < round_def.passingScore:
                passed = False

            now = datetime.utcnow().isoformat() + "Z"
            round_session.status = "passed" if passed else "failed"
            round_session.passed = passed
            round_session.score = fetched_score
            round_session.resultReference = req.resultReference
            round_session.completedAt = now
            session.updatedAt = now

            if not passed and round_def.required:
                session.status = "failed"
                session.failedRoundId = round_id
                session.completedAt = now
                # Lock remaining
                for r in session.rounds:
                    if r.order > round_session.order and r.status == "not_started":
                         r.status = "locked"
            else:
                next_order = round_session.order + 1
                next_round = next((r for r in session.rounds if r.order == next_order), None)
                
                if next_round:
                    next_round.status = "not_started"
                    session.currentRoundOrder = next_order
                else:
                    session.status = "completed"
                    session.completedAt = now

            return session
        finally:
            self._processing_locks[session_id] = False

    def abandon_session(self, user_id: str, session_id: str) -> PlacementSimulationSession:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        if session.status in ["not_started", "in_progress"]:
            session.status = "abandoned"
            session.updatedAt = datetime.utcnow().isoformat() + "Z"
            for r in session.rounds:
                if r.status in ["not_started", "locked", "in_progress"]:
                    r.status = "locked"
        return session

    def get_summary(self, user_id: str, session_id: str) -> PlacementSimulationSummary:
        session = self.get_session(user_id, session_id)
        if not session:
            raise ValueError("Session not found")
        sim = self.get_simulation(session.simulationId)
        
        return PlacementSimulationSummary(
            sessionId=session.sessionId,
            simulationId=session.simulationId,
            simulationName=sim.title if sim else "Simulation",
            status=session.status,
            startedAt=session.startedAt,
            completedAt=session.completedAt or datetime.utcnow().isoformat() + "Z",
            rounds=session.rounds
        )

placement_simulation_service = PlacementSimulationService()
