import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
    BookOpen,
    Building2,
    CalendarDays,
    ClipboardCheck,
    ClipboardList,
    GraduationCap,
    LayoutDashboard,
    Leaf,
    Layers,
    LogOut,
    School,
    Sparkles,
    Star,
    UserCog,
    UserRound,
    Users,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const roleLabels = {
    ADMIN: 'Administrador',
    COORDINATOR: 'Coordinador',
    TEACHER: 'Docente',
    STUDENT: 'Estudiante',
}

const pageTitles = {
    '/admin/dashboard': 'Dashboard institucional',
    '/admin/environmental-impact': 'Impacto ambiental',
    '/admin/data-readiness': 'Preparación de datos',
    '/admin/users': 'Usuarios',
    '/admin/teachers': 'Docentes',
    '/admin/students': 'Estudiantes',
    '/admin/sections': 'Secciones',
    '/admin/courses': 'Cursos',
    '/admin/classrooms': 'Aulas',
    '/admin/academic-periods': 'Periodos académicos',
    '/admin/academic-programs': 'Programas académicos',
    '/admin/curriculum-plans': 'Planes curriculares',
    '/admin/curriculum': 'Malla curricular',
    '/coordinator/dashboard': 'Dashboard del coordinador',
    '/coordinator/offerings': 'Oferta academica',
    '/coordinator/offerings/create': 'Crear oferta',
    '/coordinator/conflicts': 'Conflictos de oferta',
    '/coordinator/csp': 'CSP desde ofertas',
    '/coordinator/change-requests': 'Solicitudes docentes',
    '/admin/schedules': 'Generador CSP institucional',
    '/admin/student-generator': 'Simulador estudiantil',
    '/admin/student-schedules': 'Horarios de estudiantes',
    '/admin/schedule-view': 'Vista institucional',
    '/admin/schedule-quality': 'Calidad de horario',
    '/teacher/dashboard': 'Panel del docente',
    '/teacher/schedule': 'Mi horario',
    '/teacher/sections': 'Mis cursos y secciones',
    '/teacher/availability': 'Mi disponibilidad',
    '/teacher/load': 'Mi carga academica',
    '/teacher/conflicts': 'Conflictos docentes',
    '/teacher/change-requests': 'Solicitudes de cambio',
    '/student': 'Panel del estudiante',
    '/student/schedule-generator': 'Generador de horario',
    '/student/my-schedules': 'Mi horario elegido',
    '/student/curriculum': 'Mi malla curricular',
    '/student/offer': 'Oferta académica',                    // ✅ Nuevo título
}

export default function AppLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const getDashboardPath = () => {
        if (user?.role === 'ADMIN') {
            return '/admin/dashboard'
        }

        if (user?.role === 'COORDINATOR') {
            return '/coordinator/dashboard'
        }

        if (user?.role === 'TEACHER') {
            return '/teacher/dashboard'
        }

        if (user?.role === 'STUDENT') {
            return '/student'
        }

        return '/'
    }

    const currentTitle = pageTitles[location.pathname] || 'OptiAcademic'

    return (
        <div className="flex min-h-screen bg-slate-100">
            <aside className="flex w-72 flex-col bg-slate-950 text-white">
                <div className="border-b border-slate-800 p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600">
                            <GraduationCap size={26} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold">OptiAcademic</h1>
                            <p className="text-xs text-slate-400">
                                Gestión inteligente de horarios
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                    <NavItem to={getDashboardPath()} icon={<LayoutDashboard size={19} />}>
                        Dashboard
                    </NavItem>

                    {user?.role === 'ADMIN' && (
                        <>
                            <SidebarGroupTitle>Gestión institucional</SidebarGroupTitle>

                            <NavItem
                                to="/admin/data-readiness"
                                icon={<ClipboardList size={19} />}
                            >
                                Preparación de datos
                            </NavItem>

                            <NavItem
                                to="/admin/environmental-impact"
                                icon={<Leaf size={19} />}
                            >
                                Impacto ambiental
                            </NavItem>

                            <NavItem to="/admin/users" icon={<Users size={19} />}>
                                Usuarios
                            </NavItem>

                            <NavItem to="/admin/teachers" icon={<UserCog size={19} />}>
                                Docentes
                            </NavItem>

                            <NavItem to="/admin/students" icon={<UserRound size={19} />}>
                                Estudiantes
                            </NavItem>

                            <NavItem to="/admin/sections" icon={<Layers size={19} />}>
                                Secciones
                            </NavItem>

                            <NavItem to="/admin/courses" icon={<School size={19} />}>
                                Cursos
                            </NavItem>

                            <NavItem to="/admin/classrooms" icon={<Building2 size={19} />}>
                                Aulas
                            </NavItem>

                            <SidebarGroupTitle>Dominio académico</SidebarGroupTitle>

                            <NavItem to="/admin/academic-periods" icon={<CalendarDays size={19} />}>
                                Periodos
                            </NavItem>

                            <NavItem to="/admin/academic-programs" icon={<GraduationCap size={19} />}>
                                Programas
                            </NavItem>

                            <NavItem to="/admin/curriculum-plans" icon={<ClipboardList size={19} />}>
                                Planes curriculares
                            </NavItem>

                            <NavItem to="/admin/curriculum" icon={<BookOpen size={19} />}>
                                Malla curricular
                            </NavItem>

                            <NavItem to="/coordinator/offerings" icon={<Layers size={19} />}>
                                Oferta academica
                            </NavItem>

                            <NavItem to="/coordinator/conflicts" icon={<ClipboardCheck size={19} />}>
                                Conflictos de oferta
                            </NavItem>
                            <NavItem to="/coordinator/csp" icon={<Sparkles size={19} />}>
                                CSP desde ofertas
                            </NavItem>
                            <NavItem to="/coordinator/change-requests" icon={<ClipboardCheck size={19} />}>
                                Solicitudes docentes
                            </NavItem>

                            <SidebarGroupTitle>Horarios</SidebarGroupTitle>

                            <NavItem
                                to="/admin/schedules"
                                icon={<CalendarDays size={19} />}
                            >
                                Generar horario
                            </NavItem>

                            <NavItem
                                to="/admin/schedule-view"
                                icon={<CalendarDays size={19} />}
                            >
                                Ver horario
                            </NavItem>

                            <NavItem
                                to="/admin/schedule-quality"
                                icon={<ClipboardCheck size={19} />}
                            >
                                Calidad horario
                            </NavItem>

                            <SidebarGroupTitle>Estudiantes</SidebarGroupTitle>

                            <NavItem
                                to="/admin/student-generator"
                                icon={<Sparkles size={19} />}
                            >
                                Simulador estudiantil
                            </NavItem>

                            <NavItem
                                to="/admin/student-schedules"
                                icon={<Star size={19} />}
                            >
                                Horarios estudiantes
                            </NavItem>
                        </>
                    )}

                    {user?.role === 'COORDINATOR' && (
                        <>
                            <SidebarGroupTitle>Oferta academica</SidebarGroupTitle>
                            <NavItem to="/coordinator/offerings" icon={<Layers size={19} />}>
                                Gestionar oferta
                            </NavItem>
                            <NavItem to="/coordinator/conflicts" icon={<ClipboardCheck size={19} />}>
                                Conflictos
                            </NavItem>
                            <SidebarGroupTitle>Planificacion</SidebarGroupTitle>
                            <NavItem to="/coordinator/csp" icon={<Sparkles size={19} />}>
                                CSP desde ofertas
                            </NavItem>
                            <NavItem to="/coordinator/change-requests" icon={<ClipboardCheck size={19} />}>
                                Solicitudes docentes
                            </NavItem>
                            <NavItem to="/admin/schedules" icon={<CalendarDays size={19} />}>
                                Generar horario
                            </NavItem>
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <SidebarGroupTitle>Mi horario</SidebarGroupTitle>

                            <NavItem
                                to="/student/curriculum"
                                icon={<GraduationCap size={19} />}
                            >
                                Mi malla curricular
                            </NavItem>

                            {/* ✅ Nueva opción: Oferta académica */}
                            <NavItem
                                to="/student/offer"
                                icon={<BookOpen size={19} />}
                            >
                                Oferta académica
                            </NavItem>

                            <NavItem
                                to="/student/schedule-generator"
                                icon={<Sparkles size={19} />}
                            >
                                Generar mi horario
                            </NavItem>

                            <NavItem
                                to="/student/my-schedules"
                                icon={<Star size={19} />}
                            >
                                Mi horario elegido
                            </NavItem>
                        </>
                    )}

                    {user?.role === 'TEACHER' && (
                        <>
                            <SidebarGroupTitle>Docente</SidebarGroupTitle>

                            <NavItem to="/teacher/schedule" icon={<CalendarDays size={19} />}>
                                Mi horario
                            </NavItem>
                            <NavItem to="/teacher/sections" icon={<BookOpen size={19} />}>
                                Mis cursos/secciones
                            </NavItem>
                            <NavItem to="/teacher/availability" icon={<ClipboardList size={19} />}>
                                Mi disponibilidad
                            </NavItem>
                            <NavItem to="/teacher/load" icon={<Layers size={19} />}>
                                Mi carga academica
                            </NavItem>
                            <NavItem to="/teacher/conflicts" icon={<ClipboardCheck size={19} />}>
                                Conflictos
                            </NavItem>
                            <NavItem to="/teacher/change-requests" icon={<Sparkles size={19} />}>
                                Solicitudes de cambio
                            </NavItem>
                        </>
                    )}
                </nav>

                <div className="border-t border-slate-800 p-4">
                    <div className="mb-4 rounded-2xl bg-slate-900 px-4 py-3">
                        <p className="truncate text-sm font-semibold">
                            {user?.full_name || 'Usuario'}
                        </p>

                        <p className="truncate text-xs text-slate-400">
                            {user?.email}
                        </p>

                        <p className="mt-1 text-xs font-medium text-orange-300">
                            {roleLabels[user?.role] || user?.role}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2 text-sm font-semibold transition hover:bg-red-700"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
                    <div>
                        <p className="text-sm text-slate-500">
                            {roleLabels[user?.role] || 'Usuario'}
                        </p>

                        <h2 className="text-lg font-bold text-slate-800">
                            {currentTitle}
                        </h2>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </section>
            </main>
        </div>
    )
}

function SidebarGroupTitle({ children }) {
    return (
        <p className="px-4 pt-5 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            {children}
        </p>
    )
}

function NavItem({ to, icon, children }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                [
                    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                    isActive
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                ].join(' ')
            }
        >
            {icon}
            <span>{children}</span>
        </NavLink>
    )
}
