# Backend FastAPI - OptiAcademic

## Descripcion

El backend implementa la API REST de OptiAcademic con FastAPI, persistencia
MySQL mediante SQLAlchemy, migraciones Alembic, autenticacion JWT y servicios
de generacion/validacion de horarios.

## Estructura

```text
backend/
|-- app/
|   |-- api/v1/endpoints/   # Rutas HTTP
|   |-- core/               # Configuracion, DB y seguridad
|   |-- csp/                # Motor de restricciones
|   |-- middleware/         # Medicion ambiental HTTP
|   |-- models/             # Modelos SQLAlchemy
|   |-- schemas/            # Contratos Pydantic
|   `-- services/           # Logica de aplicacion
|-- alembic/                # Migraciones
|-- public/assets/          # Reporte GreenFrame local
|-- alembic.ini
`-- requirements.txt
```

## Variables De Entorno

Crear un `.env` local basado en `.env.example`; nunca versionar secretos.

| Variable | Ejemplo | Uso |
| --- | --- | --- |
| `APP_NAME` | `OptiAcademic` | Nombre de la API. |
| `APP_VERSION` | `1.0.0` | Version visible. |
| `APP_ENV` | `development` | Entorno. |
| `DEBUG` | `True` | Depuracion local. |
| `API_V1_PREFIX` | `/api/v1` | Prefijo REST. |
| `MYSQL_HOST` | `localhost` | Host MySQL; en Docker es `mysql`. |
| `MYSQL_PORT` | `3306` | Puerto interno MySQL. |
| `MYSQL_USER` | `root` | Usuario local. |
| `MYSQL_PASSWORD` | `tu_password` | Contrasena local. |
| `MYSQL_DATABASE` | `optiacademic_db` | Base de datos. |
| `SECRET_KEY` | `cambiar_localmente` | Firma JWT. |
| `ALGORITHM` | `HS256` | Algoritmo JWT. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Caducidad del token. |
| `BACKEND_CORS_ORIGINS` | `["http://localhost:5173"]` | Origenes React. |

## Instalacion Local

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Migraciones

```powershell
alembic upgrade head
```

## Datos Demo

```powershell
python seed_realistic_demo.py
```

El seed principal crea la cuenta demo:

```text
admin@optiacademic.com / admin123
```

## Ejecutar La API

```powershell
uvicorn app.main:app --reload
```

Swagger: <http://127.0.0.1:8000/docs>

## Endpoints Destacados

| Metodo | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login-json` | Publico |
| `GET` | `/api/v1/auth/me` | Autenticado |
| `GET` | `/api/v1/dashboard/admin-summary` | Admin/coordinador |
| `POST` | `/api/v1/institutional-csp/generate` | Admin/coordinador |
| `GET` | `/api/v1/environmental-impact` | Publico |
| `GET` | `/api/v1/environmental-impact/summary` | Admin/coordinador |
| `GET` | `/api/v1/sustainability` | Publico |
