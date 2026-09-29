import {
  ArrowRight, User, Globe, Smartphone, MessageSquare,
  Phone, Store, CheckCircle, XCircle, Clock, AlertTriangle,
  Eye
} from 'lucide-react'

const channelIcons = {
  Web: Globe,
  Mobile: Smartphone,
  Social: MessageSquare,
  Phone: Phone,
  Store: Store,
}

const channelColors = {
  Web: '#6366f1',
  Mobile: '#06b6d4',
  Social: '#8b5cf6',
  Phone: '#f59e0b',
  Store: '#10b981',
}

const journeys = [
  {
    id: 'JRN-2041',
    customer: 'Sarah M.',
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
    customer: 'James T.',
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
    customer: 'Priya K.',
    steps: [
      { channel: 'Mobile', action: 'Checked order status', time: '08:00 AM', contextPassed: true },
      { channel: 'Phone', action: 'Called about delivery delay', time: '08:20 AM', contextPassed: false },
      { channel: 'Social', action: 'Complained on Twitter about being asked to repeat info', time: '08:45 AM', contextPassed: false },
    ],
    status: 'Escalated',
    effort: 'Very High',
    resolved: false,
  },
  {
    id: 'JRN-2038',
    customer: 'Tom R.',
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
    customer: 'Elena V.',
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
  'Resolved': { badge: 'success', icon: CheckCircle },
  'Context Lost': { badge: 'danger', icon: XCircle },
  'Escalated': { badge: 'warning', icon: AlertTriangle },
  'In Progress': { badge: 'info', icon: Clock },
}

const effortMap = {
  'Low': 'success',
  'Medium': 'info',
  'High': 'warning',
  'Very High': 'danger',
}

export default function JourneyTracker() {
  return (
    <>
      <div className="page-header animate-in">
        <h1>Journey Tracker</h1>
        <p>Visualize customer journeys across channel switches and context handoffs</p>
      </div>

      {/* Summary strip */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="kpi-card primary animate-in animate-in-delay-1">
          <p className="kpi-label">Total Journeys Today</p>
          <p className="kpi-value">142</p>
          <span className="kpi-trend up">↑ 8% vs yesterday</span>
        </div>
        <div className="kpi-card success animate-in animate-in-delay-2">
          <p className="kpi-label">Context Preserved</p>
          <p className="kpi-value">68%</p>
          <span className="kpi-trend up">↑ 5%</span>
        </div>
        <div className="kpi-card warning animate-in animate-in-delay-3">
          <p className="kpi-label">Avg Channels / Journey</p>
          <p className="kpi-value">2.7</p>
          <span className="kpi-trend down">↓ 0.3</span>
        </div>
        <div className="kpi-card secondary animate-in animate-in-delay-4">
          <p className="kpi-label">Resolution Rate</p>
          <p className="kpi-value">74%</p>
          <span className="kpi-trend up">↑ 2%</span>
        </div>
      </div>

      {/* Journey Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {journeys.map((journey, idx) => {
          const StatusIcon = statusMap[journey.status]?.icon || Clock
          return (
            <div
              key={journey.id}
              className="glass-card animate-in"
              style={{ animationDelay: `${0.1 * (idx + 1)}s`, cursor: 'default' }}
            >
              {/* Journey Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-lg)',
                flexWrap: 'wrap',
                gap: 'var(--space-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={20} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 'var(--font-size-base)' }}>{journey.customer}</p>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{journey.id}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                  <span className={`badge ${effortMap[journey.effort]}`}>
                    Effort: {journey.effort}
                  </span>
                  <span className={`badge ${statusMap[journey.status]?.badge || 'info'}`}>
                    <StatusIcon size={12} />
                    {journey.status}
                  </span>
                </div>
              </div>

              {/* Journey Flow */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0',
                overflowX: 'auto',
                padding: 'var(--space-md) 0',
              }}>
                {journey.steps.map((step, i) => {
                  const ChannelIcon = channelIcons[step.channel]
                  const color = channelColors[step.channel]
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Step Node */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '140px',
                        padding: 'var(--space-md)',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-fast)',
                      }}>
                        <div style={{
                          width: '44px', height: '44px',
                          borderRadius: '50%',
                          background: `${color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginBottom: 'var(--space-sm)',
                        }}>
                          <ChannelIcon size={20} color={color} />
                        </div>
                        <p style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 600,
                          color: color,
                          marginBottom: '2px',
                        }}>
                          {step.channel}
                        </p>
                        <p style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--text-secondary)',
                          textAlign: 'center',
                          lineHeight: 1.4,
                          maxWidth: '130px',
                        }}>
                          {step.action}
                        </p>
                        <p style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--text-muted)',
                          marginTop: 'var(--space-xs)',
                        }}>
                          {step.time}
                        </p>
                      </div>

                      {/* Arrow between steps */}
                      {i < journey.steps.length - 1 && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          padding: '0 var(--space-sm)',
                          minWidth: '60px',
                        }}>
                          <ArrowRight
                            size={20}
                            color={step.contextPassed ? 'var(--accent-success)' : 'var(--accent-danger)'}
                          />
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: step.contextPassed ? 'var(--accent-success)' : 'var(--accent-danger)',
                            marginTop: '2px',
                          }}>
                            {step.contextPassed ? 'Context ✓' : 'Context ✗'}
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
