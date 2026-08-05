import TimeEntryItem from './TimeEntryItem'
import type { TimeEntry } from '../../types/timeEntry'
import styles from './TimeEntryList.module.css'

interface TimeEntryListProps {
  entries: TimeEntry[]
  onEdit: (entry: TimeEntry) => void
  onDelete: (id: string) => void
  onViewDetail?: (entry: TimeEntry) => void
}

function TimeEntryList({ entries, onEdit, onDelete, onViewDetail }: TimeEntryListProps) {
  // 条件渲染：无记录时显示空状态
  if (entries.length === 0) {
    return <p className={styles.empty}>暂无工时记录</p>
  }

  return (
    <div className={styles.list}>
      {/* 【JavaScript Array.prototype.map()】遍历 entries 数组，为每条记录生成 TimeEntryItem 组件 */}
      {entries.map((entry) => (
        <TimeEntryItem
          key={entry.id}
          entry={entry}
          onEdit={() => onEdit(entry)}
          onDelete={() => onDelete(entry.id)}
          onViewDetail={onViewDetail ? () => onViewDetail(entry) : undefined}
        />
      ))}
    </div>
  )
}

export default TimeEntryList