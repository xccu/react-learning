import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { updateEntryThunk, submitEntryThunk, fetchEntryById } from '../store/timesheetSlice'
import type { TimeEntry } from '../types/timeEntry'
import TimeEntryForm from '../components/timesheet/TimeEntryForm'
import { message } from 'antd'
import styles from './TimeEntryEditPage.module.css'

// 编辑页：按路由标识经请求模块加载记录并预填表单，处理加载中与记录不存在状态
function TimeEntryEditPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  // 从 Redux Store 读取所有工时记录
  const entries = useSelector((state: RootState) => state.timesheet.entries)
  const loading = useSelector((state: RootState) => state.timesheet.loading)
  const error = useSelector((state: RootState) => state.timesheet.error)
  const entry = entries.find((e) => e.id === id) ?? null
  const [localError, setLocalError] = useState<string | null>(null)

  // 挂载时如果 Store 中没有该记录，则 dispatch fetchEntryById
  useEffect(() => {
    if (!id) return
    if (entry) return
    setLocalError(null)
    dispatch(fetchEntryById(id))
      .unwrap()
      .catch((err) => setLocalError(err instanceof Error ? err.message : '加载失败'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch])

  // 记录不存在或加载失败时显示提示 + 返回列表入口
  if (localError || !entry) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>{localError === '记录不存在' ? '未找到该工时记录' : '加载失败'}</p>
        <Link to="/" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    )
  }

  // 提交修改：通过 thunks 更新
  const handleSubmit = async (data: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    try {
      const isRejected = entry.approvalStatus === '已驳回'
      if (isRejected) {
        await dispatch(submitEntryThunk(entry.id)).unwrap()
      }
      const { approvalStatus: _, ...updateData } = data
      await dispatch(updateEntryThunk({
        id: entry.id,
        updates: { ...updateData, hours: Number(data.hours), approvalStatus: isRejected ? '待审批' : entry.approvalStatus, ...(isRejected && { rejectReason: undefined }) }
      })).unwrap()
      message.success('更新成功')
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