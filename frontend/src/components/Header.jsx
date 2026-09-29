import { Search, Bell, Moon } from 'lucide-react'

export default function Header() {
  return (
    <header className="top-header">
      <div className="header-search">
        <Search size={16} color="var(--text-muted)" />
        <input type="text" placeholder="Search channels, journeys, metrics..." />
      </div>

      <div className="header-actions">
        <button className="header-btn" title="Toggle theme">
          <Moon size={18} />
        </button>
        <button className="header-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
        <div className="header-avatar" title="Profile">
          OC
        </div>
      </div>
    </header>
  )
}
