import enum
from datetime import time

from sqlalchemy import Boolean, Enum, Float, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class ScheduleStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    GENERATED = "GENERATED"
    APPROVED = "APPROVED"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class ScheduleType(str, enum.Enum):
    INSTITUTIONAL = "INSTITUTIONAL"
    STUDENT = "STUDENT"


class AcademicSchedule(Base, TimestampMixin):
    __tablename__ = "academic_schedules"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    academic_period: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )  # Ejemplo: 2026-1

    schedule_type: Mapped[ScheduleType] = mapped_column(
        Enum(ScheduleType),
        nullable=False,
    )

    status: Mapped[ScheduleStatus] = mapped_column(
        Enum(ScheduleStatus),
        nullable=False,
        default=ScheduleStatus.DRAFT,
    )

    generated_by_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    # Relaciones
    blocks = relationship(
        "ScheduleBlock",
        back_populates="schedule",
        cascade="all, delete-orphan",
    )

    student_schedules = relationship(
        "StudentSchedule",
        back_populates="schedule",
        cascade="all, delete-orphan",
    )


class ScheduleBlock(Base, TimestampMixin):
    __tablename__ = "schedule_blocks"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    schedule_id: Mapped[int] = mapped_column(
        ForeignKey("academic_schedules.id", ondelete="CASCADE"),
        nullable=False,
    )

    section_id: Mapped[int] = mapped_column(
        ForeignKey("course_sections.id"),
        nullable=False,
    )

    classroom_id: Mapped[int | None] = mapped_column(
        ForeignKey("classrooms.id"),
        nullable=True,
    )

    day_of_week: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )  # 1=Lunes, 2=Martes, ..., 7=Domingo

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    # Relaciones
    schedule = relationship(
        "AcademicSchedule",
        back_populates="blocks",
    )

    section = relationship(
        "CourseSection",
        back_populates="schedule_blocks",
    )

    classroom = relationship(
        "Classroom",
        back_populates="schedule_blocks",
    )


class StudentSchedule(Base, TimestampMixin):
    __tablename__ = "student_schedules"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
    )

    schedule_id: Mapped[int] = mapped_column(
        ForeignKey("academic_schedules.id", ondelete="CASCADE"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        default="Horario personalizado",
    )

    score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    is_favorite: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # Relaciones
    student = relationship(
        "Student",
        back_populates="student_schedules",
    )

    schedule = relationship(
        "AcademicSchedule",
        back_populates="student_schedules",
    )
    
    selected_blocks = relationship(
        "StudentScheduleBlock",
        back_populates="student_schedule",
        cascade="all, delete-orphan",
    )


class StudentScheduleBlock(Base, TimestampMixin):
    __tablename__ = "student_schedule_blocks"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    student_schedule_id: Mapped[int] = mapped_column(
        ForeignKey("student_schedules.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    schedule_block_id: Mapped[int] = mapped_column(
        ForeignKey("schedule_blocks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Relaciones
    student_schedule = relationship(
        "StudentSchedule",
        back_populates="selected_blocks",
    )

    schedule_block = relationship("ScheduleBlock")