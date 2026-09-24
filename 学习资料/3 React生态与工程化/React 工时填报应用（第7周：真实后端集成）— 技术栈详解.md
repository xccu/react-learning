# React 工时填报应用（第7周：真实后端集成）— 技术栈详解

> 本文聚焦第 7 周「真实后端集成」中**新增的业务逻辑与架构变更**，不涉及前 6 周已讲过的 React、TypeScript、Redux Toolkit、Ant Design、React Hook Form、RBAC 权限管理等基础知识。每个知识点均结合第 7 周的真实代码，包含定义、示例、使用效果和注意事项。

> **参考文档：** 本文涉及的技术栈参考 `学习资料/3 React生态与工程化/` 文件夹中的以下文档：
>
> | 技术 | 参考文档 | 对应章节 |
> |------|---------|---------|
> | FastAPI | [`web-api-design.md`](web-api-design.md) | RESTful API 设计、Pydantic 模型、JSON 持久化 |
> | Axios | [`3.2 Axios.md`](3.2%20Axios.md) | 拦截器、错误处理、类型化请求 |
> | Vite | [`3.10 Vite.md`](3.10%20Vite.md) | 开发服务器代理配置 |
> | Redux Toolkit | [`3.6 Redux Toolkit.md`](3.6%20Redux%20Toolkit.md) | `createAsyncThunk`、`extraReducers` |

> **当前项目版本：** React `19.2.7`，TypeScript `~6.0.2`，Python 3.12，FastAPI `0.115.0`，依赖全部沿用第 1-6 周。

> **当前项目范围说明：** 本次在第 6 周基础上新增 FastAPI Web API Server（Python）、Vite 开发代理配置、移除所有 Mock 代码、启用真实 HTTP 客户端调用。前端与后端通过 RESTful API 通信，数据持久化到 JSON 文件。

> **启动说明：** 第 7 周需要同时启动后端（FastAPI）和前端（Vite），详见「三、其他实现 → 2. 启动流程」。

---

## 目录

- [一、本周新增内容概览](#一本周新增内容概览)
- [二、知识点详解](#二知识点详解)
  - [1. Redux thunks 对接真实 API](#1-redux-thunks-对接真实-api)
  - [2. react-app 项目结构](#2-react-app-项目结构)
  - [3. FastAPI Web API Server 架构](#3-fastapi-web-api-server-架构)
  - [4. Vite 开发代理配置](#4-vite-开发代理配置)
  - [5. 移除 Mock 代码](#5-移除-mock-代码)
  - [6. httpClient 拦截器](#6-httpclient-拦截器)
  - [7. 登录响应 JSON 格式与 Token 存储](#7-登录响应-json-格式与-token-存储)
  - [8. JSON 数据持久化](#8-json-数据持久化)
  - [9. 数据备份与恢复](#9-数据备份与恢复)
- [三、其他实现](#三其他实现)
  - [1. 前后端对接清单](#1-前后端对接清单)
  - [2. 启动流程](#2-启动流程)
  - [3. 开发环境 vs 生产环境](#3-开发环境-vs-生产环境)
- [四、知识进阶点](#四知识进阶点)
  - [1. FastAPI 自动生成交互式文档](#1-fastapi-自动生成交互式文档)
  - [2. 从 Mock 到真实 API 的迁移策略](#2-从-mock-到真实-api-的迁移策略)
- [五、第 7 周需求与技术栈对照检查](#五第-7-周需求与技术栈对照检查)
  - [技术栈覆盖](#技术栈覆盖)
  - [第 7 周产出确认](#第-7-周产出确认)
  - [边界与说明](#边界与说明)
- [六、权限控制方案详解](#六权限控制方案详解)
  - [6.1 权限模型：RBAC](#61-权限模型rbac)
  - [6.2 权限数据流](#62-权限数据流)
  - [6.3 权限存储](#63-权限存储)
  - [6.4 路由级权限控制](#64-路由级权限控制)
  - [6.5 组件级权限控制](#65-组件级权限控制)
  - [6.6 HTTP 层权限控制](#66-http-层权限控制)
  - [6.7 权限数据读写完整流程](#67-权限数据读写完整流程)
  - [6.8 权限控制的三层架构](#68-权限控制的三层架构)
  - [6.9 关键文件索引](#69-关键文件索引)
- [七、学习路径建议](#七学习路径建议)

---

## 一、本周新增内容概览

第 7 周的核心变更是**从 Mock 架构迁移到真实后端**，涉及前端和后端两端的改造：

| 新增/变更内容 | 涉及文件 | 核心概念 |
|--------------|---------|---------|
| FastAPI Web API Server | `web-api-server/main.py` | Python FastAPI 框架、Pydantic 模型、RESTful 路由 |
| JSON 数据持久化 | `web-api-server/data/*.json` | 文件读写、数据模型映射 |
| 数据备份与恢复 | `web-api-server/backup_data.py` / `restore_data.bat` | 数据安全管理 |
| Vite 开发代理 | `react-app/vite.config.ts` | `server.proxy` 配置、CORS 解决 |
| 移除 Mock 代码 | 删除 `src/api/mockApi.ts`、`src/api/mockAdapter.ts` | 依赖清理、路由清理 |
| httpClient 增强 | `react-app/src/api/httpClient.ts` | 请求/响应拦截器、401/403 处理 |
| Redux thunks 对接真实 API | `react-app/src/store/*.ts` | thunks 调用 `timeEntryApi.ts` / `userApi.ts` / `roleApi.ts`（已解耦） |

---

## 二、知识点详解

### 1. Redux thunks 对接真实 API

#### 定义

第 7 周前端 Redux thunks 不再调用 Mock API，而是通过 `timeEntryApi.ts` / `userApi.ts` / `roleApi.ts` 调用真实 FastAPI 后端。由于第 6 周已经将 thunks 与 API 层解耦，此处无需修改 Redux 代码。

#### 数据流

```
组件 dispatch(thunk)
  → thunk 内部调用 timeEntryApi.ts 函数
  → timeEntryApi.ts 使用 httpClient 发送 HTTP 请求
  → Vite 代理转发到 FastAPI
  → FastAPI 处理请求，读写 JSON 文件
  → 返回 JSON 响应
  → thunk 的 extraReducers 更新 Redux state
  → 组件自动重新渲染
```

#### 示例 — `fetchEntries` thunk（无需修改）

```ts
// timesheetSlice.ts
export const fetchEntries = createAsyncThunk<TimeEntry[]>('timesheet/fetchEntries', async () => {
  return getEntriesApi()  // 调用 timeEntryApi.ts
})

// extraReducers 处理状态
builder
  .addCase(fetchEntries.fulfilled, (state, action) => {
    state.loading = false
    state.entries = action.payload
  })
```

- **`getEntriesApi`**：导入自 `timeEntryApi.ts`，内部使用 `httpClient.get('/time-entries')`
- **Mock 时代**：`axios-mock-adapter` 拦截请求，在内存中返回数据
- **真实 API 时代**：请求发送到 `localhost:8000/api/time-entries`，FastAPI 从 JSON 文件读取数据

#### 注意事项

- Redux 代码不变的关键在于**依赖倒置**：thunks 只依赖 `timeEntryApi.ts` 的函数签名，不关心底层是 Mock 还是真实 API。
- 如果 API 返回的数据格式与 TypeScript 类型定义不一致，TypeScript 编译期不会报错（运行时才会出错），需要手动验证。

#### 变更：httpClient 对接真实后端

Mock 时代，`axios-mock-adapter` 在内存中拦截请求并返回模拟数据；第 7 周移除 Mock 后，`httpClient` 直接通过 Vite 代理将请求发送到 FastAPI 后端。`httpClient.ts` 的核心配置保持不变：

```ts
// react-app/src/api/httpClient.ts
import axios from 'axios'
import { isLoggedIn, logout } from '../utils/auth'

const httpClient = axios.create({
  baseURL: '/api',       // 所有请求自动加上 /api 前缀
  timeout: 10000,        // 10 秒超时
})

// 请求拦截器：登录后统一附加凭证到请求头
httpClient.interceptors.request.use((config) => {
  if (isLoggedIn()) {
    config.headers.Authorization = 'Bearer mock-token'  // 开发环境占位符
  }
  return config
})

// 响应拦截器：401 清除登录态并跳转登录页；403 跳转 403 页面
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status
    if (status === 401) {
      logout()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    if (status === 403) {
      if (!window.location.pathname.startsWith('/unauthorized')) {
        window.location.href = '/unauthorized'
      }
    }
    const message: string = error.response?.data?.message ?? error.message ?? '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default httpClient
```

- **`baseURL: '/api'`**：配合 Vite 代理，所有请求自动转发到 `localhost:8000`，前端代码无需写完整 URL
- **`timeout: 10000`**：10 秒超时，避免请求长时间挂起
- **请求拦截器**：已登录用户在请求头附加 `Authorization: Bearer mock-token`，FastAPI 可根据此标识进行认证（当前为占位符）
- **响应拦截器**：
  - `401` → 调用 `logout()` 清除登录态，跳转 `/login`
  - `403` → 跳转 `/unauthorized`
  - 其他错误 → 提取响应体中的 `message` 字段，抛出可展示的错误信息
- **`error.response?.status`**：使用可选链防止网络错误时 `error.response` 为 `undefined` 导致崩溃

#### 变更：API 访问层按业务模块拆分

第 7 周将 `timeEntryApi.ts` 按业务模块拆分为三个独立文件，Redux thunks 和页面组件的 import 路径同步更新。

**拆分后的文件结构：**

| 文件 | 职责 | 导出函数 |
|------|------|---------|
| `src/api/timeEntryApi.ts` | 工时记录 API | `getEntries`、`queryEntries`、`getEntryById`、`addEntry`、`updateEntry`、`deleteEntry`、`addEntries`、`submitEntry`、`approveEntry`、`rejectEntry` |
| `src/api/userApi.ts` | 用户 API | `getUsers`、`queryUsers`、`getUserById`、`addUser`、`updateUser`、`deleteUser`、`login` |
| `src/api/roleApi.ts` | 角色 API | `getRoles`、`getRoleById`、`createRole`、`updateRole`、`deleteRole` |

**各文件导入方：**

| 文件 | 从 timeEntryApi 导入 | 从 userApi 导入 | 从 roleApi 导入 |
|------|---------------------|-----------------|-----------------|
| `store/timesheetSlice.ts` | 工时 CRUD + 审批函数 | — | — |
| `store/userSlice.ts` | — | 用户 CRUD + login | 角色 CRUD |
| `pages/TimeEntryListPage.tsx` | `addEntries`、`queryEntries` | — | — |
| `pages/UserListPage.tsx` | — | `queryUsers` | — |

**示例 — `timeEntryApi.ts`（工时记录模块）：**

```ts
// react-app/src/api/timeEntryApi.ts
import httpClient from './httpClient'
import type { TimeEntry, TimeEntryQuery } from '../types/timeEntry'

export async function getEntries(): Promise<TimeEntry[]> {
  const { data } = await httpClient.get<TimeEntry[]>('/time-entries')
  return data
}

export async function addEntry(entry: Omit<TimeEntry, 'id' | 'createdAt'>): Promise<TimeEntry> {
  const { data } = await httpClient.post<TimeEntry>('/time-entries', entry)
  return data
}

export async function approveEntry(id: string): Promise<TimeEntry> {
  const { data } = await httpClient.put<TimeEntry>(`/time-entries/${id}/approve`)
  return data
}
```

**示例 — `userApi.ts`（用户模块）：**

```ts
// react-app/src/api/userApi.ts
import httpClient from './httpClient'
import type { User, UserQuery } from '../types/timeEntry'

export async function getUsers(): Promise<User[]> {
  const { data } = await httpClient.get<User[]>('/users')
  return data
}

export async function login(username: string, password: string): Promise<User> {
  const { data } = await httpClient.post<User>('/users/login', { username, password })
  return data
}
```

**示例 — `roleApi.ts`（角色模块）：**

```ts
// react-app/src/api/roleApi.ts
import httpClient from './httpClient'
import type { Role } from '../types/timeEntry'

export async function getRoles(): Promise<Role[]> {
  const { data } = await httpClient.get<Role[]>('/roles')
  return data
}

export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const { data } = await httpClient.post<Role>('/roles', role)
  return data
}
```

- **按业务边界拆分**：工时、用户、角色各自独立文件，职责清晰，避免单文件过大
- **函数签名一致**：拆分后各函数签名与之前 `mockApi.ts` 完全一致，Redux thunks 只需更新 import 路径
- **底层切换**：之前被 `axios-mock-adapter` 拦截在内存中处理，现在直接通过 `httpClient` 发送 HTTP 请求到 FastAPI
- **类型安全**：`httpClient.get<T>(...)` 使用泛型指定响应数据类型，TypeScript 在编译期验证返回数据的类型

#### Mock → 真实 API 对比

| 维度 | Mock 时代 | 真实 API 时代 |
|------|----------|--------------|
| 请求拦截 | `axios-mock-adapter` 在内存中拦截 | `httpClient` 通过 Vite 代理转发到 FastAPI |
| 数据源 | 内存中的模拟数据数组 | FastAPI 从 JSON 文件读取/写入 |
| 认证头 | 无 | 请求拦截器自动附加 `Authorization: Bearer mock-token` |
| 错误处理 | Mock 适配器返回模拟错误 | 响应拦截器处理 401/403/网络错误 |
| Redux 代码 | 无需修改 | 无需修改（依赖倒置） |
| API 文件 | `timeEntryApi.ts` 单一文件 | 按业务拆分为 `timeEntryApi.ts` + `userApi.ts` + `roleApi.ts` |

---

### 2. react-app 项目结构

#### 定义

`react-app` 是前端 React 应用目录，使用 Vite + TypeScript 构建，包含所有页面组件、状态管理、API 调用和样式配置。

#### 项目结构

```
react-app/
├── index.html                  # HTML 入口
├── package.json                # Node.js 依赖
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置（含开发代理）
├── public/                     # 静态资源
└── src/
    ├── main.tsx                # React 应用入口，渲染 Router + Provider
    ├── App.tsx                 # 根组件，定义路由
    ├── api/                    # API 调用层
    │   ├── httpClient.ts       # Axios 实例 + 拦截器
    │   ├── timeEntryApi.ts     # 工时记录 API 函数
    │   ├── userApi.ts          # 用户 API 函数
    │   └── roleApi.ts          # 角色 API 函数
    ├── components/             # 通用组件
    │   ├── ProtectedRoute.tsx  # 路由守卫
    │   └── ...
    ├── pages/                  # 页面组件
    │   ├── Login.tsx           # 登录页
    │   ├── Timesheet.tsx       # 工时填报页
    │   ├── UserManagement.tsx  # 用户管理页
    │   ├── RoleManagement.tsx  # 角色管理页
    │   └── ...
    ├── store/                  # Redux 状态管理
    │   ├── store.ts            # Redux store 配置
    │   ├── timesheetSlice.ts   # 工时记录 slice（含 thunks）
    │   ├── userSlice.ts        # 用户 slice（含认证、权限）
    │   └── roleSlice.ts        # 角色 slice
    ├── utils/                  # 工具函数
    │   └── auth.ts             # 认证与权限检查函数
    └── types/                  # TypeScript 类型定义
        └── index.ts            # TimeEntry、User、Role 等类型
```

#### 关键说明

- **`api/` 层**：所有 HTTP 请求封装在此，与 Redux thunks 解耦，是 Mock → 真实 API 迁移的核心
- **`store/` 层**：Redux Toolkit 管理全局状态，`createAsyncThunk` 处理异步 API 调用
- **`pages/` 层**：每个文件对应一个路由页面，通过 React Router 切换
- **`components/` 层**：可复用的 UI 组件，如路由守卫 `ProtectedRoute`
- **`utils/auth.ts`**：第 7 周从 `mockApi.ts` 中提取的权限检查函数，供 `userSlice` 和组件使用

---

### 3. FastAPI Web API Server 架构

#### 定义

FastAPI 是一个基于 Python 3.8+ 和类型提示的现代 Web 框架，自动生成交互式 API 文档（Swagger UI / ReDoc）。本项目使用 FastAPI 实现 RESTful API，作为 React 前端的后端服务。

#### 项目结构

```
web-api-server/
├── main.py              # FastAPI 应用入口
├── models.py            # Pydantic 数据模型（TimeEntry、User、Role）
├── routes_time_entry.py # TimeEntry 路由
├── routes_user.py       # User 路由
├── routes_role.py       # Role 路由
├── data_loader.py       # JSON 数据加载
├── data/                # 数据文件目录
│   ├── time_entries.json
│   ├── users.json
│   ├── roles.json
│   ├── initial/         # 初始数据备份
│   └── backup/          # 运行时备份
├── requirements.txt     # Python 依赖
└── restore_data.bat     # 数据恢复脚本
```

#### 启动命令

**首次启动（创建虚拟环境 + 安装依赖）：**

```cmd
:: 进入后端目录
cd web-api-server

:: 创建 Python 虚拟环境
python -m venv .venv

:: 激活虚拟环境（CMD）
.venv\Scripts\activate

:: 安装依赖
pip install -r requirements.txt

:: 启动 FastAPI 服务（--reload 表示代码修改后自动重启）
python -m uvicorn main:app --reload
```

**启动后验证：**
- 后端服务运行在 `http://localhost:8000`
- Swagger UI 文档: http://localhost:8000/docs
- ReDoc 文档: http://localhost:8000/redoc
- API 根路径: http://localhost:8000（返回 `{"message": "工时填报 API 服务运行中"}`）

**关键参数说明：**

| 参数 | 说明 |
|------|------|
| `main:app` | `main` 模块中的 `app` 变量（FastAPI 实例） |
| `--reload` | 热重载模式，代码修改后自动重启，仅开发环境使用 |
| `--port 8000` | 指定端口（默认 8000，可省略） |

#### 示例 — 应用入口 `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes_time_entry import router as time_entry_router
from routes_user import router as user_router
from routes_role import router as role_router

app = FastAPI(
    title="工时填报 API",
    description="React 工时填报应用的后端 API 服务",
    version="1.0.0",
)

# CORS 中间件：允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(time_entry_router)
app.include_router(user_router)
app.include_router(role_router)

@app.get("/")
def root():
    return {"message": "工时填报 API 服务运行中"}
```

- **`FastAPI(...)`**：创建 FastAPI 应用实例，`title` 和 `description` 用于 Swagger UI 展示
- **`CORSMiddleware`**：CORS（跨域资源共享）中间件，开发环境下允许 `localhost:5173`（Vite）跨域访问 `localhost:8000`（FastAPI）
- **`app.include_router(...)`**：将路由模块注册到应用，路由路径前缀由各路由模块自行定义

#### 示例 — Pydantic 数据模型 `models.py`

```python
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TimeEntry(BaseModel):
    id: str
    projectName: str
    description: str
    hours: float = Field(> 0)
    approvalStatus: str
    rejectReason: Optional[str] = None
    createdAt: str

class User(BaseModel):
    id: str
    username: str
    password: str
    roles: list[str]
    createdAt: str

class Role(BaseModel):
    id: str
    name: str
    permissions: list[str]
```

- **`BaseModel`**：Pydantic 基类，提供数据验证和 JSON 序列化
- **`Field(> 0)`**：字段约束，`hours` 必须大于 0
- **`Optional[str] = None`**：可选字段，默认为 `None`
- **类型提示**：FastAPI 利用类型提示自动验证请求/响应数据

#### 示例 — 路由模块 `routes_time_entry.py`

```python
from fastapi import APIRouter
from models import TimeEntry
from data_loader import get_time_entries, save_time_entries, get_time_entry_by_id

router = APIRouter(prefix="/api/time-entries", tags=["TimeEntry"])

@router.get("/")
def list_entries():
    return get_time_entries()

@router.get("/{entry_id}")
def get_entry(entry_id: str):
    entry = get_time_entry_by_id(entry_id)
    if not entry:
        return {"detail": "记录不存在"}, 404
    return entry

@router.post("/", status_code=201)
def create_entry(entry: TimeEntry):
    entries = get_time_entries()
    entry.id = str(len(entries) + 1)
    entries.append(entry)
    save_time_entries(entries)
    return entry

@router.put("/{entry_id}")
def update_entry(entry_id: str, updates: dict):
    entries = get_time_entries()
    for i, e in enumerate(entries):
        if e["id"] == entry_id:
            entries[i].update(updates)
            save_time_entries(entries)
            return entries[i]
    return {"detail": "记录不存在"}, 404

@router.delete("/{entry_id}")
def delete_entry(entry_id: str):
    entries = get_time_entries()
    entries = [e for e in entries if e["id"] != entry_id]
    save_time_entries(entries)
    return {"success": True}
```

- **`APIRouter(prefix=...)`**：路由前缀，所有该模块的路由自动加上 `/api/time-entries`
- **`tags=["TimeEntry"]`**：Swagger UI 中的分组标签
- **`status_code=201`**：创建资源返回 201 Created
- **`return {"detail": "..."}, 404`**：FastAPI 的错误响应格式

#### 使用效果

启动 FastAPI 后，自动生成交互式 API 文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

#### 注意事项

- FastAPI 的 `GET` 路由返回数据时，Pydantic 模型自动序列化为 JSON。
- 路由函数参数中的类型（如 `entry: TimeEntry`）会自动验证请求体，不符合类型的数据会返回 422 错误。
- 数据持久化在每次写操作后调用 `save_*` 函数写入 JSON 文件，服务器重启后数据不丢失。

---

### 4. Vite 开发代理配置

#### 定义

开发环境下，React 应用运行在 `localhost:5173`（Vite），FastAPI 运行在 `localhost:8000`，两者存在跨域问题。Vite 内置的 `server.proxy` 配置可以将 `/api` 请求转发到 FastAPI，避免 CORS 问题。

#### 示例 — `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

- **`server.proxy`**：Vite 开发服务器的代理配置
- **`'/api'`**：匹配所有以 `/api` 开头的请求路径
- **`target: 'http://localhost:8000'`**：将匹配的请求转发到 FastAPI 服务
- **`changeOrigin: true`**：修改请求的 `Origin` 头为目标地址，避免 CORS 预检请求失败

#### 数据流

```
浏览器 (localhost:5173)
  → GET /api/time-entries
  → Vite 代理拦截
  → 转发到 http://localhost:8000/api/time-entries
  → FastAPI 处理
  → 返回 JSON 数据
  → Vite 返回给浏览器
```

#### 注意事项

- **仅开发环境有效**：`server.proxy` 是 Vite 开发服务器的配置，生产构建后不生效。
- **生产环境部署**：生产环境前端和后端由同一服务器提供，API 请求使用相对路径 `/api`，无需代理。
- **CORS 配置**：FastAPI 的 `CORSMiddleware` 允许 `allow_origins=["*"]`，开发环境也可直接跨域访问（不通过代理）。

---

### 5. 移除 Mock 代码

#### 定义

第 7 周将前端所有 Mock 数据（`mockApi.ts`、`mockAdapter.ts`）和 `axios-mock-adapter` 依赖移除，前端直接通过 `timeEntryApi.ts`、`userApi.ts`、`roleApi.ts` 调用真实 API。

#### 变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/api/mockApi.ts` | 删除 | 包含所有 Mock 数据和操作函数 |
| `src/api/mockAdapter.ts` | 删除 | 包含 axios-mock-adapter 路由注册 |
| `package.json` | 移除依赖 | `axios-mock-adapter` 从 dependencies 中删除 |
| `src/api/timeEntryApi.ts` | 保留 | 工时记录 API 函数 |
| `src/api/userApi.ts` | 新增 | 用户 API 函数 |
| `src/api/roleApi.ts` | 新增 | 角色 API 函数 |
| `src/store/userSlice.ts` | 更新导入 | 从 `userApi.ts` / `roleApi.ts` 导入，不再引用 mockApi |

#### 示例 — `timeEntryApi.ts` / `userApi.ts` / `roleApi.ts` 函数签名（与 mockApi 一致）

```ts
// timeEntryApi.ts — 工时记录
export async function getEntries(): Promise<TimeEntry[]> {
  const { data } = await httpClient.get<TimeEntry[]>('/time-entries')
  return data
}

// userApi.ts — 用户
export async function getUsers(): Promise<User[]> {
  const { data } = await httpClient.get<User[]>('/users')
  return data
}

// roleApi.ts — 角色
export async function getRoles(): Promise<Role[]> {
  const { data } = await httpClient.get<Role[]>('/roles')
  return data
}
```

- **函数签名一致**：拆分后各文件的函数签名与之前 `mockApi.ts` 一致，TypeScript 类型定义不变
- **底层切换**：之前被 `axios-mock-adapter` 拦截在内存中处理，现在直接发送到 FastAPI 后端

#### 注意事项

- Redux store 结构不变，thunks 调用对应 API 文件的函数（已解耦），只需更新 import 路径。
- 页面组件导入路径从 `timeEntryApi` 改为对应 API 文件（如 `userApi`、`timeEntryApi`）。

---

### 6. httpClient 拦截器增强

#### 定义

`httpClient.ts` 是 Axios 实例，配置了请求和响应拦截器，统一处理认证和错误。

#### 示例 — `httpClient.ts`

```ts
import axios from 'axios'
import { isLoggedIn, logout } from '../utils/auth'

const httpClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：登录后统一附加凭证到请求头
httpClient.interceptors.request.use((config) => {
  if (isLoggedIn()) {
    config.headers.Authorization = 'Bearer mock-token'
  }
  return config
})

// 响应拦截器：401 清除登录态并跳转登录页；403 跳转 403 页面
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status: number | undefined = error.response?.status
    if (status === 401) {
      logout()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    if (status === 403) {
      if (!window.location.pathname.startsWith('/unauthorized')) {
        window.location.href = '/unauthorized'
      }
    }
    const message: string = error.response?.data?.message ?? error.message ?? '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default httpClient
```

- **`baseURL: '/api'`**：所有请求自动加上 `/api` 前缀
- **`timeout: 10000`**：10 秒超时
- **请求拦截器**：已登录用户在请求头附加 `Authorization: Bearer mock-token`
- **响应拦截器**：
  - `401` → 清除登录态，跳转 `/login`
  - `403` → 跳转 `/unauthorized`
  - 其他错误 → 返回可展示的错误信息

#### 使用效果

```ts
// 所有 API 调用自动携带认证头（如果已登录）
await httpClient.get('/time-entries')
// 实际发送: GET /api/time-entries
// 请求头: Authorization: Bearer mock-token（如果已登录）

// 401 自动处理：清除登录态并跳转
// 403 自动处理：跳转 403 页面
```

#### 注意事项

- `mock-token` 是开发环境的占位符，生产环境应使用真实的 JWT token。
- 响应拦截器中 `error.response?.status` 使用可选链，防止网络错误时 `error.response` 为 `undefined`。
- 401/403 跳转使用 `window.location.href` 而非 React Router 的 `navigate`，确保页面完全刷新，避免 React Router 状态不一致。

---

### 6.5 登录响应 JSON 格式与 Token 存储

#### 登录接口信息

| 属性 | 值 |
|------|-----|
| 请求方法 | `POST` |
| 接口路径 | `/api/users/login` |
| 请求体 | `{ "username": "string", "password": "string" }` |
| 成功状态码 | `200` |
| 失败状态码 | `401`（用户名或密码错误） |

#### 登录响应 JSON 格式

后端 `UserLoginResponse` 模型定义（`web-api-server/models.py`）：

```python
class UserLoginResponse(BaseModel):
    id: str
    username: str
    password: str
    roles: list[str]
    permissions: list[str]
    createdAt: str
```

**登录成功响应示例：**

```json
{
  "id": "1726780800000",
  "username": "Administrator",
  "password": "Pass@word0",
  "roles": ["Administrator"],
  "permissions": ["time-entry:view", "time-entry:create", "time-entry:edit", "time-entry:delete", "time-entry:approve", "time-entry:reject", "user:view", "user:create", "user:edit", "user:delete", "role:view", "role:create", "role:edit", "role:delete"],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**响应字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 用户唯一标识 |
| `username` | `string` | 用户名 |
| `password` | `string` | 密码（**明文，生产环境不应返回**） |
| `roles` | `string[]` | 用户拥有的角色列表 |
| `permissions` | `string[]` | 由角色解析出的所有权限列表 |
| `createdAt` | `string` | 用户创建时间（ISO 8601 格式） |

#### 后端登录逻辑（`routes_user.py`）

```python
@router.post("/login", response_model=UserLoginResponse, status_code=200)
def login(user_login: UserLogin):
    users = load_users()
    # 1. 验证用户名和密码
    user = next((u for u in users if u["username"] == user_login.username 
                 and u["password"] == user_login.password), None)
    if not user:
        raise HTTPException(status_code=401, detail={"message": "用户名或密码错误"})
    # 2. 加载角色列表，解析用户权限
    roles = load_roles()
    permissions = []
    for role_name in user["roles"]:
        role = next((r for r in roles if r["name"] == role_name), None)
        if role:
            permissions.extend(role["permissions"])
    # 3. 返回用户信息 + 权限列表
    user_with_permissions = {**user, "permissions": permissions}
    return user_with_permissions
```

**核心流程：**
1. 从 JSON 文件加载所有用户，验证用户名和密码
2. 加载角色列表，根据用户拥有的角色解析出所有权限
3. 将用户信息和权限列表合并后返回

#### 当前项目的 Token 存储方案

**现状：使用 localStorage 而非 JWT Token**

当前项目没有使用真正的 JWT Token，而是使用 `localStorage` 存储登录态。

**存储键值对：**

| localStorage 键 | 值类型 | 用途 |
|-----------------|--------|------|
| `react-app:isLoggedIn` | `'true'` / `null` | 登录状态标识 |
| `react-app:username` | 字符串 | 当前登录用户名 |
| `react-app:permissions` | JSON 数组字符串 | 用户权限列表 |

**存储工具函数（`utils/auth.ts`）：**

```typescript
// 登录状态键
const LOGIN_STORAGE_KEY = 'react-app:isLoggedIn'
const USERNAME_STORAGE_KEY = 'react-app:username'
const PERMISSIONS_STORAGE_KEY = 'react-app:permissions'

// 判断是否已登录
export function isLoggedIn(): boolean {
  return localStorage.getItem(LOGIN_STORAGE_KEY) === 'true'
}

// 保存登录状态
export function login(): void {
  localStorage.setItem(LOGIN_STORAGE_KEY, 'true')
}

// 清除登录状态
export function logout(): void {
  localStorage.removeItem(LOGIN_STORAGE_KEY)
  localStorage.removeItem(USERNAME_STORAGE_KEY)
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY)
}

// 保存用户名
export function saveUsername(username: string): void {
  localStorage.setItem(USERNAME_STORAGE_KEY, username)
}

// 读取用户名
export function getUsername(): string | null {
  return localStorage.getItem(USERNAME_STORAGE_KEY)
}

// 保存权限列表
export function savePermissions(permissions: string[]): void {
  localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions))
}

// 读取权限列表
export function getPermissions(): string[] {
  const data = localStorage.getItem(PERMISSIONS_STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}
```

#### 登录流程中的 Token 处理

**登录页 `LoginPage.tsx` 的登录流程：**

```typescript
// 1. 调用登录 API
const response = await login(username, password)

// 2. 保存登录状态到 localStorage
login()                          // 设置 isLoggedIn = 'true'
saveUsername(response.username)  // 保存用户名

// 3. 加载角色列表，计算权限
const allRoles = await fetchRoles()
const permissions = getUserPermissionsFromRoles(response.roles, allRoles)
savePermissions(permissions)     // 保存权限列表

// 4. 跳转到目标页面
navigate(targetPage || '/')
```

#### 请求拦截器中的 Token 处理

**`httpClient.ts` 的请求拦截器：**

```typescript
httpClient.interceptors.request.use((config) => {
  if (isLoggedIn()) {
    // 注意：这里是占位符 token，不是真正的 JWT
    config.headers.Authorization = 'Bearer mock-token'
  }
  return config
})
```

**关键点：**
- `mock-token` 是**开发环境的占位符**，后端并未实际验证
- 生产环境应替换为真实的 JWT Token

#### localStorage 的读写方法

localStorage 是浏览器提供的 Web API，所有数据以**字符串形式**存储。

**写入数据：**

```typescript
// 存储字符串
localStorage.setItem('key', 'value')

// 存储对象/数组（需先序列化为 JSON 字符串）
const userData = { username: 'admin', roles: ['admin'] }
localStorage.setItem('user', JSON.stringify(userData))
```

**读取数据：**

```typescript
// 读取字符串
const value = localStorage.getItem('key')  // 返回 string | null

// 读取对象/数组（需解析 JSON）
const userStr = localStorage.getItem('user')
const userData = userStr ? JSON.parse(userStr) : null
```

**删除数据：**

```typescript
// 删除指定键
localStorage.removeItem('key')

// 清空所有数据
localStorage.clear()
```

**类型转换对照表：**

| 原始类型 | 存储方式 | 读取方式 |
|----------|---------|---------|
| `string` | 直接存储 | `localStorage.getItem('key')` |
| `number` | `String(num)` | `Number(localStorage.getItem('key'))` |
| `boolean` | `String(bool)` | `localStorage.getItem('key') === 'true'` |
| `object` | `JSON.stringify(obj)` | `JSON.parse(localStorage.getItem('key'))` |
| `array` | `JSON.stringify(arr)` | `JSON.parse(localStorage.getItem('key'))` |

**实际使用示例（来自本项目）：**

```typescript
// 读取布尔值（登录状态）
const isLoggedIn = localStorage.getItem('react-app:isLoggedIn') === 'true'

// 读取数组（权限列表）
const permissionsStr = localStorage.getItem('react-app:permissions')
const permissions: string[] = permissionsStr ? JSON.parse(permissionsStr) : []

// 检查权限
const hasPermission = permissions.includes('time-entry:create')
```

#### 生产环境的 JWT Token 方案（进阶）

**当前方案的问题：**

| 问题 | 说明 |
|------|------|
| **安全性低** | localStorage 可被 JavaScript 读取，存在 XSS 攻击风险 |
| **无过期机制** | 没有 Token 过期时间，用户永久保持登录状态 |
| **无签名验证** | `mock-token` 没有签名，任何人都可以伪造 |
| **密码明文传输** | 登录响应返回明文密码，不应这样做 |
| **无刷新机制** | 没有 access_token / refresh_token 的双 Token 机制 |

**JWT 是什么：**

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在各方之间安全地传输信息。一个 JWT Token 由三部分组成：

```
Header.Payload.Signature
```

- **Header**：算法和令牌类型
- **Payload**：声明（用户信息、过期时间等）
- **Signature**：签名（验证 Token 未被篡改）

**双 Token 机制：**

生产环境通常使用 **access_token + refresh_token** 双 Token 机制：

| Token | 存储位置 | 有效期 | 用途 |
|-------|---------|--------|------|
| `access_token` | 内存（变量）或 `httpOnly` Cookie | 短（如 15 分钟） | 请求接口认证 |
| `refresh_token` | `httpOnly` Cookie | 长（如 7 天） | 刷新 access_token |

**使用 localStorage 存储 Token 的示例（开发学习用途）：**

```typescript
// 登录成功后保存 Token
const { data } = await httpClient.post<UserLoginResponse>('/users/login', {
  username,
  password
})

// 保存 access_token
localStorage.setItem('auth_token', data.token)
localStorage.setItem('auth_expires_at', String(Date.now() + 15 * 60 * 1000)) // 15分钟后过期

// 从 localStorage 获取 Token
function getToken(): string | null {
  return localStorage.getItem('auth_token')
}

// 检查 Token 是否过期
function isTokenExpired(): boolean {
  const expiresAt = localStorage.getItem('auth_expires_at')
  if (!expiresAt) return true
  return Date.now() >= Number(expiresAt)
}

// 请求拦截器中使用 Token
httpClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token && !isTokenExpired()) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器处理 Token 过期
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token 过期，尝试刷新
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const { data } = await httpClient.post('/auth/refresh', { refreshToken })
          localStorage.setItem('auth_token', data.accessToken)
          // 重试原请求
          return httpClient(error.config)
        } catch {
          // 刷新失败，跳转登录
          logout()
          window.location.href = '/login'
        }
      } else {
        logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

**后端登录接口应返回（JWT 方案）：**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "user": {
    "id": "1726780800000",
    "username": "Administrator",
    "roles": ["Administrator"],
    "permissions": ["time-entry:view", "..."]
  }
}
```

**注意：**
- 不再返回 `password` 字段
- `accessToken` 用于请求认证（短有效期）
- `refreshToken` 用于刷新 Token（长有效期，建议存储在 `httpOnly` Cookie 中）

---

### 7. JSON 数据持久化

#### 定义

FastAPI 后端使用 JSON 文件存储所有业务数据（TimeEntry、User、Role）。每次写操作（创建、更新、删除）后，数据立即写入文件，服务器重启后数据不丢失。

#### 数据文件结构

```
web-api-server/data/
├── time_entries.json    # 工时记录
├── users.json           # 用户数据
├── roles.json           # 角色数据
├── initial/             # 初始数据备份（开发恢复用）
│   ├── time_entries.json
│   ├── users.json
│   └── roles.json
└── backup/              # 运行时备份（带时间戳）
    ├── time_entries_20260918_143000.json
    ├── users_20260918_143000.json
    └── roles_20260918_143000.json
```

#### 示例 — 数据加载 `data_loader.py`

```python
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

def load_json(filename: str) -> list:
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filename: str, data: list) -> None:
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def get_time_entries() -> list:
    return load_json('time_entries.json')

def save_time_entries(entries: list) -> None:
    save_json('time_entries.json', entries)
```

- **`load_json`**：从 JSON 文件加载数据，文件不存在时返回空数组
- **`save_json`**：将数据写入 JSON 文件，`ensure_ascii=False` 保证中文正常显示，`indent=2` 格式化输出
- **`get_time_entries` / `save_time_entries`**：按业务模块封装的加载/保存函数

#### 示例 — 初始数据恢复

```python
import shutil
from datetime import datetime

INITIAL_DIR = os.path.join(DATA_DIR, 'initial')
BACKUP_DIR = os.path.join(DATA_DIR, 'backup')

def backup_current_data() -> None:
    """备份当前数据到 backup/ 目录"""
    os.makedirs(BACKUP_DIR, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    for filename in ['time_entries.json', 'users.json', 'roles.json']:
        src = os.path.join(DATA_DIR, filename)
        if os.path.exists(src):
            dst = os.path.join(BACKUP_DIR, f'{filename.replace(".json", "")}_{timestamp}.json')
            shutil.copy2(src, dst)

def restore_initial_data() -> None:
    """从 initial/ 目录恢复初始数据"""
    for filename in ['time_entries.json', 'users.json', 'roles.json']:
        src = os.path.join(INITIAL_DIR, filename)
        dst = os.path.join(DATA_DIR, filename)
        if os.path.exists(src):
            shutil.copy2(src, dst)
```

- **`backup_current_data`**：启动服务器前备份当前数据，文件名带时间戳
- **`restore_initial_data`**：恢复初始数据，用于开发调试时重置数据

#### 注意事项

- JSON 文件使用 UTF-8 编码，`ensure_ascii=False` 确保中文字符正常存储。
- 每次写操作都写入整个文件（非增量更新），数据量大时性能会下降。当前数据量小（3-5 条），可接受。
- 并发写入时可能产生数据竞争，生产环境应使用数据库。

---

### 8. 数据备份与恢复

#### 定义

提供 `backup_data.py` 和 `restore_data.bat` 两个脚本，用于开发环境的数据安全管理。

#### 示例 — `backup_data.py`

```python
#!/usr/bin/env python3
"""备份当前数据到 initial/ 目录"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from data_loader import backup_current_data, restore_initial_data

if __name__ == '__main__':
    action = sys.argv[1] if len(sys.argv) > 1 else 'backup'
    if action == 'backup':
        backup_current_data()
        print('Data backed up successfully')
    elif action == 'restore':
        restore_initial_data()
        print('Data restored successfully')
```

#### 示例 — `restore_data.bat`

```batch
@echo off
echo Restoring initial data...
python restore_data.py
echo Data restored successfully.
pause
```

- **`backup_data.py`**：Python 脚本，支持 `backup` 和 `restore` 两个动作
- **`restore_data.bat`**：Windows 批处理脚本，快捷恢复初始数据

#### 使用效果

```cmd
# 备份当前数据
python backup_data.py backup

# 恢复初始数据
python backup_data.py restore
# 或
restore_data.bat
```

#### 注意事项

- 初始数据（`data/initial/`）在项目初始化时设置，包含 3 个用户、3 个角色、3 条工时记录。
- 备份数据（`data/backup/`）带时间戳，可保留多个历史版本。
- 生产环境应使用数据库备份机制，而非 JSON 文件复制。

---

## 三、其他实现

### 1. 前后端对接清单

| 前端模块 | API 端点 | 后端路由 | 状态 |
|---------|---------|---------|------|
| `getEntries()` | `GET /api/time-entries` | `routes_time_entry.py` | ✅ |
| `addEntry()` | `POST /api/time-entries` | `routes_time_entry.py` | ✅ |
| `updateEntry()` | `PUT /api/time-entries/{id}` | `routes_time_entry.py` | ✅ |
| `deleteEntry()` | `DELETE /api/time-entries/{id}` | `routes_time_entry.py` | ✅ |
| `approveEntry()` | `PUT /api/time-entries/{id}/approve` | `routes_time_entry.py` | ✅ |
| `rejectEntry()` | `PUT /api/time-entries/{id}/reject` | `routes_time_entry.py` | ✅ |
| `submitEntry()` | `PUT /api/time-entries/{id}/submit` | `routes_time_entry.py` | ✅ |
| `getUsers()` | `GET /api/users` | `routes_user.py` | ✅ |
| `login()` | `POST /api/users/login` | `routes_user.py` | ✅ |
| `getRoles()` | `GET /api/roles` | `routes_role.py` | ✅ |
| `createRole()` | `POST /api/roles` | `routes_role.py` | ✅ |
| `deleteRole()` | `DELETE /api/roles/{id}` | `routes_role.py` | ✅ |

### 2. 启动流程

#### 2.1 后端启动（FastAPI）

**首次启动（创建虚拟环境 + 安装依赖）：**

```cmd
:: 进入后端目录
cd web-api-server

:: 创建 Python 虚拟环境
python -m venv .venv

:: 激活虚拟环境（CMD）
.venv\Scripts\activate

:: 安装依赖
pip install -r requirements.txt

:: 启动 FastAPI 服务（--reload 表示代码修改后自动重启）
python -m uvicorn main:app --reload
```

**启动后验证：**
- 后端服务运行在 `http://localhost:8000`
- Swagger UI 文档: http://localhost:8000/docs
- ReDoc 文档: http://localhost:8000/redoc
- API 根路径: http://localhost:8000（返回 `{"message": "工时填报 API 服务运行中"}`）

**关键参数说明：**

| 参数 | 说明 |
|------|------|
| `main:app` | `main` 模块中的 `app` 变量（FastAPI 实例） |
| `--reload` | 热重载模式，代码修改后自动重启，仅开发环境使用 |
| `--port 8000` | 指定端口（默认 8000，可省略） |

#### 2.2 前端启动（Vite）

**首次启动（安装依赖）：**

```cmd
:: 进入前端目录
cd react-app

:: 安装 Node.js 依赖
npm install

:: 启动 Vite 开发服务器
npm run dev
```

npm run dev
**启动后验证：**
- 前端应用运行在 `http://localhost:5173`
- 浏览器自动打开 http://localhost:5173
- 登录页: http://localhost:5173/login

#### 2.3 同时启动前后端

需要打开**两个终端窗口**，分别运行：

```
终端 1（后端）:                          终端 2（前端）:
┌──────────────────────────┐             ┌──────────────────────────┐
│ cd web-api-server        │             │ cd react-app             │
│ .venv\Scripts\activate   │             │ npm run dev              │
│ python -m uvicorn        │             │                            │
│   main:app --reload      │             │                            │
│                          │             │                            │
│ → API 运行在             │             │ → 应用运行在               │
│   localhost:8000         │             │   localhost:5173           │
└──────────────────────────┘             └──────────────────────────┘
```

#### 2.4 数据恢复（开发调试用）

如果测试过程中数据混乱，可恢复初始数据：

```cmd
cd web-api-server

:: 方法一：使用 Python 脚本
python restore_data.py

:: 方法二：使用批处理脚本（Windows）
restore_data.bat
```

恢复后数据：
- 3 个用户：Administrator/Pass@word0、ProjectManager/Pass@word0、User/Pass@word0
- 3 个角色：Administrator、ProjectManager、User
- 3 条工时记录

#### 2.5 常见问题

| 问题 | 原因 | 解决方法 |
|------|------|---------|
| `uvicorn: command not found` | 虚拟环境未激活 | 先执行 `.venv\Scripts\activate` |
| `ModuleNotFoundError` | 依赖未安装 | 执行 `pip install -r requirements.txt` |
| 前端请求 404 | 后端未启动 | 先启动 FastAPI 服务 |
| 前端请求 CORS 错误 | 未配置代理或后端未开启 CORS | 检查 `vite.config.ts` 代理配置，确认 FastAPI `CORSMiddleware` 已启用 |
| 端口 8000 被占用 | 其他进程占用 | 使用 `netstat -ano | findstr :8000` 查找占用进程，或指定端口 `--port 8001` |
| 端口 5173 被占用 | Vite 默认端口冲突 | Vite 自动切换到 5174，或设置 `VITE_PORT=3000` 环境变量 |

### 3. 开发环境 vs 生产环境

| 维度 | 开发环境 | 生产环境 |
|------|---------|---------|
| 前端地址 | `localhost:5173`（Vite） | 部署到服务器 |
| 后端地址 | `localhost:8000`（FastAPI） | 同一服务器 |
| API 请求 | Vite 代理转发 `/api` | 相对路径 `/api` |
| CORS | FastAPI `CORSMiddleware` 允许 `*` | 同域，无需 CORS |
| 数据持久化 | JSON 文件 | JSON 文件（或数据库） |

---

## 四、知识进阶点

### 1. FastAPI 自动生成交互式文档

FastAPI 基于 OpenAPI 规范，自动生成交互式 API 文档（Swagger UI / ReDoc）。

#### 使用效果

访问 http://localhost:8000/docs 可查看：
- 所有 API 端点列表
- 请求/响应参数说明
- 在线测试功能（Try it out）

#### 注意事项

- 生产环境建议关闭 Swagger UI（避免暴露 API 细节）。
- 可通过 `@app.get(..., summary="...", description="...")` 自定义文档说明。

### 2. 从 Mock 到真实 API 的迁移策略

#### 定义

从 Mock 架构迁移到真实后端，采用**渐进式迁移**策略，确保每步可独立验证。

#### 迁移步骤

| 步骤 | 操作 | 验证方式 |
|------|------|---------|
| 1 | 迁移权限检查函数到 `auth.ts` | TypeScript 编译通过 |
| 2 | 更新 `userSlice.ts` 导入路径 | Redux 状态管理正常 |
| 3 | 删除 `mockApi.ts` 和 `mockAdapter.ts` | 无引用报错 |
| 4 | 移除 `axios-mock-adapter` 依赖 | `npm install` 成功 |
| 5 | 配置 Vite 代理 | 前端请求转发到后端 |
| 6 | 启动 FastAPI + Vite | 所有 CRUD 操作正常 |

#### 注意事项

- 迁移期间保持 API 文件的函数签名与 `mockApi.ts` 一致，确保 Redux 代码无需修改。
- 删除 Mock 代码后，必须启动 FastAPI 服务，否则前端所有 API 请求失败。
- API 文件按业务拆分为 `timeEntryApi.ts` / `userApi.ts` / `roleApi.ts`，Redux thunks 和页面组件的 import 路径需同步更新。

---

## 五、第 7 周需求与技术栈对照检查

### 技术栈覆盖

| 技术 | 计划要求 | 实现情况 |
|------|---------|---------|
| FastAPI | RESTful API 服务 | ✅ `main.py` + 3 个路由模块 + Pydantic 模型 |
| JSON 持久化 | 数据写入 JSON 文件 | ✅ `data_loader.py` + `data/*.json` |
| 数据备份恢复 | 备份 + 恢复脚本 | ✅ `backup_data.py` + `restore_data.bat` |
| Vite 代理 | `/api` 转发到 FastAPI | ✅ `vite.config.ts` `server.proxy` |
| 移除 Mock | 删除 mockApi + mockAdapter | ✅ 文件已删除，依赖已清理 |
| httpClient 拦截器 | 401/403 处理 | ✅ 请求/响应拦截器 |
| Redux thunks | 对接真实 API | ✅ 无需修改（已解耦） |

### 第 7 周产出确认

| 计划产出 | 完成情况 |
|---------|---------|
| ① FastAPI Web API Server | ✅ `web-api-server/` 完整实现 |
| ② Pydantic 数据模型 | ✅ `models.py` 定义 TimeEntry/User/Role |
| ③ JSON 数据持久化 | ✅ 每次写操作写入 JSON 文件 |
| ④ 数据备份与恢复 | ✅ `backup_data.py` + `restore_data.bat` |
| ⑤ Vite 开发代理 | ✅ `server.proxy` 配置 |
| ⑥ 移除 Mock 代码 | ✅ `mockApi.ts` + `mockAdapter.ts` 已删除 |
| ⑦ httpClient 拦截器 | ✅ 401/403 自动处理 |
| ⑧ Redux thunks 对接 | ✅ 无需修改（依赖倒置） |

### 边界与说明

- **JSON 文件并发问题**：多用户同时写入同一 JSON 文件可能产生数据竞争，生产环境应使用数据库。
- **CORS 配置**：开发环境 FastAPI 允许 `allow_origins=["*"]`，生产环境应限制为前端域名。
- **Mock Token**：`Authorization: Bearer mock-token` 是占位符，生产环境应使用 JWT。
- **数据量限制**：JSON 文件全量读写，数据量大时性能下降，应迁移到数据库。
- **权限控制**：前端 RBAC 权限控制基于 localStorage + Redux 实现，路由级和组件级双重保障，详见「六、权限控制方案详解」。

---

## 六、权限控制方案详解

第 7 周在前 6 周 RBAC 权限管理的基础上，实现了完整的前端权限控制体系，包括**路由级权限控制**、**组件级权限控制**和**HTTP 层权限控制**三层架构。

### 6.1 权限模型：RBAC（基于角色的访问控制）

#### 核心概念

```
用户（User）→ 角色（Role）→ 权限（Permission）
```

- **用户**：拥有若干个角色
- **角色**：拥有若干个权限
- **权限**：最小的操作单元（如 `TimeSheet.Write`、`User.Read`）

#### 内置角色与权限

| 角色 | 权限列表 |
|------|---------|
| Administrator | 所有权限（工时 + 用户 + 角色管理） |
| ProjectManager | 工时相关权限（查看、创建、编辑、审批） |
| User | 工时查看、创建权限 |

#### 权限命名规范

```
模块.操作
```

| 权限标识 | 说明 | 所属模块 |
|----------|------|---------|
| `TimeSheet.Read` | 查看工时 | 工时 |
| `TimeSheet.Write` | 创建/编辑工时 | 工时 |
| `TimeSheet.Approve` | 审批工时 | 工时 |
| `TimeSheet.Reject` | 驳回工时 | 工时 |
| `User.Read` | 查看用户 | 用户管理 |
| `User.Write` | 创建/编辑用户 | 用户管理 |
| `Role.Read` | 查看角色 | 权限管理 |
| `Role.Write` | 创建/编辑角色 | 权限管理 |

### 6.2 权限数据流

#### 登录时的权限获取流程

```
用户输入用户名/密码
  → dispatch(loginUser) → POST /api/users/login
  → 后端返回 { id, username, roles, permissions, ... }
  → dispatch(fetchUsers) → GET /api/users（获取所有用户）
  → dispatch(fetchRoles) → GET /api/roles（获取所有角色）
  → 前端根据用户角色匹配角色列表，计算权限
  → savePermissions(permissions) → 存入 localStorage
```

#### 登录页权限计算代码（`LoginPage.tsx:44-52`）

```typescript
const fetchedUsers = await dispatch(fetchUsers()).unwrap()
const fetchedRoles = await dispatch(fetchRoles()).unwrap()

// 根据用户角色，从角色列表中查找并合并所有权限
const currentUser = fetchedUsers.find((u) => u.username === username)
const permissions = currentUser?.roles.flatMap((roleName) => {
  const role = fetchedRoles.find((r) => r.name === roleName)
  return role ? role.permissions : []
}) ?? []
savePermissions(permissions)
```

**核心逻辑：**
1. 获取当前登录用户的角色列表（如 `['ProjectManager']`）
2. 遍历每个角色名，在角色列表中查找对应的角色定义
3. 将找到的角色的权限合并到一个数组中
4. 使用 `savePermissions()` 存入 localStorage

### 6.3 权限存储

#### localStorage 存储

**存储键：** `react-app:permissions`

**存储值：** JSON 数组字符串

```json
["TimeSheet.Read", "TimeSheet.Write", "User.Read", "Role.Read"]
```

#### 存储工具函数（`utils/auth.ts:34-46`）

```typescript
// 保存权限列表
export function savePermissions(permissions: string[]): void {
  localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(permissions))
}

// 读取权限列表
export function getPermissions(): string[] {
  const data = localStorage.getItem(PERMISSIONS_STORAGE_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}
```

#### 权限检查工具函数

```typescript
// 检查当前用户是否有指定权限
export function hasPermission(permission: string): boolean {
  const permissions = getPermissions()
  return permissions.includes(permission)
}

// 从用户角色和角色列表检查是否有指定权限
export function hasPermissionFromRoles(
  userRoles: string[],
  roles: { name: string; permissions: string[] }[],
  permission: string
): boolean {
  for (const roleName of userRoles) {
    const role = roles.find((r) => r.name === roleName)
    if (role && role.permissions.includes(permission)) {
      return true
    }
  }
  return false
}

// 从用户角色和角色列表合并获取所有权限
export function getUserPermissionsFromRoles(
  userRoles: string[],
  roles: { name: string; permissions: string[] }[]
): string[] {
  const permissions: string[] = []
  for (const roleName of userRoles) {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      permissions.push(...role.permissions)
    }
  }
  return [...new Set(permissions)]  // 去重
}
```

### 6.4 路由级权限控制

#### RequireAuth 路由守卫

**文件：** `components/auth/RequireAuth.tsx`

**功能：**
1. 检查用户是否已登录
2. 检查用户是否有指定权限（可选）

```typescript
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

  // 1. 检查登录状态
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // 2. 检查权限（如果指定了权限要求）
  if (permissions && permissions.length > 0) {
    let userPermissions: string[] = []
    
    // 优先从 Redux 获取权限
    if (currentUser) {
      currentUser.roles.forEach((roleName) => {
        const role = roles.find((r) => r.name === roleName)
        if (role) {
          userPermissions.push(...role.permissions)
        }
      })
    }
    
    // 如果 Redux 中没有权限信息（页面刷新后丢失），从 localStorage 获取
    if (userPermissions.length === 0) {
      userPermissions = getPermissions()
    }
    
    // 检查是否有所有要求的权限
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
```

**权限检查逻辑：**
1. 优先从 Redux store 的 `currentUser` 和 `roles` 计算权限
2. 如果 Redux 中没有（如页面刷新后 `currentUser` 丢失），从 localStorage 读取
3. 使用 `permissions.every()` 检查是否拥有**所有**要求的权限（AND 逻辑）

#### 路由权限配置（`App.tsx`）

```typescript
// 全部路由（只要登录即可访问）
<Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
  <Route index element={<TimeEntryListPage />} />
  <Route path="timesheet/:id" element={<TimeEntryDetailPage />} />
  <Route path="timesheet" element={<TimeSheetPage />} />
</Route>

// 需要 TimeSheet.Write 权限
<Route element={<RequireAuth permissions={['TimeSheet.Write']} />}>
  <Route path="timesheet/create" element={<TimeEntryCreatePage />} />
  <Route path="timesheet/:id/edit" element={<TimeEntryEditPage />} />
</Route>

// 需要 User.Read 权限
<Route element={<RequireAuth permissions={['User.Read']} />}>
  <Route path="users" element={<UserListPage />} />
  <Route path="users/:id" element={<UserDetailPage />} />
</Route>

// 需要 User.Write 权限
<Route element={<RequireAuth permissions={['User.Write']} />}>
  <Route path="users/create" element={<UserCreatePage />} />
  <Route path="users/:id/edit" element={<UserEditPage />} />
</Route>

// 需要 Role.Read 权限
<Route element={<RequireAuth permissions={['Role.Read']} />}>
  <Route path="permissions" element={<PermissionListPage />} />
  <Route path="permissions/assign" element={<PermissionAssignPage />} />
</Route>
```

#### 权限控制效果

| 路由 | 需要权限 | Administrator | ProjectManager | User |
|------|---------|---------------|----------------|------|
| `/` 工时列表 | 登录即可 | ✅ | ✅ | ✅ |
| `/timesheet/create` | `TimeSheet.Write` | ✅ | ✅ | ✅ |
| `/timesheet/:id` | 登录即可 | ✅ | ✅ | ✅ |
| `/users` | `User.Read` | ✅ | ❌ | ❌ |
| `/users/create` | `User.Write` | ✅ | ❌ | ❌ |
| `/permissions` | `Role.Read` | ✅ | ❌ | ❌ |

#### hasPermission 工作原理示例

**场景一：URL 访问控制（路由级）**

```typescript
// App.tsx 路由配置
<Route element={<RequireAuth permissions={['User.Read']} />}>
  <Route path="users" element={<UserListPage />} />
</Route>
```

**工作流程：**

```
用户尝试访问 /users 路由
  ↓
RequireAuth 组件拦截
  ↓
获取用户权限列表（从 Redux 或 localStorage）
  ↓
用户是 ProjectManager，权限列表为：
  ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Approve", "TimeSheet.Reject"]
  ↓
检查：permissions.every(p => userPermissions.includes(p))
  → 检查 'User.Read' 是否在用户权限列表中
  → userPermissions.includes('User.Read') = false
  ↓
hasPermission = false
  ↓
跳转 /unauthorized 页面
```

**不同用户访问同一 URL 的效果：**

| 用户 | 权限列表 | 访问 `/users` | 结果 |
|------|---------|--------------|------|
| Administrator | 包含 `User.Read` | ✅ 正常渲染 UserListPage |
| ProjectManager | 不包含 `User.Read` | ❌ 跳转 /unauthorized |
| User | 不包含 `User.Read` | ❌ 跳转 /unauthorized |

---

**场景二：组件显示控制（组件级）**

```typescript
// UserListPage.tsx — 操作列按钮控制
function UserListPage() {
  return (
    <Table>
      <Table.Column title="操作">
        {({ key }: { key: string }) => (
          <>
            {/* 有 User.Read 权限才显示「查看」按钮 */}
            <RequirePermission permissions={['User.Read']}>
              <Button onClick={() => handleView(key)}>查看</Button>
            </RequirePermission>
            
            {/* 有 User.Write 权限才显示「编辑」按钮 */}
            <RequirePermission permissions={['User.Write']}>
              <Button onClick={() => handleEdit(key)}>编辑</Button>
            </RequirePermission>
            
            {/* 有 User.Write 权限才显示「删除」按钮 */}
            <RequirePermission permissions={['User.Write']}>
              <Button onClick={() => handleDelete(key)}>删除</Button>
            </RequirePermission>
          </>
        )}
      </Table.Column>
    </Table>
  )
}
```

**工作流程：**

```
用户访问 /users 页面（已登录且有 User.Read 权限）
  ↓
RequirePermission 组件渲染
  ↓
获取用户权限列表：
  Administrator: ["TimeSheet.Read", ..., "User.Read", "User.Write", ...]
  ProjectManager: ["TimeSheet.Read", "TimeSheet.Write", ...]（无 User 权限）
  ↓
检查每个按钮的权限：
  ↓
  「查看」按钮：permissions={['User.Read']}
    → Administrator: userPermissions.includes('User.Read') = true → 显示
    → ProjectManager: userPermissions.includes('User.Read') = false → 隐藏
  ↓
  「编辑」按钮：permissions={['User.Write']}
    → Administrator: userPermissions.includes('User.Write') = true → 显示
    → ProjectManager: userPermissions.includes('User.Write') = false → 隐藏
  ↓
  「删除」按钮：permissions={['User.Write']}
    → Administrator: userPermissions.includes('User.Write') = true → 显示
    → ProjectManager: userPermissions.includes('User.Write') = false → 隐藏
```

**不同用户看到的界面效果：**

```
Administrator 看到的操作列：
┌─────────────────────────────────────┐
│ [查看] [编辑] [删除]                │
└─────────────────────────────────────┘

ProjectManager 看到的操作列：
┌─────────────────────────────────────┐
│ （无任何按钮，操作列为空）           │
└─────────────────────────────────────┘
```

---

**场景三：导航菜单控制**

```typescript
// AppLayout.tsx — 侧边栏菜单
function AppLayout() {
  return (
    <Sider>
      <Menu>
        <Menu.Item key="/timesheet" icon={<ClockCircleOutlined />}>
          工时填报
        </Menu.Item>
        
        {/* 有 User.Read 权限才显示「用户管理」菜单 */}
        <RequirePermission permissions={['User.Read']}>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
        </RequirePermission>
        
        {/* 有 Role.Read 权限才显示「权限管理」菜单 */}
        <RequirePermission permissions={['Role.Read']}>
          <Menu.Item key="/permissions" icon={<SafetyOutlined />}>
            权限管理
          </Menu.Item>
        </RequirePermission>
      </Menu>
    </Sider>
  )
}
```

**不同用户看到的菜单：**

```
Administrator 看到的菜单：
┌─────────────────────────┐
│ 🕐 工时填报             │
│ 👤 用户管理             │
│ 🛡️ 权限管理            │
└─────────────────────────┘

ProjectManager 看到的菜单：
┌─────────────────────────┐
│ 🕐 工时填报             │
│ （无用户管理和权限管理） │
└─────────────────────────┘

User 看到的菜单：
┌─────────────────────────┐
│ 🕐 工时填报             │
│ （无用户管理和权限管理） │
└─────────────────────────┘
```

---

**场景四：页面内功能区块控制**

```typescript
// TimeEntryListPage.tsx — 操作栏按钮控制
function TimeEntryListPage() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {/* 有 TimeSheet.Write 权限才显示「新增」按钮 */}
        <RequirePermission 
          permissions={['TimeSheet.Write']}
          fallback={<Button disabled>新增工时（无权限）</Button>}
        >
          <Button type="primary" onClick={handleCreate}>
            新增工时
          </Button>
        </RequirePermission>
        
        {/* 有 TimeSheet.Approve 权限才显示「批量审批」按钮 */}
        <RequirePermission permissions={['TimeSheet.Approve']}>
          <Button onClick={handleBatchApprove}>批量审批</Button>
        </RequirePermission>
      </div>
      
      <TimeEntryTable />
    </div>
  )
}
```

**不同用户看到的功能区：**

```
Administrator 看到的功能区：
┌─────────────────────────────────────────────┐
│ [新增工时] [批量审批]                        │
├─────────────────────────────────────────────┤
│ 工时列表表格...                              │
└─────────────────────────────────────────────┘

ProjectManager 看到的功能区：
┌─────────────────────────────────────────────┐
│ [新增工时] [批量审批]                        │
├─────────────────────────────────────────────┤
│ 工时列表表格...                              │
└─────────────────────────────────────────────┘

User 看到的功能区：
┌─────────────────────────────────────────────┐
│ [新增工时]                                   │
├─────────────────────────────────────────────┤
│ 工时列表表格...                              │
└─────────────────────────────────────────────┘
```

---

**场景五：权限检查函数直接调用**

```typescript
// 在组件中直接使用 hasPermission 函数
import { hasPermission } from '../utils/auth'

function UserListPage() {
  const canEdit = hasPermission('User.Write')
  const canDelete = hasPermission('User.Write')
  
  return (
    <Table>
      <Table.Column title="操作">
        {({ key }: { key: string }) => (
          <>
            {canEdit && (
              <Button onClick={() => handleEdit(key)}>编辑</Button>
            )}
            {canDelete && (
              <Button onClick={() => handleDelete(key)}>删除</Button>
            )}
          </>
        )}
      </Table.Column>
    </Table>
  )
}
```

**工作流程：**

```
hasPermission('User.Write') 调用过程：
  ↓
getPermissions() → 从 localStorage 读取
  → 返回 ["TimeSheet.Read", "TimeSheet.Write", ...]（ProjectManager）
  → 返回 ["TimeSheet.Read", ..., "User.Read", "User.Write", ...]（Administrator）
  ↓
permissions.includes('User.Write')
  → ProjectManager: false
  → Administrator: true
  ↓
返回 true / false
```

---

**总结：hasPermission 的两种使用方式**

| 使用方式 | 组件 | 特点 | 适用场景 |
|---------|------|------|---------|
| **组件包裹** | `<RequirePermission>` | 条件渲染，支持 fallback | 按钮、菜单、功能区块 |
| **函数调用** | `hasPermission()` | 返回布尔值，手动判断 | 自定义逻辑、复杂条件 |
| `/permissions` | `Role.Read` | ✅ | ❌ | ❌ |

### 6.5 组件级权限控制

#### RequirePermission 组件

**文件：** `components/auth/RequirePermission.tsx`

**功能：** 条件渲染 — 有权限显示子内容，无权限显示 fallback

```typescript
function RequirePermission({
  permissions,
  fallback = null,
  children,
}: {
  permissions: string[]
  fallback?: ReactNode
  children: ReactNode
}) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  // 未登录时显示 fallback
  if (!currentUser) {
    return <>{fallback}</>
  }

  // 从 Redux 计算用户权限
  const userPermissions = new Set<string>()
  currentUser.roles.forEach((roleName) => {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      role.permissions.forEach((p) => userPermissions.add(p))
    }
  })

  // 有权限则渲染 children，否则渲染 fallback
  if (userPermissions.size > 0) {
    const hasAllPermissions = permissions.every((p) => userPermissions.has(p))
    return hasAllPermissions ? <>{children}</> : <>{fallback}</>
  }

  // 兜底：从 localStorage 获取权限
  const storedPermissions = getPermissions()
  const hasAllPermissions = permissions.every((p) => storedPermissions.includes(p))
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>
}
```

#### 使用示例

```typescript
// 有权限显示按钮，无权限显示空
<RequirePermission permissions={['TimeSheet.Write']}>
  <Button onClick={handleCreate}>新增工时</Button>
</RequirePermission>

// 有权限显示按钮，无权限显示提示文字
<RequirePermission 
  permissions={['User.Write']}
  fallback={<span style={{ color: 'gray' }}>无编辑权限</span>}
>
  <Button onClick={handleEdit}>编辑用户</Button>
</RequirePermission>
```

### 6.6 HTTP 层权限控制

#### 请求拦截器（`httpClient.ts`）

```typescript
httpClient.interceptors.request.use((config) => {
  if (isLoggedIn()) {
    config.headers.Authorization = 'Bearer mock-token'
  }
  return config
})
```

#### 响应拦截器（`httpClient.ts`）

```typescript
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      logout()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    if (status === 403) {
      if (!window.location.pathname.startsWith('/unauthorized')) {
        window.location.href = '/unauthorized'
      }
    }
    const message = error.response?.data?.message ?? error.message ?? '请求失败'
    return Promise.reject(new Error(message))
  }
)
```

**拦截器作用：**
- `401` → 清除登录态，跳转登录页
- `403` → 跳转 403 页面

### 6.7 权限数据读写完整流程

#### 写入流程（登录时）

```
LoginPage.tsx
  ↓ dispatch(loginUser)
  ↓ POST /api/users/login
  ↓ 后端返回用户 + 角色信息
  ↓ dispatch(fetchUsers) + dispatch(fetchRoles)
  ↓ 前端计算权限（角色 → 权限映射）
  ↓ savePermissions(permissions)
  ↓ localStorage.setItem('react-app:permissions', JSON.stringify(permissions))
```

#### 读取流程（权限检查时）

```
RequireAuth / RequirePermission 组件
  ↓ 从 Redux store 读取 currentUser 和 roles
  ↓ 遍历 currentUser.roles，匹配 roles 列表
  ↓ 合并所有角色的 permissions
  ↓ 如果 Redux 为空，降级从 localStorage 读取
  ↓ getPermissions() → localStorage.getItem('react-app:permissions')
  ↓ JSON.parse() → string[]
  ↓ permissions.every(p => userPermissions.includes(p))
  ↓ 返回 true/false 决定是否放行
```

#### 双重读取策略

| 数据来源 | 触发场景 | 优点 | 缺点 |
|----------|---------|------|------|
| Redux store | 正常登录后 | 响应快，无需序列化 | 页面刷新后丢失 |
| localStorage | 页面刷新后 | 持久化，刷新不丢失 | 需要 JSON 解析 |

### 6.8 权限控制的三层架构

```
┌─────────────────────────────────────────────────┐
│  路由层（RequireAuth）                           │
│  → 未登录 → 跳转 /login                         │
│  → 无权限 → 跳转 /unauthorized                   │
├─────────────────────────────────────────────────┤
│  组件层（RequirePermission）                     │
│  → 有权限 → 渲染子组件                          │
│  → 无权限 → 渲染 fallback                       │
├─────────────────────────────────────────────────┤
│  HTTP 层（httpClient 拦截器）                    │
│  → 401 → 清除登录态，跳转 /login                 │
│  → 403 → 跳转 /unauthorized                     │
└─────────────────────────────────────────────────┘
```

### 6.9 关键文件索引

| 文件 | 路径 | 职责 |
|------|------|------|
| 认证工具 | `react-app/src/utils/auth.ts` | localStorage 读写、权限检查函数 |
| 登录页 | `react-app/src/pages/LoginPage.tsx` | 登录流程、权限计算与存储 |
| 路由守卫 | `react-app/src/components/auth/RequireAuth.tsx` | 路由级权限控制 |
| 组件守卫 | `react-app/src/components/auth/RequirePermission.tsx` | 组件级权限控制 |
| 路由配置 | `react-app/src/App.tsx` | 各路由的权限要求声明 |
| 403 页面 | `react-app/src/pages/UnauthorizedPage.tsx` | 无权限提示页 |
| HTTP 客户端 | `react-app/src/api/httpClient.ts` | 请求/响应拦截器（401/403 处理） |
| 用户 Slice | `react-app/src/store/userSlice.ts` | 用户/角色 Redux 状态管理 |

---

## 七、学习路径建议

按照从易到难的顺序，建议按以下路径学习第 7 周代码：

1. **Redux thunks 对接真实 API**（第 1 节）→ 依赖倒置、无需修改的解耦设计
2. **react-app 项目结构**（第 2 节）→ 前端目录组织、各层职责说明
3. **FastAPI 应用入口**（第 3 节）→ 理解 `FastAPI()` 创建应用、`CORSMiddleware`、路由注册
4. **Pydantic 数据模型**（第 3 节）→ `BaseModel`、字段约束、类型验证
5. **路由模块**（第 3 节）→ `APIRouter`、前缀、状态码、错误响应
6. **Vite 代理配置**（第 4 节）→ `server.proxy`、`changeOrigin`
7. **移除 Mock 代码**（第 5 节）→ 文件删除、依赖清理、函数签名一致性
8. **httpClient 拦截器**（第 6 节）→ 请求认证、401/403 处理
9. **JSON 数据持久化**（第 7 节）→ 文件读写、UTF-8 编码、格式化输出
10. **数据备份与恢复**（第 8 节）→ `backup_data.py` + `restore_data.bat`
11. **FastAPI 自动文档**（「四、知识进阶点」第 1 节）→ Swagger UI / ReDoc
12. **迁移策略**（「四、知识进阶点」第 2 节）→ 渐进式迁移 6 步计划
13. **权限控制方案**（第六节）→ RBAC 模型、路由守卫、组件守卫、HTTP 拦截

每个知识点均可对照 `openspec/changes/archive/2026-09-18-replace-mock-with-real-api/` 深入理解设计决策。
