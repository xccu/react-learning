import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { createEntry, updateEntryThunk, deleteEntryThunk, fetchEntries } from '../store/timesheetSlice'
import { message } from 'antd'
import Header from '../components/timesheet/Header'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import Stats from '../components/timesheet/Stats'
import type { TimeEntry, ApprovalStatus } from '../types/timeEntry'

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
    try {
      if (editingEntry) {
        // 编辑模式：调用 updateEntryThunk
        await dispatch(updateEntryThunk({
          id: editingEntry.id,
          updates: { ...entry, hours: Number(entry.hours) }
        })).unwrap()
        message.success('更新成功')
        setEditingEntry(null)
      } else {
        // 新增模式：调用 createEntry thunk
        await dispatch(createEntry({ ...entry, hours: Number(entry.hours), approvalStatus: '待审批' as ApprovalStatus })).unwrap()
        message.success('新增成功')
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败')
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
    try {
      await dispatch(deleteEntryThunk(id)).unwrap()
      message.success('删除成功')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '删除失败')
    }
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