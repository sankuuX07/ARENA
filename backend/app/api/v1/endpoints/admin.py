from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.core.authorization import verify_admin
from app.schemas.admin import (
    AdminDashboardResponse, AdminStudentListItem, AdminStudentDetail, AdminStudentStatusUpdate,
    AdminCompetitionCreate, AdminCompetitionUpdate, AdminCompetitionStatusUpdate,
    AdminCodingProblemCreate, AdminContentCreate, AdminActivityResponse
)
from app.schemas.competition import Competition
from app.services.admin_dashboard_service import admin_dashboard_service
from app.services.admin_student_service import admin_student_service
from app.services.admin_competition_service import admin_competition_service

router = APIRouter(dependencies=[Depends(verify_admin)])

# --- DASHBOARD ---
@router.get("/dashboard", response_model=AdminDashboardResponse)
async def get_dashboard():
    return admin_dashboard_service.get_dashboard_stats()

# --- STUDENTS ---
@router.get("/students", response_model=List[AdminStudentListItem])
async def list_students():
    return admin_student_service.get_students()

@router.get("/students/{student_id}", response_model=AdminStudentDetail)
async def get_student(student_id: str):
    try:
        return admin_student_service.get_student(student_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/students/{student_id}/status", response_model=AdminStudentDetail)
async def update_student_status(student_id: str, update: AdminStudentStatusUpdate):
    try:
        return admin_student_service.update_student_status(student_id, update)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# --- COMPETITIONS ---
@router.get("/competitions", response_model=List[Competition])
async def list_competitions():
    from app.services.competition_service import competition_service
    return competition_service.get_competitions()

@router.post("/competitions", response_model=Competition)
async def create_competition(data: AdminCompetitionCreate):
    return admin_competition_service.create_competition(data)

@router.patch("/competitions/{competition_id}", response_model=Competition)
async def update_competition(competition_id: str, data: AdminCompetitionUpdate):
    try:
        return admin_competition_service.update_competition(competition_id, data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.patch("/competitions/{competition_id}/status", response_model=Competition)
async def update_competition_status(competition_id: str, data: AdminCompetitionStatusUpdate):
    try:
        return admin_competition_service.update_status(competition_id, data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# --- CONTENT (Mock endpoints for M40 requirement) ---
@router.get("/activity", response_model=AdminActivityResponse)
async def get_activity():
    # Return empty safely
    return AdminActivityResponse(items=[], total=0)
