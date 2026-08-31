import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// BrowserRouter：基于 HTML5 History API 的路由根容器，URL 形态与普通路径一致（如 /timesheet/1）
import { BrowserRouter } from 'react-router-dom'
// Provider：将 Redux Store 注入组件树
import { Provider } from 'react-redux'
// ConfigProvider：Ant Design 全局配置（中文语言包）
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
// Ant Design 全局样式
import 'antd/dist/reset.css'
import './index.css'
// 引入即注册 mock 适配器：/api/* 请求落入内存数据源，接入真实后端时移除该导入即可
import './api/mockAdapter'
import store from './store'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)