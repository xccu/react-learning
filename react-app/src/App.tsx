import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TimeEntryProvider } from './context/TimeEntryContext'
import AppLayout from './components/timesheet/AppLayout'
import TimeSheetPage from './pages/TimeSheetPage'
import { Layout, DocsRoutes } from './docs-examples'

// 页面路由配置：将导航 key 映射到页面组件
const navPages: Record<string, React.ComponentType> = {
  timesheet: TimeSheetPage,
}

// 导航项配置
const navItems = [
  { key: 'timesheet', label: 'Timesheet', icon: '📋' },
]

// App 组件：布局壳 + 导航配置
function App() {
  // 使用 useState 管理当前激活的导航项（默认 Timesheet）
  const [activeNav, setActiveNav] = useState('timesheet')

  return (
    <TimeEntryProvider>
      <Routes>
        <Route path="/docs-examples" element={<Layout />}>
          <Route index element={<Navigate to="components" replace />} />
          <Route path="*" element={<DocsRoutes />} />
        </Route>
        <Route path="*" element={
          <AppLayout activeNav={activeNav} setActiveNav={setActiveNav} navPages={navPages} navItems={navItems} />
        } />
      </Routes>
    </TimeEntryProvider>
  )
}

export default App