import TimeEntryItem from './TimeEntryItem'
import type { TimeEntry } from '../api/mockApi'

// 接收 entries 作为 Props
interface TimeEntryListProps {
  entries: TimeEntry[]
  onEdit: (entry: TimeEntry) => void
  onDelete: (id: string) => void
}

function TimeEntryList({ entries, onEdit, onDelete }: TimeEntryListProps) {
  // 使用条件渲染：无记录时显示"暂无工时记录"
  if (entries.length === 0) {
    return <p style={styles.empty}>暂无工时记录</p>
  }

  // 使用列表渲染：遍历 entries 数组，用 map 渲染每条记录
  return (
    <div style={styles.list}>
      {entries.map((entry) => (
        // 为每条记录设置唯一的 key（使用 id 字段）
        <TimeEntryItem
          key={entry.id}
          entry={entry}
          onEdit={() => onEdit(entry)}
          onDelete={() => onDelete(entry.id)}
        />
      ))}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 0',
  },
}

export default TimeEntryList