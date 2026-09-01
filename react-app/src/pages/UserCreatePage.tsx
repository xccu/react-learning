import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { setUsers } from '../store/userSlice'
import UserForm from '../components/timesheet/UserForm'
import type { User } from '../types/timeEntry'
import styles from './UserCreatePage.module.css'

// 用户新增页：复用 UserForm 新增模式（不传 initialData）
function UserCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 提交新增：通过 API 新增用户，成功后刷新列表
  const handleSubmit = async (data: { username: string; roles: User['roles'] }) => {
    // 调用 API 新增用户（mock 层会生成 id 和 createdAt）
    const { addUser: addUserApi } = await import('../api/timeEntryApi')
    await addUserApi(data)
    // 新增成功后从 Store 重新加载最新数据
    const { getUsers } = await import('../api/timeEntryApi')
    dispatch(setUsers(await getUsers()))
    navigate('/users')
  }

  return (
    <div className={styles.page}>
      <UserForm onSubmit={handleSubmit} />
    </div>
  )
}

export default UserCreatePage