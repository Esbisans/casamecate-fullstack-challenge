import datetime
import enum

from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.base import Base


class MovementType(str, enum.Enum):
    DEPARTURE = "Salida"
    ARRIVAL = "Llegada"


class Airline(Base):
    __tablename__ = "aerolineas"

    id: Mapped[int] = mapped_column("id_aerolinea", primary_key=True)
    name: Mapped[str] = mapped_column("nombre_aerolinea", String(100))

    flights: Mapped[list["Flight"]] = relationship(back_populates="airline")


class Airport(Base):
    __tablename__ = "aeropuertos"

    id: Mapped[int] = mapped_column("id_aeropuerto", primary_key=True)
    name: Mapped[str] = mapped_column("nombre_aeropuerto", String(100))

    flights: Mapped[list["Flight"]] = relationship(back_populates="airport")


class Movement(Base):
    __tablename__ = "movimientos"

    id: Mapped[int] = mapped_column("id_movimiento", primary_key=True)
    type: Mapped[MovementType] = mapped_column(
        "descripcion",
        Enum(
            MovementType,
            name="tipo_movimiento",
            values_callable=lambda e: [x.value for x in e],
        ),
        unique=True,
    )

    flights: Mapped[list["Flight"]] = relationship(back_populates="movement")


class Flight(Base):
    __tablename__ = "vuelos"

    id: Mapped[int] = mapped_column("id_vuelo", primary_key=True)
    airline_id: Mapped[int] = mapped_column(
        "id_aerolinea", ForeignKey("aerolineas.id_aerolinea")
    )
    airport_id: Mapped[int] = mapped_column(
        "id_aeropuerto", ForeignKey("aeropuertos.id_aeropuerto")
    )
    movement_id: Mapped[int] = mapped_column(
        "id_movimiento", ForeignKey("movimientos.id_movimiento")
    )
    date: Mapped[datetime.date] = mapped_column("dia")

    airline: Mapped["Airline"] = relationship(back_populates="flights")
    airport: Mapped["Airport"] = relationship(back_populates="flights")
    movement: Mapped["Movement"] = relationship(back_populates="flights")
