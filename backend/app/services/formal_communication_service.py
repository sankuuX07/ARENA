import json
import logging
import uuid
from datetime import datetime
from typing import Tuple

from app.schemas.formal import (
    FormalStartRequest,
    FormalStartResponse,
    FormalRespondRequest,
    FormalRespondResponse,
    FormalEvaluation,
    FormalCompleteRequest,
    FormalCompleteResponse,
)
from app.services.gemini_service import gemini_service
from app.services.prompts.formal_prompts import (
    build_formal_evaluation_prompt,
    build_formal_scenario_prompt,
)

logger = logging.getLogger(__name__)

class FormalCommunicationService:
    async def start_session(self, request: FormalStartRequest) -> FormalStartResponse:
        """
        Initialize a new Formal Communication practice session.
        """
        session_id = f"formal_{uuid.uuid4().hex[:10]}"
        category = request.category
        difficulty = request.difficulty.lower()

        # Generate scenario via Gemini API
        prompt_instruction = build_formal_scenario_prompt(category, difficulty)
        generated_scenario = await gemini_service.generate_communication_response(
            message=prompt_instruction, mode="formal"
        )

        if not generated_scenario or "not configured" in generated_scenario:
            generated_scenario = f"You are attending a professional meeting regarding {category}. Please introduce yourself formally."

        return FormalStartResponse(
            session_id=session_id,
            category=category,
            difficulty=difficulty,
            scenario=generated_scenario,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    async def evaluate_turn(self, request: FormalRespondRequest) -> FormalRespondResponse:
        """
        Evaluate a single formal response using Gemini and calculate the 9-criteria score.
        """
        difficulty = request.difficulty.lower()
        eval_instructions = build_formal_evaluation_prompt(request.category, difficulty)
        full_user_message = (
            f"Evaluation instructions:\n{eval_instructions}\n\n"
            f"Student Response to Evaluate:\n\"{request.response_text}\""
        )

        raw_response = await gemini_service.generate_communication_response(
            message=full_user_message,
            mode="formal",
            history=request.history,
        )

        evaluation, next_prompt = self._parse_evaluation_json(raw_response, request.response_text)
        
        # Determine if session is complete (default to 5 interactions)
        is_completed = request.turn_index >= 5

        return FormalRespondResponse(
            session_id=request.session_id,
            turn_index=request.turn_index,
            evaluation=evaluation,
            next_prompt=next_prompt,
            is_completed=is_completed,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    async def complete_session(self, request: FormalCompleteRequest) -> FormalCompleteResponse:
        """
        Calculate final overall Formal Communication score and category summary.
        """
        evals = request.evaluations
        if not evals:
            return FormalCompleteResponse(
                session_id=request.session_id,
                overall_score=75,
                category_breakdown={
                    "professionalism": 75,
                    "clarity": 75,
                    "grammar": 75,
                    "vocabulary": 75,
                    "structure": 75,
                    "relevance": 75,
                    "tone": 75,
                    "conciseness": 75,
                    "confidence": 75,
                },
                strengths=["Completed the session"],
                improvements=["Practice more to get detailed feedback"],
                summary="Session completed without enough data for detailed evaluation.",
                timestamp=datetime.utcnow().isoformat() + "Z",
            )

        # Average each criteria across all turns
        avg_breakdown = {
            "professionalism": round(sum(e.professionalism for e in evals) / len(evals)),
            "clarity": round(sum(e.clarity for e in evals) / len(evals)),
            "grammar": round(sum(e.grammar for e in evals) / len(evals)),
            "vocabulary": round(sum(e.vocabulary for e in evals) / len(evals)),
            "structure": round(sum(e.structure for e in evals) / len(evals)),
            "relevance": round(sum(e.relevance for e in evals) / len(evals)),
            "tone": round(sum(e.tone for e in evals) / len(evals)),
            "conciseness": round(sum(e.conciseness for e in evals) / len(evals)),
            "confidence": round(sum(e.confidence for e in evals) / len(evals)),
        }

        overall_score = round(sum(avg_breakdown.values()) / 9)

        all_strengths = []
        all_improvements = []
        for e in evals:
            all_strengths.extend(e.strengths)
            all_improvements.extend(e.improvements)

        # Deduplicate
        unique_strengths = list(dict.fromkeys(all_strengths))[:4] or ["Professional tone"]
        unique_improvements = list(dict.fromkeys(all_improvements))[:4] or ["Improve conciseness"]

        summary = (
            f"Formal Communication Practice Complete! You achieved an Overall Score of {overall_score}/100. "
            f"Keep practicing to refine your professional communication skills."
        )

        return FormalCompleteResponse(
            session_id=request.session_id,
            overall_score=overall_score,
            category_breakdown=avg_breakdown,
            strengths=unique_strengths,
            improvements=unique_improvements,
            summary=summary,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    def _parse_evaluation_json(self, raw_response: str, original_text: str) -> Tuple[FormalEvaluation, str]:
        """
        Safely parse JSON evaluation output from Gemini response or generate deterministic fallback.
        """
        try:
            clean_json_str = raw_response
            if "```json" in raw_response:
                clean_json_str = raw_response.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_response:
                clean_json_str = raw_response.split("```")[1].split("```")[0].strip()

            data = json.loads(clean_json_str)

            professionalism = int(data.get("professionalism", 80))
            clarity = int(data.get("clarity", 80))
            grammar = int(data.get("grammar", 80))
            vocabulary = int(data.get("vocabulary", 80))
            structure = int(data.get("structure", 80))
            relevance = int(data.get("relevance", 80))
            tone = int(data.get("tone", 80))
            conciseness = int(data.get("conciseness", 80))
            confidence = int(data.get("confidence", 80))

            overall = round((professionalism + clarity + grammar + vocabulary + structure + relevance + tone + conciseness + confidence) / 9)

            evaluation = FormalEvaluation(
                professionalism=professionalism,
                clarity=clarity,
                grammar=grammar,
                vocabulary=vocabulary,
                structure=structure,
                relevance=relevance,
                tone=tone,
                conciseness=conciseness,
                confidence=confidence,
                overallScore=overall,
                strengths=data.get("strengths", ["Good professional response"]),
                improvements=data.get("improvements", ["Try to be more concise"]),
                originalText=original_text,
                betterVersion=data.get("betterVersion", None),
                rewriteReason=data.get("rewriteReason", None),
            )

            next_prompt = data.get("nextPrompt") or "Thank you. Let's move on to the next topic."
            return evaluation, next_prompt

        except Exception as e:
            logger.warning(f"[FormalCommunicationService] JSON parsing failed: {e}. Using deterministic evaluation.")
            
            # Deterministic heuristic fallback
            words = original_text.split()
            word_count = len(words)

            base = min(90, max(60, 65 + (word_count // 3)))
            
            evaluation = FormalEvaluation(
                professionalism=base,
                clarity=base + 2,
                grammar=base,
                vocabulary=base - 2,
                structure=base + 1,
                relevance=85,
                tone=base,
                conciseness=max(60, 95 - (word_count // 2)),
                confidence=base,
                overallScore=base,
                strengths=["Clear response"],
                improvements=["Use more professional vocabulary"],
                originalText=original_text,
                betterVersion=f"I am writing to inform you that {original_text.lower()}",
                rewriteReason="More formal opening.",
            )

            next_prompt = "How would you handle a follow-up question regarding this?"
            return evaluation, next_prompt

formal_communication_service = FormalCommunicationService()
