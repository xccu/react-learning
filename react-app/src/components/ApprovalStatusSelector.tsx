import type { ApprovalStatus } from '../api/mockApi'

interface ApprovalStatusSelectorProps {
  value: ApprovalStatus
  onChange: (status: ApprovalStatus) => void
}

// 审批状态选项配置
const STATUS_OPTIONS: { value: ApprovalStatus; label: string; color: string; bg: string }[] = [
  { value: '待审批', label: '待审批', color: '#d97706', bg: '#fef3c7' },
  { value: '已通过', label: '已通过', color: '#059669', bg: '#d1fae5' },
  { value: '已驳回', label: '已驳回', color: '#dc2626', bg: '#fee2e2' },
]

function ApprovalStatusSelector({ value, onChange }: ApprovalStatusSelectorProps) {
  return (
    <div style={styles.container}>
      {STATUS_OPTIONS.map((option) => {
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              ...styles.option,
              ...(isSelected ? { background: option.bg, color: option.color, borderColor: option.color } : {}),
            }}
          >
            <span
              style={{
                ...styles.dot,
                background: isSelected ? option.color : '#d1d5db',
              }}
            />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'inline-flex',
    gap: '0',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  option: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    border: 'none',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
}

export default ApprovalStatusSelector