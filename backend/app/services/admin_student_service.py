import uuid
from typing import List, Dict
from datetime import datetime, timedelta
from app.schemas.admin import AdminStudentListItem, AdminStudentDetail, AdminStudentStatusUpdate

class AdminStudentService:
    def __init__(self):
        # Mock users database
        now = datetime.utcnow()
        self._users = {
            "user-1": AdminStudentDetail(
                uid="user-1", displayName="Alice Smith", email="alice@example.com",
                status="active", createdAt=now - timedelta(days=30), lastActive=now - timedelta(hours=2)
            ),
            "user-2": AdminStudentDetail(
                uid="user-2", displayName="Bob Johnson", email="bob@example.com",
                status="active", createdAt=now - timedelta(days=15), lastActive=now - timedelta(days=1)
            ),
            "user-3": AdminStudentDetail(
                uid="user-3", displayName="Charlie Davis", email="charlie@example.com",
                status="inactive", createdAt=now - timedelta(days=60), lastActive=now - timedelta(days=45)
            ),
        }

    def get_students(self) -> List[AdminStudentListItem]:
        return [
            AdminStudentListItem(
                uid=u.uid, displayName=u.displayName, email=u.email,
                status=u.status, lastActive=u.lastActive
            ) for u in self._users.values()
        ]

    def get_student(self, uid: str) -> AdminStudentDetail:
        if uid not in self._users:
            raise ValueError("Student not found")
        return self._users[uid]

    def update_student_status(self, uid: str, update: AdminStudentStatusUpdate) -> AdminStudentDetail:
        if uid not in self._users:
            raise ValueError("Student not found")
        self._users[uid].status = update.status
        return self._users[uid]

admin_student_service = AdminStudentService()
