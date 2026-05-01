from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import engine
from app.core.dependencies import SessionDep
from app.flights.router import router as flights_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(title=settings.app.name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(flights_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
async def health_db(session: SessionDep):
    await session.execute(text("SELECT 1"))
    return {"status": "ok", "database": "reachable"}
