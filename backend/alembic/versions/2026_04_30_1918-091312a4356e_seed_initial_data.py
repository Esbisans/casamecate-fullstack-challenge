"""seed initial data

Revision ID: 091312a4356e
Revises: 8d603b13adb3
Create Date: 2026-04-30 19:18:47.710526

"""
from datetime import date
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '091312a4356e'
down_revision: Union[str, Sequence[str], None] = '8d603b13adb3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Lightweight table constructs decoupled from app models — migrations must not
# import ORM classes (they may be renamed/removed and break old migrations).
aerolineas = sa.table(
    "aerolineas",
    sa.column("id_aerolinea", sa.Integer),
    sa.column("nombre_aerolinea", sa.String),
)
aeropuertos = sa.table(
    "aeropuertos",
    sa.column("id_aeropuerto", sa.Integer),
    sa.column("nombre_aeropuerto", sa.String),
)
movimientos = sa.table(
    "movimientos",
    sa.column("id_movimiento", sa.Integer),
    sa.column(
        "descripcion",
        sa.Enum("Salida", "Llegada", name="tipo_movimiento", create_type=False),
    ),
)
vuelos = sa.table(
    "vuelos",
    sa.column("id_aerolinea", sa.Integer),
    sa.column("id_aeropuerto", sa.Integer),
    sa.column("id_movimiento", sa.Integer),
    sa.column("dia", sa.Date),
)


def upgrade() -> None:
    """Upgrade schema."""
    op.bulk_insert(
        aerolineas,
        [
            {"id_aerolinea": 1, "nombre_aerolinea": "Volaris"},
            {"id_aerolinea": 2, "nombre_aerolinea": "Aeromar"},
            {"id_aerolinea": 3, "nombre_aerolinea": "Interjet"},
            {"id_aerolinea": 4, "nombre_aerolinea": "Aeromexico"},
        ],
    )
    op.bulk_insert(
        aeropuertos,
        [
            {"id_aeropuerto": 1, "nombre_aeropuerto": "Benito Juarez"},
            {"id_aeropuerto": 2, "nombre_aeropuerto": "Guanajuato"},
            {"id_aeropuerto": 3, "nombre_aeropuerto": "La paz"},
            {"id_aeropuerto": 4, "nombre_aeropuerto": "Oaxaca"},
        ],
    )
    op.bulk_insert(
        movimientos,
        [
            {"id_movimiento": 1, "descripcion": "Salida"},
            {"id_movimiento": 2, "descripcion": "Llegada"},
        ],
    )
    op.bulk_insert(
        vuelos,
        [
            {"id_aerolinea": 1, "id_aeropuerto": 1, "id_movimiento": 1, "dia": date(2021, 5, 2)},
            {"id_aerolinea": 2, "id_aeropuerto": 1, "id_movimiento": 1, "dia": date(2021, 5, 2)},
            {"id_aerolinea": 3, "id_aeropuerto": 2, "id_movimiento": 2, "dia": date(2021, 5, 2)},
            {"id_aerolinea": 4, "id_aeropuerto": 3, "id_movimiento": 2, "dia": date(2021, 5, 2)},
            {"id_aerolinea": 1, "id_aeropuerto": 3, "id_movimiento": 2, "dia": date(2021, 5, 2)},
            {"id_aerolinea": 2, "id_aeropuerto": 1, "id_movimiento": 1, "dia": date(2021, 5, 2)},
            {"id_aerolinea": 2, "id_aeropuerto": 3, "id_movimiento": 1, "dia": date(2021, 5, 4)},
            {"id_aerolinea": 3, "id_aeropuerto": 4, "id_movimiento": 1, "dia": date(2021, 5, 4)},
            {"id_aerolinea": 3, "id_aeropuerto": 4, "id_movimiento": 1, "dia": date(2021, 5, 4)},
        ],
    )

    # Sync sequences to MAX(id): we inserted with explicit IDs, so the
    # auto-increment counter is still at 1 and would collide on next insert.
    op.execute("SELECT setval('aerolineas_id_aerolinea_seq', (SELECT MAX(id_aerolinea) FROM aerolineas))")
    op.execute("SELECT setval('aeropuertos_id_aeropuerto_seq', (SELECT MAX(id_aeropuerto) FROM aeropuertos))")
    op.execute("SELECT setval('movimientos_id_movimiento_seq', (SELECT MAX(id_movimiento) FROM movimientos))")


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DELETE FROM vuelos")
    op.execute("DELETE FROM movimientos")
    op.execute("DELETE FROM aeropuertos")
    op.execute("DELETE FROM aerolineas")
    op.execute("ALTER SEQUENCE aerolineas_id_aerolinea_seq RESTART WITH 1")
    op.execute("ALTER SEQUENCE aeropuertos_id_aeropuerto_seq RESTART WITH 1")
    op.execute("ALTER SEQUENCE movimientos_id_movimiento_seq RESTART WITH 1")
    op.execute("ALTER SEQUENCE vuelos_id_vuelo_seq RESTART WITH 1")
