from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.schemas.puzzle import (
    PuzzleProblem,
    PuzzleSubmissionRequest,
    PuzzleSubmissionResponse,
    PuzzleProgress,
    ProblemGenerationRequest
)
from app.schemas.evaluation import CodingSubmissionRequest, CodingSubmissionResponse
from app.services.puzzle_service import puzzle_service
from app.services.problem_generator_service import problem_generator_service
from app.services.coding_evaluation_service import coding_evaluation_service
from app.core.firebase_auth import verify_firebase_token

router = APIRouter()

@router.get("/problems", response_model=List[PuzzleProblem])
async def get_problems():
    return puzzle_service.get_all_problems()

@router.get("/problems/{problem_id}", response_model=PuzzleProblem)
async def get_problem(problem_id: str):
    problem = puzzle_service.get_problem(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@router.post("/submissions", response_model=PuzzleSubmissionResponse)
async def submit_solution(request: PuzzleSubmissionRequest):
    try:
        return puzzle_service.submit_solution(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/progress/{uid}", response_model=PuzzleProgress)
async def get_puzzle_progress(uid: str):
    try:
        return puzzle_service.get_progress(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate", response_model=PuzzleProblem)
async def generate_problem(request: ProblemGenerationRequest):
    try:
        return await problem_generator_service.generate_problem(request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to generate problem at this time.")

@router.post("/submissions", response_model=CodingSubmissionResponse)
async def submit_solution(
    request: CodingSubmissionRequest,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return coding_evaluation_service.evaluate_submission(uid, request)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/submissions/history", response_model=List[CodingSubmissionResponse])
async def get_submission_history(uid: str = Depends(verify_firebase_token)):
    try:
        return coding_evaluation_service.get_submission_history(uid)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/problems/{problem_id}/submissions", response_model=List[CodingSubmissionResponse])
async def get_problem_submissions(
    problem_id: str,
    uid: str = Depends(verify_firebase_token)
):
    try:
        return coding_evaluation_service.get_problem_submissions(uid, problem_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
