import { useState } from 'react'
import {
  RefreshCw, TrendingUp, Users, AlertTriangle,
  Globe, Smartphone, MessageSquare, Phone, Store,
  ArrowRight, Clock, ShieldCheck, Zap
} from 'lucide-react'
import KpiCard from '../components/KpiCard'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
)

const channelData = [
  { name: 'Web Portal', icon: Globe, consistency: 92, status: 'online', issues: 2 },
  { name: 'Mobile App', icon: Smartphone, consistency: 87, status: 'online', issues: 5 },
  { name: 'Social Media', icon: MessageSquare, consistency: 73, status: 'warning', issues: 11 },
  { name: 'Contact Centre', icon: Phone, consistency: 68, status: 'warning', issues: 14 },
  { name: 'Physical Stores', icon: Store, consistency: 61, status: 'offline', issues: 19 },
]

const recentJourneys = [
  { id: 'J-1042', customer: 'Customer #8291', from: 'Web', to: 'Phone', status: 'Context Lost', time: '2 min ago' },
  { id: 'J-1041', customer: 'Customer #4517', from: 'Mobile', to: 'Store', status: 'Resolved', time: '8 min ago' },
  { id: 'J-1040', customer: 'Customer #3208', from: 'Social', to: 'Web', status: 'In Progress', time: '15 min ago' },
  { id: 'J-1039', customer: 'Customer #9102', from: 'Phone', to: 'Mobile', status: 'Resolved', time: '23 min ago' },
  { id: 'J-1038', customer: 'Customer #6733', from: 'Web', to: 'Social', status: 'Context Lost', time: '31 min ago' },
]

const statusBadge = (status) => {
  const map = {
    Resolved: 'success',
    'In Progress': 'info',
    'Context Lost': 'danger',
  }
  return <span className={`badge ${map[status] || 'info'}`}>{status}</span>
}

export default function Dashboard() {
  const [activeRange, setActiveRange] = useState('30D')

  const consistencyDoughnut = {
    labels: ['Consistent (78%)', 'Inconsistent (17%)', 'Unknown (5%)'],
    datasets: [
      {
        data: [78, 17, 5],
        backgroundColor: ['#10b981', '#f43f5e', '#cbd5e1'],
        borderWidth: 4,
        borderColor: '#ffffff',
        hoverOffset: 6,
        cutout: '76%',
      },
    ],
  }

  const repeatContactBar = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Repeat Contacts',
        data: [420, 380, 350, 310, 285, 260],
        backgroundColor: '#6366f1',
        borderRadius: 8,
        barPercentage: 0.6,
      },
      {
        label: 'First Contact Resolve',
        data: [580, 620, 650, 690, 715, 740],
        backgroundColor: '#06b6d4',
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  }

  const trendLine = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Customer Effort Score (CES)',
        data: [4.2, 4.0, 3.8, 3.7, 3.5, 3.3, 3.1, 2.9],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        borderWidth: 3,
        pointRadius: 5,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.45,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#64748b',
          font: { family: 'Inter', size: 12, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { family: 'Plus Jakarta Sans', weight: '700', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: '500' } },
        border: { color: '#e2e8f0' },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: '500' } },
        border: { dash: [4, 4], color: '#e2e8f0' },
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748b',
          font: { family: 'Inter', size: 12, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 18,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#cbd5e1',
        cornerRadius: 10,
        padding: 12,
      },
    },
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header animate-in">
        <div className="page-header-text">
          <h1>Executive Overview</h1>
          <p>Real-time cross-channel consistency orchestration and interaction health</p>
        </div>

        <div className="page-header-actions">
          <div className="pill-group">
            {['Live', '7D', '30D', 'Quarter'].map((range) => (
              <button
                key={range}
                type="button"
                className={`pill-btn ${activeRange === range ? 'active' : ''}`}
                onClick={() => setActiveRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards — Radiant Reference Gradient Style */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <KpiCard
          icon={RefreshCw}
          label="Repeat Contact Rate"
          value="26.0%"
          trend="4.2% reduction"
          trendDir="down"
          variant="primary"
          progress={74}
          delay={0.05}
        />
        <KpiCard
          icon={TrendingUp}
          label="Consistency Score"
          value="78.4%"
          trend="3.2% increase"
          trendDir="up"
          variant="success"
          progress={78}
          delay={0.1}
        />
        <KpiCard
          icon={Users}
          label="Cross-Channel Journeys"
          value="1,247"
          trend="12% volume"
          trendDir="up"
          variant="secondary"
          progress={85}
          delay={0.15}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Active Discrepancies"
          value="51"
          trend="8 resolved"
          trendDir="down"
          variant="warning"
          progress={42}
          delay={0.2}
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="glass-card animate-in animate-in-delay-2">
          <div className="card-header">
            <div>
              <h3 className="card-title">Repeat vs First Contact Resolution</h3>
              <p className="card-subtitle">Monthly trajectory: resolving issues before channel switching</p>
            </div>
            <span className="badge success">Target on Track</span>
          </div>
          <div style={{ height: 290 }}>
            <Bar data={repeatContactBar} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card animate-in animate-in-delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Information Consistency Ratio</h3>
              <p className="card-subtitle">Aggregated audit coverage across 5 core channels</p>
            </div>
            <span className="badge info">78% Verified</span>
          </div>
          <div style={{ height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={consistencyDoughnut} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Trend & Channel Health Row */}
      <div className="grid-2-1" style={{ marginBottom: 28 }}>
        <div className="glass-card animate-in animate-in-delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Customer Effort Score (CES) Curve</h3>
              <p className="card-subtitle">Calculated on multi-channel journeys (Target: ≤ 2.5)</p>
            </div>
            <span className="badge success">
              <Zap size={12} /> Improving
            </span>
          </div>
          <div style={{ height: 250 }}>
            <Line data={trendLine} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card animate-in animate-in-delay-4">
          <div className="card-header">
            <div>
              <h3 className="card-title">Channel Health Index</h3>
              <p className="card-subtitle">Live endpoint parity</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {channelData.map((ch) => {
              const Icon = ch.icon
              const isGreen = ch.consistency >= 80
              const isAmber = ch.consistency >= 70 && ch.consistency < 80
              return (
                <div
                  key={ch.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '6px 0',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(99, 102, 241, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {ch.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: isGreen ? '#059669' : isAmber ? '#d97706' : '#dc2626',
                        }}
                      >
                        {ch.consistency}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${isGreen ? 'success' : isAmber ? 'warning' : 'danger'}`}
                        style={{ width: `${ch.consistency}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Live Recent Channel Switches Table */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Live Channel Switch Stream</h3>
            <p className="card-subtitle">Real-time audit log of customer context propagation</p>
          </div>
          <span className="badge info">
            <ShieldCheck size={12} /> Live Sync
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Journey ID</th>
                <th>Customer Entity</th>
                <th>Channel Switch Flow</th>
                <th>Context Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentJourneys.map((j) => (
                <tr key={j.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--brand-primary)' }}>
                    {j.id}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {j.customer}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge primary">{j.from}</span>
                      <ArrowRight size={14} color="var(--text-tertiary)" />
                      <span className="badge info">{j.to}</span>
                    </span>
                  </td>
                  <td>{statusBadge(j.status)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
                      <Clock size={13} /> {j.time}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
