from sqlalchemy import Boolean, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Student(Base, TimestampMixin):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    student_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
    )

    career: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    current_cycle: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    min_credits: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=7,
    )

    max_credits: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=25,
    )

    user = relationship(
        "User",
        back_populates="student_profile",
    )

    student_schedules = relationship(
        "StudentSchedule",
        back_populates="student",
        cascade="all, delete-orphan",
    )

    course_enrollments = relationship(
        "StudentCourseEnrollment",
        back_populates="student",
        cascade="all, delete-orphan",
    )


class StudentCourseEnrollment(Base, TimestampMixin):
    __tablename__ = "student_course_enrollments"

    __table_args__ = (
        UniqueConstraint(
            "student_id",
            "course_id",
            "academic_period",
            name="uq_student_course_period",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
        autoincrement=True,
    )

    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    course_id: Mapped[int] = mapped_column(
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    academic_period: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="2026-1",
        index=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="ENROLLED",
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    student = relationship(
        "Student",
        back_populates="course_enrollments",
    )

    course = relationship(
        "Course",
        back_populates="student_enrollments",
    )