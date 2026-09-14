// Routes：路由表容器，按优先级自动匹配当前 URL 并只渲染命中的一个路由
// Route：声明「路径 → 组件」映射；Navigate：渲染即重定向
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/timesheet/AppLayout'
import RequireAuth from './components/auth/RequireAuth'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import TimeEntryListPage from './pages/TimeEntryListPage'
import TimeEntryDetailPage from './pages/TimeEntryDetailPage'
import TimeEntryEditPage from './pages/TimeEntryEditPage'
import TimeEntryCreatePage from './pages/TimeEntryCreatePage'
import TimeSheetPage from './pages/TimeSheetPage'
import UserListPage from './pages/UserListPage'
import UserDetailPage from './pages/UserDetailPage'
import UserCreatePage from './pages/UserCreatePage'
import UserEditPage from './pages/UserEditPage'
import PermissionListPage from './pages/PermissionListPage'
import PermissionAssignPage from './pages/PermissionAssignPage'
import { Layout, DocsRoutes } from './docs-examples'

// App 组件：路由表配置
// 登录页（无守卫）→ 受保护主布局（嵌套子页面）→ 404 兜底
function App() {
  return (
    <Routes>
      {/* 登录页：无守卫，绝对路径 /login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/Administrator" element={<LoginPage />} />
      <Route path="/login/ProjectManager" element={<LoginPage />} />
      <Route path="/login/User" element={<LoginPage />} />

      {/* 403 页面 */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* docs 示例路由：父路由 + 子路由嵌套 */}
      <Route path="/docs-examples" element={<Layout />}>
        {/* index：无路径的默认子路由，URL 恰好等于 /docs-examples 时渲染（跳转到 components） */}
        <Route index element={<Navigate to="components" replace />} />
        {/* *：通配符，匹配该父路由下的所有子路径，由 DocsRoutes 内部二次分发 */}
        <Route path="*" element={<DocsRoutes />} />
      </Route>

      {/* 受保护主布局：/ 下所有子页面共用 AppLayout 框架 */}
      <Route
        path="/"
        element={
          /* 路由守卫：未登录拦截并重定向到 /login */
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        {/* index：默认落地页，访问 / 时渲染工时列表 */}
        <Route index element={<TimeEntryListPage />} />
        {/* 工时新增：需要 TimeSheet.Write 权限 */}
        <Route element={<RequireAuth permissions={['TimeSheet.Write']} />}>
          <Route path="timesheet/create" element={<TimeEntryCreatePage />} />
        </Route>
        {/* 子路由 path 不以 / 开头，自动基于父路径 / 拼接；:id 为动态参数 */}
        <Route element={<RequireAuth permissions={['TimeSheet.Write']} />}>
          <Route path="timesheet/:id/edit" element={<TimeEntryEditPage />} />
        </Route>
        <Route path="timesheet/:id" element={<TimeEntryDetailPage />} />
        <Route path="timesheet" element={<TimeSheetPage />} />
        {/* 用户管理路由 */}
        <Route element={<RequireAuth permissions={['User.Read']} />}>
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
        </Route>
        <Route element={<RequireAuth permissions={['User.Write']} />}>
          <Route path="users/create" element={<UserCreatePage />} />
          <Route path="users/:id/edit" element={<UserEditPage />} />
        </Route>
        {/* 权限管理路由 */}
        <Route element={<RequireAuth permissions={['Role.Read']} />}>
          <Route path="permissions" element={<PermissionListPage />} />
          <Route path="permissions/assign" element={<PermissionAssignPage />} />
          <Route path="permissions/assign/:id" element={<PermissionAssignPage />} />
        </Route>
      </Route>

      {/* 404 兜底：* 必须放在所有正常路由之后，否则会拦截正常路由 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App