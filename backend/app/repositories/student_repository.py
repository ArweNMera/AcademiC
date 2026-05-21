from sqlalchemy.orm import Session

from app.models.student import Student
from app.schemas.student_schema import StudentCreate, StudentUpdate


class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def count_all(self) -> int:
        return self.db.query(Student).count()

    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> list[Student]:
        return (
            self.db.query(Student)
            .order_by(Student.id.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id(self, student_id: int) -> Student | None:
        return (
            self.db.query(Student)
            .filter(Student.id == student_id)
            .first()
        )

    def get_by_user_id(self, user_id: int) -> Student | None:
        return (
            self.db.query(Student)
            .filter(Student.user_id == user_id)
            .first()
        )

    def get_by_student_code(self, student_code: str) -> Student | None:
        return (
            self.db.query(Student)
            .filter(Student.student_code == student_code)
            .first()
        )

    def create(self, student_data: StudentCreate) -> Student:
        student = Student(**student_data.model_dump())

        self.db.add(student)
        self.db.commit()
        self.db.refresh(student)

        return student

    def update(
        self,
        student: Student,
        student_data: StudentUpdate,
    ) -> Student:
        update_data = student_data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(student, field, value)

        self.db.commit()
        self.db.refresh(student)

        return student

    def delete(self, student: Student) -> None:
        self.db.delete(student)
        self.db.commit()