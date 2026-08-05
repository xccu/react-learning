import { useNavigate } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import Stats from '../components/timesheet/Stats'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import type { TimeEntry } from '../types/timeEntry'

// 列表页：复用 Stats 与 TimeEntryList，作为主布局的默认子页面
function TimeEntryListPage() {
  const { entries, deleteEntry } = useTimeEntries()
  const navigate = useNavigate()

  // 详情按钮：跳转到对应记录的详情页
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

  // 使用 reduce 遍历 entries 数组，累加总工时
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div>
      <h1>工时列表</h1>
      <Stats totalHours={totalHours} />
      <TimeEntryList
        entries={entries}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default TimeEntryListPage
