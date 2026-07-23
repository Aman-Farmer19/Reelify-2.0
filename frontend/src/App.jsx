import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AiAssistantProvider } from './context/AiAssistantContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Generator from './pages/Generator'
import AuthModal from './components/AuthModal'
import AiAssistantDrawer from './components/AiAssistantDrawer'
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
      <AiAssistantDrawer />
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(m) => setAuthModal(m)}
        />
      )}
      <Routes>
        <Route path="/" element={<LandingPage onAuth={setAuthModal} />} />
        <Route path="/sandbox" element={<Generator mode="sandbox" onAuth={setAuthModal} />} />
        <Route path="/studio" element={isAuth ? <Generator mode="studio" onAuth={setAuthModal} /> : <Navigate to="/sandbox" replace />} />
        <Route path="/generate" element={<Navigate to={isAuth ? "/studio" : "/sandbox"} replace />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/history" element={isAuth ? <History /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AiAssistantProvider>
        <AppRoutes />
      </AiAssistantProvider>
    </AuthProvider>
  )
}
