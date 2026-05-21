# 15. Tecnologías utilizadas en OptiAcademic

## Descripción general

OptiAcademic es una aplicación web full-stack para la gestión, generación y optimización de horarios académicos universitarios.  
El sistema está compuesto por un frontend desarrollado en React, un backend desarrollado en FastAPI y una base de datos MySQL.

La arquitectura tecnológica permite separar la interfaz de usuario, la lógica de negocio, el motor CSP y la persistencia de datos.

---

# 1. Tecnologías del frontend

## React

React se utiliza para construir la interfaz de usuario del sistema.

En OptiAcademic se emplea para:

- Crear páginas administrativas.
- Crear páginas para estudiantes.
- Gestionar componentes reutilizables.
- Mostrar dashboards.
- Visualizar horarios.
- Construir formularios interactivos.
- Renderizar opciones generadas por el motor CSP.

Ejemplos de páginas desarrolladas con React:

- Login.
- Dashboard administrador.
- Dashboard estudiante.
- Gestión de cursos.
- Gestión de docentes.
- Gestión de aulas.
- Generador CSP institucional.
- Oferta académica del estudiante.
- Generador de horario estudiantil.
- Horario final del estudiante.

---

## Vite

Vite se utiliza como herramienta de construcción y servidor de desarrollo para el frontend.

Permite:

- Ejecutar el proyecto rápidamente en desarrollo.
- Recargar cambios automáticamente.
- Compilar el proyecto para producción.
- Trabajar con módulos modernos de JavaScript.

Comando principal:

```bash
npm run dev

JavaScript

JavaScript es el lenguaje principal utilizado en el frontend.

Se usa para:

Crear componentes React.
Manejar eventos.
Consumir servicios del backend.
Procesar respuestas JSON.
Gestionar datos temporales del usuario.
Controlar navegación entre páginas.
Tailwind CSS

Tailwind CSS se utiliza para el diseño visual del sistema.

Permite construir interfaces modernas mediante clases utilitarias.

En el proyecto se usa para:

Diseñar tarjetas.
Crear botones.
Crear dashboards.
Crear tablas.
Crear grillas semanales.
Mostrar estados visuales.
Diseñar formularios.
Crear paneles compactos y acordiones.

Ejemplo de estilos usados:

className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
Axios

Axios se utiliza para realizar peticiones HTTP desde el frontend hacia el backend.

Se usa para consumir endpoints como:

Login.
Cursos.
Docentes.
Estudiantes.
Aulas.
Secciones.
Horarios.
CSP institucional.
CSP estudiantil.
Publicación de horarios.

Ejemplo de uso:

const response = await api.get('/courses')
Zustand

Zustand se utiliza para manejar estado global en el frontend.

En el sistema se usa principalmente para:

Guardar información del usuario autenticado.
Guardar el token JWT.
Mantener sesión activa.
Controlar datos de autenticación.
React Router DOM

React Router DOM permite manejar la navegación interna del sistema.

Se usa para separar rutas por rol:

Rutas públicas.
Rutas protegidas.
Rutas de administrador.
Rutas de coordinador.
Rutas de docente.
Rutas de estudiante.

Ejemplos:

/admin
/student
/student/offer
/student/schedule-generator
/student/my-schedules
Lucide React

Lucide React se utiliza para mostrar iconos dentro de la interfaz.

Se usa en:

Botones.
Dashboards.
Menús laterales.
Tarjetas informativas.
Indicadores visuales.
Acciones rápidas.
React Hot Toast

React Hot Toast se utiliza para mostrar notificaciones.

Ejemplos de uso:

Inicio de sesión correcto.
Error al generar horario.
Horario guardado correctamente.
Publicación exitosa.
Validaciones de formularios.
html2pdf.js

html2pdf.js se utiliza para exportar el horario final del estudiante en formato PDF.

El PDF incluye:

Datos del horario.
Créditos.
Cursos.
Docentes.
Aulas.
Grilla semanal.
Lista de clases.
2. Tecnologías del backend
Python

Python es el lenguaje principal del backend.

Se utiliza para:

Crear la API REST.
Implementar servicios.
Implementar repositorios.
Definir modelos.
Ejecutar el motor CSP.
Procesar validaciones.
Gestionar autenticación.
FastAPI

FastAPI es el framework principal del backend.

Se utiliza para crear endpoints REST de forma rápida, segura y documentada.

Ventajas dentro del proyecto:

Alto rendimiento.
Documentación automática con Swagger.
Validación con Pydantic.
Soporte para inyección de dependencias.
Fácil integración con JWT.
Organización modular de endpoints.

Documentación automática:

http://127.0.0.1:8000/docs
Uvicorn

Uvicorn se utiliza como servidor ASGI para ejecutar FastAPI.

Comando principal:

uvicorn app.main:app --reload
SQLAlchemy

SQLAlchemy se utiliza como ORM para interactuar con la base de datos MySQL.

Permite:

Definir modelos de base de datos.
Crear consultas.
Relacionar entidades.
Insertar, actualizar y eliminar registros.
Trabajar con sesiones de base de datos.

Ejemplos de entidades:

Usuario.
Docente.
Estudiante.
Curso.
Aula.
Sección.
Horario académico.
Bloque de horario.
PyMySQL

PyMySQL permite conectar Python con MySQL.

Se utiliza dentro de la URL de conexión:

DATABASE_URL=mysql+pymysql://usuario:password@localhost:3306/optiacademic
Pydantic

Pydantic se utiliza para validar datos de entrada y salida.

En el proyecto se usa para:

Schemas de usuarios.
Schemas de cursos.
Schemas de docentes.
Schemas de aulas.
Schemas de horarios.
Schemas del motor CSP.
Validaciones de payloads.

Ejemplo:

class CSPDiagnosticRequest(BaseModel):
    schedule_id: int
    academic_period: str
Alembic

Alembic se utiliza para gestionar migraciones de base de datos.

Permite:

Crear cambios estructurales.
Versionar tablas.
Mantener control sobre la evolución de la base de datos.

Estructura relacionada:

backend/alembic/
backend/alembic/versions/
Python-Jose

Python-Jose se utiliza para trabajar con tokens JWT.

En el sistema se usa para:

Generar tokens de acceso.
Validar tokens.
Proteger endpoints.
Identificar al usuario autenticado.
Passlib y bcrypt

Passlib y bcrypt se utilizan para el manejo seguro de contraseñas.

Permiten:

Encriptar contraseñas.
Verificar contraseñas ingresadas.
Evitar almacenar contraseñas en texto plano.
python-multipart

python-multipart permite trabajar con formularios y datos enviados desde el cliente.

Es comúnmente necesario en proyectos FastAPI para ciertos tipos de peticiones.

python-dotenv

python-dotenv permite cargar variables de entorno desde archivos .env.

Se usa para configurar:

URL de base de datos.
Clave secreta.
Algoritmo JWT.
Tiempo de expiración del token.
Orígenes permitidos por CORS.
3. Base de datos
MySQL

MySQL es el sistema gestor de base de datos utilizado en OptiAcademic.

Se encarga de almacenar:

Usuarios.
Roles.
Cursos.
Docentes.
Estudiantes.
Aulas.
Secciones.
Disponibilidades.
Horarios institucionales.
Bloques de horario.
Horarios guardados por estudiantes.
Modelo relacional

El sistema usa relaciones entre tablas para representar la estructura académica.

Ejemplo:

courses
   ↓
course_sections
   ↓
schedule_blocks
   ↓
academic_schedules

Otro ejemplo:

users
   ↓
students
   ↓
student_schedules
   ↓
student_schedule_blocks
4. Motor CSP
CSP

CSP significa Constraint Satisfaction Problem, o Problema de Satisfacción de Restricciones.

En OptiAcademic se usa para resolver el problema de asignación de horarios.

El motor CSP permite asignar:

Cursos.
Secciones.
Docentes.
Aulas.
Días.
Horas.

Respetando restricciones como:

Un docente no puede estar en dos clases al mismo tiempo.
Un aula no puede tener dos clases simultáneas.
Una sección no puede cruzarse consigo misma.
El horario debe estar dentro del rango permitido.
El docente debe tener disponibilidad.
El estudiante no debe tener cruces en su horario personal.
Backtracking

Backtracking es la técnica principal de búsqueda del motor CSP.

Funciona probando asignaciones posibles y retrocediendo cuando encuentra un conflicto.

Flujo simplificado:

Elegir sección
→ Probar día, hora y aula
→ Validar restricciones
→ Continuar con la siguiente sección
→ Si hay conflicto, retroceder
MRV

MRV significa Minimum Remaining Values.

Se utiliza para elegir primero las variables con menos opciones disponibles.

Esto mejora la eficiencia porque las secciones más difíciles se programan antes.

Scoring

El scoring permite evaluar la calidad de una solución.

No solo importa generar un horario válido, sino también generar un horario conveniente.

Criterios considerados:

Distribución de bloques.
Horas preferidas.
Penalización por horas extremas.
Balance semanal.
Cantidad de créditos.
Preferencias del estudiante.
Docentes preferidos o evitados.
5. Seguridad
JWT

JWT se utiliza para manejar sesiones de usuario.

Cuando el usuario inicia sesión:

Frontend envía credenciales
→ Backend valida usuario
→ Backend genera token
→ Frontend guarda token
→ Frontend envía token en cada petición protegida
Control de roles

El sistema protege rutas según el rol del usuario.

Roles principales:

ADMIN
COORDINATOR
TEACHER
STUDENT

Ejemplo:

require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
CORS

CORS permite que el frontend pueda comunicarse con el backend aunque estén en puertos distintos.

Ejemplo:

Frontend: http://localhost:5173
Backend:  http://127.0.0.1:8000
6. Herramientas de desarrollo
Git

Git se utiliza para el control de versiones del proyecto.

Comandos principales:

git status
git add .
git commit -m "mensaje"
git push
GitHub

GitHub se utiliza como repositorio remoto.

Repositorio:

https://github.com/ArweNMera/AcademiC.git

Rama principal:

main
Visual Studio Code

Visual Studio Code se utiliza como editor principal de desarrollo.

Permite:

Editar código.
Abrir terminal integrada.
Gestionar carpetas.
Revisar errores.
Ejecutar comandos.
Trabajar con Git.
PowerShell

PowerShell se utiliza como terminal principal en Windows.

Se usa para:

Ejecutar backend.
Ejecutar frontend.
Instalar dependencias.
Ejecutar scripts.
Usar Git.
7. Librerías principales del proyecto
Backend
Librería	Uso
FastAPI	Framework API REST
Uvicorn	Servidor ASGI
SQLAlchemy	ORM
PyMySQL	Conexión MySQL
Pydantic	Validación de datos
Alembic	Migraciones
python-jose	JWT
passlib	Hash de contraseñas
bcrypt	Encriptación de contraseñas
python-dotenv	Variables de entorno
python-multipart	Soporte para formularios
Frontend
Librería	Uso
React	Interfaz de usuario
Vite	Servidor y build
Axios	Peticiones HTTP
Zustand	Estado global
React Router DOM	Rutas
Tailwind CSS	Estilos
Lucide React	Iconos
React Hot Toast	Notificaciones
html2pdf.js	Exportar PDF
date-fns	Manejo de fechas
Recharts	Gráficos y visualizaciones
8. Resumen de tecnologías por capa
Capa	Tecnologías
Frontend	React, Vite, Tailwind CSS, Axios, Zustand
Backend	Python, FastAPI, SQLAlchemy, Pydantic
Base de datos	MySQL, PyMySQL
Seguridad	JWT, Passlib, bcrypt, CORS
Motor de optimización	CSP, Backtracking, MRV, Scoring
Documentación API	Swagger / OpenAPI
Control de versiones	Git, GitHub
Desarrollo	VS Code, PowerShell
Exportación	html2pdf.js
9. Justificación tecnológica
¿Por qué React?

Porque permite construir una interfaz dinámica, modular y reutilizable.

¿Por qué FastAPI?

Porque permite crear APIs rápidas, modernas y con documentación automática.

¿Por qué MySQL?

Porque el sistema trabaja con datos estructurados y relaciones académicas claras.

¿Por qué CSP?

Porque la generación de horarios es un problema basado en restricciones.

¿Por qué Tailwind CSS?

Porque permite diseñar interfaces modernas rápidamente sin crear demasiados archivos CSS personalizados.

¿Por qué JWT?

Porque permite proteger endpoints y mantener sesiones de usuario de forma escalable.

10. Conclusión

Las tecnologías utilizadas en OptiAcademic permiten construir un sistema académico moderno, escalable y funcional.

La combinación de React, FastAPI, MySQL y CSP permite resolver el problema de generación de horarios de forma automatizada, validada y orientada tanto a la administración institucional como a la experiencia del estudiante.