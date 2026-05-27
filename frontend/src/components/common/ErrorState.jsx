import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorState({ title = 'No se pudo cargar esta vista', message = 'Intenta nuevamente en unos segundos.', onRetry }) {
    return (
        <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <AlertTriangle className="mx-auto mb-3 text-red-600" size={30} />
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                    <RefreshCw size={16} /> Reintentar
                </button>
            )}
        </div>
    )
}

