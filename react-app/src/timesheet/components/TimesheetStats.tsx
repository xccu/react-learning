// 导入全局状态 Hook
import { useTimesheet } from '../TimesheetContext'

// 统计面板配置：定义每个统计项的标识、标签、颜色和图标
const STATS_CONFIG = [
  { key: 'total', label: '总工时', color: '#2c3e50', icon: '⏱' },
  { key: 'pending', label: '待提交', color: '#e67e22', icon: '📋' },
  { key: 'submitted', label: '已提交', color: '#2980b9', icon: '📤' },
  { key: 'approved', label: '已审批', color: '#27ae60', icon: '✅' },
]

// 统计面板组件：展示总工时和各状态记录数量
// 使用 reduce 计算总工时，filter 统计各状态数量
function TimesheetStats() {
  const { records } = useTimesheet()

  // reduce 累加所有记录的工时数
  const totalHours = records.reduce((sum, r) => sum + r.hours, 0)
  // filter 筛选并统计各状态的记录数量
  const pendingCount = records.filter((r) => r.status === 'pending').length
  const submittedCount = records.filter((r) => r.status === 'submitted').length
  const approvedCount = records.filter((r) => r.status === 'approved').length

  // 将配置与计算结果合并
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
        gridTemplateColumns: 'repeat(4, 1fr)',  // 4 列等宽网格布局
        gap: '12px',
        marginBottom: '24px',
      }}
    >
      {/* 使用 map 遍历渲染每个统计卡片 */}
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
          {/* 统计项标签和图标 */}
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '6px' }}>
            {stat.icon} {stat.label}
          </div>
          {/* 统计数值 */}
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