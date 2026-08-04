import type { ApprovalStatus } from '../../types/timeEntry'
import styles from './ApprovalStatusSelector.module.css'

interface ApprovalStatusSelectorProps {
  value: ApprovalStatus
  onChange: (status: ApprovalStatus) => void
}

// 【TypeScript 数组类型】STATUS_OPTIONS 定义审批状态的选项列表
const STATUS_OPTIONS: { value: ApprovalStatus; label: string; color: string; bg: string }[] = [
  { value: '待审批', label: '待审批', color: '#d97706', bg: '#fef3c7' },
  { value: '已通过', label: '已通过', color: '#059669', bg: '#d1fae5' },
  { value: '已驳回', label: '已驳回', color: '#dc2626', bg: '#fee2e2' },
]

function ApprovalStatusSelector({ value, onChange }: ApprovalStatusSelectorProps) {
  return (
    <div className={styles.container}>
      {/* 【JavaScript Array.prototype.map()】遍历选项列表，为每个选项生成一个按钮 */}
      {STATUS_OPTIONS.map((option) => {
        // 【JavaScript 严格相等】value === option.value 判断当前选项是否被选中
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={styles.option}
            // 【JavaScript 内联样式】根据选中状态动态设置样式对象
            style={{
              background: isSelected ? option.bg : '#fff',
              color: isSelected ? option.color : '#6b7280',
              borderColor: isSelected ? option.color : 'transparent',
            }}
          >
            <span
              className={styles.dot}
              style={{
                // 【JavaScript 三元运算符】根据选中状态切换圆点颜色
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

export default ApprovalStatusSelector