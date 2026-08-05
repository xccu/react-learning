import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isLoggedIn } from '../../utils/auth'

// 登录守卫：未登录时记录来源路径并重定向到登录页
function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default RequireAuth
