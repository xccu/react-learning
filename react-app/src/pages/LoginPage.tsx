// 【React Hook Form】登录表单：useForm + register 管理字段与必填校验
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, saveUsername } from '../utils/auth'
import styles from './LoginPage.module.css'

// 登录表单字段结构
interface LoginFormValues {
  username: string
  password: string
}

// 登录页：表单 + 必填校验，成功后保存登录态并跳转来源路径
function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ defaultValues: { username: '', password: '' } })
  // useNavigate：编程式导航，返回 navigate 函数在逻辑中触发跳转
  const navigate = useNavigate()
  // useLocation：读取路由信息，location.state 拿到跳转时附带的数据（如守卫记录的 from）
  const location = useLocation()

  // 表单校验由 RHF 的 register 规则处理（用户名/密码必填），通过后进入此处
  const handleFormSubmit = (values: LoginFormValues) => {
    // 保存登录态与用户名
    login()
    saveUsername(values.username.trim())

    // 登录成功后返回用户原本想访问的页面（默认 /）
    // location.state 由 RequireAuth 在重定向时写入 { from: pathname }；?? 表示为空时取 '/'
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  }

  return (
    <div className={styles.container}>
      {/* handleSubmit：内部先执行注册的校验规则，全部通过才调用回调 */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.card} noValidate>
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
            // 【React Hook Form register】注册字段并绑定必填校验
            {...register('username', { required: '用户名不能为空' })}
            className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
            placeholder="请输入用户名"
          />
          {errors.username && <span className={styles.error}>{errors.username.message}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: '密码不能为空' })}
            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            placeholder="请输入密码"
          />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>

        {/* isSubmitting：提交中禁用按钮，防止重复提交 */}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
