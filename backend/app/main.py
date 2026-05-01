from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from sqlalchemy import text

from app.core.config import get_settings
from app.core.database import engine
from app.core.dependencies import SessionDep
from app.flights.router import router as flights_router
from app.stackoverflow import service as so_service
from app.stackoverflow.client import StackOverflowClient
from app.stackoverflow.router import router as stackoverflow_router

settings = get_settings()


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}" if route.tags else route.name


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with httpx.AsyncClient(
        timeout=10.0,
        headers={"User-Agent": "casa-mecate-backend/0.1"},
    ) as http_client:
        app.state.so_client = StackOverflowClient(
            http_client=http_client,
            api_url=str(settings.stackoverflow.api_url),
        )
        await so_service.print_summary(app.state.so_client)
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
app.include_router(stackoverflow_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
async def health_db(session: SessionDep):
    await session.execute(text("SELECT 1"))
    return {"status": "ok", "database": "reachable"}
