import logging
import time
import json
import urllib.request
import urllib.error
from typing import List, Dict, Optional
from app.core.config import settings
from app.services.prompts.communication_prompts import build_system_prompt

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Centralized AI gateway — powered by local Ollama (llama3.1).
    All existing ARENA modules call generate_communication_response
    and generate_json_response unchanged.
    """

    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        self.model = settings.OLLAMA_MODEL
        self.timeout = 120  # local model can be slow on first token

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _check_ollama(self):
        """Verify Ollama service is reachable before making a request."""
        try:
            req = urllib.request.Request(f"{self.base_url}/api/tags")
            with urllib.request.urlopen(req, timeout=5):
                pass
        except Exception as e:
            logger.error(f"[OllamaService] Service unreachable at {self.base_url}: {e}")
            raise ValueError(
                f"OLLAMA_UNAVAILABLE: Cannot reach Ollama at {self.base_url}. "
                "Please ensure Ollama is running locally."
            )

    def _chat(self, messages: List[Dict[str, str]]) -> str:
        """
        POST to Ollama /api/chat (OpenAI-compatible messages format).
        Uses stream=False for simplest response handling.
        """
        payload = json.dumps({
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 512,
            }
        }).encode("utf-8")

        req = urllib.request.Request(
            f"{self.base_url}/api/chat",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                raw = resp.read().decode("utf-8")
                data = json.loads(raw)
                content = data.get("message", {}).get("content", "").strip()
                if content:
                    return content
                raise ValueError("Empty response from Ollama")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            logger.error(f"[OllamaService] HTTP {e.code}: {body}")
            if e.code == 404:
                raise ValueError(
                    f"OLLAMA_MODEL_NOT_FOUND: Model '{self.model}' is not installed. "
                    f"Run: ollama pull {self.model}"
                )
            raise ValueError(f"OLLAMA_ERROR: HTTP {e.code} — {body[:200]}")
        except urllib.error.URLError as e:
            logger.error(f"[OllamaService] Connection error: {e}")
            raise ValueError(
                f"OLLAMA_UNAVAILABLE: Cannot reach Ollama at {self.base_url}. "
                "Please ensure Ollama is running locally."
            )
        except TimeoutError:
            logger.error(f"[OllamaService] Request timed out after {self.timeout}s")
            raise ValueError("OLLAMA_TIMEOUT: Ollama request timed out.")

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
        Generate an AI communication response via local Ollama.
        """
        self._check_ollama()
        system_prompt = system_prompt_override if system_prompt_override else build_system_prompt(mode)

        messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]
        if history:
            for item in history:
                role = "user" if item.get("role") in ("student", "user") else "assistant"
                content = item.get("content", "").strip()
                if content:
                    messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": message})

        try:
            return self._chat(messages)
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"[OllamaService] generate_communication_response unexpected error: {e}")
            raise ValueError("AI service temporarily unavailable.")

    async def generate_json_response(
        self,
        system_instruction: str,
        message: str,
    ) -> str:
        """
        Generate a structured JSON response via local Ollama.
        """
        self._check_ollama()

        safe_instruction = system_instruction
        if "json" not in safe_instruction.lower():
            safe_instruction += "\nRespond ONLY with valid JSON. No explanations outside the JSON block."

        messages = [
            {"role": "system", "content": safe_instruction},
            {"role": "user", "content": message},
        ]

        try:
            return self._chat(messages)
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"[OllamaService] generate_json_response unexpected error: {e}")
            raise e


gemini_service = GeminiService()
