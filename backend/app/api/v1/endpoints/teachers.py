from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.teacher_schema import (
    TeacherAvailabilityCreate,
    TeacherAvailabilityListResponse,
    TeacherAvailabilityResponse,
    TeacherAvailabilityUpdate,
    TeacherCreate,
    TeacherListResponse,
    TeacherResponse,
    TeacherUpdate,
)
from app.services.teacher_service import (
    TeacherAvailabilityService,
    TeacherService,
)


router = APIRouter()


@router.get(
    "",
    response_model=TeacherListResponse,
    summary="Listar docentes",
)
def list_teachers(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    teacher_service = TeacherService(db)
    return teacher_service.list_teachers(skip=skip, limit=limit)


@router.post(
    "",
    response_model=TeacherResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear perfil docente",
)
def create_teacher(
    teacher_data: TeacherCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    teacher_service = TeacherService(db)
    return teacher_service.create_teacher(teacher_data)


@router.get(
    "/{teacher_id}",
    response_model=TeacherResponse,
    summary="Obtener docente por ID",
)
def get_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER)
    ),
):
    teacher_service = TeacherService(db)
    return teacher_service.get_teacher_by_id(teacher_id)


@router.put(
    "/{teacher_id}",
    response_model=TeacherResponse,
    summary="Actualizar docente",
)
def update_teacher(
    teacher_id: int,
    teacher_data: TeacherUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    teacher_service = TeacherService(db)
    return teacher_service.update_teacher(teacher_id, teacher_data)


@router.delete(
    "/{teacher_id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar docente",
)
def delete_teacher(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
):
    teacher_service = TeacherService(db)
    return teacher_service.delete_teacher(teacher_id)


@router.get(
    "/{teacher_id}/availability",
    response_model=TeacherAvailabilityListResponse,
    summary="Listar disponibilidad de un docente",
)
def list_teacher_availability(
    teacher_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER)
    ),
):
    availability_service = TeacherAvailabilityService(db)
    return availability_service.list_teacher_availabilities(teacher_id)


@router.post(
    "/availability",
    response_model=TeacherAvailabilityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear disponibilidad docente",
)
def create_teacher_availability(
    availability_data: TeacherAvailabilityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER)
    ),
):
    availability_service = TeacherAvailabilityService(db)
    return availability_service.create_availability(availability_data)


@router.put(
    "/availability/{availability_id}",
    response_model=TeacherAvailabilityResponse,
    summary="Actualizar disponibilidad docente",
)
def update_teacher_availability(
    availability_id: int,
    availability_data: TeacherAvailabilityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER)
    ),
):
    availability_service = TeacherAvailabilityService(db)
    return availability_service.update_availability(
        availability_id,
        availability_data,
    )


@router.delete(
    "/availability/{availability_id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar disponibilidad docente",
)
def delete_teacher_availability(
    availability_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER)
    ),
):
    availability_service = TeacherAvailabilityService(db)
    return availability_service.delete_availability(availability_id)