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
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import TeacherSchedulePage from './pages/teacher/TeacherSchedulePage'
import TeacherSectionsPage from './pages/teacher/TeacherSectionsPage'
import TeacherAvailabilityPage from './pages/teacher/TeacherAvailabilityPage'
import TeacherLoadPage from './pages/teacher/TeacherLoadPage'
import TeacherConflictsPage from './pages/teacher/TeacherConflictsPage'
import TeacherChangeRequestsPage from './pages/teacher/TeacherChangeRequestsPage'
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
import AcademicPeriodsPage from './pages/admin/AcademicPeriodsPage'
import AcademicProgramsPage from './pages/admin/AcademicProgramsPage'
import CurriculumPlansPage from './pages/admin/CurriculumPlansPage'
import CurriculumPage from './pages/admin/CurriculumPage'
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard'
import OfferingsPage from './pages/coordinator/OfferingsPage'
import OfferingFormPage from './pages/coordinator/OfferingFormPage'
import OfferingConflictsPage from './pages/coordinator/OfferingConflictsPage'
import CoordinatorCspPage from './pages/coordinator/CoordinatorCspPage'
import CoordinatorChangeRequestsPage from './pages/coordinator/CoordinatorChangeRequestsPage'
import ExecutiveDashboardPage from './pages/reports/ExecutiveDashboardPage'
import ReportDetailPage from './pages/reports/ReportDetailPage'

// Páginas: Estudiantes
import MySavedSchedulesPage from './pages/student/MySavedSchedulesPage'
import StudentScheduleGeneratorPage from './pages/student/StudentScheduleGeneratorPage'
import StudentCurriculumPage from './pages/student/StudentCurriculumPage'
import StudentOfferPage from './pages/student/StudentOfferPage'   // ✅ Nuevo import

// Stores
import { useAuthStore } from './stores/authStore'

function HomeRedirect() {
    const { user, isAuthenticated } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (user?.role === 'ADMIN') {
        return <Navigate to="/admin/dashboard" replace />
    }

    if (user?.role === 'COORDINATOR') {
        return <Navigate to="/coordinator/dashboard" replace />
    }

    if (user?.role === 'TEACHER') {
        return <Navigate to="/teacher/dashboard" replace />
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
                            element={<Navigate to="/coordinator/dashboard" replace />}
                        />
                        <Route
                            path="/teacher"
                            element={<Navigate to="/teacher/dashboard" replace />}
                        />

                        {/* ADMIN */}
                        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                            <Route path="/admin/executive-dashboard" element={<ExecutiveDashboardPage />} />
                            <Route path="/admin/reports/teacher-load" element={<ReportDetailPage reportType="teacher-load" />} />
                            <Route path="/admin/reports/classroom-usage" element={<ReportDetailPage reportType="classroom-usage" />} />
                            <Route path="/admin/reports/offerings" element={<ReportDetailPage reportType="offerings" />} />
                            <Route path="/admin/reports/conflicts" element={<ReportDetailPage reportType="conflicts" />} />
                            <Route path="/admin/reports/schedules" element={<ReportDetailPage reportType="schedules" />} />
                            <Route path="/admin/reports/students" element={<ReportDetailPage reportType="students" />} />
                            <Route path="/admin/reports/change-requests" element={<ReportDetailPage reportType="change-requests" />} />
                            <Route path="/admin/reports/sustainability" element={<ReportDetailPage reportType="sustainability" />} />
                            <Route path="/admin/environmental-impact" element={<EnvironmentalImpactPage />} />

                            <Route path="/admin/users" element={<UsersPage />} />
                            <Route path="/admin/teachers" element={<TeachersPage />} />
                            <Route path="/admin/students" element={<StudentsPage />} />
                            <Route path="/admin/sections" element={<SectionsPage />} />
                            <Route path="/admin/courses" element={<CoursesPage />} />
                            <Route path="/admin/classrooms" element={<ClassroomsPage />} />
                            <Route path="/admin/academic-periods" element={<AcademicPeriodsPage />} />
                            <Route path="/admin/academic-programs" element={<AcademicProgramsPage />} />
                            <Route path="/admin/curriculum-plans" element={<CurriculumPlansPage />} />
                            <Route path="/admin/curriculum" element={<CurriculumPage />} />

                            <Route path="/admin/student-generator" element={<StudentScheduleGeneratorPage />} />
                            <Route path="/admin/student-schedules" element={<MySavedSchedulesPage />} />

                            <Route path="/admin/student-offer" element={<StudentOfferPage />} />
                        </Route>

                        {/* ADMIN y COORDINATOR: oferta academica */}
                        <Route element={<RoleRoute allowedRoles={['ADMIN', 'COORDINATOR']} />}>
                            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
                            <Route path="/coordinator/offerings" element={<OfferingsPage />} />
                            <Route path="/coordinator/offerings/create" element={<OfferingFormPage />} />
                            <Route path="/coordinator/offerings/:id" element={<OfferingFormPage />} />
                            <Route path="/coordinator/conflicts" element={<OfferingConflictsPage />} />
                            <Route path="/coordinator/csp" element={<CoordinatorCspPage />} />
                            <Route path="/coordinator/change-requests" element={<CoordinatorChangeRequestsPage />} />
                            <Route path="/coordinator/reports" element={<ExecutiveDashboardPage />} />
                            <Route path="/coordinator/reports/teacher-load" element={<ReportDetailPage reportType="teacher-load" />} />
                            <Route path="/coordinator/reports/classroom-usage" element={<ReportDetailPage reportType="classroom-usage" />} />
                            <Route path="/coordinator/reports/offerings" element={<ReportDetailPage reportType="offerings" />} />
                            <Route path="/coordinator/reports/conflicts" element={<ReportDetailPage reportType="conflicts" />} />
                            <Route path="/coordinator/reports/schedules" element={<ReportDetailPage reportType="schedules" />} />
                            <Route path="/coordinator/reports/change-requests" element={<ReportDetailPage reportType="change-requests" />} />
                            <Route path="/admin/schedules" element={<InstitutionalCSPPage />} />
                            <Route path="/admin/schedule-view" element={<InstitutionalScheduleViewPage />} />
                            <Route path="/admin/schedule-quality" element={<ScheduleQualityPage />} />
                            <Route path="/admin/data-readiness" element={<DataReadinessPage />} />
                            <Route path="/admin/institutional-csp" element={<InstitutionalCspGeneratorPage />} />
                        </Route>

                        {/* TEACHER */}
                        <Route element={<RoleRoute allowedRoles={['TEACHER']} />}>
                            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
                            <Route path="/teacher/schedule" element={<TeacherSchedulePage />} />
                            <Route path="/teacher/sections" element={<TeacherSectionsPage />} />
                            <Route path="/teacher/availability" element={<TeacherAvailabilityPage />} />
                            <Route path="/teacher/load" element={<TeacherLoadPage />} />
                            <Route path="/teacher/conflicts" element={<TeacherConflictsPage />} />
                            <Route path="/teacher/change-requests" element={<TeacherChangeRequestsPage />} />
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
                            <Route
                                path="/student/curriculum"
                                element={<StudentCurriculumPage />}
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
