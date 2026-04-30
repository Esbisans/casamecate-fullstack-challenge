from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import engine, get_session

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(title=settings.app.name, lifespan=lifespan)


SessionDep = Annotated[AsyncSession, Depends(get_session)]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
async def health_db(session: SessionDep):
    await session.execute(text("SELECT 1"))
    return {"status": "ok", "database": "reachable"}
