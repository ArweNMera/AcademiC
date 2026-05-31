import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import toast from 'react-hot-toast'

import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { academicHistoryService } from '../../services/academicHistoryService'
import { academicProgramService } from '../../services/academicProgramService'
import { courseService } from '../../services/courseService'
import { institutionalStudentService } from '../../services/institutionalStudentService'
import { extractList, getErrorMessage } from '../../utils/extractList'

const emptyFilters = { student_id: '', academic_program_id: '', course_id: '', status: '' }

export default function AcademicHistoryPage() {
    const [history, setHistory] = useState([])
    const [students, setStudents] = useState([])
    const [programs, setPrograms] = useState([])
    const [courses, setCourses] = useState([])
    const [filters, setFilters] = useState(emptyFilters)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = async (nextFilters = filters) => {
        setLoading(true)
        setError('')
        try {
            const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value !== ''))
            setHistory(await academicHistoryService.getHistory(params))
            if (nextFilters.student_id) setSummary(await academicHistoryService.getStudentSummary(nextFilters.student_id))
            else setSummary(null)
        } catch (requestError) {
            setError(getErrorMessage(requestError, 'No se pudo cargar el historial academico.'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let active = true
        Promise.all([
            academicHistoryService.getHistory(),
            institutionalStudentService.getStudents(),
            academicProgramService.getPrograms(),
            courseService.getCourses({ limit: 500 }),
        ]).then(([historyData, studentData, programData, courseData]) => {
            if (!active) return
            setHistory(historyData)
            setStudents(extractList(studentData))
            setPrograms(extractList(programData))
            setCourses(extractList(courseData))
        }).catch((requestError) => {
            if (active) setError(getErrorMessage(requestError, 'No se pudo cargar el historial academico.'))
        }).finally(() => {
            if (active) setLoading(false)
        })
        return () => { active = false }
    }, [])

    const submit = (event) => {
        event.preventDefault()
        load(filters).catch(() => toast.error('No se pudo actualizar el historial.'))
    }

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Institucional" title="Historial academico" description="Cursos aprobados, desaprobados, en progreso y retirados de estudiantes matriculados." />
            <form onSubmit={submit} className="grid gap-3 rounded-lg border bg-white p-4 shadow-sm lg:grid-cols-5">
                <select className="rounded-lg border px-3 py-2" value={filters.student_id} onChange={(event) => setFilters({ ...filters, student_id: event.target.value })}><option value="">Todos los estudiantes</option>{students.map((student) => <option key={student.id} value={student.id}>{student.student_code} - {student.student_name}</option>)}</select>
                <select className="rounded-lg border px-3 py-2" value={filters.academic_program_id} onChange={(event) => setFilters({ ...filters, academic_program_id: event.target.value })}><option value="">Todas las carreras</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select>
                <select className="rounded-lg border px-3 py-2" value={filters.course_id} onChange={(event) => setFilters({ ...filters, course_id: event.target.value })}><option value="">Todos los cursos</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.code} - {course.name}</option>)}</select>
                <select className="rounded-lg border px-3 py-2" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Todos los estados</option>{['APPROVED', 'FAILED', 'IN_PROGRESS', 'WITHDRAWN', 'PENDING_REVIEW'].map((value) => <option key={value}>{value}</option>)}</select>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white"><Search size={16} /> Filtrar</button>
            </form>

            {summary && <div className="grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-5"><div><p className="text-xs text-slate-500">Estudiante</p><p className="font-semibold">{summary.student_name}</p></div><Metric label="Aprobados" value={summary.approved_courses} /><Metric label="Desaprobados" value={summary.failed_courses} /><Metric label="En progreso" value={summary.in_progress_courses} /><Metric label="Creditos aprobados" value={summary.approved_credits} /></div>}
            {loading && <LoadingState title="Cargando historial..." />}
            {!loading && error && <ErrorState message={error} onRetry={() => load()} />}
            {!loading && !error && history.length === 0 && <EmptyState title="No hay historial academico" text="Los registros historicos apareceran cuando se carguen cursos del estudiante." />}
            {!loading && !error && history.length > 0 && <div className="overflow-x-auto rounded-lg border bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Estudiante</th><th className="px-4 py-3">Curso</th><th className="px-4 py-3">Periodo</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Nota</th><th className="px-4 py-3">Intento</th><th className="px-4 py-3">Creditos</th></tr></thead><tbody>{history.map((item) => <tr key={item.id} className="border-t"><td className="px-4 py-3"><p className="font-semibold">{item.student_code}</p><p className="text-xs text-slate-500">{item.student_name}</p></td><td className="px-4 py-3"><p className="font-semibold">{item.course_code}</p><p className="text-xs text-slate-500">{item.course_name}</p></td><td className="px-4 py-3">{item.academic_period_name || '-'}</td><td className="px-4 py-3"><StatusBadge value={item.status} /></td><td className="px-4 py-3">{item.grade ?? '-'}</td><td className="px-4 py-3">{item.attempt_number}</td><td className="px-4 py-3">{item.credits ?? '-'}</td></tr>)}</tbody></table></div>}
        </div>
    )
}

function Metric({ label, value }) {
    return <div><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-bold text-slate-900">{value}</p></div>
}
