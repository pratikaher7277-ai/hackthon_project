import {
  Users, Headphones, Store, Megaphone, Server,
  ShoppingCart, Scale, DollarSign, ChevronRight,
  AlertCircle
} from 'lucide-react'

const stakeholders = [
  {
    name: 'Customers',
    icon: Users,
    color: '#6366f1',
    interest: 'Seamless, low-effort service',
    concern: 'Repeating themselves; conflicting answers',
    impact: 'High',
    satisfaction: 62,
  },
  {
    name: 'Customer Service / Contact Centre',
    icon: Headphones,
    color: '#06b6d4',
    interest: 'Full context, fewer escalations',
    concern: 'Tools that show incomplete history',
    impact: 'High',
    satisfaction: 48,
  },
  {
    name: 'Store / Field Staff',
    icon: Store,
    color: '#10b981',
    interest: 'Access to online orders and history',
    concern: 'Lack of system access',
    impact: 'Medium',
    satisfaction: 55,
  },
  {
    name: 'Marketing',
    icon: Megaphone,
    color: '#8b5cf6',
    interest: 'Coherent messaging and personalization',
    concern: 'Channel-routing logic conflicts with service data',
    impact: 'Medium',
    satisfaction: 60,
  },
  {
    name: 'IT / Architecture',
    icon: Server,
    color: '#f59e0b',
    interest: 'Maintainable integration',
    concern: 'Legacy systems, cost, security',
    impact: 'High',
    satisfaction: 45,
  },
  {
    name: 'Product / E-commerce',
    icon: ShoppingCart,
    color: '#ec4899',
    interest: 'Accurate content and pricing everywhere',
    concern: 'Update lag between channels',
    impact: 'Medium',
    satisfaction: 58,
  },
  {
    name: 'Legal / Compliance / Privacy',
    icon: Scale,
    color: '#ef4444',
    interest: 'Consent, disclosures, retention',
    concern: 'Cross-channel data use',
    impact: 'High',
    satisfaction: 52,
  },
  {
    name: 'Executives / Finance',
    icon: DollarSign,
    color: '#14b8a6',
    interest: 'ROI, risk management',
    concern: 'Long payback, unclear ownership',
    impact: 'High',
    satisfaction: 50,
  },
]

const impactColor = {
  High: 'danger',
  Medium: 'warning',
  Low: 'success',
}

export default function Stakeholders() {
  return (
    <>
      <div className="page-header animate-in">
        <h1>Stakeholders</h1>
        <p>Map key stakeholders, their interests, and concerns in the omnichannel consistency initiative</p>
      </div>

      {/* Stakeholder Grid */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {stakeholders.map((sh, idx) => {
          const Icon = sh.icon
          return (
            <div
              key={sh.name}
              className="glass-card animate-in"
              style={{ animationDelay: `${0.08 * (idx + 1)}s` }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: `${sh.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={24} color={sh.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 'var(--space-xs)',
                  }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{sh.name}</h3>
                    <span className={`badge ${impactColor[sh.impact]}`}>
                      {sh.impact} Impact
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)',
                }}>
                  <ChevronRight size={14} color="var(--accent-success)" />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Interest
                  </span>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--space-lg)' }}>
                  {sh.interest}
                </p>
              </div>

              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                  marginBottom: 'var(--space-sm)',
                }}>
                  <AlertCircle size={14} color="var(--accent-warning)" />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Primary Concern
                  </span>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--space-lg)' }}>
                  {sh.concern}
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 'var(--space-xs)',
                }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    Current Satisfaction
                  </span>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 700,
                    color: sh.satisfaction >= 70 ? 'var(--accent-success)' :
                           sh.satisfaction >= 50 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                  }}>
                    {sh.satisfaction}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '6px' }}>
                  <div
                    className={`progress-fill ${sh.satisfaction >= 70 ? 'success' : sh.satisfaction >= 50 ? 'warning' : 'danger'}`}
                    style={{ width: `${sh.satisfaction}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Key Questions */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <h3 className="card-title">Key Questions Behind the Problem</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[
            'Which channels are in scope, and which customer journeys cross them most often?',
            'Where does inconsistency hurt most: information, pricing, order status, identity, or service quality?',
            'Is there one customer identifier today, and how reliable is it?',
            'Who owns end-to-end experience, and how are they measured?',
            'What is the current repeat-contact and channel-switch rate?',
            'What is fixed by process/content changes versus needing new technology?',
          ].map((q, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'var(--bg-glass)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
            }}>
              <span style={{
                width: '28px', height: '28px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {q}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
