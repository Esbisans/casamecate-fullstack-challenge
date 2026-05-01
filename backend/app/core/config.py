from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, HttpUrl, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent


class AppConfig(BaseModel):
    name: str = "Casa Mecate API"


class DatabaseConfig(BaseModel):
    url: PostgresDsn


class StackOverflowConfig(BaseModel):
    api_url: HttpUrl = HttpUrl(
        "https://api.stackexchange.com/2.2/search"
        "?order=desc&sort=activity&intitle=perl&site=stackoverflow"
    )


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
    stackoverflow: StackOverflowConfig = StackOverflowConfig()


@lru_cache
def get_settings() -> Settings:
    return Settings()
