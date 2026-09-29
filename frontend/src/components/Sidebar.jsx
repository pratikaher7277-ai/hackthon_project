import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Route,
  BarChart3,
  Users,
  Map,
  Settings,
  HelpCircle,
  Layers
} from 'lucide-react'

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Channel Audit', path: '/audit', icon: Search },
  { label: 'Journey Tracker', path: '/journeys', icon: Route },
  { label: 'Metrics & KPIs', path: '/metrics', icon: BarChart3 },
  { label: 'Stakeholders', path: '/stakeholders', icon: Users },
  { label: 'Roadmap', path: '/roadmap', icon: Map },
]

const bottomItems = [
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: HelpCircle },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Layers size={20} color="#fff" />
        </div>
        <span className="logo-text">OmniSync</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-title">Main</span>
        {navItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}

        <span className="sidebar-section-title" style={{ marginTop: 'auto' }}>Support</span>
        {bottomItems.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div style={{
        padding: 'var(--space-md)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-xs)'
          }}>
            Consistency Score
          </p>
          <p style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            78.4%
          </p>
          <p style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--accent-success)',
            marginTop: 'var(--space-xs)'
          }}>
            ↑ 3.2% this month
          </p>
        </div>
      </div>
    </aside>
  )
}
