import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  Route,
  BarChart3,
  Users,
  Map,
  Settings,
  HelpCircle,
  Layers,
  X,
  Sparkles,
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
  { label: 'Help & Docs', path: '/help', icon: HelpCircle },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Layers size={22} color="#ffffff" />
          </div>
          <span className="logo-text">OmniSync</span>
          <span className="logo-badge">v2.4</span>

          {isOpen && (
            <button
              type="button"
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-title">Core Operations</span>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
                onClick={onClose}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}

          <span className="sidebar-section-title" style={{ marginTop: 'auto' }}>
            System Support
          </span>
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-score-widget">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={14} color="var(--brand-primary)" />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Index Health
              </span>
            </div>
            <p
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--brand-primary)',
                lineHeight: 1.1,
                fontFamily: 'var(--font-heading)',
              }}
            >
              78.4%
            </p>
            <div className="progress-bar" style={{ height: 5, margin: '8px 0 6px' }}>
              <div className="progress-fill primary" style={{ width: '78.4%' }} />
            </div>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--brand-emerald)',
                fontWeight: 600,
              }}
            >
              ↑ 3.2% vs last audit
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
