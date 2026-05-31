const palette = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    APPROVED: 'bg-blue-50 text-blue-700 border-blue-100',
    READY: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    DRAFT: 'bg-slate-100 text-slate-700 border-slate-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
    REJECTED: 'bg-red-50 text-red-700 border-red-100',
    OVERLOADED: 'bg-red-50 text-red-700 border-red-100',
    WARNING: 'bg-amber-50 text-amber-700 border-amber-100',
    NORMAL: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export default function StatusBadge({ value }) {
    const label = value || '-'
    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${palette[label] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
            {label}
        </span>
    )
}
