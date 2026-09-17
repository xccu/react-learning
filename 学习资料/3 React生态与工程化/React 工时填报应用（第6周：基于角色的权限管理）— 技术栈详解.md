# React 工时填报应用（第6周：基于角色的权限管理）— 技术栈详解

> 本文聚焦第 6 周「基于角色的权限管理（RBAC）」中**新增的业务逻辑与设计模式**，不涉及前 5 周已讲过的 React Router、Axios、Redux Toolkit、Ant Design、React Hook Form 等基础知识。每个知识点均结合第 6 周的真实代码，包含定义、示例、使用效果和注意事项。

> **当前项目版本：** React `19.2.7`，TypeScript `~6.0.2`，依赖全部沿用第 1-5 周。

> **当前项目范围说明：** 本次在第 5 周基础上新增 RBAC 权限管理体系，包括用户-角色-权限实体模型、权限定义常量、角色 CRUD API 与 Mock 数据、Redux 角色状态管理、权限存储工具函数、权限管理页面（角色列表 + 权限分配）、权限控制组件（RequirePermission / usePermission）、基于权限的动态导航菜单、路由级权限守卫、403 页面。

---

## 一、本周新增内容概览

第 6 周没有引入新的依赖库，核心新增内容如下：

| 新增内容 | 涉及文件 | 核心概念 |
|---------|---------|---------|
| 权限类型定义 | `src/types/timeEntry.ts` | Permission 类型、RoleName 联合类型、Role 接口、PERMISSIONS 常量、PERMISSION_LABELS 映射、ROLE_PERMISSIONS 映射 |
| 角色 Mock 数据与 API | `src/api/mockApi.ts` / `mockAdapter.ts` / `timeEntryApi.ts` | 角色 CRUD 函数、hasPermission / getUserPermissions 权限检查函数、RESTful 路由注册 |
| Redux 角色状态管理 | `src/store/userSlice.ts` | roles 状态字段、fetchRoles / createRole / updateRole / removeRole 异步 thunks、角色同步 reducers |
| 权限存储工具 | `src/utils/auth.ts` | savePermissions / getPermissions / hasPermission localStorage 操作 |
| 登录权限流程 | `src/pages/LoginPage.tsx` | 登录后从用户角色 + 角色列表计算权限、savePermissions 存储 |
| 权限管理页面 | `PermissionListPage.tsx` / `PermissionAssignPage.tsx` | 角色列表表格 + 搜索 + 删除、角色创建/编辑 + Select 多选权限分配 |
| 403 页面 | `src/pages/UnauthorizedPage.tsx` | Ant Design Result 组件展示无权限提示 |
| 权限控制组件 | `RequirePermission.tsx` / `usePermission.ts` | HOC 组件 + Hook 两种权限检查方式 |
| 动态导航菜单 | `src/components/timesheet/AppLayout.tsx` | 基于用户权限过滤菜单项 |
| 路由级权限控制 | `src/App.tsx` / `RequireAuth.tsx` | 扩展 RequireAuth 支持 permissions 参数、路由守卫权限检查 |

---

## 二、知识点详解

### 1. 权限类型定义与常量

#### 定义

在 `src/types/timeEntry.ts` 中新增 Permission、RoleName、Role 类型定义，以及三个常量：PERMISSIONS（所有权限标识数组）、PERMISSION_LABELS（权限标识到中文标签的映射）、ROLE_PERMISSIONS（默认角色到权限集合的映射）。

#### 示例

```ts
// 权限标识类型：用 string 表示，约定格式为 {Domain}.{Action}
export type Permission = string

// 预定义角色名称：字面量联合类型，保证类型安全
export type RoleName = 'Administrator' | 'ProjectManager' | 'User'

// 用户角色：支持自定义角色名称（不限于预定义角色）
export type UserRole = string

// 角色类型
export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

// 预定义角色名称列表（用于校验）
export const PREDEFINED_ROLE_NAMES: RoleName[] = ['Administrator', 'ProjectManager', 'User']

// 权限映射：权限标识 → 中文显示标签
export const PERMISSION_LABELS: Record<Permission, string> = {
  'TimeSheet.Read': '工时查询',
  'TimeSheet.Write': '工时增删改',
  'TimeSheet.Export': '工时导出',
  'TimeSheet.Import': '工时导入',
  'TimeSheet.approval': '工时审批',
  'User.Read': '用户查询',
  'User.Write': '用户增删改',
  'Role.Read': '角色读取',
  'Role.Write': '角色管理',
}

// 所有权限标识常量（9 个权限）
export const PERMISSIONS: Permission[] = [
  'TimeSheet.Read',
  'TimeSheet.Write',
  'TimeSheet.Export',
  'TimeSheet.Import',
  'TimeSheet.approval',
  'User.Read',
  'User.Write',
  'Role.Read',
  'Role.Write',
]

// 默认角色权限映射
export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  User: ['TimeSheet.Read', 'TimeSheet.Write'],
  ProjectManager: ['TimeSheet.Read', 'TimeSheet.Write', 'TimeSheet.Export', 'TimeSheet.Import', 'TimeSheet.approval', 'User.Read', 'User.Write'],
  Administrator: ['TimeSheet.Read', 'User.Read', 'User.Write', 'Role.Read', 'Role.Write'],
}
```

- **`Permission = string`**：用字符串类型足够，不需要复杂对象。约定格式为 `{Domain}.{Action}`（如 `TimeSheet.Read`）
- **`RoleName`**：字面量联合类型，IDE 提供自动补全，编译时防止传入非法角色名
- **`UserRole = string`**：从第 5 周的 `UserRole = '管理员' | '普通用户'` 改为开放字符串，支持自定义角色
- **`Role.permissions: Permission[]`**：角色包含权限数组，一个权限可以被多个角色拥有
- **`PERMISSION_LABELS`**：`Record<Permission, string>` 类型确保每个权限都有对应的中文标签，用于 UI 展示
- **`ROLE_PERMISSIONS`：定义三种预定义角色的默认权限集合，ProjectManager 权限最全面（7 个），Administrator 侧重管理（5 个），User 权限最少（2 个）

#### 权限列表与描述

| 权限标识 | 中文标签 | 所属域 | 操作 | 描述 |
|---------|---------|--------|------|------|
| `TimeSheet.Read` | 工时查询 | TimeSheet | Read | 查看工时记录列表和详情 |
| `TimeSheet.Write` | 工时增删改 | TimeSheet | Write | 创建、编辑、删除工时记录 |
| `TimeSheet.Export` | 工时导出 | TimeSheet | Export | 将工时记录导出为 Excel 文件 |
| `TimeSheet.Import` | 工时导入 | TimeSheet | Import | 从 Excel 文件批量导入工时记录 |
| `TimeSheet.approval` | 工时审批 | TimeSheet | Approval | 提交、审批、驳回工时记录 |
| `User.Read` | 用户查询 | User | Read | 查看用户列表和用户详情 |
| `User.Write` | 用户增删改 | User | Write | 创建、编辑、删除用户 |
| `Role.Read` | 角色读取 | Role | Read | 查看角色列表和角色详情 |
| `Role.Write` | 角色管理 | Role | Write | 创建、编辑、删除角色 |

> **权限命名规范**：采用 `{Domain}.{Action}` 格式，Domain 表示业务域（TimeSheet / User / Role），Action 表示操作类型（Read / Write / Export / Import / Approval）。

#### 默认用户-角色-权限映射关系

| 用户名 | 角色 | 权限列表 | 权限数量 | 可用功能 |
|--------|------|---------|---------|---------|
| Administrator | Administrator | `TimeSheet.Read`, `User.Read`, `User.Write`, `Role.Read`, `Role.Write` | 5 | 工时查询、用户管理、角色管理（无工时增删改、无审批） |
| ProjectManager | ProjectManager | `TimeSheet.Read`, `TimeSheet.Write`, `TimeSheet.Export`, `TimeSheet.Import`, `TimeSheet.approval`, `User.Read`, `User.Write` | 7 | 工时全操作（含导入导出审批）、用户管理（无角色管理） |
| User | User | `TimeSheet.Read`, `TimeSheet.Write` | 2 | 工时查询、工时增删改（无导入导出、无审批、无用户/角色管理） |

#### 使用效果

```ts
import { PERMISSIONS, PERMISSION_LABELS, ROLE_PERMISSIONS } from './types/timeEntry'

// 遍历所有权限
PERMISSIONS.forEach(p => console.log(PERMISSION_LABELS[p]))
// 输出: 工时查询, 工时增删改, 工时导出, ...

// 获取 Administrator 的默认权限
const adminPerms = ROLE_PERMISSIONS['Administrator']
// ['TimeSheet.Read', 'User.Read', 'User.Write', 'Role.Read', 'Role.Write']
```

#### 注意事项

- `RoleName` 仅用于预定义角色（系统内置的三种角色），`UserRole` 是开放字符串，允许创建自定义角色。
- `PERMISSION_LABELS` 的键类型是 `Permission`（即 string），TypeScript 会在编译时检查是否所有 PERMISSIONS 中的标识都有对应标签。
- `ROLE_PERMISSIONS` 的键类型是 `RoleName`，仅覆盖三种预定义角色。自定义角色无默认权限映射。

---

### 2. 角色 Mock 数据与 API 层扩展

#### 定义

在 `mockApi.ts` 中新增 roles 数组（3 个默认角色）、角色 CRUD 函数（getRoles / getRoleById / getRoleByName / createRole / updateRole / deleteRole）以及权限检查函数（hasPermission / getUserPermissions）。在 `mockAdapter.ts` 中注册角色 RESTful 路由。在 `timeEntryApi.ts` 中新增角色 HTTP 封装函数。

#### 示例 — Mock 数据

```ts
// 默认角色数据
let roles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    permissions: ['TimeSheet.Read', 'User.Read', 'User.Write', 'Role.Read', 'Role.Write'],
  },
  {
    id: '2',
    name: 'ProjectManager',
    permissions: ['TimeSheet.Read', 'TimeSheet.Write', 'TimeSheet.Export', 'TimeSheet.Import', 'TimeSheet.approval', 'User.Read', 'User.Write'],
  },
  {
    id: '3',
    name: 'User',
    permissions: ['TimeSheet.Read', 'TimeSheet.Write'],
  },
]
```

#### 示例 — 角色 CRUD 函数

```ts
// 获取所有角色
export async function getRoles(): Promise<Role[]> {
  return Promise.resolve([...roles])
}

// 获取单个角色
export async function getRoleById(id: string): Promise<Role> {
  const role = roles.find((r) => r.id === id)
  if (!role) return Promise.reject(new Error('角色不存在'))
  return Promise.resolve({ ...role })
}

// 创建角色
export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const newRole: Role = { ...role, id: Date.now().toString() }
  roles = [...roles, newRole]
  return Promise.resolve(newRole)
}

// 更新角色
export async function updateRole(id: string, updates: Partial<Omit<Role, 'id'>>): Promise<Role> {
  const index = roles.findIndex((r) => r.id === id)
  if (index === -1) return Promise.reject(new Error('角色不存在'))
  roles[index] = { ...roles[index], ...updates }
  return Promise.resolve({ ...roles[index] })
}

// 删除角色：Administrator 不可删除
export async function deleteRole(id: string): Promise<void> {
  const role = roles.find((r) => r.id === id)
  if (!role) return Promise.reject(new Error('角色不存在'))
  if (role.name === 'Administrator') {
    return Promise.reject(new Error('不能删除 Administrator 角色'))
  }
  roles = roles.filter((r) => r.id !== id)
  return Promise.resolve()
}
```

- **`deleteRole` 保护 Administrator**：尝试删除 Administrator 角色时返回错误，HTTP 层会返回 403 状态码
- **`createRole` 使用 `Omit<Role, 'id'>`**：传入数据不包含 id，由函数自动生成
- **`updateRole` 使用 `Partial<Omit<Role, 'id'>>`**：允许部分更新，name 和 permissions 都可改

#### 示例 — 权限检查函数

```ts
// 检查用户是否有指定权限（任一角色拥有即可）
export function hasPermission(userRoles: UserRole[], permission: Permission): boolean {
  for (const roleName of userRoles) {
    const role = roles.find((r) => r.name === roleName)
    if (role && role.permissions.includes(permission)) {
      return true
    }
  }
  return false
}

// 获取用户的所有权限（合并所有角色的权限，去重）
export function getUserPermissions(userRoles: UserRole[]): Permission[] {
  const permissions: Permission[] = []
  for (const roleName of userRoles) {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      permissions.push(...role.permissions)
    }
  }
  return [...new Set(permissions)]
}
```

- **`hasPermission`**：遍历用户的所有角色，任一角色包含目标权限即返回 `true`。这是「或」逻辑——用户拥有角色 A 或角色 B 的权限即可
- **`getUserPermissions`**：收集用户所有角色的权限，用 `new Set()` 去重后返回。一个用户可能同时拥有 Administrator 和 User 角色，权限会合并

#### 示例 — Mock Adapter 路由注册

```ts
// 角色列表
mock.onGet('/roles').reply(() => {
  return getRoles().then((data) => [200, data])
})

// 角色详情
mock.onGet(/\/roles\/.+$/).reply((config) => {
  const id = (config.url ?? '').split('/').pop() ?? ''
  return getRoleById(id).then(
    (data) => [200, data],
    (err) => [404, { message: err instanceof Error ? err.message : '角色不存在' }]
  )
})

// 创建角色
mock.onPost('/roles').reply((config) => {
  const body = JSON.parse(config.data) as Omit<Role, 'id'>
  return createRole(body).then((data) => [201, data])
})

// 更新角色
mock.onPut(/\/roles\/.+$/).reply((config) => {
  const id = (config.url ?? '').split('/').pop() ?? ''
  const body = JSON.parse(config.data) as Partial<Omit<Role, 'id'>>
  return updateRole(id, body).then(
    (data) => [200, data],
    (err) => [404, { message: err instanceof Error ? err.message : '角色不存在' }]
  )
})

// 删除角色：成功 200，失败（如删除 Administrator）返回 403
mock.onDelete(/\/roles\/.+$/).reply((config) => {
  const id = (config.url ?? '').split('/').pop() ?? ''
  return deleteRole(id).then(
    () => [200, { success: true }],
    (err) => [403, { message: err instanceof Error ? err.message : '删除失败' }]
  )
})
```

#### 示例 — API 函数签名

```ts
// src/api/timeEntryApi.ts

export async function getRoles(): Promise<Role[]> {
  const { data } = await httpClient.get<Role[]>('/roles')
  return data
}

export async function getRoleById(id: string): Promise<Role> {
  const { data } = await httpClient.get<Role>(`/roles/${id}`)
  return data
}

export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const { data } = await httpClient.post<Role>('/roles', role)
  return data
}

export async function updateRole(id: string, updates: Partial<Omit<Role, 'id'>>): Promise<Role> {
  const { data } = await httpClient.put<Role>(`/roles/${id}`, updates)
  return data
}

export async function deleteRole(id: string): Promise<void> {
  await httpClient.delete(`/roles/${id}`)
}
```

#### 使用效果

角色管理相关的 API 调用与工时、用户的 API 调用共用同一个 `httpClient` 和 `mockAdapter`，通过 `/roles` 路径区分。

#### 注意事项

- 删除 Administrator 角色时，mockAdapter 返回 403 状态码（而非 404），与「无权限」语义一致。
- `hasPermission` 和 `getUserPermissions` 是同步函数，直接操作内存中的 roles 数组，无需 await。

---

### 3. Redux 角色状态管理

#### 定义

在 `userSlice.ts` 中新增 `roles: Role[]` 状态字段，以及 4 个异步 thunks（fetchRoles / createRole / updateRole / removeRole）和 4 个同步 reducers（setRoles / addRole / updateRoleSync / deleteRoleSync）。

#### 示例

```ts
interface UserState {
  users: User[]
  currentUser: User | null
  roles: Role[]        // 新增：角色列表
  loading: boolean
  error: string | null
}

// 异步 thunks
export const fetchRoles = createAsyncThunk<Role[]>('user/fetchRoles', async () => {
  return getRolesApi()
})

export const createRole = createAsyncThunk<Role, Omit<Role, 'id'>>('user/createRole', async (roleData) => {
  return createRoleApi(roleData)
})

export const updateRole = createAsyncThunk<Role, { id: string; updates: Partial<Omit<Role, 'id'>> }>(
  'user/updateRole',
  async ({ id, updates }) => {
    return updateRoleApi(id, updates)
  }
)

export const removeRole = createAsyncThunk<void, string, { rejectValue: string }>('user/deleteRole', async (id, { rejectWithValue }) => {
  try {
    await deleteRoleApi(id)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : '删除失败')
  }
})

// 同步 reducers
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ... 用户相关 reducers ...
    setRoles(state, action: PayloadAction<Role[]>) {
      state.roles = action.payload
    },
    addRole(state, action: PayloadAction<Role>) {
      state.roles.push(action.payload)
    },
    updateRoleSync(state, action: PayloadAction<Role>) {
      const index = state.roles.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.roles[index] = action.payload
      }
    },
    deleteRoleSync(state, action: PayloadAction<string>) {
      state.roles = state.roles.filter((r) => r.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    // fetchRoles / createRole / updateRole / removeRole 的 pending/fulfilled/rejected 处理...
  },
})
```

- **`roles: Role[]`**：状态树中新增角色列表字段，初始为空数组
- **`fetchRoles`**：登录后或权限管理页面挂载时调用，加载全部角色
- **`createRole` / `updateRole` / `removeRole`**：角色 CRUD 的异步操作，通过 `extraReducers` 处理状态更新
- **同步 vs 异步 reducer 命名区分**：`updateRole` async thunk 对应 `updateRoleSync` 同步 reducer，`removeRole` async thunk 对应 `deleteRoleSync` 同步 reducer，避免命名冲突
- **`rejectWithValue`**：删除角色失败（如删除 Administrator）时携带错误信息

#### 状态树结构（含角色）

```ts
{
  timesheet: { entries: [...], loading: false, error: null },
  user: {
    users: [...],
    currentUser: { id: '1', username: 'Administrator', roles: ['Administrator'], ... },
    roles: [
      { id: '1', name: 'Administrator', permissions: ['TimeSheet.Read', 'User.Read', ...] },
      { id: '2', name: 'ProjectManager', permissions: ['TimeSheet.Read', ...] },
      { id: '3', name: 'User', permissions: ['TimeSheet.Read', 'TimeSheet.Write'] },
    ],
    loading: false,
    error: null,
  },
}
```

#### 使用效果

```ts
// 读取角色列表
const roles = useSelector((state: RootState) => state.user.roles)

// 加载角色列表
await dispatch(fetchRoles()).unwrap()

// 创建角色
await dispatch(createRole({ name: 'Developer', permissions: ['TimeSheet.Read', 'TimeSheet.Write'] })).unwrap()

// 删除角色
await dispatch(removeRole('3')).unwrap()
```

#### 注意事项

- `roles` 状态在登录后通过 `dispatch(fetchRoles())` 加载，权限管理页面挂载时也调用。
- 创建角色后，`createRole.fulfilled` reducer 使用 `state.roles.push()` 追加新角色（而非 unshift），因为角色列表通常不需要置顶显示。

---

### 4. 权限的 localStorage 存储

#### 定义

在 `utils/auth.ts` 中新增权限的 localStorage 存储和读取功能，包括 `savePermissions`、`getPermissions`、`hasPermission` 三个函数。权限信息在登录时计算并存储，在页面刷新后作为 Redux 状态的 fallback。

#### 示例

```ts
const PERMISSIONS_STORAGE_KEY = 'react-app:permissions'

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

// 检查是否有指定权限
export function hasPermission(permission: string): boolean {
  const permissions = getPermissions()
  return permissions.includes(permission)
}
```

- **`PERMISSIONS_STORAGE_KEY`**：使用 `react-app:permissions` 作为 localStorage key，与项目命名规范一致
- **`JSON.stringify` / `JSON.parse`**：权限是数组，需要序列化存储。parse 时 try-catch 防止数据损坏导致崩溃
- **`hasPermission`**：简化版权限检查，仅检查 localStorage 中存储的权限。与 Redux 版的 `hasPermission`（检查 roles + permissions 计算）不同
- **`logout` 中清除权限**：退出登录时同时清除 `PERMISSIONS_STORAGE_KEY`

#### 使用效果

```ts
import { savePermissions, getPermissions, hasPermission } from './utils/auth'

// 登录后存储权限
savePermissions(['TimeSheet.Read', 'TimeSheet.Write', 'User.Read'])

// 页面刷新后读取
const perms = getPermissions()  // ['TimeSheet.Read', 'TimeSheet.Write', 'User.Read']

// 检查权限
if (hasPermission('Role.Read')) {
  // 显示权限管理菜单
}
```

#### 注意事项

- localStorage 存储的权限是**扁平数组**，不包含角色信息。这与 Redux store 中的结构不同（Redux 中是 User.roles + Role[]）。
- 权限数据在登录时计算一次后持久化，角色权限变更（如编辑角色）后**不会自动更新** localStorage。这是一个已知限制，生产环境应通过 token 刷新或事件通知机制同步。

---

### 5. 登录权限流程

#### 定义

第 6 周将登录流程从「仅验证用户 + 保存用户信息」扩展为「验证用户 + 加载用户列表 + 加载角色列表 + 计算用户权限 + 保存权限」。登录后根据用户的 roles 字段，从角色列表中查找对应角色的 permissions，合并后存入 localStorage。

#### 示例

```tsx
// src/pages/LoginPage.tsx

const handleFormSubmit = async (values: { username: string; password: string }) => {
  const username = values.username.trim()
  const password = values.password

  try {
    // 1. 调用 loginUser thunk 验证用户
    await dispatch(loginUser({ username, password })).unwrap()

    // 2. 保存登录态 + 用户名
    login()
    saveUsername(username)

    // 3. 加载用户列表和角色列表
    const fetchedUsers = await dispatch(fetchUsers()).unwrap()
    const fetchedRoles = await dispatch(fetchRoles()).unwrap()

    // 4. 从用户角色 + 角色列表计算权限
    const currentUser = fetchedUsers.find((u) => u.username === username)
    const permissions = currentUser?.roles.flatMap((roleName) => {
      const role = fetchedRoles.find((r) => r.name === roleName)
      return role ? role.permissions : []
    }) ?? []
    savePermissions(permissions)

    // 5. 跳转到主页
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  } catch (err) {
    message.error(err instanceof Error ? err.message : '登录失败')
  }
}
```

- **`dispatch(fetchUsers())` + `dispatch(fetchRoles())`**：登录后同时加载用户列表和角色列表，为权限计算提供数据
- **`currentUser.roles.flatMap(...)`**：遍历用户的所有角色，从角色列表中查找对应角色的 permissions，扁平化合并
- **`savePermissions(permissions)`**：将计算出的权限数组存入 localStorage，供路由守卫和组件读取
- **`?? []`**：如果用户不存在或没有角色，权限为空数组，所有受保护页面都会拒绝访问

#### 使用效果

- 登录 Administrator → 权限：`['TimeSheet.Read', 'User.Read', 'User.Write', 'Role.Read', 'Role.Write']`（5 个）
- 登录 ProjectManager → 权限：`['TimeSheet.Read', 'TimeSheet.Write', 'TimeSheet.Export', 'TimeSheet.Import', 'TimeSheet.approval', 'User.Read', 'User.Write']`（7 个）
- 登录 User → 权限：`['TimeSheet.Read', 'TimeSheet.Write']`（2 个）

#### 注意事项

- 权限计算在**前端完成**，依赖角色列表数据。如果角色列表未加载，权限计算会不完整。
- 快捷登录链接从第 5 周的 `admin/user1/user2` 改为 `Administrator/ProjectManager/User`，密码统一为 `Pass@word0`。

---

### 6. 权限管理页面

#### 6.1 角色列表页（PermissionListPage）

##### 定义

权限管理页面展示角色列表表格，支持按角色名称搜索、删除角色（Administrator 不可删除）、新增角色（跳转到权限分配页）、编辑角色权限（跳转到权限分配页）。

##### 示例

```tsx
function PermissionListPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const roles = useSelector((state: RootState) => state.user.roles)
  const [filtered, setFiltered] = useState<Role[] | null>(null)

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  // 搜索：按角色名称模糊匹配
  const handleQuery = useCallback((values: { name?: string }) => {
    if (!values.name?.trim()) {
      setFiltered(null)  // 清空搜索，显示全部
    } else {
      setFiltered(roles.filter((r) => r.name.toLowerCase().includes(values.name!.toLowerCase().trim())))
    }
  }, [roles])

  // 删除角色：Modal.confirm 确认
  const handleDelete = (role: Role) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 "${role.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await dispatch(removeRole(role.id)).unwrap()
          message.success('删除成功')
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败')
        }
      },
    })
  }

  // 表格列定义
  const columns = [
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '权限数量', key: 'permissionCount', render: (_: unknown, record: Role) => record.permissions.length },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, record: Role) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/permissions/assign/${record.id}`)}>分配权限</Button>
          <Button type="link" danger icon={<DeleteOutlined />} disabled={record.name === 'Administrator'} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Header title="权限管理" icon={<SettingOutlined />} />
      {/* 搜索表单 */}
      <Form form={form} layout="inline" onFinish={handleQuery}>
        <Form.Item label="角色名称" name="name">
          <Input allowClear placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={handleClear}>清空</Button>
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => navigate('/permissions/assign')}>新增角色</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={filtered ?? roles} rowKey="id" pagination={false} />
    </div>
  )
}
```

- **`disabled={record.name === 'Administrator'}`**：Administrator 角色的删除按钮禁用，防止误删
- **`Modal.confirm`**：删除前弹出确认框，点击确认后调用 `removeRole` thunk
- **`filtered ?? roles`**：搜索结果为 null 时显示全部角色，有搜索结果时显示过滤后的列表
- **权限数量列**：`record.permissions.length` 显示该角色拥有的权限数量

#### 6.2 权限分配页（PermissionAssignPage）

##### 定义

权限分配页面用于创建新角色或编辑已有角色的权限。使用 Ant Design Select 组件（mode="multiple"）进行多选权限分配。

##### 示例

```tsx
function PermissionAssignPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams<{ id: string }>()
  const roles = useSelector((state: RootState) => state.user.roles)
  const [form] = Form.useForm<{ name: string; permissions: string[] }>()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const isEditMode = Boolean(id)

  // 编辑模式：加载角色数据
  useEffect(() => {
    if (isEditMode) {
      const role = roles.find((r) => r.id === id)
      if (role) {
        form.setFieldsValue({ name: role.name, permissions: role.permissions })
        setSelectedPermissions(role.permissions)
      }
    } else {
      setSelectedPermissions([])
    }
  }, [id, isEditMode, roles, form])

  // 提交：创建或更新角色
  const handleSubmit = async () => {
    const values = form.getFieldsValue()
    if (!values.name?.trim()) {
      message.error('请输入角色名称')
      return
    }

    setLoading(true)
    try {
      if (isEditMode) {
        // 更新角色
        await dispatch(updateRole({ id: id!, updates: { name: values.name.trim(), permissions: selectedPermissions } })).unwrap()
        dispatch(updateRoleSync({ id: id!, name: values.name.trim(), permissions: selectedPermissions } as Role))
        message.success('更新成功')
      } else {
        // 创建角色
        await dispatch(createRole({ name: values.name.trim(), permissions: selectedPermissions })).unwrap()
        message.success('创建成功')
      }
      navigate('/permissions')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // Select 选项：从 PERMISSIONS 和 PERMISSION_LABELS 生成
  const selectOptions = PERMISSIONS.map((p) => ({
    label: PERMISSION_LABELS[p],
    value: p,
  }))

  return (
    <div>
      <Card title={isEditMode ? '编辑角色' : '新增角色'}>
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" disabled={isEditMode} />
          </Form.Item>

          <Form.Item name="permissions" label="分配权限">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择权限"
              options={selectOptions}
              value={selectedPermissions}
              onChange={handlePermissionChange}
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {isEditMode ? '保存' : '创建'}
              </Button>
              <Button onClick={() => navigate('/permissions')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
```

- **`disabled={isEditMode}`**：编辑模式下角色名称不可修改，仅允许修改权限
- **`Select mode="multiple"`**：多选模式，已选权限以 Tag 形式显示，支持搜索过滤
- **`optionFilterProp="label"`**：支持按中文标签搜索权限（如输入「工时」可筛选出所有 TimeSheet 相关权限）
- **`selectedPermissions` 独立 state**：Select 的 value 通过独立 state 管理，而非 Form 的 `getFieldValue`，因为 Select 的 `onChange` 需要立即响应
- **`updateRole` thunk + `updateRoleSync` reducer**：先调用异步 thunk 完成 API 调用，再 dispatch 同步 reducer 更新 Redux 状态

#### 使用效果

- 新增角色：输入角色名称 → 勾选权限 → 点击创建 → 返回列表
- 编辑角色：点击「分配权限」→ 角色名称不可改 → 修改权限勾选 → 点击保存 → 返回列表

#### 注意事项

- 编辑模式下角色名称不可修改。如果需要支持修改角色名称，需移除 `disabled` 属性。
- 创建角色后未将新角色 `unshift` 到 `state.roles`，而是 `push`。如果列表需要置顶显示，应改为 `unshift`。

---

### 7. 权限控制组件与 Hook

#### 7.1 RequirePermission 组件

##### 定义

`RequirePermission` 是一个 HOC 组件，接收 `permissions` 数组和 `children`，仅当用户拥有所有指定权限时才渲染子元素，否则渲染 `fallback`（默认为 null）。

##### 示例

```tsx
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

  // 未登录时不渲染
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

  // 优先使用 Redux 权限
  if (userPermissions.size > 0) {
    const hasAllPermissions = permissions.every((p) => userPermissions.has(p))
    return hasAllPermissions ? <>{children}</> : <>{fallback}</>
  }

  // Fallback：从 localStorage 读取权限
  const storedPermissions = getPermissions()
  const hasAllPermissions = permissions.every((p) => storedPermissions.includes(p))
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>
}
```

- **`permissions.every(...)`**：「与」逻辑——用户必须拥有**所有**指定权限才放行
- **`new Set<string>()`**：使用 Set 去重，避免重复权限影响判断
- **三级 fallback**：Redux 权限 → localStorage 权限 → 不渲染。确保页面刷新后权限检查仍然有效

##### 使用效果

```tsx
// 只有拥有 TimeSheet.Write 权限的用户才能看到新增按钮
<RequirePermission permissions={['TimeSheet.Write']}>
  <Button onClick={() => navigate('/timesheet/create')}>新增工时</Button>
</RequirePermission>

// 需要同时拥有 User.Read 和 User.Write 才能看到编辑按钮
<RequirePermission permissions={['User.Read', 'User.Write']}>
  <Button>编辑用户</Button>
</RequirePermission>
```

##### 注意事项

- `RequirePermission` 检查的是**所有**权限（与逻辑）。如果只需要任一权限（或逻辑），应使用 `usePermission` Hook。
- 组件读取 Redux 状态，会在 `currentUser` 或 `roles` 变化时重新渲染。

#### 7.2 usePermission Hook

##### 定义

`usePermission` 是一个自定义 Hook，接收一个权限标识，返回布尔值表示当前用户是否拥有该权限。

##### 示例

```tsx
function usePermission(permission: string): boolean {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  // 未登录时 fallback 到 localStorage
  if (!currentUser) {
    const storedPermissions = getPermissions()
    return storedPermissions.includes(permission)
  }

  // 从 Redux 计算用户权限
  const userPermissions = new Set<string>()
  currentUser.roles.forEach((roleName) => {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      role.permissions.forEach((p) => userPermissions.add(p))
    }
  })

  // 优先使用 Redux 权限
  if (userPermissions.has(permission)) return true

  // Redux 未加载时 fallback 到 localStorage
  if (userPermissions.size === 0) {
    const storedPermissions = getPermissions()
    return storedPermissions.includes(permission)
  }

  return false
}
```

- **返回 `boolean`**：直接返回是否拥有权限，适合在组件逻辑中使用（如条件渲染、禁用按钮）
- **三级 fallback**：与 `RequirePermission` 相同的 fallback 策略

##### 使用效果

```tsx
function TimeEntryListPage() {
  const hasWritePermission = usePermission('TimeSheet.Write')

  return (
    <Space>
      <Button disabled={!hasWritePermission}>新增</Button>
      {hasWritePermission && <Button type="primary">编辑</Button>}
    </Space>
  )
}
```

##### 注意事项

- `usePermission` 在每次 `currentUser` 或 `roles` 变化时会重新计算。如果频繁调用，可考虑使用 `useMemo` 缓存结果。
- Hook 方式的权限检查适合按钮级别的细粒度控制，组件方式适合页面级别的守卫。

---

### 8. 基于权限的动态导航菜单

#### 定义

在 `AppLayout.tsx` 中，将静态菜单项改为基于用户权限动态过滤。定义 `allMenuItems` 数组（包含权限要求），通过 `userPermissions.includes(item.permission)` 过滤出用户可见的菜单项。

#### 示例

```tsx
function AppLayout() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  // 收集用户所有权限
  const userPermissions: string[] = []
  if (currentUser) {
    currentUser.roles.forEach((roleName) => {
      const role = roles.find((r) => r.name === roleName)
      if (role) {
        userPermissions.push(...role.permissions)
      }
    })
  }

  // 页面刷新后 Redux 权限丢失时，从 localStorage 获取
  if (userPermissions.length === 0) {
    const storedPermissions = getPermissions()
    if (storedPermissions.length > 0) {
      userPermissions.push(...storedPermissions)
    }
  }

  // 权限映射：菜单项 → 所需权限
  const allMenuItems = [
    { key: '/', icon: <FileTextOutlined />, label: '工时列表', permission: 'TimeSheet.Read' },
    { key: '/users', icon: <UserOutlined />, label: '用户管理', permission: 'User.Read' },
    { key: '/permissions', icon: <SettingOutlined />, label: '权限管理', permission: 'Role.Read' },
  ]

  // 过滤出用户有权限的菜单项
  const menuItems = allMenuItems.filter((item) => userPermissions.includes(item.permission))

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={({ key }) => navigate(key)} theme="dark" />
        {/* 用户信息区 */}
      </div>
      <div className={styles.main}><Outlet /></div>
    </div>
  )
}
```

- **`allMenuItems`**：每个菜单项携带 `permission` 字段，定义该菜单的权限要求
- **`menuItems = allMenuItems.filter(...)`**：过滤出用户有权限的菜单项，无权限的菜单自动隐藏
- **localStorage fallback**：页面刷新后 Redux 的 `currentUser` 丢失，但 `roles` 可能还未加载，此时从 localStorage 读取权限保证菜单正常显示

#### 不同角色的菜单显示

| 角色 | 可见菜单 |
|------|---------|
| Administrator | 工时列表、用户管理、权限管理 |
| ProjectManager | 工时列表、用户管理（无权限管理） |
| User | 工时列表（无用户管理、无权限管理） |

#### 注意事项

- 菜单过滤是**前端隐藏**，不替代路由级权限守卫。用户仍可通过直接输入 URL 访问受保护页面（由 RequireAuth 守卫）。
- 权限映射表硬编码在组件中。如果菜单项很多，可考虑提取到单独的常量文件。

---

### 9. 路由级权限控制

#### 定义

扩展 `RequireAuth` 组件，增加可选的 `permissions` 参数。在路由配置中，为需要特定权限的路由包裹 `RequireAuth permissions={[]}`。

#### 示例 — RequireAuth 扩展

```tsx
function RequireAuth({
  children,
  permissions,    // 新增：可选权限检查
}: {
  children?: ReactNode
  permissions?: string[]
}) {
  const location = useLocation()
  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const roles = useSelector((state: RootState) => state.user.roles)

  // 未登录 → 跳转登录页
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // 权限检查（如果指定了 permissions）
  if (permissions && permissions.length > 0) {
    let userPermissions: string[] = []

    // 优先从 Redux 获取
    if (currentUser) {
      currentUser.roles.forEach((roleName) => {
        const role = roles.find((r) => r.name === roleName)
        if (role) {
          userPermissions.push(...role.permissions)
        }
      })
    }

    // Redux 未加载时 fallback 到 localStorage
    if (userPermissions.length === 0) {
      userPermissions = getPermissions()
    }

    // 权限检查：用户必须拥有所有指定权限
    if (userPermissions.length > 0) {
      const hasPermission = permissions.every((p) => userPermissions.includes(p))
      if (!hasPermission) {
        return <Navigate to="/unauthorized" replace />
      }
    }
  }

  return children || <Outlet />
}
```

#### 示例 — 路由配置

```tsx
// src/App.tsx

<Routes>
  {/* 登录页：无守卫 */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/login/Administrator" element={<LoginPage />} />
  <Route path="/login/ProjectManager" element={<LoginPage />} />
  <Route path="/login/User" element={<LoginPage />} />

  {/* 403 页面 */}
  <Route path="/unauthorized" element={<UnauthorizedPage />} />

  {/* 受保护主布局 */}
  <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
    {/* 工时列表：无需额外权限（RequireAuth 已保证已登录） */}
    <Route index element={<TimeEntryListPage />} />

    {/* 工时新增：需要 TimeSheet.Write */}
    <Route element={<RequireAuth permissions={['TimeSheet.Write']} />}>
      <Route path="timesheet/create" element={<TimeEntryCreatePage />} />
    </Route>

    {/* 工时编辑：需要 TimeSheet.Write */}
    <Route element={<RequireAuth permissions={['TimeSheet.Write']} />}>
      <Route path="timesheet/:id/edit" element={<TimeEntryEditPage />} />
    </Route>

    {/* 工时详情：只需已登录（TimeSheet.Read 由菜单控制） */}
    <Route path="timesheet/:id" element={<TimeEntryDetailPage />} />

    {/* 用户管理：需要 User.Read */}
    <Route element={<RequireAuth permissions={['User.Read']} />}>
      <Route path="users" element={<UserListPage />} />
      <Route path="users/:id" element={<UserDetailPage />} />
    </Route>

    {/* 用户新增/编辑：需要 User.Write */}
    <Route element={<RequireAuth permissions={['User.Write']} />}>
      <Route path="users/create" element={<UserCreatePage />} />
      <Route path="users/:id/edit" element={<UserEditPage />} />
    </Route>

    {/* 权限管理：需要 Role.Read */}
    <Route element={<RequireAuth permissions={['Role.Read']} />}>
      <Route path="permissions" element={<PermissionListPage />} />
      <Route path="permissions/assign" element={<PermissionAssignPage />} />
      <Route path="permissions/assign/:id" element={<PermissionAssignPage />} />
    </Route>
  </Route>

  {/* 404 兜底 */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

- **`<RequireAuth permissions={['TimeSheet.Write']} />`**：路由级权限守卫，无权限时跳转到 `/unauthorized`
- **嵌套路由**：`Route element={...}` 包裹子路由，实现权限组控制
- **路由注册顺序**：`/permissions/assign/:id` 在 `/permissions/assign` 之后声明，但 React Router v7 的嵌套路由规则下，子路由优先匹配更具体的路径

#### 使用效果

- 用户 A（User 角色）直接访问 `/permissions` → 被 RequireAuth 拦截 → 跳转到 `/unauthorized`
- 用户 A 直接访问 `/users/create` → 被 RequireAuth 拦截 → 跳转到 `/unauthorized`
- 管理员直接访问 `/timesheet/create` → 通过权限检查 → 渲染 TimeEntryCreatePage

#### 注意事项

- 路由级权限守卫是**最后一道防线**。前端还应通过菜单隐藏和按钮控制提供最佳用户体验。
- `RequireAuth` 的权限检查使用「与」逻辑（`permissions.every`），即用户必须拥有**所有**指定权限。
- 页面刷新时，Redux 的 `currentUser` 可能为空（localStorage 不保存完整用户对象），此时 fallback 到 `getPermissions()` 读取 localStorage 中的权限。

---

### 10. 403 未授权页面

#### 定义

`UnauthorizedPage` 使用 Ant Design 的 `Result` 组件展示 403 错误页面，提供「返回首页」和「返回」按钮。

#### 示例

```tsx
function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' }}>
      <Result
        status="403"
        title="403"
        subTitle="您没有权限访问此页面"
        extra={
          <>
            <Button type="primary" onClick={() => navigate('/', { replace: true })} icon={<HomeOutlined />}>返回首页</Button>
            <Button onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>返回</Button>
          </>
        }
      />
    </div>
  )
}
```

- **`status="403"`**：Ant Design Result 组件的预设状态，显示对应的图标和样式
- **居中布局**：使用 flexbox 将 Result 组件居中显示

#### 使用效果

用户访问无权限页面时，显示友好的 403 提示页面，而非空白页或错误堆栈。

---

## 三、其他实现

### 1. 权限数据流全景

```
登录流程：
  用户输入账号密码 → loginUser thunk → 验证成功
    → fetchUsers + fetchRoles → 从 roles 计算 permissions
    → savePermissions(permissions) → localStorage

页面刷新后：
  Redux 状态丢失 → currentUser = null
    → RequireAuth / usePermission / AppLayout fallback 到 getPermissions()
    → 从 localStorage 读取权限

权限变更（编辑角色）：
  updateRole thunk → API 调用 → Redux roles 更新
    → localStorage 中的权限**不会自动更新**（已知限制）
```

### 2. 权限检查的三种方式对比

| 方式 | 适用场景 | 逻辑 | 示例 |
|------|---------|------|------|
| `RequireAuth permissions={[]}` | 路由级守卫 | 与（所有权限） | 访问 `/permissions` 需要 `Role.Read` |
| `<RequirePermission permissions={[]}>` | 组件级渲染 | 与（所有权限） | 仅显示有 Write 权限的按钮 |
| `usePermission('xxx')` | Hook 级判断 | 或（单个权限） | 按钮 `disabled={!hasWrite}` |

### 3. 权限存储的双源策略

| 数据源 | 优势 | 劣势 | 使用场景 |
|--------|------|------|---------|
| Redux store | 响应式更新，与组件自动同步 | 页面刷新后丢失 | 登录后正常运行期间 |
| localStorage | 持久化，页面刷新后保留 | 不会自动同步权限变更 | 页面刷新 fallback、路由守卫 |

---

## 四、第 6 周需求与技术栈对照检查

### 技术栈覆盖

| 技术 | 计划要求 | 实现情况 |
|------|---------|---------|
| TypeScript 类型定义 | Permission / Role / RoleName 类型 | ✅ `Permission = string`、`RoleName` 联合类型、`Role` 接口 |
| 权限常量 | PERMISSIONS / PERMISSION_LABELS / ROLE_PERMISSIONS | ✅ 9 个权限标识、中文标签映射、3 种角色默认权限 |
| Mock 数据与 API 层 | 角色 CRUD + 权限检查函数 | ✅ 6 个角色 API 函数 + hasPermission / getUserPermissions |
| Redux 角色状态 | roles 状态 + 4 个 thunks | ✅ `roles` 字段 + fetchRoles / createRole / updateRole / removeRole |
| 权限存储 | localStorage 存储权限 | ✅ savePermissions / getPermissions / hasPermission |
| 登录权限流程 | 登录后计算并存储权限 | ✅ fetchUsers + fetchRoles → flatMap 计算 → savePermissions |
| 权限管理页面 | 角色列表 + 权限分配 | ✅ PermissionListPage + PermissionAssignPage |
| 权限控制组件 | RequirePermission + usePermission | ✅ HOC 组件 + Hook 两种方式 |
| 动态导航菜单 | 基于权限过滤菜单 | ✅ AppLayout 中 allMenuItems.filter |
| 路由级权限控制 | RequireAuth 扩展 permissions | ✅ 路由守卫 + 403 页面 |
| 403 页面 | 无权限提示 | ✅ UnauthorizedPage 使用 Result 组件 |

### 第 6 周产出确认

| 计划产出 | 完成情况 |
|---------|---------|
| ① Permission / Role / RoleName 类型 | ✅ `types/timeEntry.ts` |
| ② PERMISSIONS / PERMISSION_LABELS / ROLE_PERMISSIONS 常量 | ✅ 9 个权限 + 中文标签 + 3 种角色默认权限 |
| ③ 角色 Mock 数据（3 个默认角色） | ✅ Administrator / ProjectManager / User |
| ④ 角色 CRUD API（6 个函数） | ✅ getRoles / getRoleById / createRole / updateRole / deleteRole / getRoleByName |
| ⑤ 权限检查函数 | ✅ hasPermission / getUserPermissions |
| ⑥ Mock Adapter 角色路由 | ✅ GET/POST/PUT/DELETE /roles |
| ⑦ Redux roles 状态 + 4 个 thunks | ✅ fetchRoles / createRole / updateRole / removeRole |
| ⑧ localStorage 权限存储 | ✅ savePermissions / getPermissions / hasPermission |
| ⑨ 登录权限计算流程 | ✅ fetchUsers + fetchRoles → flatMap → savePermissions |
| ⑩ 快捷登录更新 | ✅ Administrator / ProjectManager / User，密码 Pass@word0 |
| ⑪ 权限管理列表页 | ✅ PermissionListPage（表格 + 搜索 + 删除 + 新增） |
| ⑫ 权限分配页 | ✅ PermissionAssignPage（Select 多选权限） |
| ⑬ 403 页面 | ✅ UnauthorizedPage |
| ⑭ RequirePermission 组件 | ✅ HOC 组件 |
| ⑮ usePermission Hook | ✅ 自定义 Hook |
| ⑯ 动态导航菜单 | ✅ AppLayout 基于权限过滤 |
| ⑰ 路由级权限守卫 | ✅ RequireAuth 扩展 + 路由配置 |

### 边界与说明

- **localStorage 权限不自动同步**：编辑角色后，localStorage 中已存储的权限不会自动更新。生产环境应通过 token 刷新或事件通知机制同步。
- **前端权限控制可被绕过**：前端菜单隐藏和按钮控制仅提升用户体验，真正的权限校验应在后端 API 层完成。当前 mock 层通过 deleteRole 返回 403 模拟了后端权限拦截。
- **权限计算依赖角色列表**：登录时权限计算需要角色列表数据。如果 fetchRoles 失败，用户权限为空数组，所有受保护页面都会拒绝访问。
- **自定义角色无默认权限**：ROLE_PERMISSIONS 仅覆盖三种预定义角色。自定义角色在创建时无默认权限，需手动分配。

---

## 五、学习路径建议

按照从易到难的顺序，建议按以下路径学习第 6 周代码：

1. **权限类型定义** → 理解 `Permission` / `RoleName` / `Role` 类型设计（PERMISSIONS / PERMISSION_LABELS / ROLE_PERMISSIONS 常量）
2. **角色 Mock 数据与 API** → 6 个角色 API 函数 + hasPermission / getUserPermissions + Mock Adapter 路由注册
3. **Redux 角色状态** → `roles` 状态字段 + 4 个 thunks + 同步 reducers
4. **权限 localStorage 存储** → savePermissions / getPermissions / hasPermission 工具函数
5. **登录权限流程** → fetchUsers + fetchRoles → flatMap 计算权限 → savePermissions
6. **权限管理页面** → PermissionListPage（角色列表 + 搜索 + 删除）+ PermissionAssignPage（Select 多选）
7. **权限控制组件** → RequirePermission HOC + usePermission Hook + 三级 fallback 策略
8. **动态导航菜单** → allMenuItems.filter 基于权限过滤菜单项
9. **路由级权限守卫** → RequireAuth 扩展 permissions + 路由配置 + 403 页面
10. **权限数据流全景** → 登录流程 → 页面刷新 fallback → 权限变更（已知限制）