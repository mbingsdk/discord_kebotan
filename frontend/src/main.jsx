import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'
import './index.css'
// import './App.css'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import AuthCallback from './auth/callback.jsx'
import Dashboard from './pages/Dashboard.jsx'
import GuildList from './pages/GuildList.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import GuildDashboard from './pages/guild/GuildDashboard.jsx'
import About from './pages/About.jsx'
import { AlertProvider } from './context/AlertContext.jsx'
import LegalPage from './pages/Legal.jsx'
// import { useErrorReporter } from './hooks/useErrorReporter.js'

function RootRedirect() {
  const { user, loading } = React.useContext(AuthContext)
  if (loading) return <p className="p-5 text-center">Loading...</p>
  return user ? <Navigate to="/dashboard" replace /> : <Login />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App><RootRedirect /></App>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/legal" element={<App><LegalPage /></App>} />
            {/* <Route path="/auth/callback" element={<Navigate to="/dashboard" />} /> */}
            <Route path="/dashboard" element={<RequireAuth><App><Dashboard /></App></RequireAuth>} />
            <Route path="/guilds" element={<RequireAuth><App><GuildList /></App></RequireAuth>} />
            <Route path="/guilds/:guildId" element={<RequireAuth><App><GuildDashboard /></App></RequireAuth>} />
            <Route path="/about" element={<App><About /></App>} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  </React.StrictMode>
)
