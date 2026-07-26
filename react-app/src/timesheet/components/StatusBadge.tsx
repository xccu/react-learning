// 导入工时状态类型
import type { TimesheetStatus } from '../types'

// 状态配置映射：使用 Record 泛型定义每种状态的显示样式
// pending: 待提交(橙色), submitted: 已提交(蓝色), approved: 已审批(绿色)
const STATUS_CONFIG: Record<
  TimesheetStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: { label: '待提交', color: '#e67e22', bgColor: '#fef3e2' },
  submitted: { label: '已提交', color: '#2980b9', bgColor: '#e8f4fd' },
  approved: { label: '已审批', color: '#27ae60', bgColor: '#e8f8f0' },
}

// 状态标签组件的 props
interface StatusBadgeProps {
  status: TimesheetStatus
}

// 状态徽章组件：根据传入的状态值渲染不同颜色的标签
function StatusBadge({ status }: StatusBadgeProps) {
  // 从配置中获取对应状态的样式
  const config = STATUS_CONFIG[status]

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}33`,
      }}
    >
      {config.label}
    </span>
  )
}

export { StatusBadge }