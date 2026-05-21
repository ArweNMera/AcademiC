from datetime import time

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.schedule import AcademicSchedule, ScheduleStatus
from app.services.schedule_quality_service import ScheduleQualityService


class SchedulePublicationService:
    def __init__(self, db: Session):
        self.db = db
        self.quality_service = ScheduleQualityService(db)

    def publish_safely(
        self,
        schedule_id: int,
        career_filter: str | None = None,
        cycle_filter: list[int] | None = None,
        course_ids: list[int] | None = None,
        allowed_days: list[int] | None = None,
        start_hour: time = time(7, 0),
        end_hour: time = time(22, 0),
    ):
        schedule = self._get_schedule(schedule_id)

        previous_status = self._enum_to_str(schedule.status)

        report = self.quality_service.get_quality_report(
            schedule_id=schedule_id,
            career_filter=career_filter,
            cycle_filter=cycle_filter or [],
            course_ids=course_ids or [],
            allowed_days=allowed_days or [1, 2, 3, 4, 5, 6, 7],
            start_hour=start_hour,
            end_hour=end_hour,
        )

        summary = report["summary"]
        stats = report["stats"]
        issues = report["issues"]

        total_blocks = int(stats.get("total_blocks", 0))
        critical_issues = int(summary.get("critical_issues", 0))
        warning_issues = int(summary.get("warning_issues", 0))
        info_issues = int(summary.get("info_issues", 0))
        total_issues = int(summary.get("total_issues", 0))

        if total_blocks <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "No se puede publicar un horario sin bloques generados.",
                    "schedule_id": schedule_id,
                    "total_blocks": total_blocks,
                    "critical_issues": critical_issues,
                    "warning_issues": warning_issues,
                    "issues": issues[:20],
                },
            )

        if critical_issues > 0:
            critical_items = [
                issue
                for issue in issues
                if issue.get("severity") == "CRITICAL"
            ]

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "message": "No se puede publicar el horario porque tiene errores críticos.",
                    "schedule_id": schedule_id,
                    "total_blocks": total_blocks,
                    "critical_issues": critical_issues,
                    "warning_issues": warning_issues,
                    "issues": critical_items[:20],
                },
            )

        schedule.status = ScheduleStatus.PUBLISHED

        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)

        warnings = [
            issue
            for issue in issues
            if issue.get("severity") == "WARNING"
        ]

        return {
            "success": True,
            "message": "Horario publicado correctamente. No se encontraron errores críticos.",
            "schedule_id": schedule.id,
            "schedule_name": schedule.name,
            "previous_status": previous_status,
            "new_status": self._enum_to_str(schedule.status),
            "publishable": True,
            "total_blocks": total_blocks,
            "total_issues": total_issues,
            "critical_issues": critical_issues,
            "warning_issues": warning_issues,
            "info_issues": info_issues,
            "warnings": warnings[:20],
        }

    def _get_schedule(self, schedule_id: int):
        schedule = (
            self.db.query(AcademicSchedule)
            .filter(AcademicSchedule.id == schedule_id)
            .first()
        )

        if not schedule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Horario académico no encontrado.",
            )

        if not schedule.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede publicar un horario inactivo.",
            )

        return schedule

    def _enum_to_str(self, value):
        if value is None:
            return None

        if hasattr(value, "value"):
            return value.value

        return str(value)