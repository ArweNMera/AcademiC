# 3. Casos de prueba backend

| Código | Caso de prueba | Entrada | Resultado esperado |
|---|---|---|---|
| CP-BE-001 | Login correcto | Email y contraseña válidos | Token JWT y datos del usuario |
| CP-BE-002 | Login incorrecto | Contraseña incorrecta | Error 401 Unauthorized |
| CP-BE-003 | Acceso sin token | Petición a endpoint protegido sin token | Error 401 o 403 |
| CP-BE-004 | Listar cursos | Base poblada | Lista de cursos con código, nombre, ciclo y créditos |
| CP-BE-005 | Crear horario base | Nombre, periodo y tipo | Horario institucional creado |
| CP-BE-006 | Diagnóstico CSP institucional | schedule_id y periodo | Diagnóstico con secciones programables/problemáticas |
| CP-BE-007 | Generar horario institucional | Configuración CSP | Una o más soluciones generadas |
| CP-BE-008 | Publicar horario sin bloques | schedule_id sin bloques | Error de validación |
| CP-BE-009 | Publicar horario con bloques | schedule_id con bloques válidos | Horario publicado correctamente |
| CP-BE-010 | Obtener oferta estudiantil | Horario publicado | Cursos y bloques disponibles |

## Comando sugerido para futuras pruebas

```powershell
pytest
```
