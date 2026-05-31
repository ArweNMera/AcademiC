# Escalabilidad Institucional Huancayo

## Alcance De La Fase 10

La Fase 10 agrega la base institucional mínima para evolucionar OptiAcademic
hacia varias facultades y carreras dentro de una única sede: **Sede Huancayo**.
No implementa multi-sede ni reemplaza el flujo CSP existente.

## Nuevas Entidades

- `campuses`: registra Sede Huancayo como base territorial.
- `faculties`: registra las facultades institucionales.

Los programas académicos, aulas, ofertas y horarios incorporan relaciones
opcionales hacia sede o facultad. Los campos de texto anteriores se conservan
para mantener compatibilidad con seeds, pantallas y flujos legacy.

## Compatibilidad

La migración realiza un backfill progresivo:

- vincula programas existentes con Sede Huancayo;
- vincula aulas, ofertas y horarios existentes con Sede Huancayo;
- asocia programas cuyo texto de facultad contiene `Ingenier` con la Facultad
  de Ingeniería;
- conserva `academic_programs.faculty`, `classrooms.campus` y
  `students.career`.

Los endpoints CSP modernos y legacy, la publicación segura, los reportes, la
auditoría y las notificaciones continúan disponibles sin cambios de contrato.

## Endpoints

Las consultas de facultades y sedes están disponibles para `ADMIN`,
`COORDINATOR` y `TEACHER`. La escritura corresponde exclusivamente a `ADMIN`.

```text
/api/v1/faculties
/api/v1/campuses
```

## Próximos Pasos

Las fases posteriores incorporarán historial académico, demanda estudiantil,
proyección de NRC, disponibilidad institucional y generación CSP masiva por
particiones.
