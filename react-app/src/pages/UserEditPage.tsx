import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { getUserById } from '../api/timeEntryApi'
import { setUsers } from '../store/userSlice'
import UserForm from '../components/timesheet/UserForm'
import type { User } from '../types/timeEntry'
import styles from './UserEditPage.module.css'

// 用户编辑页：按路由标识经请求模块加载记录并预填表单
function UserEditPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
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
        <a href="/users" className={styles.backLink}>
          返回列表
        </a>
      </div>
    )
  }

  // 提交修改：通过 API 更新用户，成功后返回列表
  const handleSubmit = async (data: { username: string; roles: User['roles'] }) => {
    if (!user) return
    const { updateUser: updateUserApi } = await import('../api/timeEntryApi')
    await updateUserApi(user.id, data)
    const { getUsers } = await import('../api/timeEntryApi')
    dispatch(setUsers(await getUsers()))
    navigate('/users')
  }

  return (
    <div>
      <UserForm onSubmit={handleSubmit} initialData={user} onCancel={() => navigate('/users')} />
    </div>
  )
}

export default UserEditPage