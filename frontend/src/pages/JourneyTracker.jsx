import { useState } from 'react'
import {
  ArrowRight, User, Globe, Smartphone, MessageSquare,
  Phone, Store, CheckCircle, XCircle, Clock, AlertTriangle,
  GitBranch, CheckCheck, RefreshCw, Zap
} from 'lucide-react'
import KpiCard from '../components/KpiCard'

const channelIcons = {
  Web: Globe,
  Mobile: Smartphone,
  Social: MessageSquare,
  Phone: Phone,
  Store: Store,
}

const channelGradients = {
  Web: 'linear-gradient(135deg, #6366f1, #818cf8)',
  Mobile: 'linear-gradient(135deg, #0284c7, #38bdf8)',
  Social: 'linear-gradient(135deg, #8b5cf6, #c084fc)',
  Phone: 'linear-gradient(135deg, #ea580c, #fb923c)',
  Store: 'linear-gradient(135deg, #059669, #34d399)',
}

const journeys = [
  {
    id: 'JRN-2041',
    customer: 'Sarah Miller',
    steps: [
      { channel: 'Web', action: 'Browsed products, added to cart', time: '10:15 AM', contextPassed: true },
      { channel: 'Mobile', action: 'Attempted checkout, payment issue', time: '10:32 AM', contextPassed: true },
      { channel: 'Phone', action: 'Called support, issue resolved', time: '10:48 AM', contextPassed: false },
    ],
    status: 'Context Lost',
    effort: 'High',
    resolved: false,
  },
  {
    id: 'JRN-2040',
    customer: 'James Thornton',
    steps: [
      { channel: 'Social', action: 'Inquired about return policy via DM', time: '09:20 AM', contextPassed: true },
      { channel: 'Web', action: 'Initiated return request', time: '09:45 AM', contextPassed: true },
      { channel: 'Store', action: 'Completed return at physical location', time: '02:30 PM', contextPassed: true },
    ],
    status: 'Resolved',
    effort: 'Low',
    resolved: true,
  },
  {
    id: 'JRN-2039',
    customer: 'Priya Kapoor',
    steps: [
      { channel: 'Mobile', action: 'Checked order status', time: '08:00 AM', contextPassed: true },
      { channel: 'Phone', action: 'Called about delivery delay', time: '08:20 AM', contextPassed: false },
      { channel: 'Social', action: 'Complained on Twitter about repeating info', time: '08:45 AM', contextPassed: false },
    ],
    status: 'Escalated',
    effort: 'Very High',
    resolved: false,
  },
  {
    id: 'JRN-2038',
    customer: 'Tom Reynolds',
    steps: [
      { channel: 'Web', action: 'Compared product specifications', time: '11:00 AM', contextPassed: true },
      { channel: 'Store', action: 'Visited store, purchased product', time: '03:00 PM', contextPassed: true },
    ],
    status: 'Resolved',
    effort: 'Low',
    resolved: true,
  },
  {
    id: 'JRN-2037',
    customer: 'Elena Vasquez',
    steps: [
      { channel: 'Phone', action: 'Reported billing discrepancy', time: '09:00 AM', contextPassed: true },
      { channel: 'Web', action: 'Checked account, different amount shown', time: '09:15 AM', contextPassed: false },
      { channel: 'Phone', action: 'Called back, had to re-explain entire issue', time: '09:40 AM', contextPassed: false },
      { channel: 'Store', action: 'Visited store to resolve in person', time: '01:00 PM', contextPassed: false },
    ],
    status: 'Context Lost',
    effort: 'Very High',
    resolved: false,
  },
]

const statusMap = {
  Resolved: { badge: 'success', icon: CheckCircle },
  'Context Lost': { badge: 'danger', icon: XCircle },
  Escalated: { badge: 'warning', icon: AlertTriangle },
  'In Progress': { badge: 'info', icon: Clock },
}

const effortMap = {
  Low: 'success',
  Medium: 'info',
  High: 'warning',
  'Very High': 'danger',
}

export default function JourneyTracker() {
  const [filter, setFilter] = useState('All')

  const filteredJourneys = filter === 'All'
    ? journeys
    : journeys.filter((j) => j.status === filter)

  return (
    <>
      <div className="page-header animate-in">
        <div className="page-header-text">
          <h1>Cross-Channel Journey Tracker</h1>
          <p>Trace customer pathways across digital, voice, and store touchpoints to verify context continuity</p>
        </div>

        <div className="page-header-actions">
          <div className="pill-group">
            {['All', 'Resolved', 'Context Lost', 'Escalated'].map((st) => (
              <button
                key={st}
                type="button"
                className={`pill-btn ${filter === st ? 'active' : ''}`}
                onClick={() => setFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <KpiCard
          icon={GitBranch}
          label="Tracked Journeys"
          value="142"
          trend="8% vs yesterday"
          trendDir="up"
          variant="primary"
          progress={75}
          delay={0.05}
        />
        <KpiCard
          icon={CheckCheck}
          label="Context Continuity"
          value="68%"
          trend="5% improvement"
          trendDir="up"
          variant="success"
          progress={68}
          delay={0.1}
        />
        <KpiCard
          icon={RefreshCw}
          label="Avg Channels / Journey"
          value="2.7"
          trend="Target: < 2.0"
          trendDir="down"
          variant="warning"
          progress={55}
          delay={0.15}
        />
        <KpiCard
          icon={Zap}
          label="Handoff Resolution Rate"
          value="74%"
          trend="2% gain"
          trendDir="up"
          variant="secondary"
          progress={74}
          delay={0.2}
        />
      </div>

      {/* Journey Cards Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {filteredJourneys.map((journey, idx) => {
          const StatusIcon = statusMap[journey.status]?.icon || Clock
          const initials = journey.customer
            .split(' ')
            .map((n) => n[0])
            .join('')

          return (
            <div
              key={journey.id}
              className="glass-card animate-in"
              style={{ animationDelay: `${0.06 * (idx + 1)}s` }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  gap: 12,
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--border-light)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--grad-brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13px',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {journey.customer}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          padding: '1px 6px',
                          background: 'var(--bg-surface-subtle)',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-xs)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {journey.id}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Traversing {journey.steps.length} sequential touchpoints
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className={`badge ${effortMap[journey.effort]}`}>
                    Effort: {journey.effort}
                  </span>
                  <span className={`badge ${statusMap[journey.status]?.badge || 'info'}`}>
                    <StatusIcon size={13} />
                    {journey.status}
                  </span>
                </div>
              </div>

              {/* Journey Nodes Flow */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  overflowX: 'auto',
                  padding: '8px 4px 12px',
                }}
              >
                {journey.steps.map((step, i) => {
                  const ChannelIcon = channelIcons[step.channel] || Globe
                  const gradient = channelGradients[step.channel] || 'linear-gradient(135deg, #6366f1, #818cf8)'

                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Step Node */}
                      <div
                        className="journey-node"
                        style={{
                          minWidth: 170,
                          maxWidth: 210,
                          padding: '16px 14px',
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            background: gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 10px',
                            color: '#ffffff',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <ChannelIcon size={18} />
                        </div>

                        <span
                          style={{
                            display: 'block',
                            fontSize: '12px',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            marginBottom: 4,
                          }}
                        >
                          {step.channel}
                        </span>

                        <p
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-body)',
                            lineHeight: 1.4,
                            marginBottom: 8,
                            minHeight: 32,
                          }}
                        >
                          {step.action}
                        </p>

                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '10px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-surface-subtle)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-light)',
                          }}
                        >
                          <Clock size={10} />
                          {step.time}
                        </span>
                      </div>

                      {/* Transition Link */}
                      {i < journey.steps.length - 1 && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '0 12px',
                            minWidth: 100,
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              height: 2,
                              background: step.contextPassed ? 'var(--brand-emerald)' : 'var(--brand-rose)',
                              marginBottom: 6,
                              borderRadius: 2,
                              position: 'relative',
                            }}
                          />
                          <span
                            className={`badge ${step.contextPassed ? 'success' : 'danger'}`}
                            style={{ fontSize: '10px', padding: '2px 8px' }}
                          >
                            {step.contextPassed ? 'Passed ✓' : 'Dropped ✗'}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
