import logging
import time
from typing import List, Dict, Optional
from app.core.config import settings
from app.services.prompts.communication_prompts import build_system_prompt

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.models = [
            m for m in [
                getattr(settings, "GROQ_MODEL_PRIMARY", "llama3-70b-8192"),
                getattr(settings, "GROQ_MODEL_FALLBACK_1", "llama3-8b-8192"),
                getattr(settings, "GROQ_MODEL_FALLBACK_2", "mixtral-8x7b-32768"),
                getattr(settings, "GROQ_MODEL_FALLBACK_3", "gemma-7b-it")
            ] if m
        ]
        self.cooldowns: Dict[str, float] = {}
        self.cooldown_period = 60.0  # 1 minute cooldown for rate-limited models

    def _get_ordered_models(self) -> List[str]:
        now = time.time()
        available = []
        for model in self.models:
            if now > self.cooldowns.get(model, 0):
                available.append(model)
        
        # Fallback if all are in cooldown: just return all models to try again
        return available if available else self.models

    def _mark_cooldown(self, model: str):
        self.cooldowns[model] = time.time() + self.cooldown_period
        
    def _is_retryable_error(self, e: Exception) -> bool:
        try:
            import groq
            if isinstance(e, groq.RateLimitError) or isinstance(e, groq.InternalServerError) or isinstance(e, groq.APIConnectionError):
                return True
            if isinstance(e, groq.APIStatusError) and getattr(e, "status_code", 400) in [429, 500, 502, 503, 504]:
                return True
        except ImportError:
            pass
        return False

    async def generate_communication_response(
        self,
        message: str,
        mode: str = "general",
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Generate AI communication response using Groq API with automatic model failover.
        (Kept method name generate_communication_response for compatibility)
        """
        system_prompt = build_system_prompt(mode)

        if not self.api_key or self.api_key == "your_groq_api_key_here":
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
            
            models_to_try = self._get_ordered_models()
            last_error = None
            
            for i, model_name in enumerate(models_to_try):
                try:
                    chat_completion = client.chat.completions.create(
                        messages=messages,
                        model=model_name,
                    )
                    
                    if chat_completion.choices and chat_completion.choices[0].message:
                        if i > 0:
                            logger.info(f"[GeminiService] AI request: Model {model_name} (Fallback {i}) Result: SUCCESS")
                        return chat_completion.choices[0].message.content.strip()
                        
                    raise ValueError("Empty response from AI")
                    
                except Exception as e:
                    last_error = e
                    if self._is_retryable_error(e):
                        logger.warning(f"[GeminiService] AI request: Model {model_name} Result: {e.__class__.__name__} Action: FALLBACK")
                        self._mark_cooldown(model_name)
                        continue
                    else:
                        # Non-retryable error (e.g. invalid key, bad request)
                        logger.error(f"[GeminiService] AI request: Model {model_name} Result: {e.__class__.__name__} Action: ABORT (Non-retryable)")
                        raise e
            
            # Exhausted all models
            logger.error("[GeminiService] AI request failed: All configured AI models are temporarily unavailable.")
            raise ValueError("AI_PROVIDER_UNAVAILABLE: All configured AI models are temporarily unavailable.")

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"[GeminiService] Unexpected error: {e}")
            raise ValueError("AI service temporarily unavailable.")

    async def generate_json_response(
        self,
        system_instruction: str,
        message: str
    ) -> str:
        """
        Generate structured JSON response using Groq API with automatic model failover.
        """
        if not self.api_key or self.api_key == "your_groq_api_key_here":
            logger.warning("[GeminiService] GROQ_API_KEY is not configured. Failing JSON generation.")
            raise ValueError("AI service not configured. Please configure the backend AI provider credentials.")

        try:
            from groq import Groq
            client = Groq(api_key=self.api_key)
            
            safe_system_instruction = system_instruction
            if "json" not in safe_system_instruction.lower():
                safe_system_instruction += "\nOutput in JSON format."

            messages = [
                {"role": "system", "content": safe_system_instruction},
                {"role": "user", "content": message}
            ]
            
            models_to_try = self._get_ordered_models()
            last_error = None
            
            for i, model_name in enumerate(models_to_try):
                try:
                    chat_completion = client.chat.completions.create(
                        messages=messages,
                        model=model_name,
                        response_format={"type": "json_object"}
                    )

                    if chat_completion.choices and chat_completion.choices[0].message:
                        if i > 0:
                            logger.info(f"[GeminiService] AI request JSON: Model {model_name} (Fallback {i}) Result: SUCCESS")
                        return chat_completion.choices[0].message.content.strip()
                    
                    raise ValueError("Empty JSON response from AI")
                
                except Exception as e:
                    last_error = e
                    if self._is_retryable_error(e):
                        logger.warning(f"[GeminiService] AI request JSON: Model {model_name} Result: {e.__class__.__name__} Action: FALLBACK")
                        self._mark_cooldown(model_name)
                        continue
                    else:
                        logger.error(f"[GeminiService] AI request JSON: Model {model_name} Result: {e.__class__.__name__} Action: ABORT (Non-retryable)")
                        raise e
            
            logger.error("[GeminiService] AI JSON request failed: All configured AI models are temporarily unavailable.")
            raise ValueError("AI_PROVIDER_UNAVAILABLE: All configured AI models are temporarily unavailable.")

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"[GeminiService] Unexpected error for JSON: {e}")
            raise e

gemini_service = GeminiService()


