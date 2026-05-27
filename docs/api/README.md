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
| `/academic-periods`, `/academic-programs` | Periodos y carreras. |
| `/curriculum-plans`, `/curriculum-courses` | Plan curricular y malla por ciclos. |
| `/course-prerequisites`, `/elective-bank-courses` | Reglas y sugerencias editables. |
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

## Dominio Académico - Fase 1

| Ruta | Escritura | Regla |
| --- | --- | --- |
| `/academic-periods` | `ADMIN` | Define período vigente. |
| `/academic-programs` | `ADMIN` | Define carrera/programa. |
| `/curriculum-plans` | `ADMIN` | Mantiene versiones de plan. |
| `/curriculum-courses` | `ADMIN`, `COORDINATOR` | Administra cursos, ciclos y electivos sugeridos. |
| `/course-prerequisites` | `ADMIN`, `COORDINATOR` | Administra relaciones editables. |
| `/elective-bank-courses` | `ADMIN`, `COORDINATOR` | Administra alternativas sugeridas. |
| `/students/me/curriculum` | Sin escritura | El estudiante ve solo la malla `ACTIVE`. |
| `/students/me/eligible-courses` | Sin escritura | Solo `REQUIRED` puede bloquear elegibilidad. |

La malla `ISI-UC-2026` es base editable proporcionada por el usuario. Los
electivos y prerrequisitos `RECOMMENDED` cargados no sustituyen confirmación
documental oficial.

## Rutas Publicas Destacadas

| Metodo | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Estado de API. |
| `GET` | `/api/v1/environmental-impact` | Dashboard HTML ambiental. |
| `GET` | `/api/v1/sustainability` | Reporte GreenFrame o mensaje de ausencia. |

Para contratos de request/response y autorizacion vigente, Swagger es la
referencia ejecutable.
