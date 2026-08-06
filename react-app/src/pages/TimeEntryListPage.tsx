import { useNavigate } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import Header from '../components/timesheet/Header'
import Stats from '../components/timesheet/Stats'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import type { TimeEntry } from '../types/timeEntry'

// 列表页：复用 Stats 与 TimeEntryList，作为主布局的默认子页面
function TimeEntryListPage() {
  const { entries, deleteEntry } = useTimeEntries()
  // useNavigate：编程式导航，跳转路径由点击的记录动态决定，Link 在模板里不好表达
  const navigate = useNavigate()

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

  // 使用 reduce 遍历 entries 数组，累加总工时
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0)

  return (
    <div>
      <Header title="工时列表" />
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
