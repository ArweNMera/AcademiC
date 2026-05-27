import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Sin datos para mostrar', text = 'Cuando existan registros apareceran aqui.' }) {
    return (
        <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-slate-500">
            <Inbox className="mx-auto mb-3 text-slate-400" size={28} />
            <p className="font-semibold text-slate-700">{title}</p>
            <p className="mt-1 text-sm">{text}</p>
        </div>
    )
}

