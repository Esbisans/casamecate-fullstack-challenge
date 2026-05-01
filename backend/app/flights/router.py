from fastapi import APIRouter

from app.core.dependencies import SessionDep
from app.flights import service
from app.flights.schemas import (
    AirlineFlightsPerDay,
    AirlineStats,
    AirportStats,
    DayStats,
)
from app.flights.service import FLIGHTS_PER_DAY_THRESHOLD

router = APIRouter(prefix="/flights", tags=["flights"])


@router.get("/airports/top", response_model=list[AirportStats])
async def top_airports(session: SessionDep, year: int | None = None):
    rows = await service.top_airports_by_movement(session, year)
    return [AirportStats(name=name, total_flights=total) for name, total in rows]


@router.get("/airlines/top", response_model=list[AirlineStats])
async def top_airlines(session: SessionDep, year: int | None = None):
    rows = await service.top_airlines_by_flights(session, year)
    return [AirlineStats(name=name, total_flights=total) for name, total in rows]


@router.get("/days/top", response_model=list[DayStats])
async def top_days(session: SessionDep, year: int | None = None):
    rows = await service.top_days(session, year)
    return [DayStats(date=d, total_flights=total) for d, total in rows]


@router.get("/airlines/flights-per-day", response_model=list[AirlineFlightsPerDay])
async def airlines_flights_per_day(
    session: SessionDep,
    year: int | None = None,
    more_than: int = FLIGHTS_PER_DAY_THRESHOLD,
):
    rows = await service.airlines_flights_per_day(session, year, more_than)
    return [
        AirlineFlightsPerDay(airline=name, date=d, total_flights=total)
        for name, d, total in rows
    ]
