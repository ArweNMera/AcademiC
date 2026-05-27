import { useEffect, useMemo, useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { reportService } from '../../services/reportService'

const definitions = {
    'teacher-load': {
        title: 'Carga docente',
        description: 'Horas asignadas en horarios publicados y nivel de utilizacion docente.',
        load: reportService.getTeacherLoadReport,
        export: reportService.exportTeacherLoadCsv,
        rows: (data) => data.teachers,
        cards: (data) => [['Docentes', data.teachers.length], ['Con carga', data.teachers.filter((x) => x.assigned_weekly_hours > 0).length], ['Sobrecargados', data.teachers.filter((x) => x.status === 'OVERLOADED').length]],
        columns: [['teacher_name', 'Docente'], ['assigned_weekly_hours', 'Horas'], ['max_weekly_hours', 'Maximo'], ['load_percentage', '% carga'], ['courses_count', 'Cursos'], ['sections_count', 'Secciones'], ['status', 'Estado']],
    },
    'classroom-usage': {
        title: 'Uso de aulas',
        description: 'Ocupacion semanal calculada desde bloques institucionales publicados.',
        load: reportService.getClassroomUsageReport,
        export: reportService.exportClassroomUsageCsv,
        rows: (data) => data.classrooms,
        cards: (data) => [['Aulas', data.classrooms.length], ['En uso', data.classrooms.filter((x) => x.blocks_count > 0).length], ['Alta ocupacion', data.classrooms.filter((x) => ['HIGH_USAGE', 'SATURATED'].includes(x.status)).length]],
        columns: [['classroom_code', 'Codigo'], ['classroom_name', 'Aula'], ['type', 'Tipo'], ['capacity', 'Capacidad'], ['used_hours', 'Horas'], ['usage_percentage', '% uso'], ['status', 'Estado']],
    },
    offerings: {
        title: 'Estado de ofertas',
        description: 'Avance de secciones ofertadas por periodo academico.',
        load: reportService.getOfferingStatusReport,
        export: reportService.exportOfferingStatusCsv,
        rows: (data) => Object.entries(data.by_status || {}).map(([status, count]) => ({ status, count })),
        cards: (data) => [['Ofertas', data.total_offerings], ['Sin docente', data.missing_teacher], ['Sin aula', data.missing_classroom], ['Publicadas', data.published_count]],
        columns: [['status', 'Estado'], ['count', 'Cantidad']],
    },
    conflicts: {
        title: 'Conflictos de oferta',
        description: 'Alertas detectadas durante la preparacion y validacion de oferta.',
        load: reportService.getConflictsReport,
        export: reportService.exportConflictsCsv,
        rows: (data) => data.details,
        cards: (data) => [['Conflictos', data.total_conflicts], ['Pendientes', data.unresolved_count], ['Resueltos', data.resolved_count], ['Criticos', data.by_severity?.CRITICAL || 0]],
        columns: [['conflict_type', 'Tipo'], ['severity', 'Severidad'], ['related_course', 'Curso'], ['related_section', 'Seccion'], ['message', 'Mensaje'], ['is_resolved', 'Resuelto']],
    },
    schedules: {
        title: 'Horarios institucionales',
        description: 'Horarios generados, calidad y distribucion de bloques.',
        load: reportService.getSchedulesReport,
        rows: (data) => data.schedules,
        cards: (data) => [['Horarios', data.schedules.length], ['Publicados', data.schedules.filter((x) => x.status === 'PUBLISHED').length], ['Borradores', data.schedules.filter((x) => x.status === 'DRAFT').length]],
        columns: [['name', 'Horario'], ['source_type', 'Fuente'], ['status', 'Estado'], ['quality_score', 'Calidad'], ['total_blocks', 'Bloques'], ['period', 'Periodo'], ['program', 'Programa']],
    },
    students: {
        title: 'Indicadores estudiantiles',
        description: 'Cursos asignados y horarios personales guardados por estudiantes.',
        load: reportService.getStudentsReport,
        export: reportService.exportStudentsCsv,
        rows: (data) => data.most_common_courses,
        cards: (data) => [['Estudiantes', data.total_students], ['Con asignaciones', data.students_with_enrollments], ['Con horario guardado', data.students_with_saved_schedules], ['Creditos promedio', data.average_credits]],
        columns: [['course_code', 'Codigo'], ['course_name', 'Curso asignado'], ['students', 'Estudiantes']],
    },
    'change-requests': {
        title: 'Solicitudes docentes',
        description: 'Seguimiento de peticiones de cambio registradas por docentes.',
        load: reportService.getChangeRequestsReport,
        rows: (data) => data.requests_by_teacher,
        cards: (data) => [['Solicitudes', data.total], ['Pendientes', data.pending_count], ['Aprobadas', data.approved_count], ['Rechazadas', data.rejected_count]],
        columns: [['teacher_name', 'Docente'], ['total', 'Total'], ['pending', 'Pendientes']],
    },
    sustainability: {
        title: 'Sostenibilidad',
        description: 'Metricas HTTP ambientales y disponibilidad del ultimo analisis GreenFrame.',
        load: reportService.getSustainabilityReport,
        rows: (data) => Object.entries(data.environmental_metrics).map(([indicator, value]) => ({ indicator, value })),
        cards: (data) => [['Requests medidos', data.environmental_metrics.total_requests], ['Bytes', data.environmental_metrics.total_bytes], ['CO2 estimado (g)', Number(data.environmental_metrics.total_co2 || 0).toFixed(8)], ['GreenFrame', data.latest_greenframe_result.available ? 'Disponible' : 'Pendiente']],
        columns: [['indicator', 'Indicador'], ['value', 'Valor']],
    },
}

export default function ReportDetailPage({ reportType }) {
    const config = useMemo(() => definitions[reportType], [reportType])
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [periodId, setPeriodId] = useState('')

    const load = async () => {
        try {
            setLoading(true)
            setData(await config.load(periodId ? { academic_period_id: Number(periodId) } : {}))
        } catch {
            toast.error('No se pudo cargar el reporte')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let active = true
        config.load()
            .then((result) => { if (active) setData(result) })
            .catch(() => toast.error('No se pudo cargar el reporte'))
            .finally(() => { if (active) setLoading(false) })
        return () => { active = false }
    }, [config])

    const rows = data ? config.rows(data) : []

    return <div className="space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-6 lg:flex-row lg:items-center">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Reportes academicos</p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">{config.title}</h1>
                <p className="mt-2 text-sm text-slate-500">{config.description}</p>
                {data?.active_period && <p className="mt-2 text-sm font-semibold text-slate-600">Periodo: {data.active_period.code}</p>}
            </div>
            <div className="flex gap-2">
                {reportType !== 'sustainability' && (
                    <input
                        type="number"
                        min="1"
                        value={periodId}
                        onChange={(event) => setPeriodId(event.target.value)}
                        placeholder="ID periodo"
                        className="w-32 rounded-xl border px-3 py-2 text-sm text-slate-700"
                    />
                )}
                {config.export && (
                    <button onClick={() => config.export(periodId ? { academic_period_id: Number(periodId) } : {}).catch(() => toast.error('No se pudo exportar CSV'))} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white">
                        <Download size={17} /> Exportar CSV
                    </button>
                )}
                <button onClick={load} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold text-slate-700">
                    <RefreshCw size={17} /> Actualizar
                </button>
            </div>
        </header>

        {loading && !data && <div className="rounded-2xl border bg-white p-10 text-slate-500">Cargando reporte...</div>}
        {data && (
            <>
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {config.cards(data).map(([title, value]) => (
                        <div key={title} className="rounded-2xl border bg-white p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
                            <p className="mt-2 text-3xl font-bold text-slate-900">{value ?? '-'}</p>
                        </div>
                    ))}
                </section>
                <section className="overflow-hidden rounded-2xl border bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>{config.columns.map(([, label]) => <th key={label} className="px-4 py-3">{label}</th>)}</tr>
                            </thead>
                            <tbody className="divide-y">
                                {rows.map((row, index) => (
                                    <tr key={row.id || row.teacher_id || row.classroom_id || row.schedule_id || `${reportType}-${index}`}>
                                        {config.columns.map(([field]) => <td key={field} className="max-w-sm px-4 py-3 text-slate-700">{display(row[field])}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!rows.length && <p className="p-8 text-center text-slate-500">No hay registros para mostrar.</p>}
                </section>
                {reportType === 'sustainability' && <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">{data.message}</p>}
            </>
        )}
    </div>
}

function display(value) {
    if (typeof value === 'boolean') return value ? 'Si' : 'No'
    if (value === null || value === undefined) return '-'
    return String(value)
}
