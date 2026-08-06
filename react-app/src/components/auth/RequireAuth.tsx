import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { isLoggedIn } from '../../utils/auth'

// RequireAuth：路由守卫组件，在进入受保护页面「之前」做条件判断
// 未登录时记录来源路径并重定向到登录页；已登录则放行渲染子内容
function RequireAuth({ children }: { children: ReactNode }) {
  // useLocation：读取当前路由信息，location.pathname 即用户原本想访问的页面路径
  const location = useLocation()

  if (!isLoggedIn()) {
    // <Navigate to>：渲染时立即执行重定向，无需用户操作
    // state={{ from }}：把来源路径通过路由 state 传给登录页，供登录成功后回跳
    // replace：用登录页替换当前历史记录，避免浏览器返回键回到被拦截的页面
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // 守卫只负责「放行与否」，返回 children 而不是 <Outlet />，布局仍由被包裹组件渲染
  return children
}

export default RequireAuth
