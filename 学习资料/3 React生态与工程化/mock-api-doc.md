# React-App Mock API 文档

> **架构说明**：基于 `axios-mock-adapter` 拦截 `httpClient` 请求，复用 `mockApi.ts` 内存数据源，300ms 延迟模拟网络。所有请求以 `/api` 为前缀。

---

## 目录

1. [工时记录模块 (TimeEntry)](#1-timeentry)
2. [用户模块 (User)](#2-user)
3. [角色模块 (Role)](#3-role)
4. [权限工具函数](#4-权限工具函数)
5. [通用规范](#5-通用规范)
6. [默认数据](#6-默认数据)

---

## 1. TimeEntry

### GET `/api/time-entries` — 列表/查询

**请求参数 (Query String):**

| 参数 | 类型 | 说明 |
|---|---|---|
| `projectName` | `string` | 项目名称（模糊匹配） |
| `description` | `string` | 描述（模糊匹配） |
| `approvalStatus` | `'待审批' \| '已通过' \| '已驳回' \| ''` | 审批状态 |

**请求示例:**
```
GET /api/time-entries?projectName=React&approvalStatus=待审批
```

**响应 200 — TimeEntry[]:**
```json
[
  {
    "id": "1",
    "projectName": "React 学习",
    "description": "学习函数组件和 Hooks",
    "hours": 3,
    "approvalStatus": "已通过",
    "createdAt": "2026-09-15T10:00:00.000Z"
  },
  {
    "id": "2",
    "projectName": "项目 A",
    "description": "开发用户登录功能",
    "hours": 5,
    "approvalStatus": "待审批",
    "createdAt": "2026-09-14T22:00:00.000Z"
  },
  {
    "id": "3",
    "projectName": "代码审查",
    "description": "审查 Pull Request #42",
    "hours": 1.5,
    "approvalStatus": "已驳回",
    "createdAt": "2026-09-14T10:00:00.000Z"
  }
]
```

---

### GET `/api/time-entries/:id` — 详情

**响应 200:**
```json
{
  "id": "1",
  "projectName": "React 学习",
  "description": "学习函数组件和 Hooks",
  "hours": 3,
  "approvalStatus": "已通过",
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

**响应 404:**
```json
{ "message": "记录不存在" }
```

---

### POST `/api/time-entries` — 新增

**请求体:**
```json
{
  "projectName": "项目 B",
  "description": "开发用户管理",
  "hours": 4,
  "approvalStatus": "待审批"
}
```

**响应 201:**
```json
{
  "id": "1726456789000",
  "projectName": "项目 B",
  "description": "开发用户管理",
  "hours": 4,
  "approvalStatus": "待审批",
  "createdAt": "2026-09-16T10:00:00.000Z"
}
```

---

### POST `/api/time-entries/batch` — 批量新增

**请求体:**
```json
[
  { "projectName": "A", "description": "d1", "hours": 2, "approvalStatus": "待审批" },
  { "projectName": "B", "description": "d2", "hours": 3, "approvalStatus": "待审批" }
]
```

**响应 201 — TimeEntry[]:**
```json
[
  { "id": "1726456789000", "projectName": "A", "description": "d1", "hours": 2, "approvalStatus": "待审批", "createdAt": "2026-09-16T10:00:00.000Z" },
  { "id": "1726456789001", "projectName": "B", "description": "d2", "hours": 3, "approvalStatus": "待审批", "createdAt": "2026-09-16T10:00:00.000Z" }
]
```

---

### PUT `/api/time-entries/:id` — 编辑

**请求体 (Partial TimeEntry):**
```json
{ "hours": 6, "description": "更新描述" }
```

**响应 200 — TimeEntry:**
```json
{
  "id": "1",
  "projectName": "React 学习",
  "description": "更新描述",
  "hours": 6,
  "approvalStatus": "已通过",
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

---

### DELETE `/api/time-entries/:id` — 删除

**响应 200:**
```json
{ "success": true }
```

---

### PUT `/api/time-entries/:id/submit` — 提交审批

**请求体:** 无

**响应 200 — TimeEntry:**
```json
{
  "id": "1",
  "projectName": "React 学习",
  "description": "学习函数组件和 Hooks",
  "hours": 3,
  "approvalStatus": "待审批",
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

---

### PUT `/api/time-entries/:id/approve` — 审批通过

**请求体:** 无

**响应 200 — TimeEntry:**
```json
{
  "id": "1",
  "projectName": "React 学习",
  "description": "学习函数组件和 Hooks",
  "hours": 3,
  "approvalStatus": "已通过",
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

---

### PUT `/api/time-entries/:id/reject` — 驳回

**请求体:**
```json
{ "reason": "工时填写不规范" }
```

**响应 200 — TimeEntry:**
```json
{
  "id": "1",
  "projectName": "React 学习",
  "description": "学习函数组件和 Hooks",
  "hours": 3,
  "approvalStatus": "已驳回",
  "rejectReason": "工时填写不规范",
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

---

## 2. User

### GET `/api/users` — 列表/查询

**请求参数 (Query String):**

| 参数 | 类型 | 说明 |
|---|---|---|
| `username` | `string` | 用户名（模糊匹配） |
| `role` | `string \| ''` | 角色名称 |

**请求示例:**
```
GET /api/users?username=Admin&role=Administrator
```

**响应 200 — User[]:**
```json
[
  {
    "id": "1",
    "username": "Administrator",
    "password": "Pass@word0",
    "roles": ["Administrator"],
    "createdAt": "2026-09-15T10:00:00.000Z"
  },
  {
    "id": "2",
    "username": "ProjectManager",
    "password": "Pass@word0",
    "roles": ["ProjectManager"],
    "createdAt": "2026-09-14T22:00:00.000Z"
  },
  {
    "id": "3",
    "username": "User",
    "password": "Pass@word0",
    "roles": ["User"],
    "createdAt": "2026-09-14T10:00:00.000Z"
  }
]
```

---

### GET `/api/users/:id` — 详情

**响应 200 — User:**
```json
{
  "id": "1",
  "username": "Administrator",
  "password": "Pass@word0",
  "roles": ["Administrator"],
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

**响应 404:**
```json
{ "message": "用户不存在" }
```

---

### POST `/api/users` — 新增用户

**请求体:**
```json
{
  "username": "NewUser",
  "password": "Pass@word0",
  "roles": ["User"]
}
```

**响应 201 — User:**
```json
{
  "id": "1726456789000",
  "username": "NewUser",
  "password": "Pass@word0",
  "roles": ["User"],
  "createdAt": "2026-09-16T10:00:00.000Z"
}
```

---

### PUT `/api/users/:id` — 编辑用户

**请求体 (不含 password):**
```json
{ "roles": ["ProjectManager"] }
```

**响应 200 — User:**
```json
{
  "id": "3",
  "username": "User",
  "password": "Pass@word0",
  "roles": ["ProjectManager"],
  "createdAt": "2026-09-14T10:00:00.000Z"
}
```

---

### DELETE `/api/users/:id` — 删除用户

**响应 200:**
```json
{ "success": true }
```

---

### POST `/api/users/login` — 登录

**请求体:**
```json
{ "username": "Administrator", "password": "Pass@word0" }
```

**响应 200 — User:**
```json
{
  "id": "1",
  "username": "Administrator",
  "password": "Pass@word0",
  "roles": ["Administrator"],
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

**响应 401:**
```json
{ "message": "用户名或密码错误" }
```

---

## 3. Role

### GET `/api/roles` — 角色列表

**响应 200 — Role[]:**
```json
[
  {
    "id": "1",
    "name": "Administrator",
    "permissions": ["TimeSheet.Read", "User.Read", "User.Write", "Role.Read", "Role.Write"]
  },
  {
    "id": "2",
    "name": "ProjectManager",
    "permissions": ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Export", "TimeSheet.Import", "TimeSheet.approval", "User.Read", "User.Write"]
  },
  {
    "id": "3",
    "name": "User",
    "permissions": ["TimeSheet.Read", "TimeSheet.Write"]
  }
]
```

---

### GET `/api/roles/:id` — 角色详情

**响应 200 — Role:**
```json
{
  "id": "1",
  "name": "Administrator",
  "permissions": ["TimeSheet.Read", "User.Read", "User.Write", "Role.Read", "Role.Write"]
}
```

**响应 404:**
```json
{ "message": "角色不存在" }
```

---

### POST `/api/roles` — 创建角色

**请求体:**
```json
{
  "name": "Developer",
  "permissions": ["TimeSheet.Read", "TimeSheet.Write"]
}
```

**响应 201 — Role:**
```json
{
  "id": "1726456789000",
  "name": "Developer",
  "permissions": ["TimeSheet.Read", "TimeSheet.Write"]
}
```

---

### PUT `/api/roles/:id` — 更新角色

**请求体 (Partial Role):**
```json
{ "permissions": ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Export"] }
```

**响应 200 — Role:**
```json
{
  "id": "3",
  "name": "User",
  "permissions": ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Export"]
}
```

---

### DELETE `/api/roles/:id` — 删除角色

**响应 200:**
```json
{ "success": true }
```

**响应 403 (删除 Administrator):**
```json
{ "message": "不能删除 Administrator 角色" }
```

---

## 4. 权限工具函数

以下函数不暴露 REST 端点，在业务层直接调用。

### `hasPermission(userRoles: UserRole[], permission: Permission): boolean`

检查用户是否有指定权限。

```typescript
hasPermission(['Administrator'], 'Role.Write') // true
hasPermission(['User'], 'Role.Write')           // false
```

### `getUserPermissions(userRoles: UserRole[]): Permission[]`

获取用户全部权限集合（去重）。

```typescript
getUserPermissions(['ProjectManager'])
// ['TimeSheet.Read', 'TimeSheet.Write', 'TimeSheet.Export', 'TimeSheet.Import', 'TimeSheet.approval', 'User.Read', 'User.Write']
```

---

## 5. 通用规范

### 请求

| 项目 | 说明 |
|---|---|
| Base URL | `/api` |
| 超时 | 10000ms |
| 延迟 | 300ms |
| 认证头 | 登录后自动附加 `Authorization: Bearer mock-token` |

### 响应格式

**成功响应** — Axios 标准格式，业务数据在 `response.data` 中。

**错误响应:**
```json
{ "message": "错误信息" }
```

### 状态码

| 状态码 | 含义 |
|---|---|
| 200 | 成功（GET/PUT/DELETE） |
| 201 | 创建成功（POST） |
| 401 | 登录失败 / 未授权 |
| 403 | 权限不足 / 禁止操作 |
| 404 | 资源不存在 |

### 响应拦截器行为

| 状态码 | 行为 |
|---|---|
| 401 | 清除登录态，跳转 `/login` |
| 403 | 跳转 `/unauthorized` |

---

## 6. 默认数据

### 工时记录 (3 条)

| id | projectName | description | hours | approvalStatus |
|---|---|---|---|---|
| 1 | React 学习 | 学习函数组件和 Hooks | 3 | 已通过 |
| 2 | 项目 A | 开发用户登录功能 | 5 | 待审批 |
| 3 | 代码审查 | 审查 Pull Request #42 | 1.5 | 已驳回 |

### 用户 (3 个)

| id | username | password | roles |
|---|---|---|---|
| 1 | Administrator | Pass@word0 | Administrator |
| 2 | ProjectManager | Pass@word0 | ProjectManager |
| 3 | User | Pass@word0 | User |

### 角色 (3 个)

| id | name | permissions |
|---|---|---|
| 1 | Administrator | TimeSheet.Read, User.Read, User.Write, Role.Read, Role.Write |
| 2 | ProjectManager | TimeSheet.Read, TimeSheet.Write, TimeSheet.Export, TimeSheet.Import, TimeSheet.approval, User.Read, User.Write |
| 3 | User | TimeSheet.Read, TimeSheet.Write |

### 权限标签映射

| 权限标识 | 中文标签 |
|---|---|
| TimeSheet.Read | 工时查询 |
| TimeSheet.Write | 工时增删改 |
| TimeSheet.Export | 工时导出 |
| TimeSheet.Import | 工时导入 |
| TimeSheet.approval | 工时审批 |
| User.Read | 用户查询 |
| User.Write | 用户增删改 |
| Role.Read | 角色读取 |
| Role.Write | 角色管理 |

---

## 文件索引

| 文件 | 职责 |
|---|---|
| `src/api/mockApi.ts` | 内存数据源 + CRUD 函数 |
| `src/api/mockAdapter.ts` | axios-mock-adapter 路由注册 |
| `src/api/httpClient.ts` | Axios 实例 + 拦截器 |
| `src/types/timeEntry.ts` | TypeScript 类型定义 |

> **注意**：mock 数据存储在内存中，刷新页面后丢失。接入真实后端时移除 `src/main.tsx` 中的 `import './api/mockAdapter'` 即可。