// 【Ant Design】侧边栏使用 div + Menu + Avatar + Button
import { Menu, Avatar, Button, Tooltip } from 'antd'
import { UserOutlined, LogoutOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../store'
import { clearCurrentUser } from '../../store/userSlice'
import { getUsername, logout } from '../../utils/auth'
import styles from './AppLayout.module.css'

// 路由化主布局：Menu 高亮 + Outlet 渲染子路由 + 退出登录
function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const username = getUsername()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  // 退出登录：清除 Redux 用户信息 + 清除 localStorage + 跳转
  const handleLogout = () => {
    dispatch(clearCurrentUser())
    logout()
    navigate('/login', { replace: true })
  }

  // 导航菜单项
  const menuItems = [
    {
      key: '/',
      icon: <FileTextOutlined />,
      label: '工时列表',
    },
    {
      key: '/timesheet/create',
      icon: <PlusOutlined />,
      label: '新增工时',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
  ]

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoIcon}>⚛️</span>
          <span className={styles.logoText}>React App</span>
        </div>

        <div className={styles.menuContainer}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            theme="dark"
          />
        </div>

        <div className={styles.userMenu}>
          <Avatar icon={<UserOutlined />} className={styles.userAvatar} />
          <span className={styles.userName}>{currentUser?.username ?? username ?? '未登录'}</span>
          <Tooltip placement="right" title="注销">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              style={{ color: '#fff' }}
              onClick={handleLogout}
              className={styles.logoutBtn}
            />
          </Tooltip>
        </div>
      </div>

      <div className={styles.main}>
        {/* Outlet：当前 URL 匹配到的子路由组件在此处渲染 */}
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout