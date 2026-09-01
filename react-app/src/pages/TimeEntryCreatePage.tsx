import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { addEntry } from '../store/timesheetSlice'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import type { TimeEntry } from '../types/timeEntry'
import styles from './TimeEntryCreatePage.module.css'

// 新增页：复用 TimeEntryForm 新增模式（不传 initialData），审批状态默认"待审批"
function TimeEntryCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 提交新增：不传 approvalStatus，默认"待审批"
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    dispatch(addEntry({ ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), hours: Number(data.hours), approvalStatus: '待审批' as ApprovalStatus }))
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <TimeEntryForm onSubmit={handleSubmit} showApprovalStatus={false} />
    </div>
  )
}

export default TimeEntryCreatePage