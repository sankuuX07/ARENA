import json
import logging
import re
import uuid
from datetime import datetime
from typing import List, Dict, Optional
from app.schemas.group_discussion import (
    GroupDiscussionStartRequest,
    GroupDiscussionStartResponse,
    GroupDiscussionResponseRequest,
    GroupDiscussionResponseResponse,
    GroupDiscussionEvaluation,
    GroupDiscussionSessionSummary,
    AIResponseData
)
from app.services.gemini_service import gemini_service
from app.services.prompts.group_discussion import (
    TOPIC_GENERATION_PROMPT,
    MODERATOR_INTRO_PROMPT,
    PARTICIPANT_RESPONSE_PROMPT,
    GD_EVALUATION_PROMPT
)

logger = logging.getLogger(__name__)

class GroupDiscussionService:
    async def start_session(self, request: GroupDiscussionStartRequest) -> GroupDiscussionStartResponse:
        session_id = f"gd_{uuid.uuid4().hex[:10]}"
        
        # 1. Generate topic
        topic_prompt = TOPIC_GENERATION_PROMPT.format(category=request.category, difficulty=request.difficulty)
        topic = await gemini_service.generate_communication_response(
            message=topic_prompt,
            mode="group_discussion"
        )
        if not topic or len(topic) < 5:
            topic = "Should artificial intelligence replace some human jobs?"
            
        topic = topic.replace('"', '').strip()

        # 2. Generate moderator intro
        mod_prompt = MODERATOR_INTRO_PROMPT.format(topic=topic)
        moderator_intro = await gemini_service.generate_communication_response(
            message=mod_prompt,
            mode="group_discussion"
        )
        
        if not moderator_intro:
            moderator_intro = f"Welcome everyone. Today's topic is: '{topic}'. Let's begin our discussion. Participant A, what are your initial thoughts?"

        return GroupDiscussionStartResponse(
            session_id=session_id,
            topic=topic,
            category=request.category,
            difficulty=request.difficulty,
            moderator_intro=moderator_intro
        )

    async def evaluate_turn(self, request: GroupDiscussionResponseRequest, topic: str) -> GroupDiscussionResponseResponse:
        # Generate AI participant responses
        conversation_history = "\n".join(
            [f"{msg.get('role', 'unknown')}: {msg.get('content', '')}" for msg in request.messages]
        )
        
        prompt = PARTICIPANT_RESPONSE_PROMPT.format(
            topic=topic,
            round_num=request.current_round,
            conversation_history=conversation_history,
            student_message=request.student_message
        )
        
        raw_response = await gemini_service.generate_communication_response(
            message=prompt,
            mode="group_discussion"
        )
        
        ai_responses = self._parse_participant_responses(raw_response)
        
        # Ensure fallback
        if not ai_responses:
            ai_responses = [AIResponseData(speaker="participant_A", content="That's an interesting point. I'd like to add that we should also consider the broader implications.")]
            
        is_complete = request.current_round >= 5
        
        return GroupDiscussionResponseResponse(
            session_id=request.session_id,
            round=request.current_round,
            ai_responses=ai_responses,
            is_complete=is_complete
        )
        
    async def complete_session(self, session_id: str, topic: str, category: str, difficulty: str, transcript_messages: List[Dict]) -> GroupDiscussionSessionSummary:
        # Full evaluation
        transcript = "\n".join(
            [f"{msg.get('role', 'unknown')}: {msg.get('content', '')}" for msg in transcript_messages]
        )
        
        eval_prompt = GD_EVALUATION_PROMPT.format(
            topic=topic,
            transcript=transcript
        )
        
        raw_eval = await gemini_service.generate_communication_response(
            message=eval_prompt,
            mode="group_discussion"
        )
        
        evaluation = self._parse_evaluation(raw_eval)
        
        return GroupDiscussionSessionSummary(
            session_id=session_id,
            category=category,
            difficulty=difficulty,
            topic=topic,
            evaluation=evaluation,
            completed_at=datetime.utcnow().isoformat() + "Z"
        )
        
    def _parse_participant_responses(self, raw_response: str) -> List[AIResponseData]:
        try:
            clean_json_str = raw_response
            if "```json" in raw_response:
                clean_json_str = raw_response.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_response:
                clean_json_str = raw_response.split("```")[1].split("```")[0].strip()
                
            data = json.loads(clean_json_str)
            responses = []
            for item in data:
                responses.append(AIResponseData(speaker=item["speaker"], content=item["content"]))
            return responses
        except Exception as e:
            logger.warning(f"Failed to parse participant responses JSON: {e}")
            return []
            
    def _parse_evaluation(self, raw_eval: str) -> GroupDiscussionEvaluation:
        try:
            clean_json_str = raw_eval
            if "```json" in raw_eval:
                clean_json_str = raw_eval.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_eval:
                clean_json_str = raw_eval.split("```")[1].split("```")[0].strip()
                
            data = json.loads(clean_json_str)
            return GroupDiscussionEvaluation(**data)
        except Exception as e:
            logger.warning(f"Failed to parse evaluation JSON: {e}. Returning fallback.")
            return GroupDiscussionEvaluation(
                communication=75, clarity=75, grammar=75, vocabulary=75, relevance=75,
                confidence=75, participation=75, leadership=75, teamwork=75,
                respectfulness=75, argumentQuality=75, responsiveness=75,
                adaptability=75, timeManagement=75, overallScore=75,
                strengths=["Participated in discussion"],
                improvements=["Could be more active"],
                improved_responses=[]
            )

group_discussion_service = GroupDiscussionService()
