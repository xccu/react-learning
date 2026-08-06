// useParams：读取 URL 动态参数定位要编辑的记录；useNavigate：提交成功后编程式跳转
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

  // 提交修改：调用 updateEntry 后返回列表页
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    await updateEntry(entry.id, data)
    // 编程式导航：await 异步流程结束后跳转，Link 无法表达这种时机
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
