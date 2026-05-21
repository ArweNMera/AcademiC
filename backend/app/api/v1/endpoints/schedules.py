from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.schedule import (
    AcademicSchedule,
    ScheduleBlock,
    ScheduleStatus,
    ScheduleType,
)
from app.models.user import User, UserRole
from app.schemas.schedule_schema import (
    AcademicScheduleCreate,
    AcademicScheduleListResponse,
    AcademicScheduleResponse,
    AcademicScheduleUpdate,
)
from app.services.schedule_service import ScheduleService

router = APIRouter()


@router.get(
    "",
    response_model=AcademicScheduleListResponse,
    summary="Listar horarios académicos",
)
def list_schedules(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    academic_period: str | None = Query(default=None),
    schedule_type: ScheduleType | None = Query(default=None),
    status_filter: ScheduleStatus | None = Query(default=None),
    is_active: bool | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.COORDINATOR,
            UserRole.TEACHER,
            UserRole.STUDENT,
        )
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.list_schedules(
        skip=skip,
        limit=limit,
        academic_period=academic_period,
        schedule_type=schedule_type,
        status_filter=status_filter,
        is_active=is_active,
    )


@router.post(
    "",
    response_model=AcademicScheduleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear horario académico",
)
def create_schedule(
    schedule_data: AcademicScheduleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.create_schedule(schedule_data)


# --------------------------------------------------------------------------
# Endpoint para publicar horario institucional (corregido y mejorado)
# --------------------------------------------------------------------------
@router.patch(
    "/{schedule_id}/publish",
    summary="Publicar horario institucional",
)
def publish_academic_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule = (
        db.query(AcademicSchedule)
        .filter(AcademicSchedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Horario académico no encontrado",
        )

    if not schedule.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede publicar un horario inactivo",
        )

    total_blocks = (
        db.query(ScheduleBlock)
        .filter(ScheduleBlock.schedule_id == schedule_id)
        .count()
    )

    if total_blocks == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede publicar un horario sin bloques generados",
        )

    current_status = schedule.status
    if hasattr(current_status, "value"):
        current_status = current_status.value

    # Si ya está publicado, responder sin modificar
    if current_status == "PUBLISHED":
        return {
            "success": True,
            "message": "El horario ya estaba publicado",
            "schedule_id": schedule.id,
            "status": schedule.status,
            "total_blocks": total_blocks,
        }

    # No permitir publicar desde DRAFT
    if current_status == "DRAFT":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede publicar un horario en DRAFT. Primero genera el horario institucional.",
        )

    # Rechazar ARCHIVED (opcional pero recomendado)
    if current_status == "ARCHIVED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede publicar un horario archivado",
        )

    # Cambiar estado a PUBLISHED
    schedule.status = ScheduleStatus.PUBLISHED
    db.add(schedule)
    db.commit()
    db.refresh(schedule)

    return {
        "success": True,
        "message": "Horario institucional publicado correctamente",
        "schedule_id": schedule.id,
        "status": schedule.status,
        "total_blocks": total_blocks,
    }


@router.get(
    "/{schedule_id}",
    response_model=AcademicScheduleResponse,
    summary="Obtener horario académico por ID",
)
def get_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.ADMIN,
            UserRole.COORDINATOR,
            UserRole.TEACHER,
            UserRole.STUDENT,
        )
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.get_schedule_by_id(schedule_id)


@router.put(
    "/{schedule_id}",
    response_model=AcademicScheduleResponse,
    summary="Actualizar horario académico",
)
def update_schedule(
    schedule_id: int,
    schedule_data: AcademicScheduleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.update_schedule(schedule_id, schedule_data)


@router.patch(
    "/{schedule_id}/approve",
    response_model=AcademicScheduleResponse,
    summary="Aprobar horario académico",
)
def approve_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.approve_schedule(schedule_id)


@router.patch(
    "/{schedule_id}/archive",
    response_model=AcademicScheduleResponse,
    summary="Archivar horario académico",
)
def archive_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.archive_schedule(schedule_id)


@router.patch(
    "/{schedule_id}/deactivate",
    response_model=AcademicScheduleResponse,
    summary="Desactivar horario académico",
)
def deactivate_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.deactivate_schedule(schedule_id)


@router.patch(
    "/{schedule_id}/activate",
    response_model=AcademicScheduleResponse,
    summary="Activar horario académico",
)
def activate_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    schedule_service = ScheduleService(db)
    return schedule_service.activate_schedule(schedule_id)


@router.delete(
    "/{schedule_id}",
    status_code=status.HTTP_200_OK,
    summary="Eliminar horario académico",
)
def delete_schedule(
    schedule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN)),
):
    schedule_service = ScheduleService(db)
    return schedule_service.delete_schedule(schedule_id)