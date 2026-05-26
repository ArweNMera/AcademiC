# 4. Casos de prueba frontend

| Código | Caso de prueba | Acción | Resultado esperado |
|---|---|---|---|
| CP-FE-001 | Renderizar login | Abrir aplicación | Formulario visible |
| CP-FE-002 | Login admin | Ingresar credenciales admin | Redirección al dashboard admin |
| CP-FE-003 | Login estudiante | Ingresar credenciales estudiante | Redirección al dashboard estudiante |
| CP-FE-004 | Vista oferta académica | Entrar a `/student/offer` | Se muestran cursos y secciones |
| CP-FE-005 | Selección de cursos | Seleccionar cursos | Cursos quedan seleccionados |
| CP-FE-006 | Generar alternativas | Presionar generar | Se muestran alternativas |
| CP-FE-007 | Comparar horarios | Revisar opciones | Se visualiza score, créditos y recomendación |
| CP-FE-008 | Guardar horario final | Elegir una solución | Horario guardado como final |
| CP-FE-009 | Exportar PDF | Presionar exportar PDF | Se genera archivo PDF |

## Pruebas manuales recomendadas

- Verificar mensajes de error.
- Verificar carga de datos.
- Verificar navegación por rol.
- Verificar que el estudiante no vea módulos administrativos.
