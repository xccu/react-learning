import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import Header from '../components/timesheet/Header'
import Stats from '../components/timesheet/Stats'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import TimeEntryQueryForm from '../components/timesheet/TimeEntryQueryForm'
import type { TimeEntry } from '../types/timeEntry'
import type { TimeEntryQuery } from '../api/mockApi'

// 列表页：复用 Stats 与 TimeEntryList，作为主布局的默认子页面
function TimeEntryListPage() {
  const { entries, deleteEntry, queryEntries } = useTimeEntries()
  // useNavigate：编程式导航，跳转路径由点击的记录动态决定，Link 在模板里不好表达
  const navigate = useNavigate()
  // 查询结果保存在本地 state：null 表示未过滤，显示 Context 全量
  const [filtered, setFiltered] = useState<TimeEntry[] | null>(null)

  // 待展示记录：有查询结果用查询结果，否则用 Context 全量
  const visibleEntries = filtered ?? entries

  // 提交查询：条件全空时恢复全部；否则调用 Context 的 queryEntries（内部走 mockApi 过滤）
  const handleQuery = async (query: TimeEntryQuery) => {
    const { projectName, description, approvalStatus } = query
    if (!projectName && !description && !approvalStatus) {
      setFiltered(null)
      return
    }
    setFiltered(await queryEntries(query))
  }

  // 新增工时：跳转到独立新增页
  const handleCreate = () => {
    navigate('/timesheet/create')
  }

  // 详情按钮：模板字符串拼接动态参数，跳转到对应记录的详情页
  const handleViewDetail = (entry: TimeEntry) => {
    navigate(`/timesheet/${entry.id}`)
  }

  // 编辑按钮：跳转到对应记录的编辑页
  const handleEdit = (entry: TimeEntry) => {
    navigate(`/timesheet/${entry.id}/edit`)
  }

  // 删除按钮：调用 deleteEntry
  const handleDelete = async (id: string) => {
    await deleteEntry(id)
  }

  // 使用 reduce 遍历可见记录数组，累加总工时
  const totalHours = visibleEntries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div>
      <Header title="工时列表" />
      <TimeEntryQueryForm onQuery={handleQuery} onCreate={handleCreate} />
      <Stats totalHours={totalHours} />
      <TimeEntryList
        entries={visibleEntries}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default TimeEntryListPage
