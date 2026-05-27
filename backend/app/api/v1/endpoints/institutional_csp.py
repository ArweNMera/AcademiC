from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_roles
from app.models.user import User, UserRole
from app.schemas.csp_schema import (
    InstitutionalCSPGenerateRequest,
    InstitutionalCSPGenerateResponse,
    InstitutionalCSPPreviewResponse,
    InstitutionalCSPSaveSelectedRequest,
)
from app.schemas.offering_csp_schema import (
    OfferingCSPGenerateRequest,
    OfferingCSPGenerateResponse,
    OfferingCSPSaveSolutionRequest,
    OfferingCSPSaveSolutionResponse,
)
from app.services.institutional_csp_service import InstitutionalCSPService
from app.services.offering_csp_service import OfferingCSPService
from app.services.traceability_service import TraceabilityService


router = APIRouter()


@router.post(
    "/generate-from-offerings",
    response_model=OfferingCSPGenerateResponse,
    summary="Generar soluciones CSP institucionales desde ofertas academicas",
)
def generate_from_offerings(
    request: OfferingCSPGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.COORDINATOR)),
):
    result = OfferingCSPService(db).generate(request)
    TraceabilityService(db).record_csp_generation(current_user, request, result)
    return result


@router.post(
    "/save-offering-solution",
    response_model=OfferingCSPSaveSolutionResponse,
    summary="Guardar como DRAFT una solucion CSP basada en ofertas",
)
def save_offering_solution(
    request: OfferingCSPSaveSolutionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.COORDINATOR)),
):
    result = OfferingCSPService(db).save_solution(request, current_user)
    TraceabilityService(db).record_saved_solution(current_user, result["schedule_id"])
    return result


@router.post(
    "/preview",
    response_model=InstitutionalCSPPreviewResponse,
    summary="Previsualizar soluciones CSP institucionales sin guardar",
)
def preview_institutional_schedule(
    request: InstitutionalCSPGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    csp_service = InstitutionalCSPService(db)

    return csp_service.preview_institutional_schedule(request)


@router.post(
    "/generate",
    response_model=InstitutionalCSPGenerateResponse,
    summary="Generar horario institucional con motor CSP",
)
def generate_institutional_schedule(
    request: InstitutionalCSPGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    csp_service = InstitutionalCSPService(db)

    return csp_service.generate_institutional_schedule(request)


@router.post(
    "/generate-selected",
    response_model=InstitutionalCSPGenerateResponse,
    summary="Guardar una solución CSP específica del preview",
)
def generate_selected_institutional_schedule(
    request: InstitutionalCSPSaveSelectedRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(UserRole.ADMIN, UserRole.COORDINATOR)
    ),
):
    csp_service = InstitutionalCSPService(db)

    return csp_service.generate_selected_solution(request)
