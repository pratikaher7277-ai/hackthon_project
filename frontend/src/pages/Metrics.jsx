import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Radar } from 'react-chartjs-2'
import {
  TrendingUp, TrendingDown, Minus,
  RefreshCw, Users, Timer, Shield, Gauge, Target,
  Zap, Clock, Award
} from 'lucide-react'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Tooltip, Legend, Filler
)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

const kpis = [
  {
    name: 'Repeat Contact Rate',
    icon: RefreshCw,
    current: '26.0%',
    target: '< 15%',
    trend: 'down',
    trendValue: '4.2%',
    data: [38, 36, 34, 32, 30, 29, 28, 27, 26],
    color: '#6366f1',
  },
  {
    name: 'Switch Resolution',
    icon: Target,
    current: '68.0%',
    target: '> 85%',
    trend: 'up',
    trendValue: '5.1%',
    data: [52, 55, 57, 59, 62, 63, 65, 67, 68],
    color: '#06b6d4',
  },
  {
    name: 'Info Consistency',
    icon: Shield,
    current: '78.4%',
    target: '> 95%',
    trend: 'up',
    trendValue: '3.2%',
    data: [65, 67, 69, 71, 72, 74, 75, 77, 78.4],
    color: '#10b981',
  },
  {
    name: 'Customer Effort (CES)',
    icon: Gauge,
    current: '2.9 / 5',
    target: '≤ 2.5',
    trend: 'down',
    trendValue: '0.4 pts',
    data: [4.2, 4.0, 3.8, 3.6, 3.4, 3.3, 3.1, 3.0, 2.9],
    color: '#8b5cf6',
  },
  {
    name: 'Identity Match Rate',
    icon: Users,
    current: '91.2%',
    target: '> 98%',
    trend: 'up',
    trendValue: '1.8%',
    data: [82, 84, 85, 86, 87, 88, 89, 90, 91.2],
    color: '#f59e0b',
  },
  {
    name: 'Avg Handling Time',
    icon: Timer,
    current: '8.2 min',
    target: '< 6.0 min',
    trend: 'down',
    trendValue: '1.1m',
    data: [12.5, 12.0, 11.2, 10.5, 10.0, 9.5, 9.0, 8.5, 8.2],
    color: '#ef4444',
  },
]

const radarData = {
  labels: ['Pricing Parity', 'Policy Uniformity', 'Order Status Sync', 'Identity Resolution', 'Content Latency', 'Service Logic'],
  datasets: [
    {
      label: 'Current Measured Score',
      data: [82, 75, 68, 91, 70, 65],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: '#6366f1',
      borderWidth: 2.5,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
    {
      label: 'Target Benchmark',
      data: [95, 95, 90, 98, 95, 90],
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10b981',
      borderWidth: 2,
      borderDash: [5, 5],
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
}

const csatData = {
  labels: ['Single Channel Experience', 'Two-Channel Transition', 'Three+ Channel Transition'],
  datasets: [
    {
      label: 'Customer Satisfaction (CSAT)',
      data: [4.5, 3.8, 2.9],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderRadius: 8,
      barThickness: 26,
    },
  ],
}

const chartOpts = {
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
        padding: 16,
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
  scales: {
    x: {
      grid: { color: 'rgba(226, 232, 240, 0.6)' },
      ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      border: { dash: [4, 4], color: '#e2e8f0' },
    },
    y: {
      grid: { display: false },
      ticks: { color: '#64748b', font: { family: 'Inter', size: 12, weight: '500' } },
      border: { color: '#e2e8f0' },
    },
  },
}

const radarOpts = {
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
        padding: 16,
      },
    },
  },
  scales: {
    r: {
      angleLines: { color: 'rgba(226, 232, 240, 0.8)' },
      grid: { color: 'rgba(226, 232, 240, 0.8)' },
      pointLabels: { color: '#475569', font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' } },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
}

export default function Metrics() {
  return (
    <>
      <div className="page-header animate-in">
        <div className="page-header-text">
          <h1>Analytics & Key Metrics</h1>
          <p>Multi-dimensional operational telemetry tracking consistency, latency, and customer friction</p>
        </div>
      </div>

      {/* KPI Sparkline Cards Grid */}
      <div className="grid-3" style={{ marginBottom: 28 }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
          const isGood =
            (kpi.trend === 'down' &&
              ['Repeat Contact Rate', 'Avg Handling Time', 'Customer Effort (CES)'].includes(kpi.name)) ||
            (kpi.trend === 'up' &&
              !['Repeat Contact Rate', 'Avg Handling Time', 'Customer Effort (CES)'].includes(kpi.name))

          const sparkData = {
            labels: months,
            datasets: [
              {
                data: kpi.data,
                borderColor: kpi.color,
                backgroundColor: `${kpi.color}15`,
                borderWidth: 2.5,
                pointRadius: 0,
                fill: true,
                tension: 0.45,
              },
            ],
          }

          const sparkOpts = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
              x: { display: false },
              y: { display: false },
            },
          }

          return (
            <div
              key={kpi.name}
              className="glass-card animate-in"
              style={{ animationDelay: `${0.06 * (idx + 1)}s` }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-sm)',
                      background: `${kpi.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: kpi.color,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {kpi.name}
                  </span>
                </div>
                <span className={`badge ${isGood ? 'success' : 'warning'}`}>
                  <TrendIcon size={12} /> {kpi.trendValue}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1,
                  }}
                >
                  {kpi.current}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Target: {kpi.target}
                </span>
              </div>

              <div style={{ height: 60 }}>
                <Line data={sparkData} options={sparkOpts} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Radar + CSAT Visualizations */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="glass-card animate-in animate-in-delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Omnichannel Consistency Radar</h3>
              <p className="card-subtitle">Dimensional analysis of live parity vs target SLA</p>
            </div>
            <span className="badge primary">
              <Award size={12} /> Target 95%
            </span>
          </div>
          <div style={{ height: 320 }}>
            <Radar data={radarData} options={radarOpts} />
          </div>
        </div>

        <div className="glass-card animate-in animate-in-delay-4">
          <div className="card-header">
            <div>
              <h3 className="card-title">CSAT Drop-Off by Journey Switching</h3>
              <p className="card-subtitle">Direct customer correlation: switching channels without context damages satisfaction</p>
            </div>
            <span className="badge warning">High Sensitivity</span>
          </div>
          <div style={{ height: 320 }}>
            <Bar
              data={csatData}
              options={{
                ...chartOpts,
                indexAxis: 'y',
                scales: {
                  ...chartOpts.scales,
                  x: { ...chartOpts.scales.x, max: 5, ticks: { ...chartOpts.scales.x.ticks, stepSize: 1 } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Sync Propagation Lag Tracker */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Content Propagation Sync Lag</h3>
            <p className="card-subtitle">
              Time required for price, policy, or catalog updates to cascade across all active channel nodes
            </p>
          </div>
          <span className="badge info">
            <Clock size={12} /> Target: &lt; 1 hour
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { channel: 'Web Portal', lag: '5 min', pct: 8, status: 'success' },
            { channel: 'Mobile App', lag: '15 min', pct: 22, status: 'success' },
            { channel: 'Contact Centre (CRM)', lag: '2 hours', pct: 58, status: 'warning' },
            { channel: 'Social Media Direct', lag: '6 hours', pct: 78, status: 'danger' },
            { channel: 'Physical POS Stores', lag: '24 hours', pct: 95, status: 'danger' },
          ].map((item) => (
            <div
              key={item.channel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '4px 0',
              }}
            >
              <span
                style={{
                  width: 170,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                }}
              >
                {item.channel}
              </span>

              <div style={{ flex: 1 }}>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div
                    className={`progress-fill ${item.status}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>

              <span
                className={`badge ${item.status}`}
                style={{ minWidth: 90, justifyContent: 'center' }}
              >
                {item.lag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
