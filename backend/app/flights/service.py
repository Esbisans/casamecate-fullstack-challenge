import datetime

from sqlalchemy import ColumnElement, Select, extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.flights.models import Airline, Airport, Flight

FLIGHTS_PER_DAY_THRESHOLD = 2


def _year_filter(year: int | None) -> tuple[ColumnElement[bool], ...]:
    """Build a year-filter tuple to unpack into where(*_year_filter(year))."""
    return (extract("year", Flight.date) == year,) if year is not None else ()


def _apply_limit(stmt: Select, limit: int) -> Select:
    """Apply a LIMIT clause unless limit=0 (caller wants the full ranking)."""
    return stmt.limit(limit) if limit > 0 else stmt


async def top_airports_by_movement(
    session: AsyncSession, year: int | None = None, limit: int = 1
) -> list[tuple[str, int]]:
    """Return airports ranked by flight count (descending), optionally filtered by year."""
    stmt = (
        select(Airport.name, func.count(Flight.id).label("total"))
        .join(Flight, Flight.airport_id == Airport.id)
        .where(*_year_filter(year))
        .group_by(Airport.id, Airport.name)
        .order_by(func.count(Flight.id).desc(), Airport.name)
    )
    result = await session.execute(_apply_limit(stmt, limit))
    return result.all()


async def top_airlines_by_flights(
    session: AsyncSession, year: int | None = None, limit: int = 1
) -> list[tuple[str, int]]:
    """Return airlines ranked by flight count (descending), optionally filtered by year."""
    stmt = (
        select(Airline.name, func.count(Flight.id).label("total"))
        .join(Flight, Flight.airline_id == Airline.id)
        .where(*_year_filter(year))
        .group_by(Airline.id, Airline.name)
        .order_by(func.count(Flight.id).desc(), Airline.name)
    )
    result = await session.execute(_apply_limit(stmt, limit))
    return result.all()


async def top_days(
    session: AsyncSession, year: int | None = None, limit: int = 1
) -> list[tuple[datetime.date, int]]:
    """Return days ranked by flight count (descending), optionally filtered by year."""
    stmt = (
        select(Flight.date, func.count(Flight.id).label("total"))
        .where(*_year_filter(year))
        .group_by(Flight.date)
        .order_by(func.count(Flight.id).desc(), Flight.date)
    )
    result = await session.execute(_apply_limit(stmt, limit))
    return result.all()


async def airlines_flights_per_day(
    session: AsyncSession,
    year: int | None = None,
    more_than: int = FLIGHTS_PER_DAY_THRESHOLD,
) -> list[tuple[str, datetime.date, int]]:
    """Return (airline, date, count) where the airline had more than N flights on that date."""
    stmt = (
        select(Airline.name, Flight.date, func.count(Flight.id).label("total"))
        .join(Flight, Flight.airline_id == Airline.id)
        .where(*_year_filter(year))
        .group_by(Airline.id, Airline.name, Flight.date)
        .having(func.count(Flight.id) > more_than)
        .order_by(Airline.name, Flight.date)
    )
    result = await session.execute(stmt)
    return result.all()
