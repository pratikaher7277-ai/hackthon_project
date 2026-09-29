import { useState } from 'react'
import {
  Globe, Smartphone, MessageSquare, Phone, Store,
  CheckCircle, XCircle, AlertTriangle, Filter, RefreshCw
} from 'lucide-react'

const channels = ['Web Portal', 'Mobile App', 'Social Media', 'Contact Centre', 'Physical Store']
const channelIcons = {
  'Web Portal': Globe,
  'Mobile App': Smartphone,
  'Social Media': MessageSquare,
  'Contact Centre': Phone,
  'Physical Store': Store,
}

const auditData = [
  {
    item: 'Return Policy (30-day)',
    category: 'Policy',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': false, 'Contact Centre': true, 'Physical Store': false },
  },
  {
    item: 'Product Price — SKU #4821',
    category: 'Pricing',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': true, 'Contact Centre': true, 'Physical Store': false },
  },
  {
    item: 'Warranty Duration',
    category: 'Policy',
    channels: { 'Web Portal': true, 'Mobile App': false, 'Social Media': false, 'Contact Centre': true, 'Physical Store': true },
  },
  {
    item: 'Shipping Cost — Standard',
    category: 'Pricing',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': true, 'Contact Centre': true, 'Physical Store': true },
  },
  {
    item: 'Loyalty Points Balance',
    category: 'Account',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': false, 'Contact Centre': true, 'Physical Store': false },
  },
  {
    item: 'Order Status Display',
    category: 'Order',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': false, 'Contact Centre': true, 'Physical Store': false },
  },
  {
    item: 'Promotional Pricing — Summer Sale',
    category: 'Pricing',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': true, 'Contact Centre': false, 'Physical Store': false },
  },
  {
    item: 'Privacy Disclosure Text',
    category: 'Compliance',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': false, 'Contact Centre': false, 'Physical Store': true },
  },
  {
    item: 'Customer Support Hours',
    category: 'Info',
    channels: { 'Web Portal': true, 'Mobile App': false, 'Social Media': true, 'Contact Centre': true, 'Physical Store': true },
  },
  {
    item: 'Product Availability — Real-time',
    category: 'Inventory',
    channels: { 'Web Portal': true, 'Mobile App': true, 'Social Media': false, 'Contact Centre': false, 'Physical Store': true },
  },
]

const categoryColors = {
  Policy: 'primary',
  Pricing: 'success',
  Account: 'info',
  Order: 'warning',
  Compliance: 'danger',
  Info: 'primary',
  Inventory: 'info',
}

export default function ChannelAudit() {
  const [filter, setFilter] = useState('All')
  const categories = ['All', ...new Set(auditData.map(d => d.category))]

  const filtered = filter === 'All' ? auditData : auditData.filter(d => d.category === filter)

  const stats = {
    total: auditData.length * channels.length,
    consistent: auditData.reduce((acc, d) => acc + Object.values(d.channels).filter(Boolean).length, 0),
  }
  stats.inconsistent = stats.total - stats.consistent
  stats.rate = ((stats.consistent / stats.total) * 100).toFixed(1)

  return (
    <>
      <div className="page-header animate-in">
        <h1>Channel Audit</h1>
        <p>Compare information consistency across all customer channels</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="kpi-card success animate-in animate-in-delay-1">
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-success-light)' }}>
            <CheckCircle size={22} />
          </div>
          <p className="kpi-label">Consistent Items</p>
          <p className="kpi-value">{stats.consistent}</p>
        </div>
        <div className="kpi-card warning animate-in animate-in-delay-2">
          <div className="kpi-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-danger-light)' }}>
            <XCircle size={22} />
          </div>
          <p className="kpi-label">Inconsistencies</p>
          <p className="kpi-value">{stats.inconsistent}</p>
        </div>
        <div className="kpi-card primary animate-in animate-in-delay-3">
          <div className="kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary-light)' }}>
            <RefreshCw size={22} />
          </div>
          <p className="kpi-label">Consistency Rate</p>
          <p className="kpi-value">{stats.rate}%</p>
        </div>
        <div className="kpi-card secondary animate-in animate-in-delay-4">
          <div className="kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-secondary-light)' }}>
            <AlertTriangle size={22} />
          </div>
          <p className="kpi-label">Items Audited</p>
          <p className="kpi-value">{auditData.length}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>
            Filter by category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filter === cat ? 'var(--accent-primary)' : 'var(--border-color)',
                background: filter === cat ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: filter === cat ? 'var(--accent-primary-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family)',
                fontWeight: 500,
                transition: 'all 150ms ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Matrix */}
      <div className="glass-card animate-in animate-in-delay-3">
        <div className="card-header">
          <h3 className="card-title">Cross-Channel Consistency Matrix</h3>
          <span className="badge info">{filtered.length} items</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                {channels.map(ch => {
                  const Icon = channelIcons[ch]
                  return (
                    <th key={ch} style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <Icon size={16} />
                        <span>{ch.split(' ')[0]}</span>
                      </div>
                    </th>
                  )
                })}
                <th style={{ textAlign: 'center' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const total = Object.values(row.channels).length
                const consistent = Object.values(row.channels).filter(Boolean).length
                const pct = Math.round((consistent / total) * 100)
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)', minWidth: '200px' }}>
                      {row.item}
                    </td>
                    <td>
                      <span className={`badge ${categoryColors[row.category]}`}>{row.category}</span>
                    </td>
                    {channels.map(ch => (
                      <td key={ch} style={{ textAlign: 'center' }}>
                        {row.channels[ch]
                          ? <CheckCircle size={18} color="var(--accent-success)" />
                          : <XCircle size={18} color="var(--accent-danger)" style={{ opacity: 0.6 }} />
                        }
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        fontWeight: 600,
                        fontSize: 'var(--font-size-sm)',
                        color: pct === 100 ? 'var(--accent-success)' :
                               pct >= 60 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                      }}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
