# OptiAcademic

**Sistema inteligente para generar, validar y optimizar horarios academicos universitarios.**

OptiAcademic es una aplicacion web full-stack que centraliza datos academicos,
genera horarios institucionales mediante un modelo CSP y permite a estudiantes
construir alternativas personales con menor conflicto. El proyecto incorpora
observabilidad de impacto ambiental y analisis GreenFrame para evaluar un
flujo critico de la aplicacion.

## Problema

La programacion manual de horarios debe coordinar cursos, secciones, docentes,
aulas, disponibilidad, cruces y preferencias estudiantiles. Este proceso
consume tiempo y puede producir conflictos que afectan la planificacion del
periodo academico.

## Objetivo General

Automatizar la generacion y evaluacion de horarios validos mediante
restricciones formales, una interfaz por roles y evidencia tecnica
reproducible para calidad y sostenibilidad.

## Tecnologias

| Capa | Tecnologias |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Axios, Zustand |
| Backend | FastAPI, Python, SQLAlchemy, Alembic, Pydantic |
| Base de datos | MySQL |
| Seguridad | JWT y autorizacion por roles |
| Optimizacion | CSP con validacion de restricciones y scoring |
| Sostenibilidad | Dashboard ambiental y GreenFrame |
| Operacion local | Docker Compose |

## Arquitectura General

```text
Navegador
  |
  v
React + Vite :5173
  |  HTTP / JWT
  v
FastAPI :8000  ---- GreenFrame report ----> GET /api/v1/sustainability
  |
  | SQLAlchemy + Alembic
  v
MySQL :3306 (publicado localmente en :3307)
```

Ver [arquitectura general](docs/arquitectura/arquitectura-general.md).

## Modulos

| Modulo | Alcance |
| --- | --- |
| Autenticacion | Inicio de sesion JWT y proteccion por rol. |
| Administracion academica | Usuarios, docentes, estudiantes, cursos, aulas y secciones. |
| Horario institucional | Diagnostico, generacion CSP, validacion y publicacion. |
| Experiencia estudiante | Oferta disponible, preferencias y horarios personales. |
| Sostenibilidad | Metricas HTTP, dashboard ambiental y reporte GreenFrame publico. |

## Roles

| Rol tecnico | Vista principal |
| --- | --- |
| `ADMIN` | Administracion completa y dashboards. |
| `COORDINATOR` | Gestion academica, generacion y publicacion. |
| `TEACHER` | Consulta docente y disponibilidad. |
| `STUDENT` | Oferta y generacion de horario personal. |

## Inicio Rapido Con Docker

```powershell
Copy-Item .env.docker.example .docker.env
docker compose --env-file .docker.env up --build -d
docker compose --env-file .docker.env exec backend python seed_realistic_demo.py
```

Servicios:

| Servicio | URL |
| --- | --- |
| Aplicacion React | <http://localhost:5173> |
| Swagger FastAPI | <http://localhost:8000/docs> |
| API base | <http://localhost:8000/api/v1> |
| MySQL publicado | `localhost:3307` |

Guia completa: [docs/instalacion/guia-docker.md](docs/instalacion/guia-docker.md).

## Instalacion Manual Opcional

Backend:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

La instalacion manual requiere una instancia MySQL configurada con las
variables descritas en [backend/README.md](backend/README.md).

## Credenciales Demo

Despues de ejecutar `seed_realistic_demo.py`:

```text
Administrador: admin@optiacademic.com / admin123
```

Estas credenciales se usan solo en desarrollo y en el escenario GreenFrame.

## Endpoints Principales

| Metodo | Endpoint | Uso |
| --- | --- | --- |
| `POST` | `/api/v1/auth/login-json` | Autenticacion del frontend. |
| `GET` | `/api/v1/dashboard/admin-summary` | Resumen administrativo. |
| `POST` | `/api/v1/institutional-csp/generate` | Generacion institucional CSP. |
| `GET` | `/api/v1/environmental-impact` | Dashboard ambiental HTML publico. |
| `GET` | `/api/v1/environmental-impact/summary` | Indicadores ambientales protegidos. |
| `GET` | `/api/v1/sustainability` | Ultimo reporte GreenFrame publico. |

La referencia navegable completa se expone en Swagger.

## Sostenibilidad Y GreenFrame

El dashboard ambiental estima impacto a partir del trafico HTTP observado por
FastAPI. GreenFrame ejecuta con Playwright el flujo de login administrativo y
consulta de `/admin/environmental-impact` sobre los tres contenedores.

```bash
greenframe analyze 2>&1 | tee backend/public/assets/greenframe-latest.txt
```

El reporte generado se consulta en:

```http
GET /api/v1/sustainability
```

Detalles: [docs/sostenibilidad/02-greenframe-report.md](docs/sostenibilidad/02-greenframe-report.md).

## Reportes Academicos

La Fase 5 incorpora un panel ejecutivo para administradores y reportes
operativos para coordinacion. El administrador accede en
`/admin/executive-dashboard` y el coordinador en `/coordinator/reports`.
Los reportes combinan oferta, horarios publicados, carga docente, aulas,
estudiantes, solicitudes e indicadores ambientales, con exportacion CSV para
las tablas principales.

## Capturas Sugeridas Para La Presentacion

1. Pantalla de login y seleccion de rol.
2. Dashboard administrativo institucional.
3. Generador o diagnostico CSP de horarios.
4. Oferta y horario generado para estudiante.
5. Dashboard de impacto ambiental.
6. Resultado GreenFrame y endpoint publico de sostenibilidad.

## Estado Del Proyecto

Proyecto academico funcional en evolucion. Incluye backend, frontend,
persistencia MySQL, generacion CSP, ejecucion Docker y componentes de
sostenibilidad. Antes de una demostracion debe levantarse el stack, aplicar
migraciones y cargar datos demo.

## Documentacion

El indice general se encuentra en [docs/README.md](docs/README.md).

## Autores

- Repositorio academico mantenido por `ArweNMera` y el equipo OptiAcademic.

## Licencia

No se ha publicado aun un archivo de licencia. Definir la licencia antes de
redistribuir el proyecto fuera del contexto academico.
