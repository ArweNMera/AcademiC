# Demo Institucional Huancayo

## Preparar La Base

Con Docker activo, aplicar migraciones y ejecutar el seed idempotente:

```powershell
docker compose --env-file .env.docker.example exec backend alembic upgrade head
docker compose --env-file .env.docker.example exec backend python seed_huancayo_institutional_base.py
```

## Resultado Esperado

- existe `Sede Huancayo`;
- existen cinco facultades demo;
- programas, aulas, ofertas y horarios previos conservan su funcionamiento;
- los registros existentes quedan asociados progresivamente a la sede;
- el flujo vigente de generación institucional sigue disponible.

## Pantallas

Iniciar sesión como administrador y abrir:

```text
/admin/faculties
/admin/campuses
/admin/institutional-csp
```

Esta fase solo prepara la base institucional. La carga masiva de estudiantes,
la proyección, la demanda y la generación masiva corresponden a fases
posteriores.
