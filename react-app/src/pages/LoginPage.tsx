import { useLayoutEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../store'
import { loginUser, fetchUsers, fetchRoles } from '../store/userSlice'
import { login, saveUsername, savePermissions } from '../utils/auth'
import styles from './LoginPage.module.css'

const QUICK_LOGIN_MAP: Record<string, string> = {
  Administrator: 'Pass@word0',
  ProjectManager: 'Pass@word0',
  User: 'Pass@word0',
}

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm<{ username: string; password: string }>()

  useLayoutEffect(() => {
    const path = location.pathname
    if (path.startsWith('/login/')) {
      const username = path.replace('/login/', '')
      const password = QUICK_LOGIN_MAP[username]
      if (password) {
        form.setFieldsValue({ username, password })
      }
    }
  }, [location.pathname, form])

  const handleFormSubmit = async (values: { username: string; password: string }) => {
    const username = values.username.trim()
    const password = values.password

    try {
      const result = await dispatch(loginUser({ username, password })).unwrap()

      login()
      saveUsername(username)

      const fetchedUsers = await dispatch(fetchUsers()).unwrap()
      const fetchedRoles = await dispatch(fetchRoles()).unwrap()

      const currentUser = fetchedUsers.find((u) => u.username === username)
      const permissions = currentUser?.roles.flatMap((roleName) => {
        const role = fetchedRoles.find((r) => r.name === roleName)
        return role ? role.permissions : []
      }) ?? []
      savePermissions(permissions)

      const state = location.state as { from?: string } | null
      navigate(state?.from ?? '/', { replace: true })
    } catch (err) {
      message.error(err instanceof Error ? err.message : '登录失败')
    }
  }

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚛️</span>
          <span className={styles.brandText}>React App</span>
        </div>
        <h2 className={styles.title}>登录</h2>
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <div className={styles.quickLogin}>
          <span className={styles.quickLoginLabel}>快捷登录：</span>
          <Link to="/login/Administrator" className={styles.quickLoginLink}>Administrator</Link>
          <span className={styles.quickLoginSep}>/</span>
          <Link to="/login/ProjectManager" className={styles.quickLoginLink}>ProjectManager</Link>
          <span className={styles.quickLoginSep}>/</span>
          <Link to="/login/User" className={styles.quickLoginLink}>User</Link>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage