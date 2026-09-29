export default function KpiCard({ icon: Icon, label, value, trend, trendDir, variant = 'primary', delay = 0 }) {
  return (
    <div
      className={`kpi-card ${variant} animate-in`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="kpi-icon">
        <Icon size={22} />
      </div>
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      {trend && (
        <span className={`kpi-trend ${trendDir}`}>
          {trendDir === 'up' ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
  )
}
