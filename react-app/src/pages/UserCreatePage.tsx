import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { createUser } from '../store/userSlice'
import UserForm from '../components/timesheet/UserForm'
import type { User } from '../types/timeEntry'
import styles from './UserCreatePage.module.css'

// 用户新增页：复用 UserForm 新增模式（不传 initialData）
function UserCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 提交新增：通过 createUser thunk 创建用户，成功后自动更新 Store
  const handleSubmit = async (data: { username: string; roles: User['roles'] }) => {
    await dispatch(createUser(data))
    navigate('/users')
  }

  return (
    <div className={styles.page}>
      <UserForm onSubmit={handleSubmit} />
    </div>
  )
}

export default UserCreatePage