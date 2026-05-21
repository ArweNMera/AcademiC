# Documentación de OptiAcademic

**OptiAcademic** es un sistema web inteligente para la gestión y optimización de horarios académicos universitarios. El proyecto está orientado inicialmente a la carrera de **Ingeniería de Sistemas e Informática**, desde el ciclo 1 hasta el ciclo 10.

## Índice

1. [Introducción](01-introduccion.md)
2. [Arquitectura general](02-arquitectura-general.md)
3. [Instalación y configuración](03-instalacion-configuracion.md)
4. [Base de datos y malla curricular](04-base-datos-malla.md)
5. [Roles y permisos](05-roles-permisos.md)
6. [Módulo administrador y coordinador](06-modulo-admin-coordinador.md)
7. [Motor CSP institucional](07-motor-csp-institucional.md)
8. [Módulo estudiante](08-modulo-estudiante.md)
9. [API backend](09-api-backend.md)
10. [Frontend React](10-frontend-react.md)
11. [Flujo de demostración](11-flujo-demostracion.md)
12. [Validaciones y calidad](12-validaciones-calidad.md)
13. [Decisiones técnicas](13-decisiones-tecnicas.md)
14. [Mantenimiento y Git](14-mantenimiento-git.md)

## Tecnologías principales

| Capa | Tecnología |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios, Zustand |
| Backend | FastAPI, Python, SQLAlchemy, Pydantic |
| Base de datos | MySQL |
| Algoritmo | CSP con backtracking, MRV, validación de restricciones y scoring |
| Seguridad | JWT, roles y rutas protegidas |
| Exportación | PDF del horario final del estudiante |

## Flujo general

```text
Administrador / Coordinador
→ Gestiona datos académicos
→ Genera horario institucional con CSP
→ Valida conflictos
→ Publica la oferta académica

Estudiante
→ Visualiza la oferta publicada
→ Selecciona cursos y preferencias
→ Genera alternativas de horario
→ Compara opciones
→ Elige horario final
→ Exporta PDF
```
