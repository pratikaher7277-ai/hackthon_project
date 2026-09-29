import { useState } from 'react'
import { Settings as SettingsIcon, Sliders, Server, Shield, Bell, Database } from 'lucide-react'

export default function Settings() {
  const [backendUrl, setBackendUrl] = useState('http://localhost:8000')
  const [expressUrl, setExpressUrl] = useState('http://localhost:3000')
  const [autoSync, setAutoSync] = useState(true)

  return (
    <>
      <div className="page-header animate-in">
        <div className="page-header-text">
          <h1>Platform Settings & Integrations</h1>
          <p>Configure backend API endpoints, synchronization intervals, and audit governance rules</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Backend Connectors */}
        <div className="glass-card animate-in animate-in-delay-1">
          <div className="card-header">
            <div>
              <h3 className="card-title">Backend Service Connectors</h3>
              <p className="card-subtitle">Connect Python ML analytics and Express.js gateway APIs</p>
            </div>
            <span className="badge success">Active Gateway</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: 6,
                }}
              >
                <Server size={14} color="var(--brand-primary)" />
                Python ML Service Endpoint
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  marginBottom: 6,
                }}
              >
                <Database size={14} color="var(--brand-cyan)" />
                Express.js Gateway Endpoint
              </label>
              <input
                type="text"
                value={expressUrl}
                onChange={(e) => setExpressUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6 }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Continuous Event Stream Sync
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Poll active channels every 30 seconds for discrepancies
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Governance & Privacy Rules */}
        <div className="glass-card animate-in animate-in-delay-2">
          <div className="card-header">
            <div>
              <h3 className="card-title">Governance & Parity Thresholds</h3>
              <p className="card-subtitle">Define automated alerts for channel inconsistency</p>
            </div>
            <span className="badge warning">SLA Guard</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 14, background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Parity Violation Alert Threshold</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)' }}>&lt; 85%</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Triggers notification ping when channel info consistency drops below tolerance.
              </p>
            </div>

            <div style={{ padding: 14, background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Context Dropout Alert</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626' }}>Immediate</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Dispatches alert when a customer switches channels with lost context.
              </p>
            </div>

            <div style={{ padding: 14, background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Catalog Propagation Timeout</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#d97706' }}>1 Hour Max</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Flags sync lag if POS store or social direct takes over 60 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
