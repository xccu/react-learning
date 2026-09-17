# React-App Web API 设计文档

> **说明**：本设计文档严格遵循 `mock-api-doc.md` 的接口规范和请求/响应格式，确保前端 `httpClient` 无需修改即可对接真实后端。

---

## 1. 通用规范

### 基础信息

| 项目 | 说明 |
|---|---|
| Base URL | `/api` |
| 协议 | HTTP / HTTPS |
| 字符编码 | UTF-8 |
| 请求/响应格式 | `application/json` |

### 认证

未登录态不携带认证头；登录后统一附加：

```
Authorization: Bearer mock-token
```

### 响应格式

**成功响应** — 直接返回业务数据，不做包装。

**错误响应：**
```json
{ "message": "错误信息" }
```

### 状态码

| 状态码 | 含义 |
|---|---|
| 200 | 成功（GET / PUT / DELETE） |
| 201 | 创建成功（POST） |
| 401 | 登录失败 |
| 403 | 权限不足 / 禁止操作 |
| 404 | 资源不存在 |

---

## 2. TimeEntry

### GET `/api/time-entries`

**功能**：获取工时记录列表，支持按 `projectName`、`description`、`approvalStatus` 查询过滤。

**Query String 参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `projectName` | `string` | 否 | 项目名称（模糊匹配，不区分大小写） |
| `description` | `string` | 否 | 描述（模糊匹配，不区分大小写） |
| `approvalStatus` | `string` | 否 | 审批状态：`待审批` / `已通过` / `已驳回` / 空字符串表示不限 |

**请求示例：**
```
GET /api/time-entries?projectName=React&approvalStatus=待审批
```

**响应 200 — `TimeEntry[]`：**
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

### GET `/api/time-entries/{id}`

**功能**：获取单条工时记录详情。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 工时记录 ID |

**响应 200 — `TimeEntry`：**
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

**响应 404：**
```json
{ "message": "记录不存在" }
```

---

### POST `/api/time-entries`

**功能**：新增一条工时记录。

**请求体：**
```json
{
  "projectName": "项目 B",
  "description": "开发用户管理",
  "hours": 4,
  "approvalStatus": "待审批"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `projectName` | `string` | 是 | 项目名称 |
| `description` | `string` | 是 | 工作描述 |
| `hours` | `number` | 是 | 工时，> 0 |
| `approvalStatus` | `string` | 是 | 审批状态：`待审批` / `已通过` / `已驳回` |

**响应 201 — `TimeEntry`（服务端生成 `id` 和 `createdAt`）：**
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

### POST `/api/time-entries/batch`

**功能**：批量新增工时记录。

**请求体 — `Omit<TimeEntry, 'id' \| 'createdAt'>[]`：**
```json
[
  { "projectName": "A", "description": "d1", "hours": 2, "approvalStatus": "待审批" },
  { "projectName": "B", "description": "d2", "hours": 3, "approvalStatus": "待审批" }
]
```

**响应 201 — `TimeEntry[]`：**
```json
[
  { "id": "1726456789000", "projectName": "A", "description": "d1", "hours": 2, "approvalStatus": "待审批", "createdAt": "2026-09-16T10:00:00.000Z" },
  { "id": "1726456789001", "projectName": "B", "description": "d2", "hours": 3, "approvalStatus": "待审批", "createdAt": "2026-09-16T10:00:00.000Z" }
]
```

---

### PUT `/api/time-entries/{id}`

**功能**：更新工时记录。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 工时记录 ID |

**请求体 — Partial TimeEntry（不含 `id`、`createdAt`）：**
```json
{ "hours": 6, "description": "更新描述" }
```

**响应 200 — `TimeEntry`：**
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

### DELETE `/api/time-entries/{id}`

**功能**：删除工时记录。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 工时记录 ID |

**响应 200：**
```json
{ "success": true }
```

---

### PUT `/api/time-entries/{id}/submit`

**功能**：提交工时记录审批，将状态改为"待审批"，清除驳回原因。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 工时记录 ID |

**请求体：** 无

**响应 200 — `TimeEntry`：**
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

### PUT `/api/time-entries/{id}/approve`

**功能**：审批通过，将状态改为"已通过"，清除驳回原因。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 工时记录 ID |

**请求体：** 无

**响应 200 — `TimeEntry`：**
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

### PUT `/api/time-entries/{id}/reject`

**功能**：驳回工时记录，将状态改为"已驳回"，记录驳回原因。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 工时记录 ID |

**请求体：**
```json
{ "reason": "工时填写不规范" }
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `reason` | `string` | 是 | 驳回原因 |

**响应 200 — `TimeEntry`：**
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

## 3. User

### GET `/api/users`

**功能**：获取用户列表，支持按 `username`、`role` 查询过滤。

**Query String 参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `username` | `string` | 否 | 用户名（模糊匹配，不区分大小写） |
| `role` | `string` | 否 | 角色名称，空字符串表示不限 |

**请求示例：**
```
GET /api/users?username=Admin&role=Administrator
```

**响应 200 — `User[]`：**
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

> **注意**：响应中包含 `password` 字段，与 mock 保持一致。

---

### GET `/api/users/{id}`

**功能**：获取单个用户详情。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 用户 ID |

**响应 200 — `User`：**
```json
{
  "id": "1",
  "username": "Administrator",
  "password": "Pass@word0",
  "roles": ["Administrator"],
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

**响应 404：**
```json
{ "message": "用户不存在" }
```

---

### POST `/api/users`

**功能**：新增用户。

**请求体 — `Omit<User, 'id' \| 'createdAt'>`：**
```json
{
  "username": "NewUser",
  "password": "Pass@word0",
  "roles": ["User"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `username` | `string` | 是 | 用户名 |
| `password` | `string` | 是 | 密码 |
| `roles` | `string[]` | 是 | 用户角色列表 |

**响应 201 — `User`：**
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

### PUT `/api/users/{id}`

**功能**：更新用户信息（不含密码）。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 用户 ID |

**请求体 — Partial User（不含 `id`、`createdAt`、`password`）：**
```json
{ "roles": ["ProjectManager"] }
```

**响应 200 — `User`：**
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

### DELETE `/api/users/{id}`

**功能**：删除用户。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 用户 ID |

**响应 200：**
```json
{ "success": true }
```

---

### POST `/api/users/login`

**功能**：用户登录，验证用户名和密码。

**请求体：**
```json
{ "username": "Administrator", "password": "Pass@word0" }
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `username` | `string` | 是 | 用户名 |
| `password` | `string` | 是 | 密码 |

**响应 200 — `User`：**
```json
{
  "id": "1",
  "username": "Administrator",
  "password": "Pass@word0",
  "roles": ["Administrator"],
  "createdAt": "2026-09-15T10:00:00.000Z"
}
```

**响应 401：**
```json
{ "message": "用户名或密码错误" }
```

---

## 4. Role

### GET `/api/roles`

**功能**：获取所有角色列表。

**响应 200 — `Role[]`：**
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

### GET `/api/roles/{id}`

**功能**：获取单个角色详情。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 角色 ID |

**响应 200 — `Role`：**
```json
{
  "id": "1",
  "name": "Administrator",
  "permissions": ["TimeSheet.Read", "User.Read", "User.Write", "Role.Read", "Role.Write"]
}
```

**响应 404：**
```json
{ "message": "角色不存在" }
```

---

### POST `/api/roles`

**功能**：创建角色。

**请求体 — `Omit<Role, 'id'>`：**
```json
{
  "name": "Developer",
  "permissions": ["TimeSheet.Read", "TimeSheet.Write"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `name` | `string` | 是 | 角色名称 |
| `permissions` | `string[]` | 是 | 权限标识列表 |

**响应 201 — `Role`：**
```json
{
  "id": "1726456789000",
  "name": "Developer",
  "permissions": ["TimeSheet.Read", "TimeSheet.Write"]
}
```

---

### PUT `/api/roles/{id}`

**功能**：更新角色（Partial，不含 `id`）。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 角色 ID |

**请求体：**
```json
{ "permissions": ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Export"] }
```

**响应 200 — `Role`：**
```json
{
  "id": "3",
  "name": "User",
  "permissions": ["TimeSheet.Read", "TimeSheet.Write", "TimeSheet.Export"]
}
```

---

### DELETE `/api/roles/{id}`

**功能**：删除角色。

**路径参数：**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `id` | `string` | 是 | 角色 ID |

**响应 200：**
```json
{ "success": true }
```

**响应 403（删除 Administrator 角色）：**
```json
{ "message": "不能删除 Administrator 角色" }
```

---

## 5. 数据类型定义

### TimeEntry

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 记录 ID |
| `projectName` | `string` | 项目名称 |
| `description` | `string` | 工作描述 |
| `hours` | `number` | 工时 |
| `approvalStatus` | `string` | 审批状态：`待审批` / `已通过` / `已驳回` |
| `rejectReason` | `string \| undefined` | 驳回原因（可选） |
| `createdAt` | `string` | 创建时间（ISO 8601） |

### User

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 用户 ID |
| `username` | `string` | 用户名 |
| `password` | `string` | 密码 |
| `roles` | `string[]` | 角色列表 |
| `createdAt` | `string` | 创建时间（ISO 8601） |

### Role

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 角色 ID |
| `name` | `string` | 角色名称 |
| `permissions` | `string[]` | 权限标识列表 |

---

## 6. 端点汇总

| 方法 | 路径 | 说明 | 状态码 |
|---|---|---|---|
| GET | `/api/time-entries` | 列表/查询 | 200 |
| GET | `/api/time-entries/{id}` | 详情 | 200 / 404 |
| POST | `/api/time-entries` | 新增 | 201 |
| POST | `/api/time-entries/batch` | 批量新增 | 201 |
| PUT | `/api/time-entries/{id}` | 编辑 | 200 |
| DELETE | `/api/time-entries/{id}` | 删除 | 200 |
| PUT | `/api/time-entries/{id}/submit` | 提交审批 | 200 |
| PUT | `/api/time-entries/{id}/approve` | 审批通过 | 200 |
| PUT | `/api/time-entries/{id}/reject` | 驳回 | 200 |
| GET | `/api/users` | 列表/查询 | 200 |
| GET | `/api/users/{id}` | 详情 | 200 / 404 |
| POST | `/api/users` | 新增 | 201 |
| PUT | `/api/users/{id}` | 编辑 | 200 |
| DELETE | `/api/users/{id}` | 删除 | 200 |
| POST | `/api/users/login` | 登录 | 200 / 401 |
| GET | `/api/roles` | 列表 | 200 |
| GET | `/api/roles/{id}` | 详情 | 200 / 404 |
| POST | `/api/roles` | 创建 | 201 |
| PUT | `/api/roles/{id}` | 更新 | 200 |
| DELETE | `/api/roles/{id}` | 删除 | 200 / 403 |