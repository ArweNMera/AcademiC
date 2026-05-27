import { useEffect, useState } from 'react'
import { Download, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

import { auditLogService } from '../../services/auditLogService'

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([])
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({ action: '', entity_type: '', user_id: '' })

    const params = () => Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    const load = async () => {
        const data = await auditLogService.list(params())
        setLogs(data.logs)
        setTotal(data.total)
    }
    useEffect(() => { load().catch(() => toast.error('No se pudo cargar la auditoria.')) }, [])

    const exportCsv = async () => {
        await auditLogService.exportCsv(params())
        toast.success('Exportacion registrada en auditoria.')
        await load()
    }

    return <div className="space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-6 lg:flex-row lg:items-center">
            <div><h1 className="flex items-center gap-3 text-3xl font-bold"><ShieldCheck className="text-orange-600" /> Auditoria</h1><p className="mt-2 text-slate-500">Acciones sensibles registradas para control administrativo.</p></div>
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white"><Download size={18} /> Exportar CSV</button>
        </header>
        <section className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-4">
            <input placeholder="ID usuario" value={filters.user_id} onChange={(e) => setFilters({ ...filters, user_id: e.target.value })} className="rounded-xl border p-3" />
            <select value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value })} className="rounded-xl border p-3">
                <option value="">Todas las acciones</option>
                {['LOGIN', 'PUBLISH', 'GENERATE_CSP', 'SAVE_SOLUTION', 'EXPORT_REPORT', 'CREATE', 'UPDATE', 'APPROVE', 'REJECT', 'DELETE'].map((value) => <option key={value}>{value}</option>)}
            </select>
            <input placeholder="Entidad" value={filters.entity_type} onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })} className="rounded-xl border p-3" />
            <button onClick={() => load().catch(() => toast.error('No se pudo filtrar.'))} className="rounded-xl border font-semibold">Aplicar filtros</button>
        </section>
        <p className="text-sm text-slate-500">{total} registros encontrados</p>
        <section className="overflow-hidden rounded-2xl border bg-white">
            <div className="overflow-x-auto"><table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-4">Fecha</th><th>Usuario</th><th>Rol</th><th>Accion</th><th>Entidad</th><th>Descripcion</th></tr></thead>
                <tbody className="divide-y">{logs.map((item) => <tr key={item.id}><td className="p-4">{new Date(item.created_at).toLocaleString('es-PE')}</td><td>{item.user_id || '-'}</td><td>{item.user_role || '-'}</td><td className="font-semibold">{item.action}</td><td>{item.entity_type}{item.entity_id ? ` #${item.entity_id}` : ''}</td><td className="max-w-sm py-3 pr-4">{item.description}</td></tr>)}</tbody>
            </table></div>
            {!logs.length && <p className="p-8 text-center text-slate-500">No hay registros de auditoria.</p>}
        </section>
    </div>
}
