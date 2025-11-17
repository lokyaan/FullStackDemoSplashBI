import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import Protected from './components/Protected.jsx'
import { useAuth } from './context/AuthContext.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
export default function App() {
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login')
  }

  function RequireRole({ role, children }) {
    const { roles, isAuthed } = useAuth()
    if (!isAuthed) return <Navigate to="/login" replace />
    if (!roles.includes(role)) return <Navigate to="/" replace />
    return children
  }

  return (
    <div className="min-h-dvh text-slate-900 dark:text-slate-100">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Dashboards */}
          <Route
            path="/admin"
            element={
              <Protected>
                <AdminDashboard />
              </Protected>
            }
          />
          <Route
            path="/customer"
            element={
              <Protected>
                <CustomerDashboard />
              </Protected>
            }
          />
          <Route
            path="/manager"
            element={
              <RequireRole role="MANAGER">
                <ManagerDashboard />
              </RequireRole>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/change-password" element={<ChangePassword />}/>
        </Routes>
      </main>
    </div>
  )
}
