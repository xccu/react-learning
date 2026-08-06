import { Link, useParams } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import styles from '../components/timesheet/TimeEntryForm.module.css'

// 详情页：只读镜像 TimeEntryForm 的字段布局
function TimeEntryDetailPage() {
  // useParams：读取 URL 动态参数，path 中的 :id 对应返回的 { id }
  const { id } = useParams()
  const { entries, loading } = useTimeEntries()

  // 加载中不判定「记录不存在」，等数据就绪后再 find
  if (loading) {
    return <p>加载中...</p>
  }

  // 【JavaScript Array.prototype.find()】根据 id 查找记录
  const entry = entries.find((e) => e.id === id)

  // 记录不存在时显示提示 + 返回列表入口
  if (!entry) {
    return (
      <div>
        <p>未找到该工时记录</p>
        {/* Link：声明式导航，渲染为 <a> 标签但不会整页刷新 */}
        <Link to="/">返回列表</Link>
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

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>工时详情</h2>

      <div className={styles.field}>
        <label className={styles.label}>项目名称</label>
        <div className={styles.input}>{entry.projectName}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工作内容</label>
        <div className={styles.input}>{entry.description}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工时（小时）</label>
        <div className={styles.input}>{entry.hours}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>审批状态</label>
        <div className={styles.input}>{entry.approvalStatus}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>创建时间</label>
        <div className={styles.input}>{formatDate(entry.createdAt)}</div>
      </div>

      <div className={styles.buttonGroup}>
        {/* 模板字符串拼接当前记录的 id，跳转编辑页 */}
        <Link to={`/timesheet/${entry.id}/edit`} className={styles.submitBtn} style={{ textDecoration: 'none' }}>
          编辑
        </Link>
        <Link to="/" className={styles.cancelBtn} style={{ textDecoration: 'none' }}>
          返回列表
        </Link>
      </div>
    </div>
  )
}

export default TimeEntryDetailPage
