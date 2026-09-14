// 【Ant Design】侧边栏使用 div + Menu + Avatar + Button，基于权限动态渲染菜单
import { Menu, Avatar, Button, Tooltip } from 'antd'
import { UserOutlined, LogoutOutlined, FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../../store'
import { clearCurrentUser } from '../../store/userSlice'
import { getUsername, getPermissions, logout } from '../../utils/auth'
import styles from './AppLayout.module.css'

// 路由化主布局：Menu 高亮 + Outlet 渲染子路由 + 退出登录
function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const username = getUsername()
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  // 退出登录：清除 Redux 用户信息 + 清除 localStorage + 跳转
  const handleLogout = () => {
    dispatch(clearCurrentUser())
    logout()
    navigate('/login', { replace: true })
  }

  // 收集用户所有权限
  const userPermissions: string[] = []
  if (currentUser) {
    currentUser.roles.forEach((roleName) => {
      const role = roles.find((r) => r.name === roleName)
      if (role) {
        userPermissions.push(...role.permissions)
      }
    })
  }
  
  // 如果 Redux 中没有权限信息（页面刷新后），从 localStorage 获取
  if (userPermissions.length === 0) {
    const storedPermissions = getPermissions()
    if (storedPermissions.length > 0) {
      userPermissions.push(...storedPermissions)
    }
  }
  
  // 如果仍然没有权限信息，说明登录状态异常，跳转回登录页
  if (userPermissions.length === 0 && currentUser) {
    navigate('/login', { replace: true })
  }

  // 路由化菜单项：基于权限动态过滤
  const allMenuItems = [
    {
      key: '/',
      icon: <FileTextOutlined />,
      label: '工时列表',
      permission: 'TimeSheet.Read',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
      permission: 'User.Read',
    },
    {
      key: '/permissions',
      icon: <SettingOutlined />,
      label: '权限管理',
      permission: 'Role.Read',
    },
  ]

  // 过滤出用户有权限的菜单项
  const menuItems = allMenuItems.filter((item) => userPermissions.includes(item.permission))

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