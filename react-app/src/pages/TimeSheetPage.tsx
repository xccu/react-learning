import { useState } from 'react'
import { useTimeEntries } from '../context/TimeEntryContext'
import Header from '../components/Header'
import TimeEntryForm from '../components/TimeEntryForm'
import TimeEntryList from '../components/TimeEntryList'
import Stats from '../components/Stats'
import type { TimeEntry } from '../api/mockApi'

// 内部组件：包含工时填报的所有逻辑
function TimeSheetPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useTimeEntries()
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  // 处理表单提交（新增或编辑）
  const handleSubmit = async (
    entry: Omit<TimeEntry, 'id' | 'createdAt'>
  ) => {
    if (editingEntry) {
      // 编辑模式：调用 updateEntry
      await updateEntry(editingEntry.id, entry)
      setEditingEntry(null)
    } else {
      // 新增模式：调用 addEntry
      await addEntry(entry)
    }
  }

  // 处理编辑：设置编辑模式并传入当前记录数据
  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry)
  }

  // 取消编辑
  const handleCancel = () => {
    setEditingEntry(null)
  }

  // 处理删除
  const handleDelete = async (id: string) => {
    await deleteEntry(id)
  }

  // 计算总工时
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <>
      {/* Header 放在页面顶部，横跨整个宽度 */}
      <Header />

      {/* 在 AppLayout 的右侧内容区渲染 TimeEntryForm、TimeEntryList、Stats 组件 */}
      <TimeEntryForm onSubmit={handleSubmit} initialData={editingEntry} onCancel={editingEntry ? handleCancel : undefined} />

      <Stats totalHours={totalHours} />

      <TimeEntryList entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  )
}

export default TimeSheetPage