# Casa Mecate — Reto Técnico Fullstack

Backend en FastAPI + frontend en React que consume datos de vuelos
desde PostgreSQL y de la API pública de StackExchange.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Python 3.14 |
| Package manager | uv |
| Backend | FastAPI |
| ORM | SQLAlchemy 2 (async) |
| Migraciones | Alembic |
| Cliente HTTP | httpx |
| Base de datos | PostgreSQL 18 |
| Frontend | React · Next.js |
| Contenedores | Docker · Docker Compose |

## Cómo correr

Se requiere [Docker](https://docs.docker.com/get-docker/) y Docker Compose.

```bash
git clone https://github.com/Esbisans/casamecate-fullstack-challenge.git
cd casamecate-fullstack-challenge
docker compose up --build
```

Al levantar el stack se ejecutan en orden:

1. **PostgreSQL** se inicializa y queda listo (con healthcheck `pg_isready`).
2. **Migraciones de Alembic** crean el esquema y cargan los datos. Los 9 vuelos listados en el documento del reto se cargan tal cual en una migración inicial; una migración adicional añade ~120 filas demo distribuidas entre 2021–2023 para que las visualizaciones del frontend sean significativas.
3. **Backend FastAPI** arranca en `:8000` e imprime en consola un resumen de los datos de StackOverflow.
4. **Frontend Next.js** arranca en `:3003` y consume los servicios del backend a través de la red interna del compose.

Cuando los servicios estén `healthy`:

- Frontend (dashboard): <http://localhost:3003>
- Backend: <http://localhost:8000>
- Documentación interactiva (Swagger): <http://localhost:8000/docs>
- Documentación alternativa (ReDoc): <http://localhost:8000/redoc>

Para detener todo:

```bash
docker compose down
```

Para detener y borrar también los datos (resetea la DB):

```bash
docker compose down -v
```

## Variables de entorno

Todas opcionales — el `compose.yml` trae defaults razonables.

| Variable | Default | Descripción |
|---|---|---|
| `POSTGRES_USER` | `casamecate` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | `casamecate_dev_password` | Contraseña de PostgreSQL |
| `POSTGRES_DB` | `casamecate` | Nombre de la base de datos |
| `POSTGRES_PORT` | `5432` | Puerto en el host |
| `BACKEND_PORT` | `8000` | Puerto del backend en el host |
| `FRONTEND_PORT` | `3003` | Puerto del frontend en el host |

Para sobrescribir, crear un archivo `.env` en la raíz:

```bash
BACKEND_PORT=9000
FRONTEND_PORT=3010
POSTGRES_PORT=5433
```

## Estructura del repositorio

```
casamecate/
├── compose.yml          # orquestación de db + backend + frontend
├── README.md            # este archivo
├── backend/
│   ├── Dockerfile       # multi-stage con uv
│   ├── alembic/         # migraciones de la base de datos
│   └── app/
│       ├── main.py      # FastAPI app + lifespan
│       ├── core/        # config, db, dependencies compartidas
│       ├── flights/     # módulo SQL (router, service, schemas, models)
│       └── stackoverflow/ # módulo StackExchange (cliente HTTP + endpoints)
└── frontend/
    ├── Dockerfile       # multi-stage con next.js standalone output
    ├── next.config.ts   # output: "standalone" para imagen mínima
    ├── openapi-ts.config.ts # codegen del cliente tipado desde /openapi.json
    ├── app/             # rutas y layout (Next.js App Router)
    ├── components/      # UI, charts (visx + motion), secciones del dashboard
    ├── lib/             # cliente API generado y utilidades
    ├── providers/       # context providers de React
    └── public/          # assets estáticos
```

Cada módulo del backend (`flights`, `stackoverflow`) sigue una estructura
de 3 capas:

- `router.py` — endpoints HTTP, validación, serialización
- `service.py` — lógica de negocio y queries / llamadas externas
- `schemas.py` — modelos Pydantic de entrada y salida

## Servicios implementados

El reto pide 9 servicios: 4 de SQL, 4 de StackExchange y 1 print en consola.

### Vuelos (SQL)

| # | Pregunta del reto | Endpoint |
|---|---|---|
| 1 | ¿Aeropuerto con mayor movimiento durante el año? | `GET /flights/airports/top` |
| 2 | ¿Aerolínea con mayor número de vuelos durante el año? | `GET /flights/airlines/top` |
| 3 | ¿Día con mayor número de vuelos? | `GET /flights/days/top` |
| 4 | ¿Aerolíneas con más de N vuelos por día? | `GET /flights/airlines/flights-per-day` |

Los 3 primeros aceptan `?year=YYYY` y `?limit=N` (`limit=1` por defecto, `limit=0` para todos), p. ej. `/flights/airports/top?year=2023&limit=5`. El cuarto acepta `?year=YYYY` y `?more_than=N` (default 2), p. ej. `/flights/airlines/flights-per-day?more_than=4`.

### StackExchange

| # | Pregunta del reto | Endpoint |
|---|---|---|
| 5 | Número de preguntas contestadas vs no contestadas | `GET /stackoverflow/questions/answered-count` |
| 6 | Pregunta con mayor puntuación | `GET /stackoverflow/questions/top-score` |
| 7 | Pregunta con menor número de vistas | `GET /stackoverflow/questions/least-views` |
| 8 | Pregunta más vieja y más actual | `GET /stackoverflow/questions/oldest-newest` |

Todos consumen la URL definida en el reto y comparten un cache TTL de 5 minutos para no saturar StackExchange.

### Print en consola

| # | Requisito del reto | Cómo se cumple |
|---|---|---|
| 9 | Imprimir en consola los puntos 6, 7 y 8 | Se ejecuta automáticamente al arrancar el backend (visible en `docker compose logs backend`) |
