import { useState } from 'react'
import { History, Search } from 'lucide-react'
import toast from 'react-hot-toast'

import { traceabilityService } from '../../services/traceabilityService'

export default function TraceabilityPage() {
    const [mode, setMode] = useState('schedule')
    const [id, setId] = useState('')
    const [data, setData] = useState(null)

    const search = async () => {
        if (!id) return toast.error('Ingresa un identificador.')
        try {
            const value = mode === 'schedule'
                ? await traceabilityService.getScheduleTrace(Number(id))
                : await traceabilityService.getChangeRequestTrace(Number(id))
            setData(value)
        } catch {
            toast.error('No se pudo consultar la trazabilidad.')
        }
    }
    const changes = Array.isArray(data) ? data : data?.changes || []
    const publications = Array.isArray(data) ? [] : data?.publications || []

    return <div className="space-y-6">
        <header className="rounded-2xl border bg-white p-6">
            <h1 className="flex items-center gap-3 text-3xl font-bold"><History className="text-orange-600" /> Trazabilidad</h1>
            <p className="mt-2 text-slate-500">Historial de publicaciones y decisiones sobre solicitudes docentes.</p>
        </header>
        <section className="flex flex-wrap gap-3 rounded-2xl border bg-white p-5">
            <select value={mode} onChange={(event) => { setMode(event.target.value); setData(null) }} className="rounded-xl border p-3">
                <option value="schedule">Horario</option><option value="request">Solicitud de cambio</option>
            </select>
            <input type="number" min="1" value={id} onChange={(event) => setId(event.target.value)} placeholder={mode === 'schedule' ? 'Schedule ID' : 'Request ID'} className="rounded-xl border p-3" />
            <button onClick={search} className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white"><Search size={18} /> Consultar</button>
        </section>
        {data && <section className="space-y-4">
            {publications.map((item) => <article key={`publication-${item.id}`} className="rounded-2xl border border-emerald-100 bg-white p-5">
                <p className="text-xs font-bold text-emerald-700">PUBLICACION</p>
                <p className="mt-2 font-semibold">{item.previous_status} a {item.new_status}</p>
                <p className="mt-1 text-sm text-slate-600">{item.publication_notes}</p>
                <p className="mt-3 text-xs text-slate-500">Docentes: {item.affected_teachers_count} | Estudiantes: {item.affected_students_count} | Secciones: {item.affected_sections_count}</p>
            </article>)}
            {changes.map((item) => <article key={`change-${item.id}`} className="rounded-2xl border bg-white p-5">
                <p className="text-xs font-bold text-orange-700">{item.change_type}</p>
                <p className="mt-2 text-sm text-slate-700">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(item.created_at).toLocaleString('es-PE')}</p>
            </article>)}
            {!publications.length && !changes.length && <p className="rounded-2xl border bg-white p-8 text-center text-slate-500">Sin eventos registrados para este identificador.</p>}
        </section>}
    </div>
}
