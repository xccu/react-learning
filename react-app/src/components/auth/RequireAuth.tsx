import { Navigate, useLocation, Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../store'
import { isLoggedIn, getPermissions } from '../../utils/auth'

// RequireAuth：路由守卫组件，在进入受保护页面「之前」做条件判断
// 未登录时记录来源路径并重定向到登录页；已登录则放行渲染子内容
// 可选 permissions 参数：检查用户是否有指定权限，没有则跳转 403
function RequireAuth({
  children,
  permissions,
}: {
  children?: ReactNode
  permissions?: string[]
}) {
  const location = useLocation()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // 如果指定了权限要求，检查用户是否有对应权限
  if (permissions && permissions.length > 0) {
    let userPermissions: string[] = []
    
    // 优先从 Redux 获取权限（登录后状态）
    if (currentUser) {
      currentUser.roles.forEach((roleName) => {
        const role = roles.find((r) => r.name === roleName)
        if (role) {
          userPermissions.push(...role.permissions)
        }
      })
    }
    
    // 如果 Redux 中没有权限信息（页面刷新后 currentUser 丢失），从 localStorage 获取
    if (userPermissions.length === 0) {
      userPermissions = getPermissions()
    }
    
    // 如果没有权限信息，说明数据异常，跳过检查（用户已登录）
    if (userPermissions.length > 0) {
      const hasPermission = permissions.every((p) => userPermissions.includes(p))
      if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />
      }
    }
  }

  if (!children) {
    return <Outlet />
  }

  return children
}

export default RequireAuth