from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    classrooms,
    courses,
    csp_diagnostics,
    dashboard,
    data_readiness,
    environmental_impact,
    institutional_csp,
    schedule_blocks,
    schedule_publication,
    schedule_quality,
    schedules,
    sections,
    student_csp,
    student_enrollments,
    students,
    sustainability,
    teachers,
    users,
)

api_router = APIRouter()


@api_router.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "message": "OptiAcademic API funcionando correctamente",
    }


# --- Registro de Routers ---

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Auth"],
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
)

api_router.include_router(
    teachers.router,
    prefix="/teachers",
    tags=["Teachers"],
)

api_router.include_router(
    students.router,
    prefix="/students",
    tags=["Students"],
)

api_router.include_router(
    courses.router,
    prefix="/courses",
    tags=["Courses"],
)

api_router.include_router(
    classrooms.router,
    prefix="/classrooms",
    tags=["Classrooms"],
)

api_router.include_router(
    sections.router,
    prefix="/sections",
    tags=["Sections"],
)

api_router.include_router(
    schedules.router,
    prefix="/schedules",
    tags=["Schedules"],
)

api_router.include_router(
    schedule_blocks.router,
    prefix="/schedule-blocks",
    tags=["Schedule Blocks"],
)

api_router.include_router(
    institutional_csp.router,
    prefix="/institutional-csp",
    tags=["Institutional CSP"],
)

api_router.include_router(
    csp_diagnostics.router,
    prefix="/csp-diagnostics",
    tags=["CSP Diagnostics"],
)

api_router.include_router(
    student_csp.router,
    prefix="/student-csp",
    tags=["Student CSP"],
)

api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"],
)

api_router.include_router(
    schedule_quality.router,
    prefix="/schedule-quality",
    tags=["Schedule Quality"],
)

api_router.include_router(
    schedule_publication.router,
    prefix="/schedule-publication",
    tags=["Schedule Publication"],
)

api_router.include_router(
    data_readiness.router,
    prefix="/data-readiness",
    tags=["Data Readiness"],
)

api_router.include_router(
    student_enrollments.router,
    prefix="/student-enrollments",
    tags=["Student Enrollments"],
)

api_router.include_router(
    environmental_impact.router,
    tags=["Environmental Impact"],
)

api_router.include_router(
    sustainability.router,
    tags=["Sustainability"],
)
