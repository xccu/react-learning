import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import './styles/Layout.css'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>React 文档示例</h1>
          <p className="page-subtitle">
            当前章节: {location.pathname === '/' ? '概览' : location.pathname.slice(1)}
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  )
}