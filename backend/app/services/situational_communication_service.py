import json
import logging
import uuid
from datetime import datetime
from typing import Tuple

from app.schemas.situational import (
    SituationalStartRequest,
    SituationalStartResponse,
    SituationalRespondRequest,
    SituationalRespondResponse,
    SituationalEvaluation,
    SituationalCompleteRequest,
    SituationalCompleteResponse,
)
from app.services.gemini_service import gemini_service
from app.services.prompts.situational_prompts import (
    build_situational_evaluation_prompt,
    build_situational_scenario_prompt,
)

logger = logging.getLogger(__name__)

class SituationalCommunicationService:
    async def start_session(self, request: SituationalStartRequest) -> SituationalStartResponse:
        """
        Initialize a new Situational Communication practice session.
        """
        session_id = f"situational_{uuid.uuid4().hex[:10]}"
        category = request.category
        difficulty = request.difficulty.lower()

        prompt_instruction = build_situational_scenario_prompt(category, difficulty)
        generated_scenario = await gemini_service.generate_communication_response(
            message=prompt_instruction, mode="situational"
        )

        if not generated_scenario or "not configured" in generated_scenario:
            generated_scenario = f"You are dealing with a {difficulty} situation regarding {category}. How would you respond?"

        return SituationalStartResponse(
            session_id=session_id,
            category=category,
            difficulty=difficulty,
            scenario=generated_scenario,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    async def evaluate_turn(self, request: SituationalRespondRequest) -> SituationalRespondResponse:
        """
        Evaluate a situational response using Gemini and calculate the 10-criteria score.
        """
        difficulty = request.difficulty.lower()
        eval_instructions = build_situational_evaluation_prompt(request.category, difficulty)
        
        # Build prompt considering context. If it's a follow-up, it will be in the history.
        full_user_message = (
            f"Evaluation instructions:\n{eval_instructions}\n\n"
            f"Student Response to Evaluate:\n\"{request.response_text}\""
        )

        raw_response = await gemini_service.generate_communication_response(
            message=full_user_message,
            mode="situational",
            history=request.history,
        )

        evaluation, next_prompt = self._parse_evaluation_json(raw_response, request.response_text)
        
        # Default session length is 5 interactions
        is_completed = request.turn_index >= 5

        return SituationalRespondResponse(
            session_id=request.session_id,
            turn_index=request.turn_index,
            evaluation=evaluation,
            next_prompt=next_prompt,
            is_completed=is_completed,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    async def complete_session(self, request: SituationalCompleteRequest) -> SituationalCompleteResponse:
        """
        Calculate final overall Situational Communication score and category summary.
        """
        evals = request.evaluations
        if not evals:
            return SituationalCompleteResponse(
                session_id=request.session_id,
                overall_score=75,
                category_breakdown={
                    "relevance": 75,
                    "clarity": 75,
                    "professionalism": 75,
                    "tone": 75,
                    "appropriateness": 75,
                    "empathy": 75,
                    "decisionMaking": 75,
                    "problemHandling": 75,
                    "confidence": 75,
                    "communicationQuality": 75,
                },
                strengths=["Participated in the session"],
                improvements=["Complete more interactions for accurate feedback"],
                summary="Session completed without enough data for detailed evaluation.",
                timestamp=datetime.utcnow().isoformat() + "Z",
            )

        # Average each criteria across all turns
        avg_breakdown = {
            "relevance": round(sum(e.relevance for e in evals) / len(evals)),
            "clarity": round(sum(e.clarity for e in evals) / len(evals)),
            "professionalism": round(sum(e.professionalism for e in evals) / len(evals)),
            "tone": round(sum(e.tone for e in evals) / len(evals)),
            "appropriateness": round(sum(e.appropriateness for e in evals) / len(evals)),
            "empathy": round(sum(e.empathy for e in evals) / len(evals)),
            "decisionMaking": round(sum(e.decisionMaking for e in evals) / len(evals)),
            "problemHandling": round(sum(e.problemHandling for e in evals) / len(evals)),
            "confidence": round(sum(e.confidence for e in evals) / len(evals)),
            "communicationQuality": round(sum(e.communicationQuality for e in evals) / len(evals)),
        }

        overall_score = round(sum(avg_breakdown.values()) / 10)

        all_strengths = []
        all_improvements = []
        for e in evals:
            all_strengths.extend(e.strengths)
            all_improvements.extend(e.improvements)

        # Deduplicate
        unique_strengths = list(dict.fromkeys(all_strengths))[:4] or ["Addresses the situation"]
        unique_improvements = list(dict.fromkeys(all_improvements))[:4] or ["Provide more specific details"]

        summary = (
            f"Situational Communication Practice Complete! You achieved an Overall Score of {overall_score}/100. "
            f"Continue practicing to improve your decision-making and communication in complex scenarios."
        )

        return SituationalCompleteResponse(
            session_id=request.session_id,
            overall_score=overall_score,
            category_breakdown=avg_breakdown,
            strengths=unique_strengths,
            improvements=unique_improvements,
            summary=summary,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    def _parse_evaluation_json(self, raw_response: str, original_text: str) -> Tuple[SituationalEvaluation, str]:
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

            relevance = int(data.get("relevance", 80))
            clarity = int(data.get("clarity", 80))
            professionalism = int(data.get("professionalism", 80))
            tone = int(data.get("tone", 80))
            appropriateness = int(data.get("appropriateness", 80))
            empathy = int(data.get("empathy", 80))
            decisionMaking = int(data.get("decisionMaking", 80))
            problemHandling = int(data.get("problemHandling", 80))
            confidence = int(data.get("confidence", 80))
            communicationQuality = int(data.get("communicationQuality", 80))

            overall = round((relevance + clarity + professionalism + tone + appropriateness + empathy + decisionMaking + problemHandling + confidence + communicationQuality) / 10)

            evaluation = SituationalEvaluation(
                relevance=relevance,
                clarity=clarity,
                professionalism=professionalism,
                tone=tone,
                appropriateness=appropriateness,
                empathy=empathy,
                decisionMaking=decisionMaking,
                problemHandling=problemHandling,
                confidence=confidence,
                communicationQuality=communicationQuality,
                overallScore=overall,
                strengths=data.get("strengths", ["Addressed the situation well"]),
                improvements=data.get("improvements", ["Provide more specific details next time"]),
                originalText=original_text,
                betterResponse=data.get("betterResponse", None),
                followUp=data.get("followUp", None),
            )

            next_prompt = data.get("followUp") or "Thank you for your response. Let's move on to the next situation."
            return evaluation, next_prompt

        except Exception as e:
            logger.warning(f"[SituationalCommunicationService] JSON parsing failed: {e}. Using deterministic evaluation.")
            
            # Deterministic heuristic fallback
            words = original_text.split()
            word_count = len(words)

            base = min(90, max(60, 65 + (word_count // 3)))
            
            evaluation = SituationalEvaluation(
                relevance=base + 2,
                clarity=base + 1,
                professionalism=base,
                tone=base,
                appropriateness=base,
                empathy=base - 2,
                decisionMaking=base - 1,
                problemHandling=base,
                confidence=base,
                communicationQuality=max(60, 95 - (word_count // 2)),
                overallScore=base,
                strengths=["Responded to the prompt"],
                improvements=["Be more descriptive and clear in your reasoning"],
                originalText=original_text,
                betterResponse=f"I would clearly communicate that {original_text.lower()}",
                followUp="How would you handle a follow-up question regarding this from a manager?",
            )

            next_prompt = evaluation.followUp
            return evaluation, next_prompt

situational_communication_service = SituationalCommunicationService()
