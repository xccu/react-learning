import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'
import styles from './LoginPage.module.css'

// 登录页：表单 + 必填校验，成功后保存登录态并跳转来源路径
function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const location = useLocation()

  // 表单校验：用户名与密码必填
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!username.trim()) {
      newErrors.username = '用户名不能为空'
    }
    if (!password.trim()) {
      newErrors.password = '密码不能为空'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 【JavaScript 事件对象】通过 e.preventDefault() 阻止表单默认刷新行为
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // 保存登录态
    login()

    // 登录成功后返回用户原本想访问的页面（默认 /）
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card} noValidate>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚛️</span>
          <span className={styles.brandText}>React App</span>
        </div>
        <h1 className={styles.title}>登录</h1>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">用户名</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
            placeholder="请输入用户名"
          />
          {errors.username && <span className={styles.error}>{errors.username}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="请输入密码"
          />
          {errors.password && <span className={styles.error}>{errors.password}</span>}
        </div>

        <button type="submit" className={styles.submitBtn}>
          登录
        </button>
      </form>
    </div>
  )
}

export default LoginPage
