import { useNavigate } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import type { TimeEntry } from '../types/timeEntry'
import styles from './TimeEntryCreatePage.module.css'

// 新增页：复用 TimeEntryForm 新增模式（不传 initialData），提交成功后返回列表页
function TimeEntryCreatePage() {
  const { addEntry } = useTimeEntries()
  const navigate = useNavigate()

  // 提交新增：调用 addEntry 后编程式跳转回列表页
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    await addEntry(data)
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <TimeEntryForm onSubmit={handleSubmit} />
    </div>
  )
}

export default TimeEntryCreatePage
