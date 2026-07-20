import type { TimesheetStatus } from '../types'

const STATUS_CONFIG: Record<
  TimesheetStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: { label: '待提交', color: '#e67e22', bgColor: '#fef3e2' },
  submitted: { label: '已提交', color: '#2980b9', bgColor: '#e8f4fd' },
  approved: { label: '已审批', color: '#27ae60', bgColor: '#e8f8f0' },
}

interface StatusBadgeProps {
  status: TimesheetStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
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