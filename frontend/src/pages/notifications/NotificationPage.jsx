import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

import { notificationService } from '../../services/notificationService'

export default function NotificationPage() {
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState('')
    const [type, setType] = useState('')

    const load = async (readValue = filter, typeValue = type) => {
        const params = {}
        if (readValue !== '') params.is_read = readValue === 'read'
        if (typeValue) params.notification_type = typeValue
        const data = await notificationService.listMine(params)
        setItems(data.notifications)
    }
    useEffect(() => { load().catch(() => toast.error('No se pudieron cargar las notificaciones.')) }, [])

    const markAll = async () => {
        await notificationService.markAllRead()
        await load()
        toast.success('Notificaciones marcadas como leidas.')
    }
    const markOne = async (id) => {
        await notificationService.markRead(id)
        await load()
    }
    const remove = async (id) => {
        await notificationService.remove(id)
        await load()
    }

    return <div className="space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-6 md:flex-row md:items-center">
            <div>
                <h1 className="flex items-center gap-3 text-3xl font-bold"><Bell className="text-orange-600" /> Notificaciones</h1>
                <p className="mt-2 text-slate-500">Avisos internos relacionados con tus horarios y operaciones.</p>
            </div>
            <button onClick={markAll} className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white"><CheckCheck size={18} /> Marcar todas leidas</button>
        </header>
        <section className="flex flex-wrap gap-3 rounded-2xl border bg-white p-4">
            <select value={filter} onChange={(event) => { setFilter(event.target.value); load(event.target.value, type) }} className="rounded-xl border px-4 py-2">
                <option value="">Todas</option><option value="unread">No leidas</option><option value="read">Leidas</option>
            </select>
            <select value={type} onChange={(event) => { setType(event.target.value); load(filter, event.target.value) }} className="rounded-xl border px-4 py-2">
                <option value="">Todos los tipos</option>
                {['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'SCHEDULE_PUBLISHED', 'CHANGE_REQUEST', 'OFFERING_UPDATED', 'CSP_GENERATED', 'REPORT_READY'].map((value) => <option key={value}>{value}</option>)}
            </select>
        </section>
        <section className="space-y-3">
            {items.map((item) => <article key={item.id} className={`flex justify-between gap-4 rounded-2xl border bg-white p-5 ${item.is_read ? '' : 'border-orange-200'}`}>
                <div>
                    <div className="flex items-center gap-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold">{item.notification_type}</span>{!item.is_read && <span className="h-2 w-2 rounded-full bg-orange-600" />}</div>
                    <h2 className="mt-3 font-bold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                    <p className="mt-2 text-xs text-slate-400">{new Date(item.created_at).toLocaleString('es-PE')}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                    {!item.is_read && <button onClick={() => markOne(item.id)} className="rounded-lg border p-2 text-emerald-600"><CheckCheck size={17} /></button>}
                    <button onClick={() => remove(item.id)} className="rounded-lg border p-2 text-red-600"><Trash2 size={17} /></button>
                </div>
            </article>)}
            {!items.length && <div className="rounded-2xl border border-dashed bg-white p-12 text-center text-slate-500">No hay notificaciones para mostrar.</div>}
        </section>
    </div>
}
