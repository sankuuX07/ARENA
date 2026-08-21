from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict

from app.schemas.placement import (
    PlacementSimulation, PlacementSimulationSession, PlacementSimulationSummary,
    PlacementRoundCompleteRequest, PlacementStartRoundResponse
)
from app.services.placement_simulation_service import placement_simulation_service
from app.core.firebase_auth import verify_firebase_token
from app.core.rate_limiter import rate_limit_standard

router = APIRouter()

@router.get("/simulations", response_model=List[PlacementSimulation])
async def get_simulations():
    return placement_simulation_service.get_simulations()

@router.get("/simulations/{simulation_id}", response_model=PlacementSimulation)
async def get_simulation(simulation_id: str):
    sim = placement_simulation_service.get_simulation(simulation_id)
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return sim

@router.post("/sessions", response_model=PlacementSimulationSession, dependencies=[Depends(rate_limit_standard)])
async def start_session(payload: dict, uid: str = Depends(verify_firebase_token)):
    simulation_id = payload.get("simulationId")
    if not simulation_id:
        raise HTTPException(status_code=400, detail="simulationId is required")
    try:
        return placement_simulation_service.start_session(uid, simulation_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/active", response_model=PlacementSimulationSession)
async def get_active_session(uid: str = Depends(verify_firebase_token)):
    session = placement_simulation_service.get_active_session(uid)
    if not session:
        raise HTTPException(status_code=404, detail="No active session found")
    return session

@router.get("/sessions/{session_id}", response_model=PlacementSimulationSession)
async def get_session(session_id: str, uid: str = Depends(verify_firebase_token)):
    session = placement_simulation_service.get_session(uid, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/sessions/{session_id}/rounds/{round_id}/start", response_model=PlacementStartRoundResponse)
async def start_round(session_id: str, round_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        session = placement_simulation_service.get_session(uid, session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
            
        module_session_id = await placement_simulation_service.start_round(uid, session_id, round_id)
        round_session = next((r for r in session.rounds if r.roundId == round_id), None)
        return PlacementStartRoundResponse(
            roundSessionId=round_session.roundSessionId if round_session else "",
            moduleSessionId=module_session_id,
            redirectUrl=None
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/rounds/{round_id}/complete", response_model=PlacementSimulationSession)
async def complete_round(session_id: str, round_id: str, req: PlacementRoundCompleteRequest, uid: str = Depends(verify_firebase_token)):
    try:
        return placement_simulation_service.complete_round(uid, session_id, round_id, req)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sessions/{session_id}/abandon", response_model=PlacementSimulationSession)
async def abandon_session(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return placement_simulation_service.abandon_session(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}/summary", response_model=PlacementSimulationSummary)
async def get_summary(session_id: str, uid: str = Depends(verify_firebase_token)):
    try:
        return placement_simulation_service.get_summary(uid, session_id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[PlacementSimulationSession])
async def get_history(uid: str = Depends(verify_firebase_token)):
    return placement_simulation_service.get_history(uid)
