import logging
from typing import List, Dict, Optional
from app.core.config import settings
from app.services.prompts.communication_prompts import build_system_prompt

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model_name = settings.GROQ_MODEL or "llama3-70b-8192"

    async def generate_communication_response(
        self,
        message: str,
        mode: str = "general",
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Generate AI communication response using Groq API or intelligent interactive fallback.
        (Kept method name generate_communication_response for compatibility)
        """
        system_prompt = build_system_prompt(mode)

        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            logger.warning("[GeminiService] GROQ_API_KEY is not configured.")
            raise ValueError("AI service not configured. Please configure the backend AI provider credentials.")

        try:
            from groq import Groq
            client = Groq(api_key=self.api_key)

            messages = [{"role": "system", "content": system_prompt}]
            
            if history:
                for item in history:
                    role = "user" if item.get("role") in ["student", "user"] else "assistant"
                    content = item.get("content", "").strip()
                    if content:
                        messages.append({"role": role, "content": content})
            
            messages.append({"role": "user", "content": message})

            chat_completion = client.chat.completions.create(
                messages=messages,
                model=self.model_name,
            )

            if chat_completion.choices and chat_completion.choices[0].message:
                return chat_completion.choices[0].message.content.strip()
            
            raise ValueError("AI service temporarily unavailable.")

        except Exception as e:
            logger.error(f"[GeminiService] Error calling Groq API: {e}")
            raise ValueError("AI service temporarily unavailable.")

    async def generate_json_response(
        self,
        system_instruction: str,
        message: str
    ) -> str:
        """
        Generate structured JSON response using Groq API.
        """
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            logger.warning("[GeminiService] GROQ_API_KEY is not configured. Failing JSON generation.")
            raise ValueError("AI service not configured. Please configure the backend AI provider credentials.")

        try:
            from groq import Groq
            client = Groq(api_key=self.api_key)
            
            # Ensure the word json is in the prompt for Groq JSON mode
            safe_system_instruction = system_instruction
            if "json" not in safe_system_instruction.lower():
                safe_system_instruction += "\nOutput in JSON format."

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": safe_system_instruction},
                    {"role": "user", "content": message}
                ],
                model=self.model_name,
                response_format={"type": "json_object"}
            )

            if chat_completion.choices and chat_completion.choices[0].message:
                return chat_completion.choices[0].message.content.strip()
            
            raise ValueError("Empty JSON response from Groq")

        except Exception as e:
            logger.error(f"[GeminiService] Error calling Groq API for JSON: {e}")
            raise e

gemini_service = GeminiService()


