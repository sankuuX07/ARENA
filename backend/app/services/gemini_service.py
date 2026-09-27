import logging
import time
from typing import List, Dict, Optional
from app.core.config import settings
from app.services.prompts.communication_prompts import build_system_prompt

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Centralized AI gateway — powered by OpenRouter.
    All existing ARENA modules call generate_communication_response
    and generate_json_response unchanged.
    """

    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_API_BASE_URL
        self.model = settings.OPENROUTER_MODEL

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _is_retryable_error(self, e: Exception) -> bool:
        """
        Returns True only for temporary provider failures:
        rate-limit (429) or server errors (500/502/503/504).
        Auth errors (401/403) and bad-request (400) are NOT retried.
        """
        try:
            from openai import RateLimitError, APIStatusError, APIConnectionError, APITimeoutError
            if isinstance(e, (RateLimitError, APIConnectionError, APITimeoutError)):
                return True
            if isinstance(e, APIStatusError):
                return getattr(e, "status_code", 400) in (429, 500, 502, 503, 504)
        except ImportError:
            pass
        return False

    def _get_client(self):
        """Build an OpenAI-compatible client pointed at OpenRouter's endpoint."""
        try:
            from openai import OpenAI
        except ImportError:
            raise ImportError(
                "The 'openai' package is required for OpenRouter integration. "
                "Run: pip install openai"
            )
        return OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
            default_headers={
                "HTTP-Referer": "https://arena.app",
                "X-Title": "ARENA",
            },
        )

    def _check_api_key(self, context: str = ""):
        if not self.api_key or self.api_key in ("", "your_openrouter_api_key_here"):
            logger.warning(f"[OpenRouterService{context}] OPENROUTER_API_KEY is not configured.")
            raise ValueError(
                "AI service not configured. Please set OPENROUTER_API_KEY in the backend .env file."
            )

    # ------------------------------------------------------------------
    # Public API — interface unchanged
    # ------------------------------------------------------------------

    async def generate_communication_response(
        self,
        message: str,
        mode: str = "general",
        history: Optional[List[Dict[str, str]]] = None,
        system_prompt_override: Optional[str] = None,
    ) -> str:
        """
        Generate an AI communication response via OpenRouter.
        Retries on rate-limit / server errors; aborts on auth / bad-request errors.
        """
        self._check_api_key(" generate_communication_response")
        system_prompt = system_prompt_override if system_prompt_override else build_system_prompt(mode)

        try:
            client = self._get_client()

            messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]
            if history:
                for item in history:
                    role = "user" if item.get("role") in ("student", "user") else "assistant"
                    content = item.get("content", "").strip()
                    if content:
                        messages.append({"role": role, "content": content})
            messages.append({"role": "user", "content": message})

            retries = 0
            max_retries = 2
            while retries <= max_retries:
                try:
                    completion = client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                    )
                    if completion.choices and completion.choices[0].message:
                        return completion.choices[0].message.content.strip()
                    raise ValueError("Empty response from OpenRouter")

                except Exception as e:
                    if self._is_retryable_error(e) and retries < max_retries:
                        retries += 1
                        wait = 2 ** retries
                        logger.warning(
                            f"[OpenRouterService] Retryable error ({e.__class__.__name__}), "
                            f"retry {retries}/{max_retries} in {wait}s"
                        )
                        time.sleep(wait)
                        continue
                    logger.error(
                        f"[OpenRouterService] generate_communication_response failed: "
                        f"{e.__class__.__name__}: {e}"
                    )
                    raise e

            raise ValueError("AI_PROVIDER_UNAVAILABLE: OpenRouter is temporarily unavailable.")

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"[OpenRouterService] Unexpected error: {e}")
            raise ValueError("AI service temporarily unavailable.")

    async def generate_json_response(
        self,
        system_instruction: str,
        message: str,
    ) -> str:
        """
        Generate a structured JSON response via OpenRouter.
        """
        self._check_api_key(" generate_json_response")

        try:
            client = self._get_client()

            safe_instruction = system_instruction
            if "json" not in safe_instruction.lower():
                safe_instruction += "\nOutput in JSON format."

            messages = [
                {"role": "system", "content": safe_instruction},
                {"role": "user", "content": message},
            ]

            retries = 0
            max_retries = 2
            while retries <= max_retries:
                try:
                    completion = client.chat.completions.create(
                        model=self.model,
                        messages=messages,
                        response_format={"type": "json_object"},
                    )
                    if completion.choices and completion.choices[0].message:
                        return completion.choices[0].message.content.strip()
                    raise ValueError("Empty JSON response from OpenRouter")

                except Exception as e:
                    if self._is_retryable_error(e) and retries < max_retries:
                        retries += 1
                        wait = 2 ** retries
                        logger.warning(
                            f"[OpenRouterService] JSON retryable error ({e.__class__.__name__}), "
                            f"retry {retries}/{max_retries} in {wait}s"
                        )
                        time.sleep(wait)
                        continue
                    logger.error(
                        f"[OpenRouterService] generate_json_response failed: "
                        f"{e.__class__.__name__}: {e}"
                    )
                    raise e

            raise ValueError("AI_PROVIDER_UNAVAILABLE: OpenRouter is temporarily unavailable.")

        except ValueError:
            raise
        except Exception as e:
            logger.error(f"[OpenRouterService] Unexpected JSON error: {e}")
            raise e


gemini_service = GeminiService()
