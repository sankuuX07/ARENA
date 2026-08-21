import json
import logging
import uuid
from datetime import datetime
from typing import List
from app.schemas.aptitude import (
    AptitudeStartRequest,
    AptitudeStartResponse,
    AptitudeAnswerRequest,
    AptitudeAnswerResponse,
    AptitudeSessionCompleteRequest,
    AptitudeSessionSummary,
    AptitudeQuestion
)
from app.services.gemini_service import gemini_service
from app.services.prompts.aptitude import APTITUDE_GENERATION_PROMPT
from app.services.prompts.quantitative import QUANTITATIVE_GENERATION_PROMPT

logger = logging.getLogger(__name__)

class AptitudeService:
    async def start_session(self, request: AptitudeStartRequest) -> AptitudeStartResponse:
        session_id = f"apt_{uuid.uuid4().hex[:10]}"
        
        if request.category.lower() == 'quantitative':
            prompt = QUANTITATIVE_GENERATION_PROMPT.format(
                num_questions=request.num_questions,
                topic=request.topic or 'General Quantitative',
                difficulty=request.difficulty
            )
        else:
            prompt = APTITUDE_GENERATION_PROMPT.format(
                num_questions=request.num_questions,
                category=request.category,
                difficulty=request.difficulty
            )
        
        raw_response = await gemini_service.generate_communication_response(
            message=prompt,
            mode="aptitude"
        )
        
        questions = self._parse_questions(raw_response, request.num_questions)
        
        return AptitudeStartResponse(
            session_id=session_id,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            questions=questions
        )

    async def complete_session(self, request: AptitudeSessionCompleteRequest) -> AptitudeSessionSummary:
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
        
        return AptitudeSessionSummary(
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
            time_taken=0, # Computed by frontend usually or via timestamps
            completed_at=datetime.utcnow().isoformat() + "Z"
        )

    def _parse_questions(self, raw_response: str, expected_count: int) -> List[AptitudeQuestion]:
        try:
            clean_json_str = raw_response
            if "```json" in raw_response:
                clean_json_str = raw_response.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_response:
                clean_json_str = raw_response.split("```")[1].split("```")[0].strip()
                
            data = json.loads(clean_json_str)
            questions = []
            for i, item in enumerate(data):
                q = AptitudeQuestion(
                    question_id=f"q_{uuid.uuid4().hex[:8]}",
                    question=item["question"],
                    options=item["options"],
                    correctOption=item["correctOption"],
                    explanation=item["explanation"]
                )
                questions.append(q)
                
            # If AI didn't generate enough, duplicate for now to meet count (fallback)
            while len(questions) < expected_count and len(questions) > 0:
                questions.append(questions[0].copy(update={"question_id": f"q_{uuid.uuid4().hex[:8]}"}))
                
            return questions[:expected_count]
        except Exception as e:
            logger.warning(f"Failed to parse AI aptitude questions JSON: {e}")
            # Fallback
            return [
                AptitudeQuestion(
                    question_id=f"q_{uuid.uuid4().hex[:8]}",
                    question="What is 2 + 2?",
                    options=["3", "4", "5", "6"],
                    correctOption=1,
                    explanation="2 + 2 equals 4."
                ) for _ in range(expected_count)
            ]

aptitude_service = AptitudeService()
