import {
  Users, Headphones, Store, Megaphone, Server,
  ShoppingCart, Scale, DollarSign, CheckCircle2,
  AlertCircle, HelpCircle
} from 'lucide-react'

const stakeholders = [
  {
    name: 'End Customers',
    icon: Users,
    color: '#6366f1',
    interest: 'Seamless, low-effort service with zero repetition across channels',
    concern: 'Forced to repeat context repeatedly; conflicting answers on price/policy',
    impact: 'High',
    satisfaction: 62,
  },
  {
    name: 'Contact Centre & Agents',
    icon: Headphones,
    color: '#06b6d4',
    interest: 'Full omnichannel timeline context to eliminate customer frustration',
    concern: 'Siloed tools showing incomplete journey histories and blind spots',
    impact: 'High',
    satisfaction: 48,
  },
  {
    name: 'Physical Store & Field Staff',
    icon: Store,
    color: '#10b981',
    interest: 'Immediate visibility into online carts, loyalty, and open support tickets',
    concern: 'Lack of unified system access at POS terminals',
    impact: 'Medium',
    satisfaction: 55,
  },
  {
    name: 'Growth & Marketing',
    icon: Megaphone,
    color: '#8b5cf6',
    interest: 'Coherent campaign messaging, unified promotions, and personalization',
    concern: 'Campaign routing logic clashing with live operational service rules',
    impact: 'Medium',
    satisfaction: 60,
  },
  {
    name: 'IT Systems & Enterprise Arch',
    icon: Server,
    color: '#f59e0b',
    interest: 'Maintainable API-led integration layer with unified event streams',
    concern: 'Fragile legacy backends, point-to-point spaghetti integrations, security',
    impact: 'High',
    satisfaction: 45,
  },
  {
    name: 'Product & E-Commerce',
    icon: ShoppingCart,
    color: '#ec4899',
    interest: 'Accurate catalog data, pricing, and warranty rules everywhere',
    concern: 'Sync lag between digital storefronts and enterprise ERP databases',
    impact: 'Medium',
    satisfaction: 58,
  },
  {
    name: 'Legal, Privacy & Compliance',
    icon: Scale,
    color: '#ef4444',
    interest: 'Centralized consent management, regulatory disclosures, data retention',
    concern: 'Unregulated cross-channel data matching violating privacy bounds',
    impact: 'High',
    satisfaction: 52,
  },
  {
    name: 'Executive Leadership & Finance',
    icon: DollarSign,
    color: '#14b8a6',
    interest: 'Demonstrable ROI, reduced cost-to-serve, customer retention gains',
    concern: 'Protracted multi-year replatforming with ambiguous ownership',
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
        <div className="page-header-text">
          <h1>Stakeholder Matrix & Governance</h1>
          <p>Aligning cross-functional priorities, incentives, and operational concerns across the enterprise</p>
        </div>
      </div>

      {/* Stakeholder Grid */}
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {stakeholders.map((sh, idx) => {
          const Icon = sh.icon
          const isGreen = sh.satisfaction >= 60
          const isAmber = sh.satisfaction >= 50 && sh.satisfaction < 60

          return (
            <div
              key={sh.name}
              className="glass-card animate-in"
              style={{ animationDelay: `${0.05 * (idx + 1)}s` }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-sm)',
                    background: `${sh.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sh.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {sh.name}
                    </h3>
                    <span className={`badge ${impactColor[sh.impact]}`}>
                      {sh.impact} Impact
                    </span>
                  </div>
                </div>
              </div>

              {/* Interest Section */}
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <CheckCircle2 size={13} color="#059669" />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#059669',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Core Objective & Interest
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: 1.4 }}>
                  {sh.interest}
                </p>
              </div>

              {/* Concern Section */}
              <div
                style={{
                  padding: '10px 14px',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <AlertCircle size={13} color="#d97706" />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#d97706',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Primary Operational Friction
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: 1.4 }}>
                  {sh.concern}
                </p>
              </div>

              {/* Satisfaction Meter */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Current Satisfaction Index
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isGreen ? '#059669' : isAmber ? '#d97706' : '#dc2626',
                    }}
                  >
                    {sh.satisfaction}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                  <div
                    className={`progress-fill ${isGreen ? 'success' : isAmber ? 'warning' : 'danger'}`}
                    style={{ width: `${sh.satisfaction}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Strategic Problem Diagnostics */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Key Strategic Questions Behind the Problem</h3>
            <p className="card-subtitle">Guiding discovery interviews and cross-channel architecture sessions</p>
          </div>
          <span className="badge info">
            <HelpCircle size={12} /> Strategic Alignment
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            'Which channels are in scope, and which customer journeys cross them most often?',
            'Where does inconsistency hurt most: information, pricing, order status, identity, or service quality?',
            'Is there one customer identifier today, and how reliable is it across channel silos?',
            'Who owns end-to-end experience, and how are they measured and compensated?',
            'What is the current repeat-contact and channel-switch rate baseline?',
            'What is fixed by process and content governance versus needing new technology platforms?',
          ].map((q, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: 'var(--grad-brand)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                }}
              >
                0{i + 1}
              </div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.5 }}>
                {q}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
