import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../../utils/auth'
import styles from './AppLayout.module.css'

// 路由化主布局：NavLink 高亮 + Outlet 渲染子路由 + 退出登录
function AppLayout() {
  const navigate = useNavigate()

  // 退出登录：清除登录态并跳转登录页
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // 【JavaScript 模板字符串】根据 NavLink 激活状态拼接高亮类名
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoIcon}>⚛️</span>
          <span className={styles.logoText}>React App</span>
        </div>

        <ul className={styles.navList}>
          {/* end 确保「工时列表」仅在根路径 / 时高亮 */}
          <li>
            <NavLink to="/" end className={navLinkClass}>
              <span className={styles.navIcon}>📋</span>
              <span>工时列表</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/timesheet" className={navLinkClass}>
              <span className={styles.navIcon}>🕐</span>
              <span>工时填报</span>
            </NavLink>
          </li>
        </ul>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          退出登录
        </button>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
