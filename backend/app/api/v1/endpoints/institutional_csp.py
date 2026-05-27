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
from app.schemas.offering_schema import OfferingsCSPPrepareRequest, OfferingsCSPPrepareResponse
from app.services.institutional_csp_service import InstitutionalCSPService
from app.services.offering_service import OfferingsCSPPreparationService


router = APIRouter()


@router.post(
    "/generate-from-offerings",
    response_model=OfferingsCSPPrepareResponse,
    summary="Validar ofertas academicas como fuente de entrada CSP",
)
def generate_from_offerings(
    request: OfferingsCSPPrepareRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.ADMIN, UserRole.COORDINATOR)),
):
    return OfferingsCSPPreparationService(db).prepare(request)


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
