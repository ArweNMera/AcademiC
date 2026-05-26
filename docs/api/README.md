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

## Rutas Publicas Destacadas

| Metodo | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Estado de API. |
| `GET` | `/api/v1/environmental-impact` | Dashboard HTML ambiental. |
| `GET` | `/api/v1/sustainability` | Reporte GreenFrame o mensaje de ausencia. |

Para contratos de request/response y autorizacion vigente, Swagger es la
referencia ejecutable.
