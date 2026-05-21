from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.student import Student
from app.models.user import User, UserRole
from app.schemas.student_schema import (
    StudentCreate,
    StudentListResponse,
    StudentResponse,
    StudentUpdate,
)
from app.services.student_service import StudentService


router = APIRouter()


@router.get(
    "",
    response_model=StudentListResponse,
    summary="Listar estudiantes",
)
def list_students(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    student_service = StudentService(db)
    return student_service.list_students(skip=skip, limit=limit)


@router.post(
    "",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear perfil estudiante",
)
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    student_service = StudentService(db)
    return student_service.create_student(student_data)


# --------------------------------------------------------------------------
# NUEVO ENDPOINT: Ubicado correctamente antes de /{student_id}
# --------------------------------------------------------------------------
@router.get(
    "/me",
    summary="Obtener perfil estudiante del usuario logueado",
)
def get_my_student_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.STUDENT)),
):
    student = (
        db.query(Student)
        .filter(Student.user_id == current_user.id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El usuario logueado no tiene perfil de estudiante asociado.",
        )

    return student


@router.get(
    "/{student_id}",
    response_model=StudentResponse,
    summary="Obtener estudiante por ID",
)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.STUDENT)
    ),
):
    student_service = StudentService(db)
    return student_service.get_student_by_id(student_id)


@router.put(
    "/{student_id}",
    response_model=StudentResponse,
    summary="Actualizar estudiante",
)
def update_student(
    student_id: int,
    student_data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    student_service = StudentService(db)
    return student_service.update_student(student_id, student_data)


@router.delete(
    "/{student_id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar estudiante",
)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
):
    student_service = StudentService(db)
    return student_service.delete_student(student_id)