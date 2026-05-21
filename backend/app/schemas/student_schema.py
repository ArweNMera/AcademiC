from datetime import datetime

from pydantic import BaseModel, Field, model_validator


class StudentBase(BaseModel):
    user_id: int = Field(..., gt=0)
    student_code: str = Field(..., min_length=3, max_length=30)
    career: str = Field(..., min_length=3, max_length=120)
    current_cycle: int = Field(..., ge=1, le=10)
    min_credits: int = Field(default=7, ge=1, le=25)
    max_credits: int = Field(default=25, ge=1, le=30)

    @model_validator(mode="after")
    def validate_credit_range(self):
        if self.min_credits > self.max_credits:
            raise ValueError("Los créditos mínimos no pueden ser mayores que los máximos")

        if self.min_credits < 7:
            raise ValueError("El mínimo de créditos permitido es 7")

        if self.max_credits > 25:
            raise ValueError("El máximo de créditos permitido es 25")

        return self


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    student_code: str | None = Field(default=None, min_length=3, max_length=30)
    career: str | None = Field(default=None, min_length=3, max_length=120)
    current_cycle: int | None = Field(default=None, ge=1, le=10)
    min_credits: int | None = Field(default=None, ge=1, le=25)
    max_credits: int | None = Field(default=None, ge=1, le=30)

    @model_validator(mode="after")
    def validate_credit_range(self):
        if (
            self.min_credits is not None
            and self.max_credits is not None
            and self.min_credits > self.max_credits
        ):
            raise ValueError("Los créditos mínimos no pueden ser mayores que los máximos")

        if self.min_credits is not None and self.min_credits < 7:
            raise ValueError("El mínimo de créditos permitido es 7")

        if self.max_credits is not None and self.max_credits > 25:
            raise ValueError("El máximo de créditos permitido es 25")

        return self


class StudentResponse(BaseModel):
    id: int
    user_id: int
    student_code: str
    career: str
    current_cycle: int
    min_credits: int
    max_credits: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class StudentListResponse(BaseModel):
    total: int
    students: list[StudentResponse]