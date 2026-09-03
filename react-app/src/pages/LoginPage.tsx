import { useLayoutEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../store'
import { loginUser, fetchUsers } from '../store/userSlice'
import { login, saveUsername } from '../utils/auth'
import styles from './LoginPage.module.css'

// 快捷登录账号密码映射
const QUICK_LOGIN_MAP: Record<string, string> = {
  admin: 'admin123',
  user1: 'user123',
  user2: 'user123',
}

// 快捷登录账号列表
const QUICK_LOGIN_USERS: { username: string; label: string }[] = [
  { username: 'admin', label: '管理员' },
  { username: 'user1', label: '普通用户' },
  { username: 'user2', label: '普通用户' },
]

// 登录表单字段结构
interface LoginFormValues {
  username: string
  password: string
}

// 登录页：Form + Input + Card + 用户认证
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const [form] = Form.useForm<LoginFormValues>()

  // 根据 URL 自动填充对应账号的密码
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

  const handleFormSubmit = async (values: LoginFormValues) => {
    // 先校验用户名密码是否正确
    const username = values.username.trim()
    const password = values.password
    const expectedPassword = QUICK_LOGIN_MAP[username]
    if (!expectedPassword) {
      form.setFields([
        { name: 'username', errors: ['用户名不存在'] },
        { name: 'password', errors: [] },
      ])
      return
    }
    if (password !== expectedPassword) {
      form.setFields([
        { name: 'username', errors: [] },
        { name: 'password', errors: ['密码错误'] },
      ])
      return
    }

    try {
      // 调用 login thunk，自动处理 pending/fulfilled/rejected
      const result = await dispatch(loginUser({ username, password })).unwrap()
      
      // 验证成功：保存登录态 + 用户名
      login()
      saveUsername(username)
      
      // 同时加载用户列表
      await dispatch(fetchUsers()).unwrap()
      
      // 跳转到主页或原本想访问的页面
      const state = location.state as { from?: string } | null
      navigate(state?.from ?? '/', { replace: true })
    } catch (err) {
      // 验证失败：提示错误
      message.error(err instanceof Error ? err.message : '登录失败')
    }
  }

  // 快捷登录：自动填充用户名和密码
  const handleQuickLogin = (username: string, password: string) => {
    form.setFieldsValue({ username, password })
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
          <Link to="/login/admin" className={styles.quickLoginLink}>admin</Link>
          <span className={styles.quickLoginSep}>/</span>
          <Link to="/login/user1" className={styles.quickLoginLink}>user1</Link>
          <span className={styles.quickLoginSep}>/</span>
          <Link to="/login/user2" className={styles.quickLoginLink}>user2</Link>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage