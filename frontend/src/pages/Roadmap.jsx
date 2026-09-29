import {
  Search, FileText, Zap, Wrench, Rocket,
  CheckCircle, Clock, Circle,
  AlertTriangle, Shield, Users, Target, RotateCcw,
  CheckCircle2, Sparkles
} from 'lucide-react'

const phases = [
  {
    name: 'Discover',
    icon: Search,
    timing: 'Weeks 1–4',
    status: 'completed',
    color: '#10b981',
    activities: [
      'Map channels, backend systems, and team owners',
      'Collect baseline metrics for repeat contact volume',
      'Conduct 8–12 stakeholder and customer interviews',
      'Audit active inconsistencies in pricing and policies',
    ],
    outputs: ['Multi-channel journey maps', 'Baseline KPI scorecard', 'Ranked friction pain points'],
  },
  {
    name: 'Define',
    icon: FileText,
    timing: 'Weeks 4–6',
    status: 'active',
    color: '#6366f1',
    activities: [
      'Finalise scope and problem boundaries',
      'Agree on identical facts vs allowed channel variation',
      'Select 2–3 priority customer journeys to pilot',
      'Establish target KPIs and attribution logic',
    ],
    outputs: ['Signed executive brief', 'Target KPI benchmarks'],
  },
  {
    name: 'Quick Wins',
    icon: Zap,
    timing: 'Weeks 6–12',
    status: 'pending',
    color: '#f59e0b',
    activities: [
      'Establish single truth source for pricing and return policies',
      'Unify service scripts and disclosures across agents',
      'Provide contact agents real-time visibility into digital carts',
    ],
    outputs: ['Immediate consistency gain', 'Contact repeat reduction'],
  },
  {
    name: 'Build Foundation',
    icon: Wrench,
    timing: 'Months 3–9',
    status: 'pending',
    color: '#8b5cf6',
    activities: [
      'Deploy identity resolution & customer matching hub',
      'Implement API event streaming layer across backends',
      'Enforce central consent and privacy controls',
      'Automate cross-channel operational telemetry reporting',
    ],
    outputs: ['Unified view for priority journeys', 'Real-time event stream'],
  },
  {
    name: 'Scale & Optimise',
    icon: Rocket,
    timing: 'Months 9+',
    status: 'pending',
    color: '#06b6d4',
    activities: [
      'Extend unified architecture to remaining long-tail channels',
      'Deploy AI agent-assist with interaction summarization',
      'Establish continuous automated parity audit bots',
    ],
    outputs: ['Sustained enterprise KPI gains', 'Sub-minute content sync'],
  },
]

const statusIcon = {
  completed: CheckCircle,
  active: Clock,
  pending: Circle,
}

const risks = [
  {
    risk: 'No cross-channel executive owner',
    likelihood: 'High',
    impact: 'High',
    response: 'Secure direct executive sponsorship and shared cross-channel KPIs before tooling',
    icon: Users,
  },
  {
    risk: 'Poor data quality blocks unification',
    likelihood: 'High',
    impact: 'High',
    response: 'Execute deep data profiling in Phase 1; clean & deduplicate before identity linking',
    icon: AlertTriangle,
  },
  {
    risk: 'Privacy or consent breach across silos',
    likelihood: 'Medium',
    impact: 'High',
    response: 'Embed privacy-by-design at gateway layer; enforce centralized consent service',
    icon: Shield,
  },
  {
    risk: 'Scope creep into marketing attribution',
    likelihood: 'Medium',
    impact: 'Medium',
    response: 'Strictly enforce scope boundaries focused on customer service and facts consistency',
    icon: Target,
  },
  {
    risk: 'Quick wins not sustained over time',
    likelihood: 'Medium',
    impact: 'Medium',
    response: 'Appoint formal content owners per domain; schedule automated monthly verification audits',
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
        <div className="page-header-text">
          <h1>Transformation Roadmap</h1>
          <p>Phased operational execution plan and proactive risk governance framework</p>
        </div>
      </div>

      {/* Visual Phase Progress Bar */}
      <div className="glass-card animate-in" style={{ marginBottom: 32, padding: '24px 28px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <div>
            <h3 className="card-title">Initiative Progression</h3>
            <p className="card-subtitle">Currently active in Phase 2: Scope & Boundary Definition</p>
          </div>
          <span className="badge primary">
            <Sparkles size={12} /> Phase 2 Active
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 12,
          }}
        >
          {phases.map((phase, i) => (
            <div
              key={phase.name}
              style={{
                flex: 1,
                height: 10,
                borderRadius: i === 0 ? '6px 0 0 6px' : i === phases.length - 1 ? '0 6px 6px 0' : 0,
                background:
                  phase.status === 'completed'
                    ? phase.color
                    : phase.status === 'active'
                    ? `linear-gradient(90deg, ${phase.color}, rgba(99, 102, 241, 0.4))`
                    : 'var(--border-light)',
                transition: 'all 0.5s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {phases.map((phase) => (
            <span
              key={phase.name}
              style={{
                fontSize: '11px',
                color: phase.status === 'active' ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontWeight: phase.status === 'active' ? 700 : 500,
              }}
            >
              {phase.name}
            </span>
          ))}
        </div>
      </div>

      {/* Phased Timeline List */}
      <div className="timeline" style={{ marginBottom: 40, marginLeft: 8 }}>
        {phases.map((phase, idx) => {
          const Icon = phase.icon
          const StatusIcon = statusIcon[phase.status]
          const isCompleted = phase.status === 'completed'
          const isActive = phase.status === 'active'

          return (
            <div
              key={phase.name}
              className="timeline-item animate-in"
              style={{ animationDelay: `${0.06 * (idx + 1)}s` }}
            >
              <div className={`timeline-dot ${phase.status}`} />

              <div className="glass-card" style={{ marginLeft: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 18,
                    flexWrap: 'wrap',
                    gap: 12,
                    paddingBottom: 14,
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 'var(--radius-sm)',
                        background: `${phase.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: phase.color,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Phase {idx + 1}: {phase.name}
                      </h3>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {phase.timing}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      isCompleted ? 'success' : isActive ? 'primary' : 'info'
                    }`}
                  >
                    <StatusIcon size={12} />
                    {isCompleted ? 'Completed' : isActive ? 'In Active Sprint' : 'Planned'}
                  </span>
                </div>

                <div className="grid-2" style={{ gap: 20 }}>
                  {/* Activities */}
                  <div
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      padding: 16,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 10,
                      }}
                    >
                      Core Activities
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {phase.activities.map((a, i) => (
                        <li
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 8,
                            fontSize: '12px',
                            color: 'var(--text-body)',
                            lineHeight: 1.45,
                          }}
                        >
                          <span
                            style={{
                              color: phase.color,
                              fontSize: '14px',
                              lineHeight: 1,
                              marginTop: 1,
                            }}
                          >
                            •
                          </span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outputs */}
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.04)',
                      padding: 16,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#059669',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 10,
                      }}
                    >
                      Deliverables & Outputs
                    </p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {phase.outputs.map((o, i) => (
                        <li
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: '12px',
                            color: 'var(--text-main)',
                            fontWeight: 500,
                          }}
                        >
                          <CheckCircle2 size={14} color="#059669" />
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

      {/* Risk Register Table */}
      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: 0 }}>
        <div
          className="card-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: 0,
          }}
        >
          <div>
            <h3 className="card-title">Enterprise Risk Register & Mitigation</h3>
            <p className="card-subtitle">Proactive safeguards addressing organizational, data, and compliance exposures</p>
          </div>
          <span className="badge warning">{risks.length} Tracked Exposures</span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Risk Scenario</th>
                <th style={{ width: 120 }}>Likelihood</th>
                <th style={{ width: 120 }}>Impact</th>
                <th>Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((r, i) => {
                const Icon = r.icon
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 'var(--radius-xs)',
                            background: 'rgba(245, 158, 11, 0.12)',
                            color: '#d97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        {r.risk}
                      </div>
                    </td>
                    <td>{riskBadge(r.likelihood)}</td>
                    <td>{riskBadge(r.impact)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: 1.4 }}>
                      {r.response}
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
