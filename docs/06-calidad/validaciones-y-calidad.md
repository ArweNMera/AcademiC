# 12. Validaciones y calidad

## Validaciones institucionales

El sistema valida:

- Cruce de aula.
- Cruce de docente.
- Cruce de sección.
- Disponibilidad docente.
- Rango horario permitido.
- Existencia de bloques.
- Estado de publicación.

## Validaciones estudiante

- Cursos dentro de oferta publicada.
- Sin cruces.
- Créditos entre 7 y 25.
- Respeto de días no disponibles.
- Preferencias de docentes.

## SQL para distribución horaria

```sql
SELECT 
    start_time,
    COUNT(*) AS total_bloques
FROM schedule_blocks
WHERE schedule_id = 1
GROUP BY start_time
ORDER BY start_time;
```

## SQL para cruces de aula

```sql
SELECT 
    classroom_id,
    day_of_week,
    start_time,
    COUNT(*) AS total
FROM schedule_blocks
WHERE schedule_id = 1
GROUP BY classroom_id, day_of_week, start_time
HAVING COUNT(*) > 1;
```

## Validaciones Fase 11

- Los estudiantes institucionales conservan `career`, `cycle`, `student_code`
  y `user_id` cuando corresponda al esquema legacy.
- Las nuevas relaciones hacia programa, plan y sede son nullable para permitir
  un backfill progresivo.
- El historial académico separa cursos aprobados, desaprobados, en progreso,
  retirados y pendientes de revisión.
- La combinación estudiante, curso, período e intento evita duplicados
  evidentes.

```sql
SELECT status, COUNT(*) AS total
FROM student_academic_history
GROUP BY status;
```
