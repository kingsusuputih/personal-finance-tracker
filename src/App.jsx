import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LedgerPage from './pages/LedgerPage.jsx'

function RequireAuth() {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/login" replace />
  return <Outlet />
}

function GuestOnly() {
  const { isAuthed } = useAuth()
  if (isAuthed) return <Navigate to="/dashboard" replace />
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ledger" element={<LedgerPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
