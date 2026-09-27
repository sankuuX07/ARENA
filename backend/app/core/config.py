import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ARENA Backend"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    
    # Groq AI Configuration
    GROQ_API_KEY: str = ""
    GROQ_MODEL_PRIMARY: str = "llama3-70b-8192"
    GROQ_MODEL_FALLBACK_1: str = "llama3-8b-8192"
    GROQ_MODEL_FALLBACK_2: str = "mixtral-8x7b-32768"
    GROQ_MODEL_FALLBACK_3: str = "gemma-7b-it"

    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
