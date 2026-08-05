import { Routes, Route, Navigate } from 'react-router-dom'
import { TimeEntryProvider } from './context/TimeEntryContext'
import AppLayout from './components/timesheet/AppLayout'
import RequireAuth from './components/auth/RequireAuth'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import TimeEntryListPage from './pages/TimeEntryListPage'
import TimeEntryDetailPage from './pages/TimeEntryDetailPage'
import TimeEntryEditPage from './pages/TimeEntryEditPage'
import TimeSheetPage from './pages/TimeSheetPage'
import { Layout, DocsRoutes } from './docs-examples'

// App 组件：路由表配置
// 登录页（无守卫）→ 受保护主布局（嵌套子页面）→ 404 兜底
function App() {
  return (
    <TimeEntryProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/docs-examples" element={<Layout />}>
          <Route index element={<Navigate to="components" replace />} />
          <Route path="*" element={<DocsRoutes />} />
        </Route>
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<TimeEntryListPage />} />
          <Route path="timesheet/:id/edit" element={<TimeEntryEditPage />} />
          <Route path="timesheet/:id" element={<TimeEntryDetailPage />} />
          <Route path="timesheet" element={<TimeSheetPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TimeEntryProvider>
  )
}

export default App
