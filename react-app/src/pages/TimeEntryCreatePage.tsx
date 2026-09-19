import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { addEntry } from '../store/timesheetSlice'
import { addEntry as addEntryApi, getEntries } from '../api/timeEntryApi'
import { setEntries } from '../store/timesheetSlice'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import type { TimeEntry, ApprovalStatus } from '../types/timeEntry'
import { message } from 'antd'
import styles from './TimeEntryCreatePage.module.css'

// 新增页：复用 TimeEntryForm 新增模式（不传 initialData），审批状态默认"待审批"
function TimeEntryCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 提交新增：调用 API 后刷新列表
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    try {
      await addEntryApi({ ...data, hours: Number(data.hours), approvalStatus: '待审批' as ApprovalStatus })
      const entries = await getEntries()
      dispatch(setEntries(entries))
      navigate('/')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '新增失败')
    }
  }

  return (
    <div className={styles.page}>
      <TimeEntryForm onSubmit={handleSubmit} showApprovalStatus={false} />
    </div>
  )
}

export default TimeEntryCreatePage