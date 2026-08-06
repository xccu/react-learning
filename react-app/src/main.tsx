import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// BrowserRouter：基于 HTML5 History API 的路由根容器，URL 形态与普通路径一致（如 /timesheet/1）
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 被 BrowserRouter 包裹的组件才能使用路由 Hook（useNavigate 等）与组件（Link/NavLink） */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
