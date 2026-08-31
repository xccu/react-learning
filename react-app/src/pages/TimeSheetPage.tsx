import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { addEntry, updateEntry, deleteEntry } from '../store/timesheetSlice'
import Header from '../components/timesheet/Header'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import Stats from '../components/timesheet/Stats'
import type { TimeEntry } from '../types/timeEntry'

// 内部组件：包含工时填报的所有逻辑
function TimeSheetPage() {
  // 从 Redux Store 获取全局数据
  const { entries } = useSelector((state: RootState) => state.timesheet)
  const dispatch = useDispatch<AppDispatch>()

  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  // 处理表单提交（新增或编辑）
  const handleSubmit = async (
    entry: Omit<TimeEntry, 'id' | 'createdAt'>
  ) => {
    if (editingEntry) {
      // 编辑模式：dispatch updateEntry
      dispatch(updateEntry({ ...editingEntry, ...entry }))
      setEditingEntry(null)
    } else {
      // 新增模式：dispatch addEntry
      dispatch(addEntry({ ...entry, id: Date.now().toString(), createdAt: new Date().toISOString() }))
    }
  }

  // 处理编辑
  const handleEdit = (entry: TimeEntry) => {
    setEditingEntry(entry)
  }

  // 取消编辑
  const handleCancel = () => {
    setEditingEntry(null)
  }

  // 处理删除
  const handleDelete = async (id: string) => {
    dispatch(deleteEntry(id))
  }

  // 计算总工时
  const totalHours = entries.reduce((sum: number, entry: TimeEntry) => sum + entry.hours, 0)

  return (
    <>
      <Header title="工时填报" />
      <TimeEntryForm onSubmit={handleSubmit} initialData={editingEntry} onCancel={editingEntry ? handleCancel : undefined} />
      <Stats totalHours={totalHours} />
      <TimeEntryList entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  )
}

export default TimeSheetPage