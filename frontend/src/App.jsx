import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts y Protecciones
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import RoleRoute from './components/layout/RoleRoute'

// Páginas: Autenticación y Errores
import LoginPage from './pages/auth/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

// Páginas: Dashboards Principales
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import EnvironmentalImpactPage from './pages/admin/EnvironmentalImpactPage'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import StudentDashboard from './pages/student/StudentDashboard'

// Páginas: Administración y Coordinación
import ClassroomsPage from './pages/admin/ClassroomsPage'
import CoursesPage from './pages/admin/CoursesPage'
import DataReadinessPage from './pages/admin/DataReadinessPage'
import InstitutionalCSPPage from './pages/admin/InstitutionalCSPPage'
import InstitutionalScheduleViewPage from './pages/admin/InstitutionalScheduleViewPage'
import ScheduleQualityPage from './pages/admin/ScheduleQualityPage'
import SectionsPage from './pages/admin/SectionsPage'
import StudentsPage from './pages/admin/StudentsPage'
import TeachersPage from './pages/admin/TeachersPage'
import UsersPage from './pages/admin/UsersPage'
import InstitutionalCspGeneratorPage from './pages/admin/InstitutionalCspGeneratorPage'

// Páginas: Estudiantes
import MySavedSchedulesPage from './pages/student/MySavedSchedulesPage'
import StudentScheduleGeneratorPage from './pages/student/StudentScheduleGeneratorPage'
import StudentOfferPage from './pages/student/StudentOfferPage'   // ✅ Nuevo import

// Stores
import { useAuthStore } from './stores/authStore'

function HomeRedirect() {
    const { user, isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role === 'ADMIN' || user?.role === 'COORDINATOR') {
        return <Navigate to="/admin/dashboard" replace />
    }

    if (user?.role === 'TEACHER') {
        return <Navigate to="/teacher" replace />
    }

    if (user?.role === 'STUDENT') {
        return <Navigate to="/student" replace />
    }

    return <Navigate to="/login" replace />
}

function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h1 className="mb-4 text-3xl font-bold text-red-600">
                    Acceso no autorizado
                </h1>

                <p className="text-slate-600">
                    Tu rol no tiene permisos para ingresar a esta sección.
                </p>
            </div>
        </div>
    )
}

export default function App() {
    const { loadUser, token } = useAuthStore()

    useEffect(() => {
        if (token) {
            loadUser()
        }
    }, [token, loadUser])

    return (
        <>
            <Toaster position="top-right" />

            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<HomeRedirect />} />

                        {/* Redirecciones principales */}
                        <Route
                            path="/admin"
                            element={<Navigate to="/admin/dashboard" replace />}
                        />

                        <Route
                            path="/coordinator"
                            element={<Navigate to="/admin/dashboard" replace />}
                        />

                        {/* ADMIN y COORDINATOR */}
                        <Route element={<RoleRoute allowedRoles={['ADMIN', 'COORDINATOR']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                            <Route path="/admin/environmental-impact" element={<EnvironmentalImpactPage />} />

                            <Route path="/admin/users" element={<UsersPage />} />
                            <Route path="/admin/teachers" element={<TeachersPage />} />
                            <Route path="/admin/students" element={<StudentsPage />} />
                            <Route path="/admin/sections" element={<SectionsPage />} />
                            <Route path="/admin/courses" element={<CoursesPage />} />
                            <Route path="/admin/classrooms" element={<ClassroomsPage />} />

                            <Route path="/admin/schedules" element={<InstitutionalCSPPage />} />
                            <Route path="/admin/schedule-view" element={<InstitutionalScheduleViewPage />} />
                            <Route path="/admin/schedule-quality" element={<ScheduleQualityPage />} />
                            <Route path="/admin/data-readiness" element={<DataReadinessPage />} />

                            <Route path="/admin/institutional-csp" element={<InstitutionalCspGeneratorPage />} />

                            <Route path="/admin/student-generator" element={<StudentScheduleGeneratorPage />} />
                            <Route path="/admin/student-schedules" element={<MySavedSchedulesPage />} />

                            <Route path="/admin/student-offer" element={<StudentOfferPage />} />
                        </Route>

                        {/* TEACHER */}
                        <Route element={<RoleRoute allowedRoles={['TEACHER']} />}>
                            <Route path="/teacher" element={<TeacherDashboard />} />
                        </Route>

                        {/* STUDENT */}
                        <Route element={<RoleRoute allowedRoles={['STUDENT']} />}>
                            <Route path="/student" element={<StudentDashboard />} />

                            <Route
                                path="/student/schedule-generator"
                                element={<StudentScheduleGeneratorPage />}
                            />

                            <Route
                                path="/student/my-schedules"
                                element={<MySavedSchedulesPage />}
                            />

                            {/* ✅ Nueva ruta para estudiantes */}
                            <Route
                                path="/student/offer"
                                element={<StudentOfferPage />}
                            />
                        </Route>
                    </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    )
}
