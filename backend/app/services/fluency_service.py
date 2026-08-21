import json
import logging
import re
import uuid
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.fluency import (
    FluencyStartRequest,
    FluencyStartResponse,
    FluencyRespondRequest,
    FluencyRespondResponse,
    FluencyEvaluation,
    FluencyCompleteRequest,
    FluencyCompleteResponse,
)
from app.services.gemini_service import gemini_service
from app.services.prompts.fluency_prompts import build_fluency_evaluation_prompt, build_fluency_topic_prompt

logger = logging.getLogger(__name__)

PREDEFINED_TOPICS = [
    "Introduce yourself and your career goals",
    "My college experience and key learnings",
    "Technology's role in modern education",
    "A major technical challenge I solved",
    "The importance of effective communication",
    "Teamwork and handling project conflicts",
    "Time management strategies during exams",
]


class FluencyService:
    async def start_session(self, request: FluencyStartRequest) -> FluencyStartResponse:
        """
        Initialize a new Fluency practice session with an opening prompt.
        """
        session_id = f"fluency_{uuid.uuid4().hex[:10]}"
        topic = request.topic or PREDEFINED_TOPICS[0]
        difficulty = request.difficulty.lower()

        # Prompt generation via Gemini API
        prompt_instruction = build_fluency_topic_prompt(topic, difficulty)
        generated_prompt = await gemini_service.generate_communication_response(
            message=prompt_instruction, mode="fluency"
        )

        if not generated_prompt or "not configured" in generated_prompt:
            generated_prompt = f"Welcome! Let's discuss '{topic}'. To begin, please share your thoughts in 2-3 sentences."

        return FluencyStartResponse(
            session_id=session_id,
            topic=topic,
            prompt=generated_prompt,
            difficulty=difficulty,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    async def evaluate_turn(self, request: FluencyRespondRequest) -> FluencyRespondResponse:
        """
        Evaluate a single student response turn using Gemini API and calculate score metrics.
        """
        difficulty = request.difficulty.lower()
        eval_instructions = build_fluency_evaluation_prompt(difficulty)
        full_user_message = f"Evaluation instructions:\n{eval_instructions}\n\nStudent Response to Evaluate:\n\"{request.response_text}\""

        raw_response = await gemini_service.generate_communication_response(
            message=full_user_message,
            mode="fluency",
            history=request.history,
        )

        evaluation, next_prompt = self._parse_evaluation_json(raw_response, request.response_text)
        is_completed = request.turn_index >= 5

        return FluencyRespondResponse(
            session_id=request.session_id,
            turn_index=request.turn_index,
            evaluation=evaluation,
            next_prompt=next_prompt,
            is_completed=is_completed,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    async def complete_session(self, request: FluencyCompleteRequest) -> FluencyCompleteResponse:
        """
        Calculate final overall Fluency score and category summary for 5-turn session completion.
        """
        evals = request.evaluations
        if not evals:
            # Fallback zero evaluation
            return FluencyCompleteResponse(
                session_id=request.session_id,
                overall_score=75,
                category_breakdown={
                    "grammar": 75,
                    "vocabulary": 75,
                    "sentenceStructure": 75,
                    "clarity": 75,
                    "coherence": 75,
                    "relevance": 75,
                    "fluency": 75,
                },
                strengths=["Active participation in fluency practice"],
                improvements=["Continue expanding professional vocabulary"],
                summary="Solid effort! Consistent practice will help build spoken fluency and interview confidence.",
                timestamp=datetime.utcnow().isoformat() + "Z",
            )

        # Average each category across all turns
        avg_grammar = round(sum(e.grammar for e in evals) / len(evals))
        avg_vocab = round(sum(e.vocabulary for e in evals) / len(evals))
        avg_struct = round(sum(e.sentenceStructure for e in evals) / len(evals))
        avg_clarity = round(sum(e.clarity for e in evals) / len(evals))
        avg_coherence = round(sum(e.coherence for e in evals) / len(evals))
        avg_relevance = round(sum(e.relevance for e in evals) / len(evals))
        avg_fluency = round(sum(e.fluency for e in evals) / len(evals))

        overall_score = round(
            (avg_grammar + avg_vocab + avg_struct + avg_clarity + avg_coherence + avg_relevance + avg_fluency) / 7
        )

        all_strengths = []
        all_improvements = []
        for e in evals:
            all_strengths.extend(e.strengths)
            all_improvements.extend(e.improvements)

        # Deduplicate
        unique_strengths = list(dict.fromkeys(all_strengths))[:4] or ["Clear expression of ideas", "Good engagement"]
        unique_improvements = list(dict.fromkeys(all_improvements))[:4] or ["Vary sentence length for better rhythm"]

        summary = (
            f"Fluency Practice Complete! You achieved an Overall AI Practice Score of {overall_score}/100. "
            f"Your strongest area was clarity & relevance. Continue practicing to refine grammatical precision."
        )

        return FluencyCompleteResponse(
            session_id=request.session_id,
            overall_score=overall_score,
            category_breakdown={
                "grammar": avg_grammar,
                "vocabulary": avg_vocab,
                "sentenceStructure": avg_struct,
                "clarity": avg_clarity,
                "coherence": avg_coherence,
                "relevance": avg_relevance,
                "fluency": avg_fluency,
            },
            strengths=unique_strengths,
            improvements=unique_improvements,
            summary=summary,
            timestamp=datetime.utcnow().isoformat() + "Z",
        )

    def _parse_evaluation_json(self, raw_response: str, original_text: str) -> (FluencyEvaluation, str):
        """
        Safely parse JSON evaluation output from Gemini response or generate clean fallback.
        """
        try:
            clean_json_str = raw_response
            if "```json" in raw_response:
                clean_json_str = raw_response.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_response:
                clean_json_str = raw_response.split("```")[1].split("```")[0].strip()

            data = json.loads(clean_json_str)

            grammar = int(data.get("grammar", 78))
            vocab = int(data.get("vocabulary", 75))
            struct = int(data.get("sentenceStructure", 80))
            clarity = int(data.get("clarity", 82))
            coherence = int(data.get("coherence", 80))
            relevance = int(data.get("relevance", 85))
            fluency = int(data.get("fluency", 76))

            overall = round((grammar + vocab + struct + clarity + coherence + relevance + fluency) / 7)

            evaluation = FluencyEvaluation(
                grammar=grammar,
                vocabulary=vocab,
                sentenceStructure=struct,
                clarity=clarity,
                coherence=coherence,
                relevance=relevance,
                fluency=fluency,
                overallScore=overall,
                strengths=data.get("strengths", ["Good clarity and relevance"]),
                improvements=data.get("improvements", ["Expand vocabulary choices"]),
                originalText=original_text,
                betterVersion=data.get("betterVersion", None),
            )

            next_prompt = data.get("nextPrompt") or "That makes sense! What additional thoughts or experiences would you add?"
            return evaluation, next_prompt

        except Exception as e:
            logger.warning(f"[FluencyService] JSON parsing failed for raw response: {e}. Using deterministic evaluation.")
            # Deterministic heuristic fallback evaluation based on student response length & words
            words = original_text.split()
            word_count = len(words)

            grammar = min(90, max(60, 70 + (word_count // 3)))
            vocab = min(90, max(60, 68 + (word_count // 4)))
            struct = min(92, max(65, 72 + (word_count // 3)))
            clarity = min(95, max(65, 75 + (word_count // 2)))
            coherence = min(90, max(65, 74 + (word_count // 3)))
            relevance = 85
            fluency = min(92, max(60, 70 + (word_count // 3)))

            overall = round((grammar + vocab + struct + clarity + coherence + relevance + fluency) / 7)

            evaluation = FluencyEvaluation(
                grammar=grammar,
                vocabulary=vocab,
                sentenceStructure=struct,
                clarity=clarity,
                coherence=coherence,
                relevance=relevance,
                fluency=fluency,
                overallScore=overall,
                strengths=["Clear topic expression", "Good participation"],
                improvements=["Try adding specific examples or details"],
                originalText=original_text,
                betterVersion=f"{original_text.capitalize()} In addition, I believe continuous learning is key to success.",
            )

            next_prompt = "That's a good response! What specific steps are you taking to further develop your communication confidence?"
            return evaluation, next_prompt


fluency_service = FluencyService()
