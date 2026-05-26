# 3. Modelado CSP del problema

## 3.1 Enfoque formal

El problema de generación de horarios académicos se modela como un **Problema de Satisfacción de Restricciones (CSP)**.

Un CSP se define por:

```text
CSP = (X, D, C)
```

Donde:

- `X` es el conjunto de variables.
- `D` es el conjunto de dominios.
- `C` es el conjunto de restricciones.

## 3.2 Variables del CSP institucional

En el caso institucional, las variables representan secciones o bloques académicos que deben ser programados.

```text
X1 = Sección SIS101-A, bloque 1
X2 = Sección SIS101-A, bloque 2
X3 = Sección SIS204-B, bloque 1
```

## 3.3 Dominios del CSP institucional

El dominio de cada variable está formado por combinaciones posibles:

```text
D = Día + Hora + Aula + Docente
```

Ejemplo:

```text
Lunes, 08:40, Aula 301, Docente 15
Martes, 10:20, Laboratorio 2, Docente 15
```

## 3.4 Restricciones duras

| Código | Restricción |
|---|---|
| C1 | Un docente no puede tener dos clases al mismo tiempo |
| C2 | Un aula no puede tener dos clases al mismo tiempo |
| C3 | Una sección no puede tener dos bloques simultáneos |
| C4 | El docente debe estar disponible |
| C5 | La hora debe estar dentro del rango académico |
| C6 | El aula debe existir y estar habilitada |

## 3.5 Restricciones blandas

| Código | Restricción |
|---|---|
| B1 | Evitar horarios extremos |
| B2 | Distribuir bloques entre varios días |
| B3 | Evitar concentración excesiva a las 07:00 |
| B4 | Favorecer horarios intermedios |
| B5 | Balancear carga semanal |

## 3.6 CSP estudiantil

El CSP estudiantil se aplica después de publicar el horario institucional.

### Variables

Las variables representan cursos seleccionados por el estudiante.

```text
X1 = Curso seleccionado 1
X2 = Curso seleccionado 2
X3 = Curso seleccionado 3
```

### Dominios

Los dominios son secciones publicadas disponibles para cada curso.

```text
D = Secciones publicadas del curso
```

### Restricciones estudiantiles

| Código | Restricción |
|---|---|
| E1 | No debe existir cruce entre clases del estudiante |
| E2 | Solo se deben usar bloques de la oferta publicada |
| E3 | Se deben respetar días no disponibles |
| E4 | Se debe considerar el rango de créditos 7 a 25 |
| E5 | Se deben considerar preferencias de docentes |

## 3.7 Criterios de evaluación

Las soluciones se evalúan mediante un score considerando:

- Ausencia de conflictos.
- Cantidad de créditos.
- Cercanía al objetivo de créditos.
- Distribución de bloques.
- Preferencia docente.
- Penalización de docentes evitados.
- Penalización de horarios extremos.
- Balance semanal.

## 3.8 Impacto de restricciones

Las restricciones reducen el espacio de búsqueda y determinan qué soluciones son válidas.

Ejemplos:

- Si un docente no está disponible en la mañana, se eliminan combinaciones de mañana.
- Si un aula ya está ocupada a una hora, no puede usarse para otra sección.
- Si el estudiante marca sábado como no disponible, se eliminan bloques de sábado.

## 3.9 Conclusión técnica

El modelo CSP es adecuado porque permite representar formalmente un problema altamente combinatorio, validar restricciones y generar soluciones evaluables por calidad.
