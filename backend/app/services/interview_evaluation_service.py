import uuid
from datetime import datetime
from typing import Dict, List, Optional
import json

from app.schemas.interview_evaluation import (
    InterviewEvaluation, InterviewQuestionEvaluation, InterviewPracticeArea, 
    GeminiInterviewEvaluation, InterviewEvaluationStatus, InterviewPerformanceLevel
)
from app.services.interview_service import interview_service
from app.services.gemini_service import gemini_service
from app.services.prompts.interview_evaluation import get_interview_evaluation_prompt

class InterviewEvaluationService:
    def __init__(self):
        self._evaluations: Dict[str, InterviewEvaluation] = {}
        self._processing_locks: Dict[str, bool] = {}

    def get_performance_level(self, score: int) -> str:
        if score >= 90:
            return InterviewPerformanceLevel.excellent.value
        elif score >= 75:
            return InterviewPerformanceLevel.strong.value
        elif score >= 60:
            return InterviewPerformanceLevel.good.value
        elif score >= 40:
            return InterviewPerformanceLevel.needs_improvement.value
        else:
            return InterviewPerformanceLevel.needs_significant_improvement.value

    async def evaluate_session(self, user_id: str, session_id: str) -> InterviewEvaluation:
        # Idempotency and locking
        if self._processing_locks.get(session_id, False):
            raise ValueError("Evaluation is already processing for this session.")
        
        # Check if already evaluated successfully
        existing = next((e for e in self._evaluations.values() if e.sessionId == session_id and e.status == "completed"), None)
        if existing:
            return existing

        session = interview_service.get_session(user_id, session_id)
        if not session:
            raise ValueError("Interview session not found.")
        
        # Only evaluate if completed (or we can evaluate in-progress if they abandoned, but let's stick to completed)
        if session.status not in ["completed", "expired", "abandoned"]:
            raise ValueError("Interview session must be completed before evaluation.")

        self._processing_locks[session_id] = True
        result_id = f"res_{uuid.uuid4().hex[:8]}"

        try:
            # Prepare conversation transcript
            transcript = ""
            questions_asked = []
            
            for msg in session.messages:
                role_label = "Interviewer" if msg.role == "interviewer" else "Student" if msg.role == "student" else "System"
                transcript += f"{role_label} ({msg.messageId}): {msg.content}\n\n"
                if msg.role == "interviewer" and msg.questionType in ["introduction", "follow_up"]:
                    questions_asked.append(msg)

            if len(session.messages) < 2:
                # Insufficient data
                eval_result = InterviewEvaluation(
                    resultId=result_id,
                    sessionId=session_id,
                    userId=user_id,
                    status=InterviewEvaluationStatus.completed.value,
                    mode=session.mode,
                    topic=session.topic,
                    overallScore=0,
                    performanceLevel=InterviewPerformanceLevel.needs_significant_improvement.value,
                    strengths=[],
                    improvementAreas=[],
                    questionEvaluations=[],
                    summary="Insufficient conversation data to provide an evaluation.",
                    practiceAreas=[],
                    createdAt=datetime.utcnow().isoformat() + "Z"
                )
                self._evaluations[result_id] = eval_result
                return eval_result

            # Prepare prompt
            system_instruction = get_interview_evaluation_prompt(session.mode, session.topic)
            prompt = f"Here is the interview transcript to evaluate:\n\n{transcript}"

            # Call Gemini
            try:
                response_text = await gemini_service.generate_json_response(system_instruction, prompt)
                
                # Try to clean markdown tags if Gemini accidentally included them despite instructions
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                    
                parsed_json = json.loads(response_text)
                gemini_eval = GeminiInterviewEvaluation(**parsed_json)
                
                overall = gemini_eval.overallScore
                
                eval_result = InterviewEvaluation(
                    resultId=result_id,
                    sessionId=session_id,
                    userId=user_id,
                    status=InterviewEvaluationStatus.completed.value,
                    mode=session.mode,
                    topic=session.topic,
                    overallScore=overall,
                    performanceLevel=self.get_performance_level(overall),
                    communicationScore=gemini_eval.communicationScore,
                    technicalScore=gemini_eval.technicalScore,
                    relevanceScore=gemini_eval.relevanceScore,
                    clarityScore=gemini_eval.clarityScore,
                    structureScore=gemini_eval.structureScore,
                    strengths=gemini_eval.strengths,
                    improvementAreas=gemini_eval.improvementAreas,
                    questionEvaluations=gemini_eval.questionEvaluations,
                    summary=gemini_eval.summary,
                    practiceAreas=gemini_eval.practiceAreas,
                    createdAt=datetime.utcnow().isoformat() + "Z"
                )
                
            except Exception as ai_err:
                print(f"[InterviewEvaluationService] Evaluation failed: {ai_err}")
                # Mark as failed so user can retry
                eval_result = InterviewEvaluation(
                    resultId=result_id,
                    sessionId=session_id,
                    userId=user_id,
                    status=InterviewEvaluationStatus.failed.value,
                    mode=session.mode,
                    topic=session.topic,
                    createdAt=datetime.utcnow().isoformat() + "Z"
                )

            self._evaluations[result_id] = eval_result
            return eval_result

        finally:
            self._processing_locks[session_id] = False

    def get_evaluation(self, user_id: str, result_id: str) -> Optional[InterviewEvaluation]:
        result = self._evaluations.get(result_id)
        if result and result.userId == user_id:
            return result
        return None

    def get_evaluation_by_session(self, user_id: str, session_id: str) -> Optional[InterviewEvaluation]:
        # Return the most recent successful evaluation for this session, or a failed one if no success exists
        evals = [e for e in self._evaluations.values() if e.userId == user_id and e.sessionId == session_id]
        if not evals:
            return None
        
        completed = [e for e in evals if e.status == "completed"]
        if completed:
            return sorted(completed, key=lambda x: x.createdAt, reverse=True)[0]
        
        return sorted(evals, key=lambda x: x.createdAt, reverse=True)[0]

    def get_history(self, user_id: str) -> List[InterviewEvaluation]:
        evals = [e for e in self._evaluations.values() if e.userId == user_id and e.status == "completed"]
        return sorted(evals, key=lambda x: x.createdAt, reverse=True)


interview_evaluation_service = InterviewEvaluationService()
