import { useState } from 'react'
import {
  Globe, Smartphone, MessageSquare, Phone, Store,
  CheckCircle2, XCircle, AlertTriangle, Filter, RefreshCw,
  SlidersHorizontal, Check, X
} from 'lucide-react'
import KpiCard from '../components/KpiCard'

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
  const categories = ['All', ...new Set(auditData.map((d) => d.category))]

  const filtered = filter === 'All' ? auditData : auditData.filter((d) => d.category === filter)

  const stats = {
    total: auditData.length * channels.length,
    consistent: auditData.reduce((acc, d) => acc + Object.values(d.channels).filter(Boolean).length, 0),
  }
  stats.inconsistent = stats.total - stats.consistent
  stats.rate = ((stats.consistent / stats.total) * 100).toFixed(1)

  return (
    <>
      <div className="page-header animate-in">
        <div className="page-header-text">
          <h1>Channel Parity Audit</h1>
          <p>Cross-verification matrix evaluating data and policy uniformity across 5 touchpoints</p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <KpiCard
          icon={CheckCircle2}
          label="Consistent Points"
          value={stats.consistent}
          trend="Audited across 5 nodes"
          trendDir="up"
          variant="success"
          progress={Math.round((stats.consistent / stats.total) * 100)}
          delay={0.05}
        />
        <KpiCard
          icon={XCircle}
          label="Detected Inconsistencies"
          value={stats.inconsistent}
          trend="Requires sync intervention"
          trendDir="down"
          variant="warning"
          progress={Math.round((stats.inconsistent / stats.total) * 100)}
          delay={0.1}
        />
        <KpiCard
          icon={RefreshCw}
          label="Audit Uniformity Rate"
          value={`${stats.rate}%`}
          trend="Target: > 90%"
          trendDir="up"
          variant="primary"
          progress={parseFloat(stats.rate)}
          delay={0.15}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Catalogued Entities"
          value={auditData.length}
          trend="Core journey facets"
          trendDir="up"
          variant="secondary"
          progress={100}
          delay={0.2}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ marginBottom: 24, padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <SlidersHorizontal size={16} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter by Facet:</span>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const count = cat === 'All' ? auditData.length : auditData.filter((d) => d.category === cat).length
              const isSelected = filter === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--brand-primary)' : 'var(--border-light)',
                    background: isSelected ? 'var(--brand-primary)' : 'var(--bg-surface-subtle)',
                    color: isSelected ? '#ffffff' : 'var(--text-body)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                  }}
                >
                  <span>{cat}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      opacity: 0.8,
                      padding: '1px 5px',
                      borderRadius: 10,
                      background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Audit Matrix Table */}
      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 0 }}>
        <div
          className="card-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: 0,
          }}
        >
          <div>
            <h3 className="card-title">Cross-Channel Consistency Matrix</h3>
            <p className="card-subtitle">Verifies facts, policies, and pricing propagation across live customer channels</p>
          </div>
          <span className="badge info">{filtered.length} Entities Evaluated</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: 240 }}>Monitored Item / Entity</th>
                <th>Category</th>
                {channels.map((ch) => {
                  const Icon = channelIcons[ch]
                  return (
                    <th key={ch} style={{ textAlign: 'center', minWidth: 120 }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        <Icon size={14} color="var(--brand-primary)" />
                        <span style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                          {ch.split(' ')[0]}
                        </span>
                      </div>
                    </th>
                  )
                })}
                <th style={{ textAlign: 'center', minWidth: 140 }}>Parity Score</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const total = Object.values(row.channels).length
                const consistent = Object.values(row.channels).filter(Boolean).length
                const pct = Math.round((consistent / total) * 100)
                const isPerfect = pct === 100
                const isAcceptable = pct >= 60

                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {row.item}
                    </td>
                    <td>
                      <span className={`badge ${categoryColors[row.category]}`}>
                        {row.category}
                      </span>
                    </td>
                    {channels.map((ch) => {
                      const isMatch = row.channels[ch]
                      return (
                        <td key={ch} style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: isMatch
                                ? 'rgba(16, 185, 129, 0.12)'
                                : 'rgba(239, 68, 68, 0.12)',
                              color: isMatch ? '#059669' : '#dc2626',
                            }}
                            title={isMatch ? `${ch}: Consistent` : `${ch}: Inconsistent`}
                          >
                            {isMatch ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
                          </span>
                        </td>
                      )
                    })}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60, height: 6 }}>
                          <div
                            className={`progress-fill ${isPerfect ? 'success' : isAcceptable ? 'warning' : 'danger'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '12px',
                            minWidth: 36,
                            color: isPerfect ? '#059669' : isAcceptable ? '#d97706' : '#dc2626',
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
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
