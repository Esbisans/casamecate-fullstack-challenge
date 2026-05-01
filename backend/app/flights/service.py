import datetime

from sqlalchemy import ColumnElement, extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.flights.models import Airline, Airport, Flight

FLIGHTS_PER_DAY_THRESHOLD = 2


def _year_filter(year: int | None) -> tuple[ColumnElement[bool], ...]:
    """Build a year-filter tuple to unpack into where(*_year_filter(year))."""
    return (extract("year", Flight.date) == year,) if year is not None else ()


async def top_airports_by_movement(
    session: AsyncSession, year: int | None = None
) -> list[tuple[str, int]]:
    """Return airports tied for the highest flight count, optionally filtered by year."""
    max_count = (
        select(func.count(Flight.id))
        .where(*_year_filter(year))
        .group_by(Flight.airport_id)
        .order_by(func.count(Flight.id).desc())
        .limit(1)
        .scalar_subquery()
    )

    stmt = (
        select(Airport.name, func.count(Flight.id).label("total"))
        .join(Flight, Flight.airport_id == Airport.id)
        .where(*_year_filter(year))
        .group_by(Airport.id, Airport.name)
        .having(func.count(Flight.id) == max_count)
        .order_by(Airport.name)
    )
    result = await session.execute(stmt)
    return result.all()


async def top_airlines_by_flights(
    session: AsyncSession, year: int | None = None
) -> list[tuple[str, int]]:
    """Return airlines tied for the highest flight count, optionally filtered by year."""
    max_count = (
        select(func.count(Flight.id))
        .where(*_year_filter(year))
        .group_by(Flight.airline_id)
        .order_by(func.count(Flight.id).desc())
        .limit(1)
        .scalar_subquery()
    )

    stmt = (
        select(Airline.name, func.count(Flight.id).label("total"))
        .join(Flight, Flight.airline_id == Airline.id)
        .where(*_year_filter(year))
        .group_by(Airline.id, Airline.name)
        .having(func.count(Flight.id) == max_count)
        .order_by(Airline.name)
    )
    result = await session.execute(stmt)
    return result.all()


async def top_days(
    session: AsyncSession, year: int | None = None
) -> list[tuple[datetime.date, int]]:
    """Return days tied for the highest flight count, optionally filtered by year."""
    max_count = (
        select(func.count(Flight.id))
        .where(*_year_filter(year))
        .group_by(Flight.date)
        .order_by(func.count(Flight.id).desc())
        .limit(1)
        .scalar_subquery()
    )

    stmt = (
        select(Flight.date, func.count(Flight.id).label("total"))
        .where(*_year_filter(year))
        .group_by(Flight.date)
        .having(func.count(Flight.id) == max_count)
        .order_by(Flight.date)
    )
    result = await session.execute(stmt)
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
