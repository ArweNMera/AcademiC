# 7. Decisión sobre el stack técnico

## 7.1 Stack solicitado en la consigna

La consigna menciona el uso del stack MERN:

```text
MongoDB + Express + React + Node.js
```

## 7.2 Stack implementado en el MVP

El MVP OptiAcademic implementa:

```text
React + FastAPI + MySQL
```

| Capa | Tecnología usada |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI + Python |
| Base de datos | MySQL |
| ORM | SQLAlchemy |
| Motor de optimización | CSP en Python |

## 7.3 Justificación técnica

Aunque MERN es una alternativa válida para aplicaciones web, el problema desarrollado tiene una naturaleza altamente relacional y algorítmica.

Se eligió FastAPI y MySQL porque:

- El modelo académico requiere relaciones claras entre cursos, secciones, docentes, aulas y horarios.
- MySQL permite representar estas relaciones de forma consistente.
- Python facilita la implementación del motor CSP.
- FastAPI permite crear APIs REST con validación automática y documentación Swagger.
- SQLAlchemy permite trabajar con modelos relacionales y mantener modularidad.
- React mantiene la compatibilidad con la capa frontend solicitada.

## 7.4 Comparación de alternativas

| Criterio | MERN | React + FastAPI + MySQL |
|---|---|---|
| Interfaz web | React | React |
| API REST | Express | FastAPI |
| Base de datos | MongoDB | MySQL |
| Modelado relacional | Menos directo | Más adecuado |
| Implementación CSP | Posible en Node.js | Más natural en Python |
| Documentación API | Manual o con librerías | Swagger automático |
| Validación de datos | Requiere configuración | Pydantic integrado |

## 7.5 Riesgo identificado

El principal riesgo es que la evaluación exija estrictamente MERN. Por ello, el equipo debe comunicar la decisión técnica como una adaptación justificada por la naturaleza del problema.

## 7.6 Conclusión

El stack implementado responde adecuadamente al problema de horarios académicos porque combina una interfaz moderna con React, una API robusta con FastAPI, una base relacional con MySQL y un motor CSP implementado en Python.
