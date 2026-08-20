import { useCallback } from 'react'
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
  // 使用 useCallback 稳定回调函数引用，确保 React.memo 能正确判断 props 变化
  const handleEdit = useCallback(
    (entry: TimeEntry) => {
      onEdit(entry)
    },
    [onEdit]
  )

  const handleDelete = useCallback(
    (id: string) => {
      onDelete(id)
    },
    [onDelete]
  )

  const handleViewDetail = useCallback(
    (entry: TimeEntry) => {
      onViewDetail?.(entry)
    },
    [onViewDetail]
  )

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
          onEdit={() => handleEdit(entry)}
          onDelete={() => handleDelete(entry.id)}
          onViewDetail={onViewDetail ? () => handleViewDetail(entry) : undefined}
        />
      ))}
    </div>
  )
}

export default TimeEntryList