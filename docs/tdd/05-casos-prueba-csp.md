# 5. Casos de prueba del motor CSP

| Código | Objetivo | Entrada | Resultado esperado |
|---|---|---|---|
| CP-CSP-001 | Evitar cruce de docente | Dos secciones con el mismo docente | Horarios distintos |
| CP-CSP-002 | Evitar cruce de aula | Dos secciones con dominio común de aula | Aulas u horarios distintos |
| CP-CSP-003 | Evitar cruce de sección | Sección con varios bloques | Bloques en horarios diferentes |
| CP-CSP-004 | Respetar disponibilidad docente | Docente con disponibilidad limitada | Bloques dentro de disponibilidad |
| CP-CSP-005 | Generar solución | Datos suficientes | Al menos una solución |
| CP-CSP-006 | Detectar sección sin dominio | Sección sin docente disponible | Diagnóstico con problema |
| CP-CSP-007 | Evitar cruces del estudiante | Cursos seleccionados | Alternativas sin cruces |
| CP-CSP-008 | Respetar días no disponibles | Día bloqueado por estudiante | Soluciones sin bloques en ese día |
| CP-CSP-009 | Respetar rango de créditos | Cursos seleccionados | Solución entre 7 y 25 créditos o advertencia |
| CP-CSP-010 | Recomendar mejor solución | Varias soluciones | Mayor score marcada como recomendada |
