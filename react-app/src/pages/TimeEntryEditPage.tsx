// useParams：读取 URL 动态参数定位要编辑的记录；useNavigate：提交成功后编程式跳转
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import type { TimeEntry } from '../types/timeEntry'
import { getEntryById, updateEntry as updateEntryApi, submitEntry as submitEntryApi, getEntries } from '../api/timeEntryApi'
import { updateEntry, submitEntry, setEntries } from '../store/timesheetSlice'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import { message } from 'antd'
import styles from './TimeEntryEditPage.module.css'

// 编辑页：按路由标识经请求模块加载记录并预填表单，处理加载中与记录不存在状态
function TimeEntryEditPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 从 Redux Store 读取所有工时记录
  const entries = useSelector((state: RootState) => state.timesheet.entries)
  const entry = entries.find((e) => e.id === id) ?? null
  const [error, setError] = useState<string | null>(null)

  // 挂载时如果 Store 中没有该记录，则从 API 加载
  useEffect(() => {
    if (!id) return
    if (entry) return
    setError(null)
    getEntryById(id)
      .then((data) => {
        dispatch(setEntries([data]))
      })
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // 记录不存在或加载失败时显示提示 + 返回列表入口
  if (error || !entry) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>{error === '记录不存在' ? '未找到该工时记录' : '加载失败'}</p>
        <Link to="/" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    )
  }

  // 提交修改：调用 API 后刷新列表并返回
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    try {
      const isRejected = entry.approvalStatus === '已驳回'
      if (isRejected) {
        await submitEntryApi(entry.id)
      }
      const { approvalStatus: _, ...updateData } = data
      await updateEntryApi(entry.id, { ...updateData, hours: Number(data.hours), approvalStatus: isRejected ? '待审批' : entry.approvalStatus, ...(isRejected && { rejectReason: undefined }) })
      const entries = await getEntries()
      dispatch(setEntries(entries))
      navigate('/')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '更新失败')
    }
  }

  return (
    <div>
      <TimeEntryForm onSubmit={handleSubmit} initialData={entry} onCancel={() => navigate('/')} isRejected={entry.approvalStatus === '已驳回'} />
    </div>
  )
}

export default TimeEntryEditPage