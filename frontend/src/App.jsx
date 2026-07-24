import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AiAssistantProvider } from './context/AiAssistantContext'
import Navbar from './components/Navbar'
import AppLayout from './layouts/AppLayout'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CreativeStudio from "./pages/CreativeStudio"
import SandboxPage from './pages/SandboxPage'

import Dashboard from './pages/Dashboard'
import ProjectsPage from './pages/ProjectsPage'
import AssetLibraryPage from './pages/AssetLibraryPage'
import AnalyticsPage from './pages/AnalyticsPage'
import PromptLibraryPage from './pages/PromptLibraryPage'
import History from './pages/History'
import TemplatesPage from './pages/TemplatesPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import AiAssistantDrawer from './components/AiAssistantDrawer'

function RequireAuth({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function AppRoutes() {
  const { isAuth } = useAuth()
  const location = useLocation()

  // Public pages use Navbar, /app pages do NOT use Navbar
  const isAppRoute = location.pathname.startsWith('/app')

  return (
    <>
      {!isAppRoute && <Navbar />}
      <AiAssistantDrawer />
      <Routes>
        {/* PUBLIC MARKETING ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<LandingPage />} />
        <Route path="/pricing" element={<LandingPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* AUTHENTICATED APP ROUTES */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="studio" element={<CreativeStudio />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="assets" element={<AssetLibraryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="prompts" element={<PromptLibraryPage />} />
          <Route path="history" element={<History />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* LEGACY REDIRECTS */}
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
        <Route path="/studio" element={<Navigate to="/app/studio" replace />} />
        <Route path="/generate" element={<Navigate to={isAuth ? "/app/studio" : "/sandbox"} replace />} />
        <Route path="/history" element={<Navigate to="/app/history" replace />} />

        {/* CATCH ALL */}
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
