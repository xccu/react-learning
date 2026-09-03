import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Tag, Space } from 'antd'
import type { RootState, AppDispatch } from '../store'
import { fetchUserById } from '../store/userSlice'
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

// 用户详情页：优先从 Redux 缓存读取，未命中则 dispatch fetchUserById
function UserDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, error } = useSelector((state: RootState) => state.user)

  // 从 Redux Store 中查找用户（缓存命中）
  const cachedUser = users.find((u) => u.id === id)
  const [user, setUser] = useState<User | null>(cachedUser ?? null)

  // 挂载时：如果缓存中没有，则发起请求
  useEffect(() => {
    if (!id) return
    if (!cachedUser) {
      dispatch(fetchUserById(id))
    }
  }, [id, cachedUser, dispatch])

  // 如果缓存未命中且 thunk 已加载完成，从 users 中更新
  useEffect(() => {
    if (cachedUser && !user) {
      setUser(cachedUser)
    }
  }, [cachedUser, user])

  // 加载中不判定「用户不存在」，等数据就绪后再判断
  if (loading && !user) {
    return <p className={styles.status}>加载中...</p>
  }

  // 加载失败或用户不存在时显示提示 + 返回列表入口
  if (error && !user) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>加载失败</p>
        <Link to="/users" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>未找到该用户</p>
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
          <Space size="small">
            {user.roles.map((role) => (
              <Tag key={role} color={roleColor[role]}>{role}</Tag>
            ))}
          </Space>
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