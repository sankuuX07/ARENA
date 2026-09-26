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
            logger.warning("[GeminiService] GEMINI_API_KEY is not configured.")
            raise ValueError("AI service not configured. Please configure the backend AI provider credentials.")

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
            raise ValueError("AI service temporarily unavailable.")

        except Exception as e:
            logger.error(f"[GeminiService] Error calling Gemini API: {e}")
            raise ValueError("AI service temporarily unavailable.")

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
            raise ValueError("AI service not configured. Please configure the backend AI provider credentials.")

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

gemini_service = GeminiService()


