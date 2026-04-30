from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class AppConfig(BaseModel):
    name: str = "Casa Mecate API"


class DatabaseConfig(BaseModel):
    url: PostgresDsn


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        env_nested_delimiter="__",
        env_ignore_empty=True,
        validate_default=True,
        extra="ignore",
    )

    app: AppConfig = AppConfig()
    database: DatabaseConfig


@lru_cache
def get_settings() -> Settings:
    return Settings()
