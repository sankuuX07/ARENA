import json
import logging
import uuid
from datetime import datetime
from typing import List
from app.schemas.logical import (
    LogicalStartRequest,
    LogicalStartResponse,
    LogicalSessionCompleteRequest,
    LogicalSessionSummary,
    LogicalQuestion
)
from app.services.gemini_service import gemini_service
from app.services.prompts.logical_reasoning import LOGICAL_GENERATION_PROMPT

logger = logging.getLogger(__name__)

class LogicalReasoningService:
    async def start_session(self, request: LogicalStartRequest) -> LogicalStartResponse:
        session_id = f"logical_{uuid.uuid4().hex[:10]}"
        
        prompt = LOGICAL_GENERATION_PROMPT.format(
            num_questions=request.num_questions,
            topic=request.topic,
            difficulty=request.difficulty
        )
        
        raw_response = await gemini_service.generate_communication_response(
            message=prompt,
            mode="aptitude"
        )
        
        questions = self._parse_questions(raw_response, request.num_questions, request.topic)
        
        return LogicalStartResponse(
            session_id=session_id,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            questions=questions
        )

    async def complete_session(self, request: LogicalSessionCompleteRequest) -> LogicalSessionSummary:
        total_questions = len(request.questions)
        correct = 0
        incorrect = 0
        unanswered = 0
        
        for q in request.questions:
            student_answer = request.answers.get(q.question_id)
            if student_answer is None or student_answer == -1:
                unanswered += 1
            elif student_answer == q.correctOption:
                correct += 1
            else:
                incorrect += 1
                
        score = correct
        accuracy = round((correct / total_questions) * 100) if total_questions > 0 else 0
        
        return LogicalSessionSummary(
            session_id=request.session_id,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            total_questions=total_questions,
            correct=correct,
            incorrect=incorrect,
            unanswered=unanswered,
            score=score,
            accuracy=accuracy,
            time_taken=0, # Typically calculated or provided by frontend
            completed_at=datetime.utcnow().isoformat() + "Z"
        )

    def _parse_questions(self, raw_response: str, expected_count: int, topic: str) -> List[LogicalQuestion]:
        try:
            clean_json_str = raw_response
            if "```json" in raw_response:
                clean_json_str = raw_response.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_response:
                clean_json_str = raw_response.split("```")[1].split("```")[0].strip()
                
            data = json.loads(clean_json_str)
            questions = []
            for item in data:
                # Basic validation
                if len(item.get("options", [])) != 4:
                    continue
                if not isinstance(item.get("correctOption"), int) or item["correctOption"] not in [0, 1, 2, 3]:
                    continue
                
                # Check LLM CoT reasoning exists (even if we don't fully parse it in Python)
                if not item.get("validation_reasoning"):
                    logger.warning("LLM generated logical question without validation_reasoning. Accepted anyway if structural valid.")

                q = LogicalQuestion(
                    question_id=f"q_{uuid.uuid4().hex[:8]}",
                    question=item["question"],
                    options=item["options"],
                    correctOption=item["correctOption"],
                    explanation=item.get("explanation", "No explanation provided.")
                )
                questions.append(q)
                
            # If AI didn't generate enough, duplicate for now to meet count (fallback)
            while len(questions) < expected_count and len(questions) > 0:
                questions.append(questions[0].copy(update={"question_id": f"q_{uuid.uuid4().hex[:8]}"}))
                
            return questions[:expected_count]
        except Exception as e:
            logger.warning(f"Failed to parse AI logical questions JSON: {e}")
            # Fallback
            return [
                LogicalQuestion(
                    question_id=f"q_{uuid.uuid4().hex[:8]}",
                    question=f"Fallback question for {topic} - please try again later.",
                    options=["Option A", "Option B", "Option C", "Option D"],
                    correctOption=0,
                    explanation="Fallback explanation due to generation error."
                ) for _ in range(expected_count)
            ]

logical_reasoning_service = LogicalReasoningService()
