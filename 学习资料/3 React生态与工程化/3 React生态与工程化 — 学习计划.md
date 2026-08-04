# 第3阶段：React 生态与工程化 — 学习计划（6周）

> 基于已有的「工时填报」单页应用，引入路由、数据请求、状态管理、UI 组件库等生态工具，将其改造为一个功能完整的后台管理系统。
>
> **前置条件**：已完成第1、2阶段学习，具备一个使用 Context + useState 管理的工时填报单页应用（`react-app/src/` 中的代码）。
>
> **阶段产出的 8 个功能（按实现顺序）**：
> ① 登录 → ② 列表页 → ③ 详情页 → ④ 增删改查 → ⑤ 导入导出 → ⑥ 提交-审批-驳回-重填流程管理 → ⑦ 用户管理 → ⑧ 权限管理

---

## 每周概览（严格按产出顺序）

| 周次 | 对应产出功能 | 主题 | 引入的技术栈 |
|------|------------|------|-------------|
| 第1周 | ①登录、②列表页、③详情页 | 路由与页面结构 | React Router v7 |
| 第2周 | ④增删改查（新增、编辑、删除、列表查询） | 数据请求与表单 | Axios、React Hook Form |
| 第3周 | ⑤导入导出 | Excel 导入导出 + 性能优化基础 | xlsx (SheetJS)、memo |
| 第4周 | ⑥审批流程（提交-审批-驳回-重填） | 状态管理与 UI 组件库 | Redux Toolkit、Ant Design |
| 第5周 | ⑦用户管理 | 用户 CRUD 与角色数据 | Redux（user slice）、Ant Design |
| 第6周 | ⑧权限管理 + 全功能打磨 | 路由守卫、按钮权限、工程化 | 路由守卫、Permission 组件、ESLint、Prettier、Vite |

---

## 第1周：路由与页面结构

### 对应产出

| 产出序号 | 产出内容 | 本周完成度 |
|---------|---------|-----------|
| ① | 登录 | ✅ 完成登录页 + 路由守卫 |
| ② | 列表页 | ✅ 完成路由结构，数据加载在第2周 |
| ③ | 详情页 | ✅ 完成动态路由 + 详情页框架，数据加载在第2周 |

### 学习目标

- 理解 SPA（单页应用）路由的概念
- 掌握 React Router v7 的基本用法
- 将单页应用拆分为多页面结构

### 引入的技术栈

- **React Router v7** — 声明式路由，无需额外安装后端服务

### 本周任务

#### 1.1 安装与基础路由配置（0.5天）

```bash
npm install react-router-dom
```

在 `App.tsx` 中配置路由：

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LayoutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**关键点：**
- `BrowserRouter` 使用 HTML5 History API，URL 看起来像普通路径（如 `/timesheet`）
- `Routes` 是路由容器，`Route` 定义路径与组件的映射
- `*` 通配符匹配所有未定义的路径（404 页面）

#### 1.2 创建页面文件结构（1天）

创建以下页面文件：

```
src/pages/
  LoginPage.tsx              # ① 登录页
  LayoutPage.tsx             # 带侧边栏的主布局
  TimeSheetPage.tsx          # ② 列表页（从第2阶段迁移，本周先放静态数据）
  TimeEntryDetailPage.tsx    # ③ 详情页（本周先放占位内容，数据加载在第2周）
  NotFoundPage.tsx           # 404 页
```

`LayoutPage` 包含侧边栏导航和主内容区：

```tsx
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

function LayoutPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { key: '/timesheet', label: '工时填报', icon: '📝' },
  ]

  return (
    <div className="layout">
      <aside className="sidebar">
        {menuItems.map(item => (
          <a
            key={item.key}
            onClick={() => navigate(item.key)}
            className={location.pathname === item.key ? 'active' : ''}
          >
            {item.icon} {item.label}
          </a>
        ))}
        <a onClick={() => navigate('/login')}>退出登录</a>
      </aside>
      <main className="content">
        <Outlet />  {/* 子路由渲染区 */}
      </main>
    </div>
  )
}
```

**关键点：**
- `useNavigate()` 获取导航函数，`navigate('/path')` 跳转页面
- `useLocation()` 获取当前路径，用于高亮当前菜单
- `<Outlet />` 是 React Router 提供的占位符，渲染当前路由匹配的子路由组件

#### 1.3 实现①登录页（1天）

创建 `LoginPage.tsx`，包含用户名/密码表单，提交后跳转到 `/timesheet`：

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // 模拟登录验证（后续接真实 API）
    if (username && password) {
      localStorage.setItem('token', 'mock-token')
      navigate('/timesheet')  // 登录成功跳转到列表页
    }
  }

  return (
    <div className="login-page">
      <h2>工时填报系统</h2>
      <form onSubmit={handleLogin}>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="用户名"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="密码"
        />
        <button type="submit">登录</button>
      </form>
    </div>
  )
}
```

**关键点：**
- 登录成功后将 token 存入 `localStorage`，后续请求和路由守卫都会读取它
- `navigate('/timesheet')` 登录后直接跳转到列表页

#### 1.4 实现路由守卫（0.5天）

未登录时访问受保护页面自动跳转到登录页：

```tsx
import { Navigate, useLocation } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token')
  const location = useLocation()

  if (!isAuthenticated) {
    // 跳转到登录页，同时保存当前路径，登录后返回
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
```

路由配置中使用：

```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<LayoutPage />}>
    <Route path="timesheet" element={<TimeSheetPage />} />
    <Route path="timesheet/:id" element={<TimeEntryDetailPage />} />
  </Route>
</Route>
```

**关键点：**
- `Navigate` 组件用于编程式跳转
- `state` 属性携带 `from` 路径，登录后可以返回用户原本想访问的页面
- `replace` 替换当前历史记录，避免用户点浏览器后退回到已登录页面

#### 1.5 实现③详情页路由（0.5天）

在 `TimeSheetPage`（列表页）中，点击列表项跳转到详情页：

```tsx
// 列表页中的跳转链接
import { Link } from 'react-router-dom'

{entries.map(entry => (
  <div key={entry.id}>
    <Link to={`/timesheet/${entry.id}`}>
      {entry.projectName}
    </Link>
  </div>
))}
```

在 `TimeEntryDetailPage` 中读取路由参数（数据加载留到第2周）：

```tsx
import { useParams } from 'react-router-dom'

function TimeEntryDetailPage() {
  const { id } = useParams()  // 获取 URL 中的 :id
  // TODO: 第2周接入数据加载

  return <div>工时详情页 — ID: {id}</div>
}
```

**关键点：**
- `:id` 是动态路由参数，URL 中 `/timesheet/abc123` 时 `useParams()` 返回 `{ id: 'abc123' }`
- `<Link>` 组件用于页面间导航，不刷新页面

#### 1.6 404 页面（0.5天）

创建 `NotFoundPage.tsx`，提示「页面不存在」并提供返回首页的链接。

### 第1周知识清单

| 概念 | 说明 | 对应 API |
|------|------|---------|
| 路由 | 将不同 URL 映射到不同组件 | `Routes`, `Route` |
| 浏览器路由 | 使用 History API 管理路由 | `BrowserRouter` |
| 编程式导航 | 代码中跳转页面 | `useNavigate()` |
| 当前路径 | 获取当前 URL 信息 | `useLocation()` |
| 子路由 | 在路由组件内嵌套路由 | `<Outlet />` |
| 动态路由 | URL 中包含可变参数 | `:id` 参数 + `useParams()` |
| 链接导航 | 声明式页面跳转 | `<Link>` |
| 路由守卫 | 拦截路由跳转做权限判断 | `Navigate` + 条件渲染 |

### 第1周产出确认

- [ ] ① **登录页**：用户名/密码表单，提交后跳转列表页，token 存入 localStorage
- [ ] ② **列表页路由**：`/timesheet` 路由配置完成，页面框架搭建（静态数据占位）
- [ ] ③ **详情页路由**：`/timesheet/:id` 动态路由配置完成，`useParams` 获取 ID（数据加载待第2周）
- [ ] 带侧边栏的主布局（导航高亮 + 退出登录）
- [ ] 路由守卫（未登录自动跳转登录页，登录后返回原页面）
- [ ] 404 页面

---

## 第2周：数据请求与增删改查

### 对应产出

| 产出序号 | 产出内容 | 本周完成度 |
|---------|---------|-----------|
| ④ | 增删改查 | ✅ 全部完成：列表查询、新增、编辑、删除 |

### 学习目标

- 掌握 Axios 发起 HTTP 请求
- 理解前后端数据交互的基本流程
- 实现完整的增删改查功能
- 掌握受控表单的最佳实践

### 引入的技术栈

- **Axios** — 基于 Promise 的 HTTP 客户端
- **React Hook Form** — 高性能表单库，减少不必要的重渲染

### 本周任务

#### 2.1 Axios 基础与封装（1天）

```bash
npm install axios
```

创建 `src/api/request.ts`，封装 Axios 实例：

```tsx
import axios from 'axios'

const request = axios.create({
  baseURL: '/api',       // 后端 API 前缀
  timeout: 10000,        // 超时时间
})

// 请求拦截器：自动携带 token
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  response => response.data,  // 直接返回响应数据
  error => {
    if (error.response?.status === 401) {
      // 未授权，清除 token 并跳转登录
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default request
```

**关键点：**
- `axios.create()` 创建独立实例，可配置默认 baseURL、timeout
- 拦截器在请求/响应到达业务代码前统一处理，避免重复逻辑
- `error.response?.status` 使用可选链，防止网络断开时 `error.response` 为 undefined

#### 2.2 封装 API 模块（0.5天）

```tsx
// src/api/timeEntry.ts
import request from './request'

// ④ 查：获取列表
export const getTimeEntries = () => request.get('/time-entries')

// ④ 查：获取详情
export const getTimeEntry = (id) => request.get(`/time-entries/${id}`)

// ④ 增：创建
export const createTimeEntry = (data) => request.post('/time-entries', data)

// ④ 改：更新
export const updateTimeEntry = (id, data) => request.put(`/time-entries/${id}`, data)

// ④ 删：删除
export const deleteTimeEntry = (id) => request.delete(`/time-entries/${id}`)
```

**关键点：**
- 每个 API 对应一个独立函数，职责清晰
- 返回的是 Promise，组件中用 `async/await` 调用

#### 2.3 实现②列表页数据加载（1天）

在 `TimeSheetPage` 中用 Axios 替换静态数据：

```tsx
import { useEffect, useState } from 'react'
import { getTimeEntries, deleteTimeEntry } from '../api/timeEntry'
import { Link } from 'react-router-dom'

function TimeSheetPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // 列表查询
  useEffect(() => {
    getTimeEntries()
      .then(data => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>加载中...</p>

  return (
    <div>
      <h2>工时列表</h2>
      <button onClick={() => {/* 新增，见 2.4 */}}>新增工时</button>
      {entries.map(entry => (
        <div key={entry.id}>
          <Link to={`/timesheet/${entry.id}`}>{entry.projectName}</Link>
          <span>{entry.hours} 小时</span>
          <span>{entry.approvalStatus}</span>
          <button onClick={() => handleDelete(entry.id)}>删除</button>
        </div>
      ))}
    </div>
  )

  async function handleDelete(id) {
    if (!confirm('确定删除？')) return
    await deleteTimeEntry(id)
    // 乐观更新：先更新 UI
    setEntries(entries.filter(e => e.id !== id))
  }
}
```

**关键点：**
- `loading` 状态在数据加载时显示提示，避免空白页面
- 删除操作使用「乐观更新」：先更新 UI 再调用 API，失败时回滚

#### 2.4 实现④新增/编辑表单（1.5天）

```bash
npm install react-hook-form
```

用 React Hook Form 创建新增/编辑表单：

```tsx
import { useForm } from 'react-hook-form'

function TimeEntryForm({ onSubmit, initialData }) {
  const {
    register,          // 注册输入框
    handleSubmit,      // 表单提交处理器
    reset,             // 重置表单
    formState: { errors, isSubmitting },  // 错误信息和提交状态
  } = useForm({
    defaultValues: initialData || {
      projectName: '',
      description: '',
      hours: 1,
    },
  })

  const on_submit = async (data) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <h3>{initialData ? '编辑工时' : '新增工时'}</h3>

      <input {...register('projectName', { required: '项目名称不能为空' })} />
      {errors.projectName && <span className="error">{errors.projectName.message}</span>}

      <textarea {...register('description')} />

      <input type="number" {...register('hours', {
        required: '工时必须填写',
        validate: val => parseFloat(val) > 0 || '工时必须大于 0'
      })} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '提交中...' : (initialData ? '保存修改' : '提交')}
      </button>
    </form>
  )
}
```

在 `TimeSheetPage` 中接入表单：

```tsx
const [showForm, setShowForm] = useState(false)
const [editingEntry, setEditingEntry] = useState(null)

async function handleFormSubmit(data) {
  if (editingEntry) {
    // ④ 改
    await updateTimeEntry(editingEntry.id, data)
  } else {
    // ④ 增
    await createTimeEntry(data)
  }
  setShowForm(false)
  setEditingEntry(null)
  // 重新加载列表
  const updated = await getTimeEntries()
  setEntries(updated)
}
```

**关键点：**
- `register` 注册输入框，自动监听 `onChange` 和 `onBlur`
- `required` 设置必填验证，`validate` 设置自定义验证规则
- `handleSubmit` 包装提交函数，自动执行验证，验证通过才调用
- `defaultValues` 设置初始值，编辑模式下传入 `initialData`
- `isSubmitting` 表示正在提交，用于禁用按钮防止重复提交

#### 2.5 实现③详情页数据加载（0.5天）

在 `TimeEntryDetailPage` 中根据路由参数 `id` 加载详情：

```tsx
import { useParams } from 'react-router-dom'
import { getTimeEntry } from '../api/timeEntry'

function TimeEntryDetailPage() {
  const { id } = useParams()
  const [entry, setEntry] = useState(null)

  useEffect(() => {
    getTimeEntry(id).then(setEntry)
  }, [id])

  if (!entry) return <p>加载中...</p>

  return (
    <div>
      <h2>{entry.projectName}</h2>
      <p>工时：{entry.hours} 小时</p>
      <p>描述：{entry.description}</p>
      <p>状态：{entry.approvalStatus}</p>
      <p>创建时间：{new Date(entry.createdAt).toLocaleString('zh-CN')}</p>
    </div>
  )
}
```

### 第2周知识清单

| 概念 | 说明 | 对应 API |
|------|------|---------|
| Axios 实例 | 创建可配置的 HTTP 客户端 | `axios.create()` |
| 请求拦截器 | 请求发出前统一处理（加 token） | `interceptors.request.use()` |
| 响应拦截器 | 收到响应后统一处理（错误处理） | `interceptors.response.use()` |
| 可选链 | 安全访问可能为 null/undefined 的属性 | `obj?.prop` |
| React Hook Form | 高性能表单库，减少重渲染 | `useForm`, `register`, `handleSubmit` |
| 表单验证 | 内置 required 和自定义 validate | `register('field', { required, validate })` |
| 乐观更新 | 先更新 UI 再调用 API | 直接更新 state |

### 第2周产出确认

- [ ] ④ **增删改查全部完成**：
  - [ ] **增**：新增工时表单（React Hook Form + 验证）
  - [ ] **删**：列表删除 + 确认弹窗 + 乐观更新
  - [ ] **改**：编辑表单（复用新增表单，传入 initialData）
  - [ ] **查**：列表数据加载 + 详情数据加载
- [ ] Axios 封装（拦截器 + 错误处理）
- [ ] API 模块（timeEntry）

---

## 第3周：导入导出

### 对应产出

| 产出序号 | 产出内容 | 本周完成度 |
|---------|---------|-----------|
| ⑤ | 导入导出功能 | ✅ 完成 Excel 导入 + 导出 |

### 学习目标

- 掌握 Excel 文件的读取与生成
- 理解 FileReader API 的用法
- 掌握 `memo` 组件级性能优化

### 引入的技术栈

- **xlsx (SheetJS)** — Excel 文件处理库
- **memo** — 组件级性能优化

### 本周任务

#### 3.1 安装 xlsx（0.5天）

```bash
npm install xlsx
```

#### 3.2 实现⑤导出功能（1天）

在列表页添加导出按钮：

```tsx
import * as XLSX from 'xlsx'

function handleExport() {
  // 将 entries 转换为二维数组（含表头）
  const data = [
    ['项目名称', '工时', '描述', '状态', '创建时间'],  // 表头
    ...entries.map(e => [
      e.projectName,
      e.hours,
      e.description,
      e.approvalStatus,
      new Date(e.createdAt).toLocaleString('zh-CN'),
    ]),
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(data)  // aoa = array of arrays
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '工时记录')

  // 触发浏览器下载
  XLSX.writeFile(workbook, `工时记录_${new Date().toLocaleDateString()}.xlsx`)
}

// 在列表页 JSX 中添加
<Button onClick={handleExport}>导出 Excel</Button>
```

**关键点：**
- `aoa_to_sheet()` 接收二维数组，第一行为表头
- `writeFile()` 触发浏览器下载，参数为 workbook 对象和文件名

#### 3.3 实现⑤导入功能（1天）

```tsx
function handleImport(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    // 转为 JSON，第一行作为键名
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    // 逐条调用 API 导入
    let successCount = 0
    jsonData.forEach(async (row) => {
      try {
        await createTimeEntry({
          projectName: row['项目名称'],
          hours: row['工时'],
          description: row['描述'],
        })
        successCount++
      } catch (err) {
        console.error('导入失败:', row)
      }
    })

    alert(`成功导入 ${successCount} 条记录`)
    // 重新加载列表
    const updated = await getTimeEntries()
    setEntries(updated)
  }
  reader.readAsArrayBuffer(file)
}

// 在 JSX 中添加
<input
  type="file"
  accept=".xlsx,.xls"
  onChange={handleImport}
  style={{ display: 'none' }}
  ref={fileInputRef}
/>
<Button onClick={() => fileInputRef.current.click()}>导入 Excel</Button>
```

**关键点：**
- `FileReader.readAsArrayBuffer()` 读取本地文件为二进制
- `XLSX.read()` 解析二进制数据
- `sheet_to_json()` 将表格转为 JSON 数组，第一行作为键名
- `accept=".xlsx,.xls"` 限制文件选择类型为 Excel 文件
- 隐藏 `<input type="file">`，通过按钮点击触发

#### 3.4 列表项性能优化 — memo（0.5天）

列表数据量大时，父组件每次渲染都会导致所有列表项重新渲染。用 `memo` 缓存列表项组件：

```tsx
import { memo } from 'react'

const TimeEntryItem = memo(function TimeEntryItem({ entry, onEdit, onDelete }) {
  return (
    <div className="entry-item">
      <span>{entry.projectName}</span>
      <span>{entry.hours}h</span>
      <button onClick={() => onEdit(entry)}>编辑</button>
      <button onClick={() => onDelete(entry.id)}>删除</button>
    </div>
  )
})
```

**关键点：**
- `memo` 做浅比较（shallow equal），props 引用不变时不重新渲染
- 适合展示型组件（不管理自身状态）
- 不要滥用，只在确认有性能问题后再加

### 第3周知识清单

| 概念 | 说明 | 对应 API |
|------|------|---------|
| Excel 导出 | 将数据转为 .xlsx 文件下载 | `XLSX.writeFile()` |
| Excel 导入 | 读取本地 Excel 文件解析为 JSON | `XLSX.read()`, `sheet_to_json()` |
| FileReader | 读取本地文件 | `FileReader.readAsArrayBuffer()` |
| 组件缓存 | props 不变时不重新渲染 | `memo()` |
| 浅比较 | 只比较第一层属性（引用比较） | `memo` 内部机制 |

### 第3周产出确认

- [ ] ⑤ **导入导出功能完成**：
  - [ ] **导出**：列表数据导出为 .xlsx 文件，含表头
  - [ ] **导入**：选择 Excel 文件，解析为 JSON 后逐条调用 API 导入
- [ ] 列表项使用 `memo` 包裹优化性能

---

## 第4周：审批流程

### 对应产出

| 产出序号 | 产出内容 | 本周完成度 |
|---------|---------|-----------|
| ⑥ | 提交-审批-驳回-重填流程管理 | ✅ 全部完成 |

### 学习目标

- 理解 Redux Toolkit 的状态管理思想
- 掌握 Redux Toolkit 的基本用法
- 使用 Ant Design 组件库快速搭建界面
- 实现完整的审批流程

### 引入的技术栈

- **Redux Toolkit** — Redux 官方推荐的状态管理方案，内置 Immer
- **Ant Design** — 企业级 UI 组件库

### 本周任务

#### 4.1 安装与配置 Redux Toolkit（0.5天）

```bash
npm install @reduxjs/toolkit react-redux
```

创建 `src/store/index.ts`：

```tsx
import { configureStore } from '@reduxjs/toolkit'
import timeEntryReducer from './timeEntrySlice'

export const store = configureStore({
  reducer: {
    timeEntry: timeEntryReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

**关键点：**
- `configureStore` 自动集成了 Redux DevTools、Thunk 中间件、Immer
- 不需要手写 `combineReducers`，直接传入对象即可

#### 4.2 编写 timeEntry Slice（1天）

```tsx
// src/store/timeEntrySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getTimeEntries as apiGet,
  approveTimeEntry as apiApprove,
  rejectTimeEntry as apiReject,
} from '../api/timeEntry'

// 异步 thunk：获取列表
export const fetchTimeEntries = createAsyncThunk(
  'timeEntry/fetch',
  async () => await apiGet()
)

// 异步 thunk：审批通过
export const approveEntry = createAsyncThunk(
  'timeEntry/approve',
  async (id) => {
    await apiApprove(id)
    return id
  }
)

// 异步 thunk：驳回
export const rejectEntry = createAsyncThunk(
  'timeEntry/reject',
  async ({ id, reason }) => {
    await apiReject(id, reason)
    return id
  }
)

const timeEntrySlice = createSlice({
  name: 'timeEntry',
  initialState: {
    entries: [],
    loading: false,
    error: null,
  },
  reducers: {
    // 同步操作：删除
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter(e => e.id !== action.payload)
    },
    // 同步操作：更新审批状态（用于乐观更新）
    updateEntryStatus: (state, action) => {
      const { id, status } = action.payload
      const entry = state.entries.find(e => e.id === id)
      if (entry) entry.approvalStatus = status
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTimeEntries.pending, state => { state.loading = true })
      .addCase(fetchTimeEntries.fulfilled, (state, action) => {
        state.loading = false
        state.entries = action.payload
      })
      .addCase(fetchTimeEntries.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // 审批通过后重新加载列表
      .addCase(approveEntry.fulfilled, (state, action) => {
        const entry = state.entries.find(e => e.id === action.payload)
        if (entry) entry.approvalStatus = '已通过'
      })
      // 驳回后重新加载列表
      .addCase(rejectEntry.fulfilled, (state, action) => {
        const entry = state.entries.find(e => e.id === action.payload)
        if (entry) entry.approvalStatus = '已驳回'
      })
  },
})

export const { deleteEntry, updateEntryStatus } = timeEntrySlice.actions
export default timeEntrySlice.reducer
```

#### 4.3 在组件中接入 Redux（0.5天）

`App.tsx` 最外层包裹 Provider：

```tsx
import { Provider } from 'react-redux'
import { store } from './store'

<Provider store={store}>
  <BrowserRouter>
    <Routes>...</Routes>
  </BrowserRouter>
</Provider>
```

组件中读取和派发：

```tsx
import { useSelector, useDispatch } from 'react-redux'
import { fetchTimeEntries, approveEntry, rejectEntry } from '../store/timeEntrySlice'
import type { RootState, AppDispatch } from '../store'

function TimeSheetPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { entries, loading } = useSelector((state: RootState) => state.timeEntry)

  useEffect(() => {
    dispatch(fetchTimeEntries())
  }, [dispatch])

  const handleApprove = (id) => {
    dispatch(approveEntry(id))
  }

  const handleReject = (id) => {
    dispatch(rejectEntry({ id, reason: '信息不完整' }))
  }
}
```

**关键点：**
- `Provider` 将 store 注入所有子组件
- `useSelector` 从 store 中选取数据
- `useDispatch` 获取 dispatch 函数，用于派发 action
- `createAsyncThunk` 处理异步操作，自动生成 `pending/fulfilled/rejected` 三种 action

#### 4.4 安装 Ant Design（0.5天）

```bash
npm install antd
```

在 `main.tsx` 中引入全局样式：

```tsx
import 'antd/dist/reset.css'
```

#### 4.5 用 Ant Design 替换原生组件（1天）

将表单、列表等替换为 Ant Design 组件：

```tsx
import { Form, Input, InputNumber, Button, Table, Space, Tag, Popconfirm, message } from 'antd'

// 列表页使用 Table
const columns = [
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
  { title: '工时', dataIndex: 'hours', key: 'hours' },
  { title: '状态', dataIndex: 'approvalStatus', key: 'approvalStatus',
    render: (status) => {
      const colorMap = { '待审批': 'orange', '已通过': 'green', '已驳回': 'red' }
      return <Tag color={colorMap[status]}>{status}</Tag>
    }
  },
  { title: '操作', key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => navigate(`/timesheet/${record.id}`)}>详情</Button>
        <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="link" onClick={() => handleApprove(record.id)}>通过</Button>
        <Popconfirm title="确定驳回？" onConfirm={() => handleReject(record.id)}>
          <Button type="link" danger>驳回</Button>
        </Popconfirm>
      </Space>
    )
  },
]

<Table dataSource={entries} columns={columns} rowKey="id" />
```

**关键点：**
- `Tag` 用于展示审批状态标签，不同状态不同颜色
- `Popconfirm` 提供删除/驳回确认框
- `message.success()` 显示成功提示

#### 4.6 实现⑥审批流程（1天）

完整的审批流程：提交 → 待审批 → 已通过/已驳回 → 重填

```tsx
// 详情页中的审批操作
function TimeEntryDetailPage() {
  const { id } = useParams()
  const [entry, setEntry] = useState(null)
  const dispatch = useDispatch<AppDispatch>()

  const handleApprove = async () => {
    if (!confirm('确定通过？')) return
    dispatch(approveEntry(id))
    message.success('审批通过')
  }

  const handleReject = async () => {
    const reason = prompt('请输入驳回原因：')
    if (!reason) return
    dispatch(rejectEntry({ id, reason }))
    message.info('已驳回，请重新填写')
  }

  const handleRefill = () => {
    // 重填：跳转到编辑页，清空状态为「待审批」
    navigate(`/timesheet/${id}/edit?refill=true`)
  }

  if (!entry) return <p>加载中...</p>

  return (
    <div>
      <h2>{entry.projectName}</h2>
      <p>状态：<Tag color={entry.approvalStatus === '已通过' ? 'green' : entry.approvalStatus === '已驳回' ? 'red' : 'orange'}>
        {entry.approvalStatus}
      </Tag></p>

      {/* 待审批状态下显示审批操作 */}
      {entry.approvalStatus === '待审批' && (
        <Space>
          <Button type="primary" onClick={handleApprove}>审批通过</Button>
          <Button danger onClick={handleReject}>驳回</Button>
        </Space>
      )}

      {/* 已驳回状态下显示重填按钮 */}
      {entry.approvalStatus === '已驳回' && (
        <Button onClick={handleRefill}>重新填报</Button>
      )}
    </div>
  )
}
```

**审批状态流转图：**

```
新增提交 → 待审批 → 审批通过 → 结束
              ↓
           已驳回 → 重新填报 → 待审批（循环）
```

**关键点：**
- 审批通过/驳回后通过 Redux 更新状态，列表自动刷新
- 已驳回的记录显示「重新填报」按钮，点击后跳转到编辑页
- 驳回时弹出 prompt 输入驳回原因

### 第4周知识清单

| 概念 | 说明 | 对应 API |
|------|------|---------|
| Store | 唯一的状态容器 | `configureStore()` |
| Slice | 包含 reducer 和 actions 的模块 | `createSlice()` |
| AsyncThunk | 处理异步操作的 action | `createAsyncThunk()` |
| Selector | 从 store 中选取数据 | `useSelector()` |
| Dispatch | 派发 action 更新状态 | `useDispatch()` |
| Provider | 将 store 注入组件树 | `<Provider store={store} />` |
| Ant Design Table | 数据表格 | `Table`, `columns`, `render` |
| Ant Design Tag | 标签组件 | `Tag` |
| Ant Design Popconfirm | 气泡确认框 | `Popconfirm` |

### 第4周产出确认

- [ ] ⑥ **审批流程完成**：
  - [ ] 提交工时 → 状态为「待审批」
  - [ ] 审批通过 → 状态变为「已通过」
  - [ ] 驳回 → 状态变为「已驳回」，显示「重新填报」按钮
  - [ ] 重新填报 → 编辑后再次提交，状态回到「待审批」
- [ ] Redux Store 配置 + timeEntry Slice
- [ ] 使用 Ant Design 重写列表和表单

---

## 第5周：用户管理

### 对应产出

| 产出序号 | 产出内容 | 本周完成度 |
|---------|---------|-----------|
| ⑦ | 用户管理 | ✅ 完成用户增删改查 |

### 学习目标

- 实现用户管理页面（增删改查）
- 掌握用户数据的 Redux 管理
- 使用 Ant Design Modal 实现弹窗表单

### 引入的技术栈

- Redux Toolkit（新增 user slice）
- Ant Design（Modal、Select 等）

### 本周任务

#### 5.1 用户 API 模块（0.5天）

```tsx
// src/api/user.ts
import request from './request'

export const getUsers = () => request.get('/users')
export const createUser = (data) => request.post('/users', data)
export const updateUser = (id, data) => request.put(`/users/${id}`, data)
export const deleteUser = (id) => request.delete(`/users/${id}`)
```

#### 5.2 用户 Redux Slice（0.5天）

```tsx
// src/store/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUsers as apiGetUsers } from '../api/user'

export const fetchUsers = createAsyncThunk('user/fetch', async () => await apiGetUsers())

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    currentUser: null,  // 当前登录用户
    loading: false,
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload)
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload
    })
  },
})

export const { setCurrentUser, deleteUser } = userSlice.actions
export default userSlice.reducer
```

在 `src/store/index.ts` 中注册：

```tsx
import userReducer from './userSlice'

export const store = configureStore({
  reducer: {
    timeEntry: timeEntryReducer,
    user: userSlice.reducer,
  },
})
```

#### 5.3 实现⑦用户管理页面（2天）

创建 `UserManagePage.tsx`：

```tsx
import { Table, Button, Modal, Form, Input, Select, Popconfirm, message } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { fetchUsers, deleteUser } from '../store/userSlice'

const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
]

function UserManagePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading } = useSelector((state: RootState) => state.user)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleAdd = () => {
    setEditingUser(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    form.setFieldsValue(user)
    setModalVisible(true)
  }

  const handleSubmit = async (values) => {
    if (editingUser) {
      await updateUser(editingUser.id, values)
      message.success('更新成功')
    } else {
      await createUser(values)
      message.success('创建成功')
    }
    setModalVisible(false)
    dispatch(fetchUsers())  // 重新加载列表
  }

  const handleDelete = (id) => {
    dispatch(deleteUser(id))
    message.success('删除成功')
  }

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '角色', dataIndex: 'role', key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>{role}</Tag>
      )
    },
    { title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ]

  return (
    <div>
      <h2>用户管理</h2>
      <Button type="primary" onClick={handleAdd}>新增用户</Button>

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
```

#### 5.4 登录时设置当前用户（0.5天）

在 `LoginPage` 登录成功后，将用户信息存入 Redux：

```tsx
import { setCurrentUser } from '../store/userSlice'

const handleLogin = async (e) => {
  e.preventDefault()
  const user = await apiLogin({ username, password })
  localStorage.setItem('token', user.token)
  dispatch(setCurrentUser({ id: user.id, username: user.username, role: user.role }))
  navigate('/timesheet')
}
```

### 第5周知识清单

| 概念 | 说明 | 对应 API |
|------|------|---------|
| 多 Slice | 一个 store 管理多个模块 | `configureStore({ reducer: { ... } })` |
| 用户状态 | 存储当前登录用户信息 | `currentUser` |
| Ant Design Modal | 弹窗组件 | `Modal` |
| Ant Design Select | 下拉选择框 | `Select`, `options` |
| 表格分页 | 列表分页展示 | `Table pagination` |

### 第5周产出确认

- [ ] ⑦ **用户管理完成**：
  - [ ] 用户列表展示（含角色标签）
  - [ ] 新增用户（Modal 弹窗表单）
  - [ ] 编辑用户（预填数据）
  - [ ] 删除用户（确认弹窗）
- [ ] 用户 Redux Slice（含 currentUser）
- [ ] 登录时设置当前用户信息

---

## 第6周：权限管理与工程化

### 对应产出

| 产出序号 | 产出内容 | 本周完成度 |
|---------|---------|-----------|
| ⑧ | 权限管理 | ✅ 完成路由守卫 + 按钮级权限 |
| — | 全功能打磨 | ✅ 性能优化 + 代码规范 + 打包部署 |

### 学习目标

- 实现基于角色的权限控制
- 理解路由守卫的高级用法
- 掌握 `useMemo`、`useCallback` 性能优化
- 完成项目工程化配置

### 引入的技术栈

- 路由守卫（RoleGuard）
- 权限组件（Permission）
- `useMemo`、`useCallback`
- ESLint / Prettier / Vite 配置

### 本周任务

#### 6.1 实现⑧路由级权限守卫（1天）

在第1周的登录守卫基础上，增加角色权限判断：

```tsx
function RoleGuard({ requiredRole, children }) {
  const user = useSelector((state: RootState) => state.user.currentUser)

  if (!user) return <Navigate to="/login" replace />
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
```

路由中使用：

```tsx
<Route element={<RoleGuard requiredRole="admin" />}>
  <Route path="users" element={<UserManagePage />} />
</Route>
```

同时创建 `UnauthorizedPage.tsx`（403 页面），提示「无权访问」。

**关键点：**
- `RoleGuard` 包裹路由，检查 `currentUser.role` 是否符合 `requiredRole`
- 不符合时跳转到 403 页面

#### 6.2 实现⑧按钮级权限组件（0.5天）

```tsx
function Permission({ requiredRole, children }) {
  const user = useSelector((state: RootState) => state.user.currentUser)

  if (!user || user.role !== requiredRole) {
    return null  // 不渲染子组件
  }

  return children
}

// 使用：只有管理员能看到「新增用户」按钮
<Permission requiredRole="admin">
  <Button onClick={handleAdd}>新增用户</Button>
</Permission>
```

#### 6.3 实现⑧动态菜单权限（0.5天）

根据用户角色动态渲染侧边栏菜单：

```tsx
const allMenus = [
  { key: '/timesheet', label: '工时填报', icon: '📝', roles: ['admin', 'user'] },
  { key: '/users', label: '用户管理', icon: '👥', roles: ['admin'] },
]

const visibleMenus = allMenus.filter(menu => menu.roles.includes(user?.role))
```

#### 6.4 性能优化 — useMemo + useCallback（1天）

```tsx
// useMemo：列表过滤
const filteredEntries = useMemo(() => {
  return entries.filter(entry => {
    if (statusFilter && entry.approvalStatus !== statusFilter) return false
    if (searchText && !entry.projectName.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })
}, [entries, statusFilter, searchText])

// useCallback：回调函数缓存
const handleEdit = useCallback((entry) => {
  navigate(`/timesheet/${entry.id}/edit`)
}, [navigate])

const handleDelete = useCallback((id) => {
  dispatch(deleteEntry(id))
}, [dispatch])
```

**三者对比：**

| Hook | 缓存什么 | 何时使用 |
|------|---------|---------|
| `memo` | 组件渲染结果 | 列表项、频繁更新的父组件下的子组件 |
| `useMemo` | 计算结果（值） | 列表过滤、数据转换、耗时计算 |
| `useCallback` | 函数引用 | 传给 memo 子组件的回调函数 |

#### 6.5 工程化配置（1.5天）

##### 6.5.1 ESLint 检查

```bash
npm run lint
```

根据提示修复代码问题。

##### 6.5.2 Prettier 格式化

```bash
npm run format
```

##### 6.5.3 Vite 配置优化

编辑 `vite.config.ts`：

```tsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 代码分割：将第三方库单独打包
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['antd', '@ant-design/icons'],
        },
      },
    },
  },
})
```

##### 6.5.4 环境变量

创建 `.env.development` 和 `.env.production`：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

在代码中使用 `import.meta.env.VITE_API_BASE_URL`。

##### 6.5.5 打包部署

```bash
npm run build    # 生产构建，输出到 dist/ 目录
```

### 第6周知识清单

| 概念 | 说明 | 对应 API |
|------|------|---------|
| 路由级权限 | 保护整个页面 | `<RoleGuard />` |
| 按钮级权限 | 控制按钮显隐 | `<Permission />` |
| 动态菜单 | 根据角色显示不同导航 | `filter()` 过滤 |
| 值缓存 | 依赖不变时不重新计算 | `useMemo()` |
| 函数缓存 | 依赖不变时返回同一引用 | `useCallback()` |
| 路径别名 | 简化 import 路径 | `resolve.alias` |
| 代码分割 | 第三方库单独打包 | `manualChunks` |
| 环境变量 | 不同环境不同配置 | `.env.*` |

### 第6周产出确认

- [ ] ⑧ **权限管理完成**：
  - [ ] 路由级守卫：非管理员无法访问 `/users` 页面
  - [ ] 按钮级权限：非管理员看不到「新增用户」按钮
  - [ ] 动态菜单：非管理员侧边栏不显示「用户管理」
- [ ] 403 无权访问页面
- [ ] 列表过滤使用 `useMemo`
- [ ] 回调函数使用 `useCallback`
- [ ] ESLint 检查通过
- [ ] 代码格式化完成
- [ ] Vite 配置优化（别名 + 代码分割）
- [ ] 环境变量配置
- [ ] 生产构建成功

---

## 附录：阶段产出与周次对照表

| 产出序号 | 产出内容 | 实现周次 | 核心技术 |
|---------|---------|---------|---------|
| ① | 登录 | 第1周 | React Router、localStorage |
| ② | 列表页 | 第1周（结构）+ 第2周（数据） | React Router + Axios |
| ③ | 详情页 | 第1周（结构）+ 第2周（数据） | 动态路由 + Axios |
| ④ | 增删改查 | 第2周 | Axios + React Hook Form |
| ⑤ | 导入导出 | 第3周 | xlsx (SheetJS) |
| ⑥ | 审批流程 | 第4周 | Redux Toolkit + Ant Design |
| ⑦ | 用户管理 | 第5周 | Redux（user slice）+ Ant Design |
| ⑧ | 权限管理 | 第6周 | 路由守卫 + Permission 组件 |

## 附录：完整技术栈总览

| 类别 | 技术 | 用途 |
|------|------|------|
| 构建工具 | Vite | 开发服务器、打包 |
| 语言 | TypeScript | 类型安全 |
| 路由 | React Router v7 | 页面路由、导航 |
| HTTP 客户端 | Axios | 数据请求 |
| 状态管理 | Redux Toolkit | 全局状态管理 |
| UI 组件库 | Ant Design | 表单、表格、弹窗等 |
| 表单库 | React Hook Form | 表单验证、管理 |
| Excel 处理 | xlsx (SheetJS) | 导入导出 Excel |
| 代码检查 | oxlint | 代码质量 |
| 代码格式化 | Prettier | 代码风格统一 |

---

## 学习建议

1. **严格按周推进**：每周的产出是建立在上一周基础上的，不要跳周
2. **先跑通再优化**：第一遍实现功能时不必追求完美，先让功能跑起来
3. **每周结束时对照「产出确认」清单**打勾，确保本周目标全部完成
4. **善用浏览器开发者工具**：Network 面板看请求，React DevTools 看组件树
5. **不要急于引入新工具**：本周计划已包含所有必要技术，不要额外添加

> 完成本阶段后，你将具备开发中后台管理系统的能力，为第4阶段 Taro 小程序开发打下坚实基础。