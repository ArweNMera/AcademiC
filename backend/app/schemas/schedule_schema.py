from datetime import datetime

from pydantic import BaseModel, Field

from app.models.schedule import ScheduleStatus, ScheduleType


class AcademicScheduleBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=150)
    academic_period: str = Field(..., min_length=4, max_length=30)
    schedule_type: ScheduleType = ScheduleType.INSTITUTIONAL
    status: ScheduleStatus = ScheduleStatus.DRAFT
    generated_by_user_id: int | None = Field(default=None, gt=0)
    score: float = Field(default=0.0, ge=0.0, le=100.0)
    is_active: bool = True


class AcademicScheduleCreate(AcademicScheduleBase):
    pass


class AcademicScheduleUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=3, max_length=150)
    academic_period: str | None = Field(default=None, min_length=4, max_length=30)
    schedule_type: ScheduleType | None = None
    status: ScheduleStatus | None = None
    generated_by_user_id: int | None = Field(default=None, gt=0)
    score: float | None = Field(default=None, ge=0.0, le=100.0)
    is_active: bool | None = None


class AcademicScheduleResponse(BaseModel):
    id: int
    name: str
    academic_period: str
    schedule_type: ScheduleType
    status: ScheduleStatus
    generated_by_user_id: int | None
    score: float
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class AcademicScheduleListResponse(BaseModel):
    total: int
    schedules: list[AcademicScheduleResponse]