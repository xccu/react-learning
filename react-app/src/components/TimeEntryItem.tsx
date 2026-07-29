import type { TimeEntry, ApprovalStatus } from '../api/mockApi'

// 接收单条记录和 onDelete、onEdit 回调作为 Props
interface TimeEntryItemProps {
  entry: TimeEntry
  onEdit: () => void
  onDelete: () => void
}

// 审批状态对应的颜色
const statusColors: Record<ApprovalStatus, React.CSSProperties> = {
  '待审批': { background: '#fef3c7', color: '#d97706' },
  '已通过': { background: '#d1fae5', color: '#059669' },
  '已驳回': { background: '#fee2e2', color: '#dc2626' },
}

function TimeEntryItem({ entry, onEdit, onDelete }: TimeEntryItemProps) {
  // 格式化日期显示
  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div style={styles.item}>
      <div style={styles.itemContent}>
        <div style={styles.itemHeader}>
          <h3 style={styles.itemTitle}>{entry.projectName}</h3>
          <div style={styles.itemBadges}>
            <span style={styles.itemHours}>{entry.hours} 小时</span>
            <span style={{ ...styles.statusBadge, ...statusColors[entry.approvalStatus] }}>
              {entry.approvalStatus}
            </span>
          </div>
        </div>
        <p style={styles.itemDesc}>{entry.description}</p>
        <span style={styles.itemTime}>{formatDate(entry.createdAt)}</span>
      </div>
      <div style={styles.itemActions}>
        {/* 实现编辑按钮，点击调用 onEdit 回调并传入当前记录数据 */}
        <button onClick={onEdit} style={styles.editBtn}>
          编辑
        </button>
        {/* 实现删除按钮，点击调用 onDelete 回调 */}
        <button onClick={onDelete} style={styles.deleteBtn}>
          删除
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    gap: '16px',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  itemBadges: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  itemTitle: {
    margin: 0,
    fontSize: '16px',
    color: '#333',
  },
  itemHours: {
    background: '#eef2ff',
    color: '#6366f1',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
  },
  itemDesc: {
    margin: '4px 0',
    color: '#666',
    fontSize: '14px',
  },
  itemTime: {
    color: '#999',
    fontSize: '12px',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  editBtn: {
    padding: '4px 12px',
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    padding: '4px 12px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
}

export default TimeEntryItem