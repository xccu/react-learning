import { Form, Input, Button, Card } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, saveUsername } from '../utils/auth'
import styles from './LoginPage.module.css'

// 登录表单字段结构
interface LoginFormValues {
  username: string
  password: string
}

// 登录页：Form + Input + Card 实现
function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleFormSubmit = async (values: LoginFormValues) => {
    // 保存登录态与用户名
    login()
    saveUsername(values.username.trim())

    // 登录成功后返回用户原本想访问的页面（默认 /）
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  }

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚛️</span>
          <span className={styles.brandText}>React App</span>
        </div>
        <h2 className={styles.title}>登录</h2>
        <Form onFinish={handleFormSubmit} layout="vertical">
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
      </Card>
    </div>
  )
}

export default LoginPage