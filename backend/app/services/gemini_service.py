import logging
from typing import List, Dict, Optional
from app.core.config import settings
from app.services.prompts.communication_prompts import build_system_prompt

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-1.5-flash"

    async def generate_communication_response(
        self,
        message: str,
        mode: str = "general",
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Generate AI communication response using Google Gemini API or intelligent interactive fallback.
        """
        system_prompt = build_system_prompt(mode)

        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            logger.warning("[GeminiService] GEMINI_API_KEY is not configured. Returning fallback AI response.")
            return self._generate_fallback_response(message, mode)

        try:
            import google.generativeai as genai

            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_prompt,
            )

            # Build Gemini chat history
            formatted_history = []
            if history:
                for item in history:
                    role = "user" if item.get("role") in ["student", "user"] else "model"
                    content = item.get("content", "").strip()
                    if content:
                        formatted_history.append({"role": role, "parts": [content]})

            chat = model.start_chat(history=formatted_history)
            response = chat.send_message(message)

            if response and response.text:
                return response.text.strip()
            
            return self._generate_fallback_response(message, mode)

        except Exception as e:
            logger.error(f"[GeminiService] Error calling Gemini API: {e}")
            # Fallback gracefully rather than crashing
            return self._generate_fallback_response(message, mode)

    async def generate_json_response(
        self,
        system_instruction: str,
        message: str
    ) -> str:
        """
        Generate structured JSON response using Google Gemini API.
        """
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            logger.warning("[GeminiService] GEMINI_API_KEY is not configured. Failing JSON generation.")
            raise ValueError("Gemini API Key missing")

        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            
            # Using generation_config to enforce JSON
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_instruction,
                generation_config={"response_mime_type": "application/json"}
            )

            response = model.generate_content(message)

            if response and response.text:
                return response.text.strip()
            
            raise ValueError("Empty JSON response from Gemini")

        except Exception as e:
            logger.error(f"[GeminiService] Error calling Gemini API for JSON: {e}")
            raise e

    def _generate_fallback_response(self, message: str, mode: str) -> str:
        """
        Interactive fallback response for placement communication practice
        when Gemini API key is unconfigured or unavailable.
        """
        msg_lower = message.lower().strip()

        if "hello" in msg_lower or "hi" in msg_lower or "hey" in msg_lower:
            return (
                "Hello! Welcome to the ARENA AI Communication Practice Session. "
                "I'm here to help you build speaking confidence and placement readiness. "
                "To get started, tell me briefly about yourself and your career goals!"
            )
        elif "tell me about yourself" in msg_lower or "introduce" in msg_lower:
            return (
                "That's a classic interview question! When answering 'Tell me about yourself', "
                "focus on your academic background, core technical skills, and key projects. "
                "How would you summarize your top project in two sentences?"
            )
        elif "project" in msg_lower or "built" in msg_lower:
            return (
                "That sounds like a great project! Clearly articulating your technical contribution is crucial. "
                "What was the biggest technical challenge you faced while building it, and how did you solve it?"
            )

        return (
            f"Thank you for sharing that! Your response demonstrates good clarity. "
            f"In a competitive interview, structuring your thoughts clearly helps interviewers follow your logic. "
            f"What specific skills or topics would you like to practice next in your communication journey?"
        )


gemini_service = GeminiService()
