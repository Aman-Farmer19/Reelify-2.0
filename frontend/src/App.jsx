import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Generator from './pages/Generator'
import AuthModal from './components/AuthModal'
import { useState } from 'react'

function RequireAuthToGenerate({ onAuth }) {
  React.useEffect(() => {
    onAuth('signup')
  }, [onAuth])
  return <Navigate to="/" replace />
}

function AppRoutes() {
  const { isAuth } = useAuth()
  const [authModal, setAuthModal] = useState(null)

  return (
    <>
      <Navbar onAuth={setAuthModal} />
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(m) => setAuthModal(m)}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage onAuth={setAuthModal} />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
