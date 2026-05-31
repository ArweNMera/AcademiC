import { useEffect, useState } from 'react'
import { Eye, Pencil, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import LoadingState from '../../components/common/LoadingState'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import { academicProgramService } from '../../services/academicProgramService'
import { curriculumService } from '../../services/curriculumService'
import { institutionalStudentService } from '../../services/institutionalStudentService'
import { extractList, getErrorMessage } from '../../utils/extractList'

const emptyFilters = { academic_program_id: '', current_cycle: '', enrollment_status: '' }

export default function InstitutionalStudentsPage() {
    const [students, setStudents] = useState([])
    const [programs, setPrograms] = useState([])
    const [plans, setPlans] = useState([])
    const [filters, setFilters] = useState(emptyFilters)
    const [editing, setEditing] = useState(null)
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const load = async (nextFilters = filters) => {
        setLoading(true)
        setError('')
        try {
            const params = Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value !== ''))
            const data = await institutionalStudentService.getStudents(params)
            setStudents(extractList(data))
        } catch (requestError) {
            setError(getErrorMessage(requestError, 'No se pudieron cargar los estudiantes institucionales.'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let active = true
        Promise.all([
            institutionalStudentService.getStudents(),
            academicProgramService.getPrograms(),
            curriculumService.getPlans(),
        ]).then(([studentData, programData, planData]) => {
            if (!active) return
            setStudents(extractList(studentData))
            setPrograms(extractList(programData))
            setPlans(extractList(planData))
        }).catch((requestError) => {
            if (active) setError(getErrorMessage(requestError, 'No se pudieron cargar los estudiantes institucionales.'))
        }).finally(() => {
            if (active) setLoading(false)
        })
        return () => { active = false }
    }, [])

    const filteredPlans = plans.filter(
        (plan) => !editing?.academic_program_id || Number(plan.program_id) === Number(editing.academic_program_id),
    )

    const submit = async (event) => {
        event.preventDefault()
        try {
            await institutionalStudentService.updateStudent(editing.id, {
                academic_program_id: Number(editing.academic_program_id) || null,
                curriculum_plan_id: Number(editing.curriculum_plan_id) || null,
                current_cycle: Number(editing.current_cycle),
                enrollment_status: editing.enrollment_status,
                max_credits_allowed: Number(editing.max_credits_allowed),
                is_active: editing.is_active,
            })
            toast.success('Datos institucionales actualizados')
            setEditing(null)
            await load()
        } catch (requestError) {
            toast.error(getErrorMessage(requestError, 'No se pudo actualizar el estudiante.'))
        }
    }

    const showSummary = async (id) => {
        try {
            setSummary(await institutionalStudentService.getAcademicSummary(id))
        } catch (requestError) {
            toast.error(getErrorMessage(requestError, 'No se pudo cargar el resumen academico.'))
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader eyebrow="Institucional" title="Estudiantes institucionales" description="Perfiles matriculados vinculados a sede, carrera, plan curricular y ciclo actual." />
            <form onSubmit={(event) => { event.preventDefault(); load(filters) }} className="grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-4">
                <select className="rounded-lg border px-3 py-2" value={filters.academic_program_id} onChange={(event) => setFilters({ ...filters, academic_program_id: event.target.value })}><option value="">Todas las carreras</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select>
                <select className="rounded-lg border px-3 py-2" value={filters.current_cycle} onChange={(event) => setFilters({ ...filters, current_cycle: event.target.value })}><option value="">Todos los ciclos</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>Ciclo {index + 1}</option>)}</select>
                <select className="rounded-lg border px-3 py-2" value={filters.enrollment_status} onChange={(event) => setFilters({ ...filters, enrollment_status: event.target.value })}><option value="">Todos los estados</option>{['ENROLLED', 'RESERVED', 'GRADUATED', 'WITHDRAWN', 'SUSPENDED'].map((value) => <option key={value}>{value}</option>)}</select>
                <button className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white">Filtrar</button>
            </form>

            {summary && <div className="grid gap-3 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-5"><div><p className="text-xs text-slate-500">Estudiante</p><p className="font-semibold">{summary.student_name}</p></div><Metric label="Aprobados" value={summary.approved_courses} /><Metric label="Desaprobados" value={summary.failed_courses} /><Metric label="En progreso" value={summary.in_progress_courses} /><Metric label="Creditos aprobados" value={summary.approved_credits} /></div>}
            {editing && <form onSubmit={submit} className="grid gap-3 rounded-lg border border-orange-200 bg-white p-4 shadow-sm md:grid-cols-4"><select className="rounded-lg border px-3 py-2" value={editing.academic_program_id || ''} onChange={(event) => setEditing({ ...editing, academic_program_id: event.target.value, curriculum_plan_id: '' })}>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select><select className="rounded-lg border px-3 py-2" value={editing.curriculum_plan_id || ''} onChange={(event) => setEditing({ ...editing, curriculum_plan_id: event.target.value })}>{filteredPlans.map((plan) => <option key={plan.id} value={plan.id}>{plan.code}</option>)}</select><input className="rounded-lg border px-3 py-2" type="number" min="1" max="10" value={editing.current_cycle} onChange={(event) => setEditing({ ...editing, current_cycle: event.target.value })} /><div className="flex gap-2"><button className="rounded-lg bg-orange-600 p-2 text-white" title="Guardar"><Save size={18} /></button><button type="button" onClick={() => setEditing(null)} className="rounded-lg border p-2" title="Cancelar"><X size={18} /></button></div></form>}

            {loading && <LoadingState title="Cargando estudiantes..." />}
            {!loading && error && <ErrorState message={error} onRetry={() => load()} />}
            {!loading && !error && students.length === 0 && <EmptyState title="No hay estudiantes institucionales" text="Ejecuta el seed demo o registra perfiles institucionales." />}
            {!loading && !error && students.length > 0 && <div className="overflow-x-auto rounded-lg border bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Codigo</th><th className="px-4 py-3">Estudiante</th><th className="px-4 py-3">Carrera</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Ciclo</th><th className="px-4 py-3">Matricula</th><th className="px-4 py-3">Creditos</th><th className="px-4 py-3">Activo</th><th className="px-4 py-3">Acciones</th></tr></thead><tbody>{students.map((student) => <tr key={student.id} className="border-t"><td className="px-4 py-3 font-semibold">{student.student_code}</td><td className="px-4 py-3">{student.student_name || '-'}</td><td className="px-4 py-3">{student.academic_program_name || student.career}</td><td className="px-4 py-3">{student.curriculum_plan_code || '-'}</td><td className="px-4 py-3">{student.current_cycle}</td><td className="px-4 py-3"><StatusBadge value={student.enrollment_status} /></td><td className="px-4 py-3">{student.max_credits_allowed ?? student.max_credits}</td><td className="px-4 py-3"><StatusBadge value={student.is_active ? 'ACTIVE' : 'INACTIVE'} /></td><td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => showSummary(student.id)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Ver resumen"><Eye size={16} /></button><button onClick={() => setEditing(student)} className="rounded-lg p-2 text-orange-600 hover:bg-orange-50" title="Editar"><Pencil size={16} /></button></div></td></tr>)}</tbody></table></div>}
        </div>
    )
}

function Metric({ label, value }) {
    return <div><p className="text-xs text-slate-500">{label}</p><p className="text-xl font-bold text-slate-900">{value}</p></div>
}
