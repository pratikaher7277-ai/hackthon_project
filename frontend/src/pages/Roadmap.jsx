import {
  Search, FileText, Zap, Wrench, Rocket,
  CheckCircle, Clock, Circle,
  AlertTriangle, Shield, Users, Target, RotateCcw
} from 'lucide-react'

const phases = [
  {
    name: 'Discover',
    icon: Search,
    timing: 'Weeks 1–4',
    status: 'completed',
    color: '#10b981',
    activities: [
      'Map channels, systems, and owners',
      'Collect metrics baseline',
      'Conduct stakeholder interviews',
      'Audit current inconsistencies',
    ],
    outputs: ['Journey maps', 'Baseline KPIs', 'Ranked pain points'],
  },
  {
    name: 'Define',
    icon: FileText,
    timing: 'Weeks 4–6',
    status: 'active',
    color: '#6366f1',
    activities: [
      'Finalise scope and problem statement',
      'Agree what must be identical vs. may differ',
      'Choose 2–3 priority journeys',
      'Set target KPIs',
    ],
    outputs: ['Signed-off brief', 'Target KPIs'],
  },
  {
    name: 'Quick Wins',
    icon: Zap,
    timing: 'Weeks 6–12',
    status: 'pending',
    color: '#f59e0b',
    activities: [
      'Single source for pricing/policy/content',
      'Shared scripts across channels',
      'Give agents visibility of other channels',
    ],
    outputs: ['Measurable consistency improvement'],
  },
  {
    name: 'Build Foundation',
    icon: Wrench,
    timing: 'Months 3–9',
    status: 'pending',
    color: '#8b5cf6',
    activities: [
      'Identity resolution implementation',
      'Integration layer / API architecture',
      'Consent and privacy controls',
      'Cross-channel reporting',
    ],
    outputs: ['Unified view for priority journeys'],
  },
  {
    name: 'Scale & Optimise',
    icon: Rocket,
    timing: 'Months 9+',
    status: 'pending',
    color: '#06b6d4',
    activities: [
      'Extend to more journeys and channels',
      'Agent assist & AI summarization',
      'Continuous audits',
    ],
    outputs: ['Sustained KPI gains'],
  },
]

const statusIcon = {
  completed: CheckCircle,
  active: Clock,
  pending: Circle,
}

const risks = [
  {
    risk: 'No cross-channel owner',
    likelihood: 'High',
    impact: 'High',
    response: 'Secure executive sponsor first',
    icon: Users,
  },
  {
    risk: 'Poor data quality blocks unification',
    likelihood: 'High',
    impact: 'High',
    response: 'Data profiling in phase 1; cleanse before linking',
    icon: AlertTriangle,
  },
  {
    risk: 'Privacy or consent breach',
    likelihood: 'Medium',
    impact: 'High',
    response: 'Privacy review at design; central consent service',
    icon: Shield,
  },
  {
    risk: 'Scope creep into marketing attribution',
    likelihood: 'Medium',
    impact: 'Medium',
    response: 'Enforce scope boundaries strictly',
    icon: Target,
  },
  {
    risk: 'Quick wins not sustained',
    likelihood: 'Medium',
    impact: 'Medium',
    response: 'Assign content owners; monthly audit',
    icon: RotateCcw,
  },
]

const riskBadge = (level) => {
  const map = { High: 'danger', Medium: 'warning', Low: 'success' }
  return <span className={`badge ${map[level]}`}>{level}</span>
}

export default function Roadmap() {
  return (
    <>
      <div className="page-header animate-in">
        <h1>Roadmap</h1>
        <p>Phased implementation plan for omnichannel consistency transformation</p>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        {/* Visual Phase Progress Bar */}
        <div className="glass-card animate-in" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-xl)' }}>
          <h3 className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Overall Progress</h3>
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: 'var(--space-md)',
          }}>
            {phases.map((phase, i) => (
              <div
                key={phase.name}
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: i === 0 ? '4px 0 0 4px' : i === phases.length - 1 ? '0 4px 4px 0' : '0',
                  background: phase.status === 'completed'
                    ? phase.color
                    : phase.status === 'active'
                    ? `linear-gradient(90deg, ${phase.color}, ${phase.color}40)`
                    : 'rgba(255,255,255,0.06)',
                  transition: 'all 0.5s ease',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {phases.map(phase => (
              <span key={phase.name} style={{
                fontSize: 'var(--font-size-xs)',
                color: phase.status === 'active' ? phase.color : 'var(--text-muted)',
                fontWeight: phase.status === 'active' ? 600 : 400,
              }}>
                {phase.name}
              </span>
            ))}
          </div>
        </div>

        {/* Phase Cards */}
        <div className="timeline" style={{ marginLeft: 'var(--space-md)' }}>
          {phases.map((phase, idx) => {
            const Icon = phase.icon
            const StatusIcon = statusIcon[phase.status]
            return (
              <div
                key={phase.name}
                className="timeline-item animate-in"
                style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
              >
                <div className={`timeline-dot ${phase.status}`} />
                <div className="glass-card" style={{ marginLeft: 'var(--space-sm)' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      <div style={{
                        width: '44px', height: '44px',
                        borderRadius: 'var(--radius-md)',
                        background: `${phase.color}18`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={22} color={phase.color} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                          Phase {idx + 1}: {phase.name}
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                          {phase.timing}
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${phase.status === 'completed' ? 'success' : phase.status === 'active' ? 'primary' : 'info'}`}>
                      <StatusIcon size={12} />
                      {phase.status === 'completed' ? 'Completed' : phase.status === 'active' ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>

                  <div className="grid-2" style={{ gap: 'var(--space-lg)' }}>
                    <div>
                      <p style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 'var(--space-sm)',
                      }}>
                        Activities
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {phase.activities.map((a, i) => (
                          <li key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)',
                            fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
                          }}>
                            <span style={{ color: phase.color, marginTop: '2px' }}>•</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: 'var(--space-sm)',
                      }}>
                        Outputs
                      </p>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {phase.outputs.map((o, i) => (
                          <li key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                            fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
                          }}>
                            <CheckCircle size={14} color={phase.color} />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Risk Register */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Risk Register</h3>
            <p className="card-subtitle">Key risks with likelihood, impact, and mitigation strategies</p>
          </div>
          <span className="badge warning">{risks.length} Risks</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Risk</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>Response / Mitigation</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r, i) => {
              const Icon = r.icon
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <Icon size={16} color="var(--accent-warning)" />
                      {r.risk}
                    </div>
                  </td>
                  <td>{riskBadge(r.likelihood)}</td>
                  <td>{riskBadge(r.impact)}</td>
                  <td style={{ fontSize: 'var(--font-size-sm)', maxWidth: '300px' }}>{r.response}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
