export default function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  trendDir,
  variant = 'primary',
  progress = 75,
  delay = 0,
}) {
  return (
    <div
      className={`kpi-card ${variant} animate-in`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <div className="kpi-icon">
          <Icon size={20} />
        </div>
      </div>

      <div className="kpi-value">{value}</div>

      <div className="kpi-bottom">
        {trend && (
          <span className="kpi-trend">
            {trendDir === 'up' ? '↗' : '↘'} {trend}
          </span>
        )}
      </div>

      <div className="kpi-micro-bar">
        <div
          className="kpi-micro-fill"
          style={{ width: `${Math.min(Math.max(progress, 15), 100)}%` }}
        />
      </div>
    </div>
  )
}
