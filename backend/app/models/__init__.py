from app.core.database import Base

from app.models.user import User, UserRole
from app.models.student import Student, StudentCourseEnrollment
from app.models.teacher import Teacher, TeacherAvailability
from app.models.course import Course, CourseSection
from app.models.classroom import Classroom, ClassroomType
from app.models.schedule import (
    AcademicSchedule,
    ScheduleBlock,
    ScheduleStatus,
    ScheduleType,
    StudentSchedule,
    StudentScheduleBlock,
)
from app.models.environmental_metric import EnvironmentalMetric
from app.models.academic import (
    AcademicPeriod,
    AcademicPeriodStatus,
    AcademicProgram,
    AcademicProgramStatus,
    CoursePrerequisite,
    CurriculumCourse,
    CurriculumCourseType,
    CurriculumPlan,
    CurriculumPlanStatus,
    ElectiveArea,
    ElectiveBankCourse,
    PrerequisiteType,
)
from app.models.offering import (
    OfferingConflict,
    OfferingConflictSeverity,
    OfferingConflictType,
    OfferingModality,
    OfferingShift,
    OfferingStatus,
    SectionOffering,
    SectionRequirement,
)
from app.models.schedule_change_request import (
    ScheduleChangeRequest,
    ScheduleChangeRequestStatus,
    ScheduleChangeRequestType,
)

__all__ = [
    "Base",
    "User",
    "UserRole",
    "Student",
    "StudentCourseEnrollment",
    "Teacher",
    "TeacherAvailability",
    "Course",
    "CourseSection",
    "Classroom",
    "ClassroomType",
    "AcademicSchedule",
    "ScheduleBlock",
    "StudentSchedule",
    "StudentScheduleBlock",
    "EnvironmentalMetric",
    "ScheduleStatus",
    "ScheduleType",
    "AcademicPeriod",
    "AcademicPeriodStatus",
    "AcademicProgram",
    "AcademicProgramStatus",
    "CurriculumPlan",
    "CurriculumPlanStatus",
    "CurriculumCourse",
    "CurriculumCourseType",
    "CoursePrerequisite",
    "PrerequisiteType",
    "ElectiveBankCourse",
    "ElectiveArea",
    "SectionOffering",
    "SectionRequirement",
    "OfferingConflict",
    "OfferingModality",
    "OfferingShift",
    "OfferingStatus",
    "OfferingConflictType",
    "OfferingConflictSeverity",
    "ScheduleChangeRequest",
    "ScheduleChangeRequestStatus",
    "ScheduleChangeRequestType",
]
