import { useCallback, useEffect, useState } from 'react'
import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Cloud,
    Database,
    Gauge,
    Globe2,
    Info,
    Leaf,
    Loader2,
    RefreshCw,
    Route,
    Server,
    Timer,
    TriangleAlert,
} from 'lucide-react'
import toast from 'react-hot-toast'

import { environmentalImpactService } from '../../services/environmentalImpactService'

function formatBytes(value) {
    const bytes = Number(value || 0)

    if (bytes < 1024) return `${bytes.toLocaleString('es-PE')} B`
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 ** 2)).toFixed(2)} MB`
}

function formatCo2(value) {
    const grams = Number(value || 0)

    if (grams === 0) return '0.00000000 g'
    if (grams < 0.0001) return `${grams.toFixed(10)} g`
    return `${grams.toFixed(8)} g`
}

function formatTime(value) {
    return `${Number(value || 0).toFixed(2)} ms`
}

function formatDate(value) {
    if (!value) return '-'

    return new Date(value).toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    })
}

function PathLabel({ path, variant = 'default' }) {
    const tone = variant === 'ranking'
        ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
        : 'border-slate-200 bg-slate-50 text-slate-700'

    return (
        <span
            title={path || '-'}
            className={`inline-block max-w-[18rem] truncate rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold ${tone}`}
        >
            {path || '-'}
        </span>
    )
}

function MetricCard({ title, value, detail, icon: Icon, iconTone = 'emerald', path = false }) {
    const tones = {
        emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        teal: 'bg-teal-50 text-teal-700 ring-teal-100',
        cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
        slate: 'bg-slate-100 text-slate-700 ring-slate-200',
    }

    return (
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {title}
                    </p>
                    {path ? (
                        <p title={String(value)} className="mt-3 truncate font-mono text-base font-bold text-slate-900">
                            {value}
                        </p>
                    ) : (
                        <p className="mt-3 truncate text-2xl font-bold tracking-tight text-slate-950">
                            {value}
                        </p>
                    )}
                    <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
                </div>
                <span className={`rounded-2xl p-3 ring-1 ${tones[iconTone]}`}>
                    <Icon size={21} />
                </span>
            </div>
        </div>
    )
}

function MethodBadge({ method }) {
    const normalized = String(method || '').toUpperCase()
    const styles = {
        GET: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        POST: 'border-blue-200 bg-blue-50 text-blue-700',
        PUT: 'border-amber-200 bg-amber-50 text-amber-700',
        PATCH: 'border-amber-200 bg-amber-50 text-amber-700',
        DELETE: 'border-red-200 bg-red-50 text-red-700',
    }

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${styles[normalized] || 'border-slate-200 bg-slate-50 text-slate-600'}`}>
            {normalized || 'N/A'}
        </span>
    )
}

function StatusBadge({ statusCode }) {
    const status = Number(statusCode)
    let classes = 'border-red-200 bg-red-50 text-red-700'

    if (status >= 200 && status < 300) {
        classes = 'border-emerald-200 bg-emerald-50 text-emerald-700'
    } else if (status >= 300 && status < 400) {
        classes = 'border-blue-200 bg-blue-50 text-blue-700'
    } else if (status >= 400 && status < 500) {
        classes = 'border-amber-200 bg-amber-50 text-amber-700'
    }

    return (
        <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}>
            {statusCode}
        </span>
    )
}

function EmptyState({ title, description, icon: Icon = Leaf }) {
    return (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <Icon size={24} />
            </div>
            <p className="mt-4 font-semibold text-slate-800">{title}</p>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="h-56 animate-pulse rounded-3xl bg-gradient-to-r from-emerald-100 to-teal-50" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(7)].map((_, index) => (
                    <div key={index} className="h-32 animate-pulse rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="m-5 h-4 w-24 rounded bg-slate-100" />
                        <div className="mx-5 mt-5 h-7 w-36 rounded bg-slate-100" />
                    </div>
                ))}
            </div>
        </div>
    )
}

function ErrorState({ onRetry }) {
    return (
        <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
                <div className="flex gap-4">
                    <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                        <TriangleAlert size={25} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">No se pudieron cargar las metricas</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Revisa la conexion con el backend y vuelve a intentar la consulta.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    <RefreshCw size={16} />
                    Reintentar
                </button>
            </div>
        </div>
    )
}

export default function EnvironmentalImpactPage() {
    const [summary, setSummary] = useState(null)
    const [metrics, setMetrics] = useState([])
    const [ranking, setRanking] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [lastUpdated, setLastUpdated] = useState(null)

    const loadDashboard = useCallback(async () => {
        setLoading(true)
        setError(false)

        try {
            const [summaryData, metricsData, rankingData] = await Promise.all([
                environmentalImpactService.getSummary(),
                environmentalImpactService.getMetrics(),
                environmentalImpactService.getRanking(),
            ])

            setSummary(summaryData)
            setMetrics(metricsData)
            setRanking(rankingData)
            setLastUpdated(new Date())
        } catch (requestError) {
            console.error(requestError)
            setError(true)
            toast.error('No se pudieron cargar las metricas ambientales')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadDashboard()
        }, 0)

        return () => window.clearTimeout(timer)
    }, [loadDashboard])

    const highestImpact = Number(ranking[0]?.total_co2 || 0)

    if (loading && !summary) {
        return <LoadingState />
    }

    return (
        <div className="space-y-6">
            <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-600 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 right-12 h-40 w-40 rounded-full bg-teal-300/20 blur-3xl" />

                <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                    <div className="flex items-start gap-5">
                        <div className="hidden rounded-3xl border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur sm:block">
                            <Globe2 size={42} className="text-emerald-100" />
                        </div>
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                                <Leaf size={13} />
                                Observabilidad sostenible
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Impacto ambiental</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
                                Huella de carbono estimada a partir del volumen de las respuestas HTTP procesadas
                                por OptiAcademic durante la sesion activa del backend.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                        <button
                            onClick={loadDashboard}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? <Loader2 size={17} className="animate-spin" /> : <RefreshCw size={17} />}
                            Actualizar
                        </button>
                        <p className="text-xs text-emerald-100">
                            Ultima actualizacion: {lastUpdated ? formatDate(lastUpdated) : 'pendiente'}
                        </p>
                    </div>
                </div>
            </header>

            {error && <ErrorState onRetry={loadDashboard} />}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Total solicitudes" value={Number(summary?.total_requests || 0).toLocaleString('es-PE')} detail="Respuestas HTTP analizadas" icon={Activity} />
                <MetricCard title="CO2 total" value={formatCo2(summary?.total_co2)} detail="Emision estimada acumulada" icon={Cloud} iconTone="teal" />
                <MetricCard title="CO2 promedio" value={formatCo2(summary?.average_co2)} detail="Estimacion por solicitud" icon={Gauge} iconTone="cyan" />
                <MetricCard title="Bytes transferidos" value={formatBytes(summary?.total_bytes)} detail="Volumen medido en respuestas" icon={Database} iconTone="slate" />
                <MetricCard title="Mayor impacto" value={summary?.most_polluting_endpoint || '-'} detail="Ruta con mayor CO2 acumulado" icon={BarChart3} path />
                <MetricCard title="Mas utilizado" value={summary?.most_used_endpoint || '-'} detail="Ruta con mayor frecuencia" icon={Route} iconTone="teal" path />
                <MetricCard title="Respuesta promedio" value={formatTime(summary?.average_response_time)} detail="Latencia observada" icon={Timer} iconTone="cyan" />
            </div>

            <section className="grid gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm md:grid-cols-[auto_1fr] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                    <Info size={23} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-900">Resumen de sesion</h2>
                    <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-600 lg:grid-cols-3">
                        <p className="rounded-xl bg-white/70 px-4 py-3">
                            Las metricas reflejan las solicitudes atendidas durante la sesion actual del backend.
                        </p>
                        <p className="rounded-xl bg-white/70 px-4 py-3">
                            Los registros ambientales se reinician automaticamente cuando el servidor inicia.
                        </p>
                        <p className="rounded-xl bg-white/70 px-4 py-3">
                            El CO2 es una estimacion academica calculada desde los bytes de cada respuesta.
                        </p>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-end sm:px-6">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-700">
                            <BarChart3 size={20} />
                            <h2 className="text-lg font-bold text-slate-900">Ranking por impacto</h2>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Comparacion relativa de las rutas con mayor emision estimada.</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <ArrowUpRight size={13} />
                        Mayor CO2 primero
                    </span>
                </div>

                <div className="overflow-x-auto p-4 sm:p-5">
                    {ranking.length ? (
                        <table className="min-w-[820px] w-full border-separate border-spacing-y-2 text-sm">
                            <thead className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                <tr>
                                    <th className="px-3 pb-2">Endpoint</th>
                                    <th className="px-3 pb-2">Impacto relativo</th>
                                    <th className="px-3 pb-2">CO2</th>
                                    <th className="px-3 pb-2">Solicitudes</th>
                                    <th className="px-3 pb-2">Promedio</th>
                                    <th className="px-3 pb-2">Bytes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((item) => {
                                    const percentage = highestImpact > 0
                                        ? Math.max((Number(item.total_co2) / highestImpact) * 100, 2)
                                        : 0

                                    return (
                                        <tr key={item.path} className="bg-slate-50/80 transition hover:bg-emerald-50/50">
                                            <td className="rounded-l-xl px-3 py-3"><PathLabel path={item.path} variant="ranking" /></td>
                                            <td className="min-w-44 px-3 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${percentage}%` }} />
                                                    </div>
                                                    <span className="w-12 text-right text-xs font-bold text-slate-500">
                                                        {percentage.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-3 font-semibold text-emerald-800">{formatCo2(item.total_co2)}</td>
                                            <td className="px-3 py-3 text-slate-600">{Number(item.total_requests).toLocaleString('es-PE')}</td>
                                            <td className="px-3 py-3 text-slate-600">{formatTime(item.average_response_time)}</td>
                                            <td className="rounded-r-xl px-3 py-3 text-slate-600">{formatBytes(item.total_bytes)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            title="Sin endpoints medidos aun"
                            description="Realiza operaciones en la plataforma para comenzar a comparar su impacto estimado."
                            icon={BarChart3}
                        />
                    )}
                </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-end sm:px-6">
                    <div>
                        <div className="flex items-center gap-2 text-teal-700">
                            <Activity size={20} />
                            <h2 className="text-lg font-bold text-slate-900">Metricas recientes</h2>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Registro detallado, ordenado desde la respuesta mas reciente.</p>
                    </div>
                    <p className="text-xs font-medium text-slate-400">{metrics.length} registros visibles</p>
                </div>

                <div className="max-h-[480px] overflow-auto">
                    {metrics.length ? (
                        <table className="min-w-[1020px] w-full divide-y divide-slate-100 text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
                                <tr>
                                    <th className="px-5 py-3">Fecha y hora</th>
                                    <th className="px-4 py-3">Metodo</th>
                                    <th className="px-4 py-3">Ruta</th>
                                    <th className="px-4 py-3">Estado HTTP</th>
                                    <th className="px-4 py-3">Tiempo</th>
                                    <th className="px-4 py-3">Bytes transferidos</th>
                                    <th className="px-5 py-3">CO2 estimado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {metrics.map((metric, index) => (
                                    <tr key={`${metric.measured_at}-${metric.path}-${index}`} className="transition hover:bg-emerald-50/30">
                                        <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{formatDate(metric.measured_at)}</td>
                                        <td className="px-4 py-3.5"><MethodBadge method={metric.method} /></td>
                                        <td className="px-4 py-3.5"><PathLabel path={metric.path} /></td>
                                        <td className="px-4 py-3.5"><StatusBadge statusCode={metric.status_code} /></td>
                                        <td className="whitespace-nowrap px-4 py-3.5 font-medium text-slate-700">{formatTime(metric.response_time_ms)}</td>
                                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-600">{formatBytes(metric.response_size_bytes)}</td>
                                        <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-emerald-800">{formatCo2(metric.estimated_co2_g)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-5">
                            <EmptyState
                                title="No hay metricas recientes"
                                description="La tabla se llenara automaticamente conforme se utilicen los endpoints funcionales."
                                icon={Server}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
