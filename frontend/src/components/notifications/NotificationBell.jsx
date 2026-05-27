import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import toast from 'react-hot-toast'

import { notificationService } from '../../services/notificationService'
import NotificationDropdown from './NotificationDropdown'

export default function NotificationBell() {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([])
    const [unread, setUnread] = useState(0)

    const refresh = async () => {
        try {
            const [list, count] = await Promise.all([
                notificationService.listMine({ limit: 6 }),
                notificationService.unreadCount(),
            ])
            setItems(list.notifications)
            setUnread(count.unread_count)
        } catch {
            // Do not interrupt navigation when a transient poll fails.
        }
    }

    useEffect(() => {
        refresh()
        const timer = window.setInterval(refresh, 30000)
        return () => window.clearInterval(timer)
    }, [])

    const read = async (item) => {
        if (!item.is_read) await notificationService.markRead(item.id)
        await refresh()
    }

    const readAll = async () => {
        try {
            await notificationService.markAllRead()
            await refresh()
        } catch {
            toast.error('No se pudieron marcar las notificaciones.')
        }
    }

    return <div className="relative">
        <button onClick={() => { setOpen(!open); if (!open) refresh() }} className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:text-orange-600" aria-label="Notificaciones">
            <Bell size={20} />
            {unread > 0 && <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-xs font-bold text-white">{unread > 99 ? '99+' : unread}</span>}
        </button>
        {open && <NotificationDropdown items={items} unreadCount={unread} onReadAll={readAll} onRead={read} />}
    </div>
}
