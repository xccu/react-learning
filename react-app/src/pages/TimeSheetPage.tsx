import { useState } from 'react'
import { useTimeEntries } from '../context/TimeEntryContext'
import Header from '../components/timesheet/Header'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import Stats from '../components/timesheet/Stats'
// 【TypeScript 类型导入】从 types 目录导入 TimeEntry 类型
import type { TimeEntry } from '../types/timeEntry'

// 内部组件：包含工时填报的所有逻辑
function TimeSheetPage() {
  // 从 Context 获取全局数据和操作方法
  const { entries, addEntry, updateEntry, deleteEntry } = useTimeEntries()
  // 【TypeScript 联合类型】TimeEntry | null 表示可以是 TimeEntry 对象或 null
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  // 处理表单提交（新增或编辑）
  const handleSubmit = async (
    // 【TypeScript Omit 工具类型】Omit<TimeEntry, 'id' | 'createdAt'> 表示传入数据不包含 id 和 createdAt
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

  // 使用 reduce 遍历 entries 数组，将每条记录的 hours 累加得到总工时
  // 【JavaScript Array.prototype.reduce()】reduce 遍历数组，将每个元素累加到 sum 中，初始值为 0
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