import json
import logging
import uuid
from datetime import datetime
from typing import List, Dict
from app.schemas.aptitude import (
    AptitudeStartRequest,
    AptitudeStartResponse,
    AptitudeAnswerRequest,
    AptitudeAnswerResponse,
    AptitudeSessionCompleteRequest,
    AptitudeSessionSummary,
    AptitudeQuestion,
    ClientAptitudeQuestion
)
from app.services.gemini_service import gemini_service
from app.services.prompts.aptitude import APTITUDE_GENERATION_PROMPT
from app.services.prompts.quantitative import QUANTITATIVE_GENERATION_PROMPT

logger = logging.getLogger(__name__)

class AptitudeService:
    def __init__(self):
        self._sessions: Dict[str, List[AptitudeQuestion]] = {}

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
        
        self._sessions[session_id] = questions

        client_questions = [
            ClientAptitudeQuestion(
                question_id=q.question_id,
                question=q.question,
                options=q.options
            ) for q in questions
        ]
        
        return AptitudeStartResponse(
            session_id=session_id,
            category=request.category,
            topic=request.topic,
            difficulty=request.difficulty,
            questions=client_questions
        )

    async def complete_session(self, request: AptitudeSessionCompleteRequest) -> AptitudeSessionSummary:
        real_questions = self._sessions.get(request.session_id, [])
        if not real_questions:
            raise ValueError("Session expired or not found")
            
        total_questions = len(real_questions)
        correct = 0
        incorrect = 0
        unanswered = 0
        
        for q in real_questions:
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
            completed_at=datetime.utcnow().isoformat() + "Z",
            questions_with_answers=real_questions
        )
        # Clear memory
        self._sessions.pop(request.session_id, None)
        return summary

    def _parse_questions(self, raw_response: str, expected_count: int) -> List[AptitudeQuestion]:
        try:
            start_idx = raw_response.find('[')
            end_idx = raw_response.rfind(']')
            
            if start_idx == -1 or end_idx == -1 or start_idx > end_idx:
                raise ValueError("APTITUDE_JSON_PARSE_FAILED: No JSON array found in response")
                
            clean_json_str = raw_response[start_idx : end_idx + 1]
            data = json.loads(clean_json_str)
            
            if not isinstance(data, list):
                raise ValueError("APTITUDE_SCHEMA_VALIDATION_FAILED: JSON root is not an array")
                
            questions = []
            for item in data:
                try:
                    q = AptitudeQuestion(
                        question_id=f"q_{uuid.uuid4().hex[:8]}",
                        question=item["question"],
                        options=item["options"],
                        correctOption=item["correctOption"],
                        explanation=item.get("explanation", "")
                    )
                    questions.append(q)
                except Exception as ex:
                    logger.warning(f"Skipping malformed question object: {ex}")
                    continue
                
            if not questions:
                raise ValueError("APTITUDE_SCHEMA_VALIDATION_FAILED: No valid questions parsed")
                
            # If AI didn't generate enough, duplicate for now to meet count (fallback)
            while len(questions) < expected_count:
                questions.append(questions[0].copy(update={"question_id": f"q_{uuid.uuid4().hex[:8]}"}))
                
            return questions[:expected_count]
            
        except json.JSONDecodeError as e:
            logger.error(f"APTITUDE_JSON_PARSE_FAILED: Invalid JSON format: {e}")
            raise ValueError("APTITUDE_JSON_PARSE_FAILED")
        except Exception as e:
            logger.error(f"APTITUDE_SCHEMA_VALIDATION_FAILED: {e}")
            raise ValueError(f"APTITUDE_SCHEMA_VALIDATION_FAILED: {e}")

aptitude_service = AptitudeService()
