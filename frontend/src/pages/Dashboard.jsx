import { useEffect, useRef } from 'react'
import {
  RefreshCw, TrendingUp, Users, AlertTriangle,
  Globe, Smartphone, MessageSquare, Phone, Store,
  ArrowRight, CheckCircle, XCircle, Clock
} from 'lucide-react'
import KpiCard from '../components/KpiCard'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler)

const chartColors = {
  primary: '#6366f1',
  secondary: '#06b6d4',
  tertiary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  primaryAlpha: 'rgba(99, 102, 241, 0.15)',
  secondaryAlpha: 'rgba(6, 182, 212, 0.15)',
}

const channelData = [
  { name: 'Web Portal', icon: Globe, consistency: 92, status: 'online', issues: 2, color: 'primary' },
  { name: 'Mobile App', icon: Smartphone, consistency: 87, status: 'online', issues: 5, color: 'secondary' },
  { name: 'Social Media', icon: MessageSquare, consistency: 73, status: 'warning', issues: 11, color: 'tertiary' },
  { name: 'Contact Centre', icon: Phone, consistency: 68, status: 'warning', issues: 14, color: 'warning' },
  { name: 'Physical Stores', icon: Store, consistency: 61, status: 'offline', issues: 19, color: 'success' },
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
    'Resolved': 'success',
    'In Progress': 'info',
    'Context Lost': 'danger',
  }
  return <span className={`badge ${map[status] || 'info'}`}>{status}</span>
}

export default function Dashboard() {
  const consistencyDoughnut = {
    labels: ['Consistent', 'Inconsistent', 'Unknown'],
    datasets: [{
      data: [78, 17, 5],
      backgroundColor: [chartColors.success, chartColors.danger, chartColors.primary + '40'],
      borderWidth: 0,
      cutout: '78%',
    }]
  }

  const repeatContactBar = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Repeat Contacts',
        data: [420, 380, 350, 310, 285, 260],
        backgroundColor: chartColors.primaryAlpha,
        borderColor: chartColors.primary,
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'First Contact Resolve',
        data: [580, 620, 650, 690, 715, 740],
        backgroundColor: chartColors.secondaryAlpha,
        borderColor: chartColors.secondary,
        borderWidth: 2,
        borderRadius: 6,
      }
    ]
  }

  const trendLine = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [{
      label: 'Customer Effort Score',
      data: [4.2, 4.0, 3.8, 3.7, 3.5, 3.3, 3.1, 2.9],
      borderColor: chartColors.success,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderWidth: 2.5,
      pointRadius: 4,
      pointBackgroundColor: chartColors.success,
      pointBorderColor: '#0a0e1a',
      pointBorderWidth: 2,
      fill: true,
      tension: 0.4,
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
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
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } }
      }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
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
    }
  }

  return (
    <>
      <div className="page-header animate-in">
        <h1>Dashboard</h1>
        <p>Monitor omnichannel consistency across all customer touchpoints</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        <KpiCard
          icon={RefreshCw}
          label="Repeat Contact Rate"
          value="26%"
          trend="4.2% vs last month"
          trendDir="down"
          variant="primary"
          delay={0.1}
        />
        <KpiCard
          icon={TrendingUp}
          label="Consistency Score"
          value="78.4%"
          trend="3.2% improvement"
          trendDir="up"
          variant="success"
          delay={0.2}
        />
        <KpiCard
          icon={Users}
          label="Cross-Channel Journeys"
          value="1,247"
          trend="12% this week"
          trendDir="up"
          variant="secondary"
          delay={0.3}
        />
        <KpiCard
          icon={AlertTriangle}
          label="Active Inconsistencies"
          value="51"
          trend="8 resolved today"
          trendDir="down"
          variant="warning"
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card animate-in animate-in-delay-2">
          <div className="card-header">
            <div>
              <h3 className="card-title">Repeat vs First Contact Resolution</h3>
              <p className="card-subtitle">Monthly trend — Lower repeat contacts = better consistency</p>
            </div>
          </div>
          <div style={{ height: '280px' }}>
            <Bar data={repeatContactBar} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card animate-in animate-in-delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Information Consistency</h3>
              <p className="card-subtitle">Cross-channel audit results</p>
            </div>
          </div>
          <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={consistencyDoughnut} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Trend & Channel Health Row */}
      <div className="grid-2-1" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="glass-card animate-in animate-in-delay-3">
          <div className="card-header">
            <div>
              <h3 className="card-title">Customer Effort Score Trend</h3>
              <p className="card-subtitle">Lower is better — target ≤ 3.0</p>
            </div>
            <span className="badge success">Improving</span>
          </div>
          <div style={{ height: '240px' }}>
            <Line data={trendLine} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card animate-in animate-in-delay-4">
          <div className="card-header">
            <h3 className="card-title">Channel Health</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {channelData.map((ch) => {
              const Icon = ch.icon
              return (
                <div key={ch.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-sm) 0',
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-md)',
                    background: `rgba(99, 102, 241, 0.1)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color="var(--accent-primary-light)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                        {ch.name}
                      </span>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        color: ch.consistency >= 80 ? 'var(--accent-success)' :
                               ch.consistency >= 70 ? 'var(--accent-warning)' : 'var(--accent-danger)'
                      }}>
                        {ch.consistency}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${ch.consistency >= 80 ? 'success' : ch.consistency >= 70 ? 'warning' : 'danger'}`}
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

      {/* Recent Channel Switches */}
      <div className="glass-card animate-in animate-in-delay-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Channel Switches</h3>
            <p className="card-subtitle">Live feed of cross-channel customer journeys</p>
          </div>
          <span className="badge info">Live</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Journey ID</th>
              <th>Customer</th>
              <th>Channel Switch</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentJourneys.map(j => (
              <tr key={j.id}>
                <td style={{ fontWeight: 600, color: 'var(--accent-primary-light)' }}>{j.id}</td>
                <td>{j.customer}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge primary`}>{j.from}</span>
                    <ArrowRight size={14} color="var(--text-muted)" />
                    <span className={`badge info`}>{j.to}</span>
                  </span>
                </td>
                <td>{statusBadge(j.status)}</td>
                <td style={{ color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {j.time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
