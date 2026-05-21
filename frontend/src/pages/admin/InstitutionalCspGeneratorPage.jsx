import { useState } from 'react'
import {
    CalendarDays,
    CheckCircle,
    ClipboardCheck,
    Loader2,
    PlayCircle,
    Rocket,
    Save,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { scheduleService } from '../../services/scheduleService'
import { institutionalCspService } from '../../services/institutionalCspService'

const DEFAULT_FORM = {
    name: 'Horario Institucional Ingeniería de Sistemas 2026-1',
    academic_period: '2026-1',
    schedule_type: 'INSTITUTIONAL',
    status: 'DRAFT',
    is_active: true,
}

const DEFAULT_CSP_CONFIG = {
    use_academic_slots: true,
    academic_slots: null,
    start_hour: '07:00:00',
    end_hour: '22:00:00',
    default_block_duration_minutes: 90,
    min_block_duration_minutes: 60,
    transfer_tolerance_minutes: 10,
    days: [1, 2, 3, 4, 5, 6, 7],
    avoid_duplicate_section_blocks: true,
    max_solutions: 3,
}

export default function InstitutionalCspGeneratorPage() {
    const [form, setForm] = useState(DEFAULT_FORM)
    const [schedule, setSchedule] = useState(null)
    const [diagnostic, setDiagnostic] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loadingAction, setLoadingAction] = useState(null)

    const scheduleId = schedule?.id

    const handleCreateSchedule = async () => {
        setLoadingAction('create')

        try {
            const data = await scheduleService.createSchedule(form)

            setSchedule(data)
            setDiagnostic(null)
            setPreview(null)

            toast.success(`Horario base creado. ID: ${data.id}`)
        } catch (error) {
            console.error('ERROR CREATE SCHEDULE:', error.response?.data || error)
            toast.error(getErrorMessage(error, 'No se pudo crear el horario base'))
        } finally {
            setLoadingAction(null)
        }
    }

    const buildCspPayload = () => {
        return {
            schedule_id: Number(scheduleId),
            academic_period: form.academic_period,
            ...DEFAULT_CSP_CONFIG,
        }
    }

    const handleDiagnose = async () => {
        if (!scheduleId) {
            toast.error('Primero crea un horario base')
            return
        }

        setLoadingAction('diagnose')

        try {
            const data = await institutionalCspService.diagnoseDomains(
                buildCspPayload()
            )

            setDiagnostic(data)

            if (data?.success === false) {
                toast.error('Diagnóstico con observaciones críticas')
            } else {
                toast.success('Diagnóstico CSP completado')
            }
        } catch (error) {
            console.error('ERROR DIAGNOSTIC:', error.response?.data || error)
            toast.error(getErrorMessage(error, 'No se pudo diagnosticar el CSP'))
        } finally {
            setLoadingAction(null)
        }
    }

    const handlePreview = async () => {
        if (!scheduleId) {
            toast.error('Primero crea un horario base')
            return
        }

        setLoadingAction('preview')

        try {
            const data = await institutionalCspService.previewInstitutionalSchedule(
                buildCspPayload()
            )

            setPreview(data)
            toast.success('Vista previa generada correctamente')
        } catch (error) {
            console.error('ERROR PREVIEW CSP:', error.response?.data || error)
            toast.error(getErrorMessage(error, 'No se pudo generar la vista previa'))
        } finally {
            setLoadingAction(null)
        }
    }

    const handleGenerate = async () => {
        if (!scheduleId) {
            toast.error('Primero crea un horario base')
            return
        }

        setLoadingAction('generate')

        try {
            const data = await institutionalCspService.generateInstitutionalSchedule(
                buildCspPayload()
            )

            setPreview(data)
            toast.success('Horario institucional generado correctamente')
        } catch (error) {
            console.error('ERROR GENERATE CSP:', error.response?.data || error)
            toast.error(getErrorMessage(error, 'No se pudo generar el horario'))
        } finally {
            setLoadingAction(null)
        }
    }

    const handlePublish = async () => {
        if (!scheduleId) {
            toast.error('Primero crea o selecciona un horario')
            return
        }

        setLoadingAction('publish')

        try {
            await scheduleService.publishSchedule(scheduleId)

            toast.success('Horario institucional publicado correctamente')
        } catch (error) {
            console.error('ERROR PUBLISH:', error.response?.data || error)
            toast.error(getErrorMessage(error, 'No se pudo publicar el horario'))
        } finally {
            setLoadingAction(null)
        }
    }

    return (
        <div className="space-y-8">
            <section className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-orange-600">
                            <Rocket size={30} />
                        </div>

                        <div>
                            <p className="text-sm font-bold uppercase tracking-wide text-orange-300">
                                Generación institucional
                            </p>

                            <h1 className="text-3xl font-black">
                                Motor CSP Institucional
                            </h1>

                            <p className="mt-2 text-sm text-slate-300">
                                Crea el horario base, diagnostica dominios, genera bloques y publica la oferta académica.
                            </p>
                        </div>
                    </div>

                    {scheduleId && (
                        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
                            <p className="text-sm font-black">
                                Horario activo ID: {scheduleId}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
                    <h2 className="mb-4 text-xl font-black text-slate-900">
                        Datos del horario base
                    </h2>

                    <div className="space-y-4">
                        <Field
                            label="Nombre"
                            value={form.name}
                            onChange={(value) =>
                                setForm((current) => ({
                                    ...current,
                                    name: value,
                                }))
                            }
                        />

                        <Field
                            label="Periodo académico"
                            value={form.academic_period}
                            onChange={(value) =>
                                setForm((current) => ({
                                    ...current,
                                    academic_period: value,
                                }))
                            }
                        />

                        <button
                            type="button"
                            onClick={handleCreateSchedule}
                            disabled={loadingAction === 'create'}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingAction === 'create' ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Crear horario base
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                    <h2 className="mb-4 text-xl font-black text-slate-900">
                        Acciones CSP
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <ActionButton
                            icon={ClipboardCheck}
                            title="Diagnosticar"
                            loading={loadingAction === 'diagnose'}
                            disabled={!scheduleId}
                            onClick={handleDiagnose}
                        />

                        <ActionButton
                            icon={PlayCircle}
                            title="Vista previa"
                            loading={loadingAction === 'preview'}
                            disabled={!scheduleId}
                            onClick={handlePreview}
                        />

                        <ActionButton
                            icon={CalendarDays}
                            title="Generar horario"
                            loading={loadingAction === 'generate'}
                            disabled={!scheduleId}
                            onClick={handleGenerate}
                        />

                        <ActionButton
                            icon={CheckCircle}
                            title="Publicar"
                            loading={loadingAction === 'publish'}
                            disabled={!scheduleId}
                            onClick={handlePublish}
                        />
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Metric
                            label="Cursos"
                            value={
                                diagnostic?.domains?.courses ||
                                diagnostic?.summary?.courses ||
                                '-'
                            }
                        />

                        <Metric
                            label="Secciones"
                            value={
                                diagnostic?.domains?.sections ||
                                diagnostic?.summary?.sections ||
                                diagnostic?.total_sections_checked ||
                                '-'
                            }
                        />

                        <Metric
                            label="Bloques generados"
                            value={
                                preview?.total_blocks ||
                                preview?.summary?.total_blocks ||
                                preview?.blocks?.length ||
                                '-'
                            }
                        />
                    </div>

                    {diagnostic && (
                        <ResultBox
                            title="Resultado del diagnóstico"
                            data={diagnostic}
                        />
                    )}

                    {preview && (
                        <ResultBox
                            title="Resultado de generación"
                            data={preview}
                        />
                    )}
                </div>
            </section>
        </div>
    )
}

function Field({ label, value, onChange }) {
    return (
        <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {label}
            </label>

            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
        </div>
    )
}

function ActionButton({ icon: Icon, title, loading, disabled, onClick }) {
    return (
        <button
            type="button"
            disabled={disabled || loading}
            onClick={onClick}
            className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? (
                <Loader2 size={26} className="animate-spin text-orange-600" />
            ) : (
                <Icon size={26} className="text-orange-600" />
            )}

            <span className="text-sm font-black text-slate-800">
                {title}
            </span>
        </button>
    )
}

function Metric({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-2xl font-black text-slate-900">
                {value}
            </p>
        </div>
    )
}

function ResultBox({ title, data }) {
    return (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 text-lg font-black text-slate-900">
                {title}
            </h3>

            <pre className="max-h-72 overflow-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-100">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    )
}

function getErrorMessage(error, fallback = 'Ocurrió un error') {
    const detail = error.response?.data?.detail

    if (!detail) return fallback

    if (typeof detail === 'string') return detail

    if (Array.isArray(detail)) {
        return detail.map((item) => item.msg || JSON.stringify(item)).join(' | ')
    }

    if (typeof detail === 'object') {
        return detail.msg || JSON.stringify(detail)
    }

    return fallback
}