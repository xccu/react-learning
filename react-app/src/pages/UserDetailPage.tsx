import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { getUserById } from '../api/timeEntryApi'
import type { User } from '../types/timeEntry'
import styles from './UserDetailPage.module.css'

// 角色颜色映射
const roleColor: Record<string, string> = {
  '管理员': 'blue',
  '普通用户': 'green',
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

// 用户详情页：按路由标识经请求模块加载单条用户记录
function UserDetailPage() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 挂载时经请求模块按 id 加载用户
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getUserById(id)
      .then((data) => setUser(data))
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false))
  }, [id])

  // 加载中不判定「用户不存在」，等数据就绪后再判断
  if (loading) {
    return <p className={styles.status}>加载中...</p>
  }

  // 加载失败或用户不存在时显示提示 + 返回列表入口
  if (error || !user) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>{error === '用户不存在' ? '未找到该用户' : '加载失败'}</p>
        <Link to="/users" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>用户详情</h2>

      <div className={styles.field}>
        <label className={styles.label}>用户名</label>
        <div className={styles.value}>{user.username}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>角色</label>
        <div className={styles.value}>
          <Tag color={roleColor[user.roles[0]]}>{user.roles[0]}</Tag>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>创建时间</label>
        <div className={styles.value}>{formatDate(user.createdAt)}</div>
      </div>

      <div className={styles.buttonGroup}>
        <Link to={`/users/${user.id}/edit`} className={styles.editBtn}>
          编辑
        </Link>
        <Link to="/users" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    </div>
  )
}

export default UserDetailPage