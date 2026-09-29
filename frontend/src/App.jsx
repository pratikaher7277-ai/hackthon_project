import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ChannelAudit from './pages/ChannelAudit'
import JourneyTracker from './pages/JourneyTracker'
import Metrics from './pages/Metrics'
import Stakeholders from './pages/Stakeholders'
import Roadmap from './pages/Roadmap'
import Settings from './pages/Settings'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="app-layout">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="main-content">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/audit" element={<ChannelAudit />} />
              <Route path="/journeys" element={<JourneyTracker />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/stakeholders" element={<Stakeholders />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Navigate to="/roadmap" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
