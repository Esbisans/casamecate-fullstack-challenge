from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import engine
from app.core.dependencies import SessionDep
from app.flights.router import router as flights_router

settings = get_settings()


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}" if route.tags else route.name


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.app.name,
    description="Backend API for Casa Mecate fullstack challenge",
    version="0.1.0",
    lifespan=lifespan,
    generate_unique_id_function=custom_generate_unique_id,
)

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
