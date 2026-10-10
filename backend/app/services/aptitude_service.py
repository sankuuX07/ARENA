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
        self._results: List[AptitudeSessionSummary] = []

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
        
        system_instruction = (
            "You are an expert aptitude question generator for a placement preparation platform. "
            "Your task is to generate multiple-choice questions as a JSON array. "
            "Respond ONLY with a valid JSON array. Do not include any text outside the JSON."
        )
        raw_response = await gemini_service.generate_json_response(
            system_instruction=system_instruction,
            message=prompt
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
        
        summary = AptitudeSessionSummary(
            uid=request.uid,
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
        # Store result and clear session from memory after building result
        self._results.append(summary)
        self._sessions.pop(request.session_id, None)
        return summary

    def _parse_questions(self, raw_response: str, expected_count: int) -> List[AptitudeQuestion]:
        import re
        try:
            # 1 & 2. Read and extract text
            text = raw_response.strip()
            
            # 3. Remove accidental markdown code fences if present
            # Match ```json ... ``` or just ``` ... ```
            markdown_match = re.search(r'```(?:json)?\s*(.*?)\s*```', text, re.DOTALL)
            if markdown_match:
                text = markdown_match.group(1).strip()
                
            # 4. Trim unnecessary surrounding text where safely possible
            start_idx = text.find('[')
            end_idx = text.rfind(']')
            
            if start_idx == -1 or end_idx == -1 or start_idx > end_idx:
                raise ValueError("APTITUDE_JSON_PARSE_FAILED: No JSON array found in response")
                
            clean_json_str = text[start_idx : end_idx + 1]
            
            # 5. Parse JSON
            data = json.loads(clean_json_str)
            
            # 6. Validate resulting structure
            if not isinstance(data, list):
                raise ValueError("APTITUDE_SCHEMA_VALIDATION_FAILED: JSON root is not an array")
                
            questions = []
            for item in data:
                try:
                    # 8. Validate each question
                    if not isinstance(item, dict):
                        continue
                    if "question" not in item or not isinstance(item["question"], str):
                        continue
                        
                    # 9. Validate the options
                    options = item.get("options", [])
                    if not isinstance(options, list) or len(options) != 4:
                        continue
                    if not all(isinstance(opt, str) for opt in options):
                        options = [str(opt) for opt in options]
                        
                    # 10. Validate the correct answer
                    correct_opt = item.get("correctOption")
                    if correct_opt is None:
                        # Fallback for some LLM variations
                        if "answer" in item:
                            ans = item["answer"]
                            if isinstance(ans, int) and 0 <= ans < 4:
                                correct_opt = ans
                            elif isinstance(ans, str) and ans.isdigit():
                                correct_opt = int(ans)
                                if correct_opt not in [0, 1, 2, 3]:
                                    # Maybe it gave the text answer or 1-based index
                                    if correct_opt in [1, 2, 3, 4]:
                                        correct_opt -= 1
                                    else:
                                        continue
                        if correct_opt is None:
                            continue
                            
                    if not isinstance(correct_opt, int) or correct_opt < 0 or correct_opt > 3:
                        try:
                            correct_opt = int(correct_opt)
                            if correct_opt not in [0, 1, 2, 3]:
                                continue
                        except (ValueError, TypeError):
                            continue
                            
                    explanation = item.get("explanation", "")
                    if not isinstance(explanation, str):
                        explanation = str(explanation)
                        
                    # 11. Return clean standardized Aptitude question object
                    q = AptitudeQuestion(
                        question_id=f"q_{uuid.uuid4().hex[:8]}",
                        question=item["question"],
                        options=options,
                        correctOption=correct_opt,
                        explanation=explanation
                    )
                    questions.append(q)
                except Exception as ex:
                    logger.warning(f"Skipping malformed question object: {ex}")
                    continue
                
            if not questions:
                raise ValueError("APTITUDE_SCHEMA_VALIDATION_FAILED: No valid questions parsed")
                
            # 7. Validate number of questions
            # If AI didn't generate enough, return what it generated or duplicate
            # The prompt says: "Verify that the selected count is actually sent to the backend...
            # The backend must return the requested number of valid questions. 
            # If Ollama returns fewer questions, handle that properly rather than crashing. 
            # Do NOT silently duplicate questions."
            
            # Let's truncate if too many, but if too few, just return the ones we got.
            return questions[:expected_count]
            
        except json.JSONDecodeError as e:
            logger.error(f"APTITUDE_JSON_PARSE_FAILED: Invalid JSON format: {e}")
            raise ValueError("APTITUDE_JSON_PARSE_FAILED")
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"APTITUDE_SCHEMA_VALIDATION_FAILED: {e}")
            raise ValueError(f"APTITUDE_SCHEMA_VALIDATION_FAILED: {e}")

aptitude_service = AptitudeService()
