import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, RadialLinearScale,
  Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar, Radar } from 'react-chartjs-2'
import {
  TrendingUp, TrendingDown, Minus,
  RefreshCw, Users, Timer, Shield, Gauge, Target
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
    current: '26%',
    target: '< 15%',
    trend: 'down',
    trendValue: '4.2%',
    status: 'warning',
    data: [38, 36, 34, 32, 30, 29, 28, 27, 26],
    color: '#6366f1',
  },
  {
    name: 'Channel-Switch Resolution',
    icon: Target,
    current: '68%',
    target: '> 85%',
    trend: 'up',
    trendValue: '5.1%',
    status: 'warning',
    data: [52, 55, 57, 59, 62, 63, 65, 67, 68],
    color: '#06b6d4',
  },
  {
    name: 'Info Consistency Rate',
    icon: Shield,
    current: '78%',
    target: '> 95%',
    trend: 'up',
    trendValue: '3.2%',
    status: 'warning',
    data: [65, 67, 69, 71, 72, 74, 75, 77, 78],
    color: '#10b981',
  },
  {
    name: 'Customer Effort Score',
    icon: Gauge,
    current: '2.9',
    target: '≤ 2.5',
    trend: 'down',
    trendValue: '0.4',
    status: 'success',
    data: [4.2, 4.0, 3.8, 3.6, 3.4, 3.3, 3.1, 3.0, 2.9],
    color: '#8b5cf6',
  },
  {
    name: 'Identity Match Rate',
    icon: Users,
    current: '91%',
    target: '> 98%',
    trend: 'up',
    trendValue: '1.8%',
    status: 'success',
    data: [82, 84, 85, 86, 87, 88, 89, 90, 91],
    color: '#f59e0b',
  },
  {
    name: 'Avg Handling Time',
    icon: Timer,
    current: '8.2m',
    target: '< 6m',
    trend: 'down',
    trendValue: '1.1m',
    status: 'warning',
    data: [12.5, 12.0, 11.2, 10.5, 10.0, 9.5, 9.0, 8.5, 8.2],
    color: '#ef4444',
  },
]

const radarData = {
  labels: ['Price Consistency', 'Policy Consistency', 'Order Status', 'Identity Resolution', 'Content Sync', 'Service Quality'],
  datasets: [
    {
      label: 'Current',
      data: [82, 75, 68, 91, 70, 65],
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: '#6366f1',
      borderWidth: 2,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#0a0e1a',
      pointBorderWidth: 2,
    },
    {
      label: 'Target',
      data: [95, 95, 90, 98, 95, 90],
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: '#10b981',
      borderWidth: 2,
      borderDash: [5, 5],
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#0a0e1a',
      pointBorderWidth: 2,
    },
  ]
}

const csatData = {
  labels: ['Single Channel', 'Two Channels', 'Three+ Channels'],
  datasets: [
    {
      label: 'CSAT Score',
      data: [4.5, 3.8, 2.9],
      backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)'],
      borderColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 2,
      borderRadius: 8,
    }
  ]
}

const chartOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter', size: 12 },
        usePointStyle: true, pointStyle: 'circle', padding: 16,
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(255,255,255,0.06)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    }
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } } },
  }
}

const radarOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, usePointStyle: true, pointStyle: 'circle', padding: 16 }
    }
  },
  scales: {
    r: {
      angleLines: { color: 'rgba(255,255,255,0.06)' },
      grid: { color: 'rgba(255,255,255,0.06)' },
      pointLabels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
      ticks: { display: false },
      suggestedMin: 0,
      suggestedMax: 100,
    }
  }
}

export default function Metrics() {
  return (
    <>
      <div className="page-header animate-in">
        <h1>Metrics & KPIs</h1>
        <p>Detailed performance tracking across all omnichannel consistency indicators</p>
      </div>

      {/* KPI Trend Cards */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-xl)' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
          const isGood = (kpi.trend === 'down' && ['Repeat Contact Rate', 'Avg Handling Time', 'Customer Effort Score'].includes(kpi.name))
            || (kpi.trend === 'up' && !['Repeat Contact Rate', 'Avg Handling Time', 'Customer Effort Score'].includes(kpi.name))

          const sparkData = {
            labels: months,
            datasets: [{
              data: kpi.data,
              borderColor: kpi.color,
              backgroundColor: `${kpi.color}15`,
              borderWidth: 2,
              pointRadius: 0,
              fill: true,
              tension: 0.4,
            }]
          }

          const sparkOpts = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
              x: { display: false },
              y: { display: false },
            }
          }

          return (
            <div
              key={kpi.name}
              className="glass-card animate-in"
              style={{ animationDelay: `${0.1 * (idx + 1)}s` }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: `${kpi.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={kpi.color} />
                  </div>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>
                    {kpi.name}
                  </span>
                </div>
                <span className={`kpi-trend ${isGood ? 'up' : 'down'}`}>
                  <TrendIcon size={12} /> {kpi.trendValue}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800 }}>{kpi.current}</span>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  Target: {kpi.target}
                </span>
              </div>

              <div style={{ height: '60px' }}>
                <Line data={sparkData} options={sparkOpts} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Radar + CSAT Charts */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card animate-in animate-in-delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Consistency Radar</h3>
              <p className="card-subtitle">Current vs target across consistency dimensions</p>
            </div>
          </div>
          <div style={{ height: '320px' }}>
            <Radar data={radarData} options={radarOpts} />
          </div>
        </div>

        <div className="glass-card animate-in animate-in-delay-4">
          <div className="card-header">
            <div>
              <h3 className="card-title">CSAT by Journey Complexity</h3>
              <p className="card-subtitle">Satisfaction drops as channel switches increase</p>
            </div>
          </div>
          <div style={{ height: '320px' }}>
            <Bar data={csatData} options={{
              ...chartOpts,
              indexAxis: 'y',
              scales: {
                ...chartOpts.scales,
                x: { ...chartOpts.scales.x, max: 5, ticks: { ...chartOpts.scales.x.ticks, stepSize: 1 } }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Content Sync Lag */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Content Sync Lag by Channel</h3>
            <p className="card-subtitle">Time for a change to propagate across all channels (target: &lt; 1 hour)</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {[
            { channel: 'Web Portal', lag: '5 min', pct: 8, status: 'success' },
            { channel: 'Mobile App', lag: '15 min', pct: 25, status: 'success' },
            { channel: 'Contact Centre', lag: '2 hours', pct: 60, status: 'warning' },
            { channel: 'Social Media', lag: '6 hours', pct: 80, status: 'danger' },
            { channel: 'Physical Store', lag: '24 hours', pct: 95, status: 'danger' },
          ].map(item => (
            <div key={item.channel} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span style={{ width: '140px', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                {item.channel}
              </span>
              <div style={{ flex: 1 }}>
                <div className="progress-bar" style={{ height: '8px' }}>
                  <div className={`progress-fill ${item.status}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
              <span className={`badge ${item.status}`} style={{ minWidth: '70px', justifyContent: 'center' }}>
                {item.lag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
