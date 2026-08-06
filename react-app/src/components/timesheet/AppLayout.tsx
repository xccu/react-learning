// NavLink：增强版 Link，能感知当前路由是否激活（isActive），用于导航高亮
// Outlet：子路由占位符，匹配到的子页面组件渲染在此处
// useNavigate：编程式导航 Hook，在事件处理等逻辑中主动触发跳转
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getUsername, logout } from '../../utils/auth'
import styles from './AppLayout.module.css'

// 路由化主布局：NavLink 高亮 + Outlet 渲染子路由 + 退出登录
function AppLayout() {
  const navigate = useNavigate()
  const username = getUsername()

  // 退出登录：清除登录态并跳转登录页；replace 避免返回键回到已退出的受保护页面
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // 用户名链接暂不跳转：拦截默认导航行为
  const handleUserLinkClick = (e: React.MouseEvent) => {
    e.preventDefault()
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
          {/* end：精确匹配，仅当 URL 完全等于 / 时才高亮「工时列表」；不加 end 时 /timesheet/1 也会让「工时列表」部分匹配 */}
          <li>
            <NavLink to="/" end className={navLinkClass}>
              <span className={styles.navIcon}>📋</span>
              <span>工时列表</span>
            </NavLink>
          </li>
          <li>
            {/* 不加 end：默认部分匹配，/timesheet/1 时「工时填报」保持高亮 */}
            <NavLink to="/timesheet" className={navLinkClass}>
              <span className={styles.navIcon}>🕐</span>
              <span>工时填报</span>
            </NavLink>
          </li>
        </ul>

        <div className={styles.userMenu}>
          <Link to="/" onClick={handleUserLinkClick} className={styles.userInfo}>
            <span className={styles.userAvatar}>{username ? username.charAt(0).toUpperCase() : '?'}</span>
            <span className={styles.userName}>{username ?? '未登录'}</span>
          </Link>
          <span className={styles.logoutBtn} onClick={handleLogout} role="button" title="退出登录">
            退出登录
          </span>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Outlet：当前 URL 匹配到的子路由组件在此处渲染（列表 / 详情 / 编辑 / 原页面） */}
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
