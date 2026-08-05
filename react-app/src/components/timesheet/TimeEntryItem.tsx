import type { TimeEntry, ApprovalStatus } from '../../types/timeEntry'
import styles from './TimeEntryItem.module.css'

interface TimeEntryItemProps {
  entry: TimeEntry
  onEdit: () => void
  onDelete: () => void
  // 【TypeScript 可选回调】onViewDetail 可选，存在时才渲染「详情」按钮
  onViewDetail?: () => void
}

// 【TypeScript Record 泛型】Record<ApprovalStatus, React.CSSProperties> 表示键为审批状态、值为样式对象的映射
const statusColors: Record<ApprovalStatus, React.CSSProperties> = {
  '待审批': { background: '#fef3c7', color: '#d97706' },
  '已通过': { background: '#d1fae5', color: '#059669' },
  '已驳回': { background: '#fee2e2', color: '#dc2626' },
}

function TimeEntryItem({ entry, onEdit, onDelete, onViewDetail }: TimeEntryItemProps) {
  // 格式化时间
  const formatDate = (iso: string) => {
    // 【JavaScript Date 构造函数】new Date(iso) 将 ISO 时间字符串转换为 Date 对象
    const date = new Date(iso)
    // 【JavaScript Date.prototype.toLocaleString()】按指定区域和格式输出本地化时间字符串
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={styles.item}>
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <h3 className={styles.itemTitle}>{entry.projectName}</h3>
          <div className={styles.itemBadges}>
            <span className={styles.itemHours}>{entry.hours} 小时</span>
            {/* 【JavaScript 对象属性访问】statusColors[entry.approvalStatus] 根据审批状态获取对应样式对象 */}
            <span className={styles.statusBadge} style={statusColors[entry.approvalStatus]}>
              {entry.approvalStatus}
            </span>
          </div>
        </div>
        <p className={styles.itemDesc}>{entry.description}</p>
        <span className={styles.itemTime}>{formatDate(entry.createdAt)}</span>
      </div>
      <div className={styles.itemActions}>
        {onViewDetail && (
          <button onClick={onViewDetail} className={styles.detailBtn}>
            详情
          </button>
        )}
        <button onClick={onEdit} className={styles.editBtn}>
          编辑
        </button>
        <button onClick={onDelete} className={styles.deleteBtn}>
          删除
        </button>
      </div>
    </div>
  )
}

export default TimeEntryItem