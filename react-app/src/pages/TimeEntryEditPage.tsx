import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import type { TimeEntry } from '../types/timeEntry'

// 编辑页：复用 TimeEntryForm 编辑模式，预填记录数据
function TimeEntryEditPage() {
  const { id } = useParams()
  const { entries, loading, updateEntry } = useTimeEntries()
  const navigate = useNavigate()

  // 加载中不判定「记录不存在」，等数据就绪后再 find
  if (loading) {
    return <p>加载中...</p>
  }

  const entry = entries.find((e) => e.id === id)

  // 记录不存在时显示提示 + 返回列表入口
  if (!entry) {
    return (
      <div>
        <p>未找到该工时记录</p>
        <Link to="/">返回列表</Link>
      </div>
    )
  }

  // 提交修改：调用 updateEntry 后返回原页面
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    await updateEntry(entry.id, data)
    navigate('/timesheet')
  }

  return (
    <div>
      <TimeEntryForm
        onSubmit={handleSubmit}
        initialData={entry}
        onCancel={() => navigate('/')}
      />
    </div>
  )
}

export default TimeEntryEditPage
