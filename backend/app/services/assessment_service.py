import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict
from app.schemas.assessment import (
    Assessment, AssessmentCategory, AssessmentDifficulty, AssessmentStatus,
    AssessmentConfig, AssessmentSession, AssessmentSessionStatus, AssessmentAnswer,
    AssessmentQuestionReference, AssessmentQuestionSource, AssessmentAnswerState,
    AssessmentSection
)

# In-memory store for M27. In a real system, this goes to Firestore.
# assessments/{assessmentId}
MOCK_ASSESSMENTS = [
    Assessment(
        assessmentId="test_technical_1",
        title="Technical Assessment (Sample)",
        description="A foundational technical assessment covering algorithms, data structures, and OOP.",
        category=AssessmentCategory.technical,
        difficulty=AssessmentDifficulty.medium,
        durationMinutes=30,
        questionCount=3,
        status=AssessmentStatus.published,
        createdAt=datetime.utcnow().isoformat() + "Z",
        updatedAt=datetime.utcnow().isoformat() + "Z",
        config=AssessmentConfig(
            durationMinutes=30,
            questionCount=3,
            passingScore=60,
            negativeMarking=False,
            allowBackNavigation=True,
            shuffleQuestions=False,
            shuffleOptions=False,
            sections=[
                AssessmentSection(
                    sectionId="sec_tech_1", title="Algorithms", type=AssessmentCategory.technical,
                    source="Algorithms", questionCount=3, marks=10, negativeMarks=0, order=1, required=True
                )
            ]
        )
    ),
    Assessment(
        assessmentId="test_mixed_1",
        title="Mixed Placement Assessment",
        description="A comprehensive placement simulation covering multiple domains.",
        category=AssessmentCategory.mixed,
        difficulty=AssessmentDifficulty.hard,
        durationMinutes=60,
        questionCount=5,
        status=AssessmentStatus.published,
        createdAt=datetime.utcnow().isoformat() + "Z",
        updatedAt=datetime.utcnow().isoformat() + "Z",
        config=AssessmentConfig(
            durationMinutes=60,
            questionCount=5,
            passingScore=75,
            negativeMarking=True,
            allowBackNavigation=True,
            shuffleQuestions=False,
            shuffleOptions=False,
            sections=[
                AssessmentSection(
                    sectionId="sec_apt_1", title="Quantitative", type=AssessmentCategory.aptitude,
                    source="quantitative", questionCount=2, marks=5, negativeMarks=1, order=1, required=True
                ),
                AssessmentSection(
                    sectionId="sec_code_1", title="Python Coding", type=AssessmentCategory.coding,
                    source="python", questionCount=2, marks=50, negativeMarks=0, order=2, required=True
                ),
                AssessmentSection(
                    sectionId="sec_comm_1", title="Verbal Response", type=AssessmentCategory.communication,
                    source="situational", questionCount=1, marks=20, negativeMarks=0, order=3, required=True
                )
            ]
        )
    )
]

MOCK_QUESTIONS = [
    AssessmentQuestionReference(
        assessmentQuestionId="aq_1", assessmentId="test_technical_1", questionId="q1",
        source=AssessmentQuestionSource.static, order=1, marks=10, negativeMarks=0,
        questionText="What is the worst-case time complexity of QuickSort?",
        options=["O(n)", "O(n log n)", "O(n^2)", "O(log n)"]
    ),
    AssessmentQuestionReference(
        assessmentQuestionId="aq_2", assessmentId="test_technical_1", questionId="q2",
        source=AssessmentQuestionSource.static, order=2, marks=10, negativeMarks=0,
        questionText="Which property of OOP allows a class to inherit features from another?",
        options=["Encapsulation", "Polymorphism", "Inheritance", "Abstraction"]
    ),
    AssessmentQuestionReference(
        assessmentQuestionId="aq_3", assessmentId="test_technical_1", questionId="q3",
        source=AssessmentQuestionSource.static, order=3, marks=10, negativeMarks=0,
        questionText="Which of the following is a non-linear data structure?",
        options=["Array", "Linked List", "Stack", "Tree"]
    )
]

from app.services.assessment_type_service import assessment_type_service
from app.services.assessment_result_service import assessment_result_service

# Hidden from frontend, only used in scoring service later
MOCK_ANSWERS_MAP = {
    "q1": 2, # O(n^2)
    "q2": 2, # Inheritance
    "q3": 3  # Tree
}

class AssessmentService:
    def __init__(self):
        self._sessions: Dict[str, AssessmentSession] = {}

    def get_assessments(self) -> List[Assessment]:
        return [a for a in MOCK_ASSESSMENTS if a.status == AssessmentStatus.published]

    def get_assessment(self, assessment_id: str) -> Optional[Assessment]:
        for a in MOCK_ASSESSMENTS:
            if a.assessmentId == assessment_id:
                return a
        return None
        
    def _get_assessment_questions(self, assessment_id: str) -> List[AssessmentQuestionReference]:
        assessment = self.get_assessment(assessment_id)
        if not assessment:
            return []
        return assessment_type_service.resolve_questions(assessment)

    def _check_expiration(self, session: AssessmentSession) -> bool:
        if session.status in [AssessmentSessionStatus.submitted, AssessmentSessionStatus.expired, AssessmentSessionStatus.abandoned]:
            return True
            
        if session.expiresAt:
            expires_at = datetime.fromisoformat(session.expiresAt.replace("Z", "+00:00")).replace(tzinfo=None)
            now = datetime.utcnow()
            if now > expires_at:
                session.status = AssessmentSessionStatus.expired
                session.submittedAt = expires_at.isoformat() + "Z"
                return True
        return False

    def start_session(self, uid: str, assessment_id: str) -> AssessmentSession:
        assessment = self.get_assessment(assessment_id)
        if not assessment or assessment.status != AssessmentStatus.published:
            raise ValueError("Assessment is not available.")

        # Multiple Session Protection: One active session per assessment per user
        for s in self._sessions.values():
            if s.userId == uid and s.assessmentId == assessment_id:
                self._check_expiration(s)
                if s.status == AssessmentSessionStatus.in_progress:
                    return s # Resume existing active session

        now = datetime.utcnow()
        expires_at = now + timedelta(minutes=assessment.durationMinutes)
        
        session = AssessmentSession(
            sessionId=f"as_session_{uuid.uuid4().hex[:12]}",
            assessmentId=assessment_id,
            userId=uid,
            status=AssessmentSessionStatus.in_progress,
            currentQuestionIndex=0,
            startedAt=now.isoformat() + "Z",
            expiresAt=expires_at.isoformat() + "Z",
            questions=self._get_assessment_questions(assessment_id),
            answers=[]
        )
        
        self._sessions[session.sessionId] = session
        return session

    def get_session(self, uid: str, session_id: str) -> AssessmentSession:
        session = self._sessions.get(session_id)
        if not session or session.userId != uid:
            raise ValueError("Session not found")
            
        self._check_expiration(session)
        return session

    def save_answer(self, uid: str, session_id: str, answer: AssessmentAnswer) -> AssessmentSession:
        session = self.get_session(uid, session_id)
        if session.status != AssessmentSessionStatus.in_progress:
            raise ValueError(f"Cannot save answer: session is {session.status.value}")

        # Update or add answer
        existing = next((a for a in session.answers if a.questionId == answer.questionId), None)
        if existing:
            existing.selectedOption = answer.selectedOption
            existing.state = answer.state
            existing.answeredAt = datetime.utcnow().isoformat() + "Z"
        else:
            answer.answeredAt = datetime.utcnow().isoformat() + "Z"
            session.answers.append(answer)
            
        return session

    def submit_assessment(self, session_id: str, user_id: str) -> Optional[AssessmentSession]:
        session = self.get_session(user_id, session_id)
        if not session:
            return None
        if session.status != AssessmentSessionStatus.in_progress:
            return session
            
        current_time = datetime.utcnow()
        session.status = AssessmentSessionStatus.submitted
        session.submittedAt = current_time.isoformat() + "Z"

        # Generate Result
        assessment = self.get_assessment(session.assessmentId)
        if assessment:
            res = assessment_result_service.generate_result(session, assessment, current_time)
            # In a real system we would map the resultId back to the session or return it
            session.metadata = {"resultId": res.resultId}

        return session

assessment_service = AssessmentService()
