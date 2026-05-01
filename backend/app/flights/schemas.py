import datetime

from pydantic import BaseModel


class AirportStats(BaseModel):
    name: str
    total_flights: int


class AirlineStats(BaseModel):
    name: str
    total_flights: int


class DayStats(BaseModel):
    date: datetime.date
    total_flights: int


class AirlineFlightsPerDay(BaseModel):
    airline: str
    date: datetime.date
    total_flights: int
