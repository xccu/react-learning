import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { fetchUserById, updateUser, fetchRoles } from '../store/userSlice'
import UserForm from '../components/timesheet/UserForm'
import type { User } from '../types/timeEntry'
import usePermission from '../hooks/usePermission'

// 用户编辑页：优先从 Redux 缓存读取，未命中则 dispatch fetchUserById
function UserEditPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { users, loading, error, roles } = useSelector((state: RootState) => state.user)
  const hasWritePermission = usePermission('User.Write')

  useEffect(() => {
    if (roles.length === 0) {
      dispatch(fetchRoles())
    }
  }, [dispatch, roles])

  const roleOptions = roles.map((r) => ({
    value: r.name,
    label: r.name,
  }))

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
    return <p className="status">加载中...</p>
  }

  // 加载失败或用户不存在时显示提示 + 返回列表入口
  if (error && !user) {
    return (
      <div className="status">
        <p className="errorText">加载失败</p>
        <a href="/users" className="backLink">
          返回列表
        </a>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="status">
        <p className="errorText">未找到该用户</p>
        <a href="/users" className="backLink">
          返回列表
        </a>
      </div>
    )
  }

  // 提交修改：通过 updateUser thunk 更新用户，成功后返回列表
  const handleSubmit = async (data: { username: string; password?: string; roles: User['roles'] }) => {
    if (!user) return
    await dispatch(updateUser({ id: user.id, updates: data })).unwrap()
    navigate('/users')
  }

  return (
    <div>
      {hasWritePermission ? (
        <UserForm onSubmit={handleSubmit} initialData={user} roles={roleOptions} onCancel={() => navigate('/users')} />
      ) : (
        <div style={{ padding: 24 }}>
          <p>您没有权限执行此操作</p>
        </div>
      )}
    </div>
  )
}

export default UserEditPage