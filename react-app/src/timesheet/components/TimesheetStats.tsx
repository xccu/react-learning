import { useTimesheet } from '../TimesheetContext'

const STATS_CONFIG = [
  { key: 'total', label: '总工时', color: '#2c3e50', icon: '⏱' },
  { key: 'pending', label: '待提交', color: '#e67e22', icon: '📋' },
  { key: 'submitted', label: '已提交', color: '#2980b9', icon: '📤' },
  { key: 'approved', label: '已审批', color: '#27ae60', icon: '✅' },
]

function TimesheetStats() {
  const { records } = useTimesheet()

  const totalHours = records.reduce((sum, r) => sum + r.hours, 0)
  const pendingCount = records.filter((r) => r.status === 'pending').length
  const submittedCount = records.filter((r) => r.status === 'submitted').length
  const approvedCount = records.filter((r) => r.status === 'approved').length

  const stats = [
    { ...STATS_CONFIG[0], value: `${totalHours.toFixed(1)}h` },
    { ...STATS_CONFIG[1], value: String(pendingCount) },
    { ...STATS_CONFIG[2], value: String(submittedCount) },
    { ...STATS_CONFIG[3], value: String(approvedCount) },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.key}
          style={{
            backgroundColor: '#fff',
            border: `1px solid ${stat.color}22`,
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
            {stat.icon} {stat.label}
          </div>
          <div
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: stat.color,
            }}
          >
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export { TimesheetStats }