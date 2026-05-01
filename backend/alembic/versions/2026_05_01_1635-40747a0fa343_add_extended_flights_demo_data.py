"""add extended flights demo data

Revision ID: 40747a0fa343
Revises: 091312a4356e
Create Date: 2026-05-01 16:35:27.899950

Demo data layered on top of the spec sample (untouched in revision
091312a4356e). Adds ~120 rows across 2021-2023 with skewed weights so
charts and the per-day threshold filter show meaningful variation.
"""
import random
from datetime import date
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '40747a0fa343'
down_revision: Union[str, Sequence[str], None] = '091312a4356e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


vuelos = sa.table(
    "vuelos",
    sa.column("id_aerolinea", sa.Integer),
    sa.column("id_aeropuerto", sa.Integer),
    sa.column("id_movimiento", sa.Integer),
    sa.column("dia", sa.Date),
)


AIRLINE_WEIGHTS = {1: 35, 4: 30, 3: 20, 2: 15}
AIRPORT_WEIGHTS = {1: 45, 2: 20, 3: 20, 4: 15}

YEAR_VOLUMES = [(2021, 30), (2022, 35), (2023, 35)]

PEAK_DAYS = [
    (date(2022, 7, 15), 1, 6),
    (date(2022, 12, 22), 4, 5),
    (date(2023, 4, 10), 1, 8),
    (date(2023, 9, 16), 1, 3),
    (date(2023, 9, 16), 2, 3),
    (date(2023, 9, 16), 3, 3),
    (date(2023, 9, 16), 4, 3),
]

SPEC_FLIGHTS_COUNT = 9


def _pick(rng: random.Random, weights: dict[int, int]) -> int:
    return rng.choices(list(weights), weights=list(weights.values()))[0]


def upgrade() -> None:
    rng = random.Random(42)
    rows: list[dict] = []

    for year, count in YEAR_VOLUMES:
        for _ in range(count):
            rows.append({
                "id_aerolinea": _pick(rng, AIRLINE_WEIGHTS),
                "id_aeropuerto": _pick(rng, AIRPORT_WEIGHTS),
                "id_movimiento": rng.choice([1, 2]),
                "dia": date(year, rng.randint(1, 12), rng.randint(1, 28)),
            })

    for day, airline_id, count in PEAK_DAYS:
        for _ in range(count):
            rows.append({
                "id_aerolinea": airline_id,
                "id_aeropuerto": _pick(rng, AIRPORT_WEIGHTS),
                "id_movimiento": rng.choice([1, 2]),
                "dia": day,
            })

    op.bulk_insert(vuelos, rows)


def downgrade() -> None:
    op.execute(f"DELETE FROM vuelos WHERE id_vuelo > {SPEC_FLIGHTS_COUNT}")
