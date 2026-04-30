from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class AppConfig(BaseModel):
    name: str = "Casa Mecate API"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__",
        env_ignore_empty=True,
        validate_default=True,
        extra="forbid",
    )

    app: AppConfig = AppConfig()


@lru_cache
def get_settings() -> Settings:
    return Settings()
