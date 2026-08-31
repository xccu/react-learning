import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { getEntryById } from '../api/timeEntryApi'
import { approveEntry, rejectEntry } from '../store/timesheetSlice'
import type { TimeEntry } from '../types/timeEntry'
import styles from './TimeEntryDetailPage.module.css'

// 详情页：按路由标识经请求模块加载单条记录，处理加载中与记录不存在状态
function TimeEntryDetailPage() {
  // useParams：读取 URL 动态参数，path 中的 :id 对应返回的 { id }
  const { id } = useParams()
  const [entry, setEntry] = useState<TimeEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()

  // 挂载时经请求模块按 id 加载记录
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getEntryById(id)
      .then((data) => setEntry(data))
      // 记录不存在时响应拦截器会把「记录不存在」作为错误信息抛出
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false))
  }, [id])

  // 加载中不判定「记录不存在」，等数据就绪后再判断
  if (loading) {
    return <p className={styles.status}>加载中...</p>
  }

  // 加载失败或记录不存在时显示提示 + 返回列表入口
  if (error || !entry) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>{error === '记录不存在' ? '未找到该工时记录' : '加载失败'}</p>
        {/* Link：声明式导航，渲染为 <a> 标签但不会整页刷新 */}
        <Link to="/" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    )
  }

  // 格式化时间
  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 审批通过
  const handleApprove = () => {
    if (window.confirm('确定审批通过该记录吗？')) {
      dispatch(approveEntry(entry.id))
      // 更新本地状态
      setEntry({ ...entry, approvalStatus: '已通过', rejectReason: undefined })
    }
  }

  // 驳回
  const handleReject = () => {
    const reason = window.prompt('请输入驳回原因：')
    if (reason) {
      dispatch(rejectEntry({ id: entry.id, reason }))
      setEntry({ ...entry, approvalStatus: '已驳回', rejectReason: reason })
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>工时详情</h2>

      <div className={styles.field}>
        <label className={styles.label}>项目名称</label>
        <div className={styles.value}>{entry.projectName}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工作内容</label>
        <div className={styles.value}>{entry.description}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工时（小时）</label>
        <div className={styles.value}>{entry.hours}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>审批状态</label>
        <div className={styles.value}>{entry.approvalStatus}</div>
      </div>

      {/* 已驳回时显示驳回原因 */}
      {entry.approvalStatus === '已驳回' && entry.rejectReason && (
        <div className={styles.field}>
          <label className={styles.label}>驳回原因</label>
          <div className={styles.value}>{entry.rejectReason}</div>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>创建时间</label>
        <div className={styles.value}>{formatDate(entry.createdAt)}</div>
      </div>

      <div className={styles.buttonGroup}>
        {/* 按状态显示审批操作按钮 */}
        {entry.approvalStatus === '待审批' && (
          <>
            <button type="button" onClick={handleApprove} className={styles.submitBtn}>
              审批通过
            </button>
            <button type="button" onClick={handleReject} className={styles.cancelBtn}>
              驳回
            </button>
          </>
        )}

        {/* 已驳回时显示重填入口 */}
        {entry.approvalStatus === '已驳回' && (
          <Link to="edit" className={styles.submitBtn}>
            重填
          </Link>
        )}

        {/* 编辑按钮（所有状态都显示） */}
        <Link to="edit" className={styles.editBtn}>
          编辑
        </Link>

        <Link to="/" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    </div>
  )
}

export default TimeEntryDetailPage