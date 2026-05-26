# Base De Datos

OptiAcademic utiliza MySQL como sistema relacional de persistencia. SQLAlchemy
define los modelos del backend y Alembic controla la evolucion del esquema.

## Entidades Principales

- Usuarios y roles.
- Perfiles de estudiante y docente.
- Cursos, secciones y aulas.
- Horarios academicos y bloques.
- Horarios personales de estudiantes.
- Metricas de impacto ambiental.

## Migraciones

Desde `backend/` en instalacion manual:

```powershell
alembic upgrade head
```

En Docker:

```powershell
docker compose --env-file .docker.env exec backend alembic upgrade head
```

## Datos De Demostracion

```powershell
docker compose --env-file .docker.env exec backend python seed_realistic_demo.py
```

Los scripts de seed son para desarrollo y demostracion, no para cargar datos
reales de una institucion.

## Seguridad

Las credenciales MySQL se definen localmente en `.env` o `.docker.env`.
Ningun archivo con contrasenas reales debe versionarse.
