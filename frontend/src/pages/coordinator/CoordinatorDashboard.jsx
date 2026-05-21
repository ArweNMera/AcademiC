import { CalendarDays, ClipboardCheck, Eye, Wand2 } from 'lucide-react'

export default function CoordinatorDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Panel del Coordinador Académico
            </h1>

            <p className="text-slate-600 mb-8">
                Generación, diagnóstico, previsualización y publicación de horarios académicos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card title="Diagnóstico CSP" icon={<ClipboardCheck />} />
                <Card title="Preview de soluciones" icon={<Eye />} />
                <Card title="Generar horario" icon={<Wand2 />} />
                <Card title="Publicar horario" icon={<CalendarDays />} />
            </div>
        </div>
    )
}

function Card({ title, icon }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
    )
}