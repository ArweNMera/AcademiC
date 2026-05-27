# Frontend React - OptiAcademic

## Oferta Academica - Fase 2

El rol `COORDINATOR` dispone de navegacion propia en
`/coordinator/dashboard`, `/coordinator/offerings`,
`/coordinator/offerings/create` y `/coordinator/conflicts`. Admin tambien
puede gestionar esas pantallas. El estudiante ve en `/student/offer`
exclusivamente `section_offerings` con estado `PUBLISHED` del periodo activo;
el generador personal conserva el flujo institucional existente.

## Descripcion

La interfaz web de OptiAcademic ofrece navegacion por roles para gestion
academica, generacion de horarios y consulta de indicadores ambientales.

## Tecnologias

- React con Vite.
- Tailwind CSS.
- React Router.
- Axios para consumo de la API.
- Zustand para estado de autenticacion.

## Estructura

```text
frontend/
|-- public/
|-- src/
|   |-- api/            # Cliente Axios
|   |-- components/     # Layout y componentes reutilizables
|   |-- pages/          # Pantallas por rol
|   |-- services/       # Consumo de endpoints
|   `-- stores/         # Sesion del usuario
|-- package.json
`-- vite.config.js
```

## Variable De Entorno

Crear `.env` local sin versionarlo:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

## Comandos

```powershell
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Rutas Principales

| Ruta | Vista |
| --- | --- |
| `/login` | Inicio de sesion. |
| `/admin/dashboard` | Resumen institucional. |
| `/admin/environmental-impact` | Dashboard ambiental. |
| `/admin/schedules` | Gestion/generacion institucional. |
| `/admin/schedule-quality` | Validacion de calidad. |
| `/admin/academic-periods` | Gestión de períodos. |
| `/admin/academic-programs` | Gestión de carreras. |
| `/admin/curriculum-plans` | Planes curriculares. |
| `/admin/curriculum` | Malla, electivos y prerrequisitos editables. |
| `/student` | Inicio estudiante. |
| `/student/schedule-generator` | Generacion personal. |
| `/student/curriculum` | Malla activa y elegibilidad. |

## Roles Y Vistas

| Rol | Alcance en interfaz |
| --- | --- |
| `ADMIN` | Gestion integral y dashboards. |
| `COORDINATOR` | Planificacion y publicacion academica. |
| `TEACHER` | Informacion docente. |
| `STUDENT` | Oferta, preferencias y horarios personales. |

## Malla Curricular

La pantalla administrativa permite filtrar cursos por ciclo/tipo, marcar
electivos sugeridos y mantener prerrequisitos. La pantalla estudiantil muestra
la malla activa y trata los prerrequisitos `RECOMMENDED` como orientación, no
como bloqueo. El cliente HTTP continúa usando el Axios unificado con JWT.
## Fase 3

El coordinador dispone de `/coordinator/csp` para generar y guardar horarios institucionales desde ofertas academicas. El estudiante ve en `/student/offer` solo secciones publicadas de cursos asignados y en `/student/schedule-generator` puede usar el modo real **Generar horario con mis cursos matriculados**, manteniendo el modo exploracion previo.
