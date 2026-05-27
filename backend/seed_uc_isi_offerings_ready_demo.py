from app.core.database import SessionLocal
from app.models.academic import AcademicPeriod, CurriculumPlan
from app.models.classroom import Classroom
from app.models.offering import OfferingModality, OfferingShift, OfferingStatus, SectionOffering
from app.models.teacher import Teacher


def main():
    db = SessionLocal()
    try:
        period = db.query(AcademicPeriod).filter(AcademicPeriod.code == "2026-I").first()
        plan = db.query(CurriculumPlan).filter(CurriculumPlan.code == "ISI-UC-2026").first()
        teachers = db.query(Teacher).order_by(Teacher.id).limit(10).all()
        classrooms = (
            db.query(Classroom)
            .filter(Classroom.is_active == True, Classroom.capacity >= 40)
            .order_by(Classroom.id)
            .all()
        )
        if not period or not plan or not teachers or not classrooms:
            raise RuntimeError("Ejecute los seeds realista, curricular y de ofertas antes de este seed.")
        offerings = (
            db.query(SectionOffering)
            .filter(
                SectionOffering.academic_period_id == period.id,
                SectionOffering.curriculum_plan_id == plan.id,
                SectionOffering.cycle_number == 1,
            )
            .order_by(SectionOffering.id)
            .all()
        )
        if not offerings:
            raise RuntimeError("No existen ofertas de ciclo 1 para preparar.")
        for index, offering in enumerate(offerings):
            offering.teacher_id = teachers[index % len(teachers)].id
            offering.classroom_id = classrooms[index % len(classrooms)].id
            offering.modality = OfferingModality.PRESENTIAL
            offering.shift = OfferingShift.MORNING
            offering.capacity = max(offering.capacity, offering.estimated_students, 40)
            offering.status = OfferingStatus.APPROVED
            offering.notes = "Oferta demo aprobada para validar CSP desde ofertas."
        db.commit()
        print(f"Ofertas APPROVED preparadas para CSP: {len(offerings)}.")
        print("No se publica automaticamente; la publicacion requiere el flujo seguro.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
