import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import ChannelAudit from './pages/ChannelAudit'
import JourneyTracker from './pages/JourneyTracker'
import Metrics from './pages/Metrics'
import Stakeholders from './pages/Stakeholders'
import Roadmap from './pages/Roadmap'

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <Header />
        <main className="main-content">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/audit" element={<ChannelAudit />} />
              <Route path="/journeys" element={<JourneyTracker />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/stakeholders" element={<Stakeholders />} />
              <Route path="/roadmap" element={<Roadmap />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
