import { useState, useEffect } from 'react'
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react'

export default function Header({ onToggleSidebar }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.setAttribute('data-theme', 'dark')
    } else {
      root.removeAttribute('data-theme')
    }
  }, [isDark])

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-search">
          <Search size={16} color="var(--text-tertiary)" />
          <input
            type="text"
            placeholder="Search channels, journeys, metrics..."
            aria-label="Search"
          />
          <span className="header-search-badge">⌘K</span>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-btn"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          type="button"
          className="header-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-profile-chip" title="Alex Vance — Omni Lead">
          <div className="header-avatar">AV</div>
          <div className="header-user-info">
            <span className="header-user-name">Alex Vance</span>
            <span className="header-user-role">Journey Lead</span>
          </div>
        </div>
      </div>
    </header>
  )
}
