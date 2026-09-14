import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { fetchRoles, createUser } from '../store/userSlice'
import UserForm from '../components/timesheet/UserForm'
import type { User } from '../types/timeEntry'
import usePermission from '../hooks/usePermission'

// 用户新增页：复用 UserForm 新增模式（不传 initialData）
function UserCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const roles = useSelector((state: RootState) => state.user.roles)
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

  // 提交新增：通过 createUser thunk 创建用户，成功后自动更新 Store
  const handleSubmit = async (data: { username: string; password?: string; roles: User['roles'] }) => {
    await dispatch(createUser({
      username: data.username,
      password: data.password ?? 'Pass@word0',
      roles: data.roles,
    } as Omit<User, 'id' | 'createdAt'>))
    navigate('/users')
  }

  return (
    <div>
      {hasWritePermission ? (
        <div className="page">
          <UserForm onSubmit={handleSubmit} roles={roleOptions} />
        </div>
      ) : (
        <div style={{ padding: 24 }}>
          <p>您没有权限执行此操作</p>
        </div>
      )}
    </div>
  )
}

export default UserCreatePage