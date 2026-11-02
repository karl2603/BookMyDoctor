import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { homeOf, useAuth } from './auth'
import type { Role } from './api'
import Layout from './components/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Doctors from './pages/Doctors'
import DoctorDetail from './pages/DoctorDetail'
import Bookings from './pages/Bookings'
import DoctorHome from './pages/DoctorHome'
import DoctorSlots from './pages/DoctorSlots'
import CreateSlot from './pages/CreateSlot'

function Guard({ role, children }: { role: Role; children: ReactNode }) {
  const { token, role: mine } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (mine !== role) return <Navigate to={homeOf(mine)} replace />
  return <>{children}</>
}
function Guest({ children }: { children: ReactNode }) {
  const { token, role } = useAuth()
  return token ? <Navigate to={homeOf(role)} replace /> : <>{children}</>
}
function Root() {
  const { role } = useAuth()
  return role === 'DOCTOR' ? <Navigate to="/doctor" replace /> : <Home />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Guest><Auth mode="login" /></Guest>} />
        <Route path="/register" element={<Guest><Auth mode="register" /></Guest>} />
        <Route path="/doctors" element={<Guard role="PATIENT"><Doctors /></Guard>} />
        <Route path="/doctors/:id" element={<Guard role="PATIENT"><DoctorDetail /></Guard>} />
        <Route path="/bookings" element={<Guard role="PATIENT"><Bookings /></Guard>} />
        <Route path="/doctor" element={<Guard role="DOCTOR"><DoctorHome /></Guard>} />
        <Route path="/doctor/slots" element={<Guard role="DOCTOR"><DoctorSlots /></Guard>} />
        <Route path="/doctor/create" element={<Guard role="DOCTOR"><CreateSlot /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
