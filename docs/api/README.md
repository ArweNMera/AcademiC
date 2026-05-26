# API FastAPI

La API REST se publica bajo `/api/v1`. En desarrollo, su documentacion
interactiva esta disponible en:

```text
http://localhost:8000/docs
```

## Autenticacion

El frontend obtiene un JWT mediante:

```http
POST /api/v1/auth/login-json
```

Las rutas protegidas reciben:

```http
Authorization: Bearer <token>
```

El registro publico es deliberadamente restringido:

```http
POST /api/v1/auth/register
```

Acepta `full_name`, `email` y `password`, y siempre crea un usuario
`STUDENT`. El campo `role` es rechazado. Usuarios con privilegios se crean
solo mediante `/users` autenticado como `ADMIN` o scripts de carga.

## Grupos De Endpoints

| Prefijo | Funcion |
| --- | --- |
| `/auth` | Login, registro y usuario actual. |
| `/users`, `/teachers`, `/students` | Gestion de usuarios y perfiles. |
| `/courses`, `/sections`, `/classrooms` | Catalogo academico. |
| `/schedules`, `/schedule-blocks` | Horarios y bloques. |
| `/institutional-csp`, `/csp-diagnostics` | Generacion y diagnostico CSP. |
| `/student-csp`, `/student-enrollments` | Experiencia estudiante. |
| `/dashboard`, `/schedule-quality`, `/data-readiness` | Control administrativo. |
| `/environmental-impact` | Indicadores ambientales. |
| `/sustainability` | Reporte publico GreenFrame. |

## Controles De Fase 0

| Operacion | Regla aplicada |
| --- | --- |
| `PATCH /schedules/{id}/publish` | Compatibilidad: delega al flujo de publicacion segura. |
| `PATCH /schedule-publication/{id}/publish-safe` | Exige readiness sin fallas criticas y calidad publicable. |
| `POST /schedules`, `PUT /schedules/{id}` con `status=PUBLISHED` | Rechazado; no se permite saltar validaciones. |
| `GET /schedules`, `GET /schedules/{id}` para `STUDENT` | Solo horarios institucionales activos `PUBLISHED`. |
| `GET /schedule-blocks*` para `STUDENT` | Solo bloques pertenecientes a horarios institucionales activos `PUBLISHED`. |
| `/teachers/*/availability` para `TEACHER` | Solo el perfil docente asociado al usuario autenticado. |

La migracion `c6217d0e4a12_add_student_course_enrollments` agrega la tabla
de inscripciones por curso y periodo usada por `/student-enrollments`.

## Rutas Publicas Destacadas

| Metodo | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Estado de API. |
| `GET` | `/api/v1/environmental-impact` | Dashboard HTML ambiental. |
| `GET` | `/api/v1/sustainability` | Reporte GreenFrame o mensaje de ausencia. |

Para contratos de request/response y autorizacion vigente, Swagger es la
referencia ejecutable.
