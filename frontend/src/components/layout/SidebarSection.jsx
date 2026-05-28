import { ChevronDown } from 'lucide-react'

export default function SidebarSection({ title, icon, open, active, onToggle, children }) {
    return (
        <section className="space-y-1">
            <button
                type="button"
                onClick={onToggle}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-bold uppercase tracking-wide transition ${active ? 'bg-slate-900 text-orange-200' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
            >
                <span className="flex items-center gap-2">
                    {icon}
                    {title}
                </span>
                <ChevronDown size={16} className={`transition ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && <div className="space-y-1 pl-2">{children}</div>}
        </section>
    )
}

