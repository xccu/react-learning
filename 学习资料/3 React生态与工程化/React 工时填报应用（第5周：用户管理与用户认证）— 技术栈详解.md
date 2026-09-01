# React 工时填报应用（第5周：用户管理与用户认证）— 技术栈详解

> 本文聚焦第 5 周「用户管理与用户认证」中**新增的业务逻辑与设计模式**，不涉及前 4 周已讲过的 React Router、Axios、Redux Toolkit、Ant Design、React Hook Form 等基础知识。每个知识点均结合第 5 周的真实代码，包含定义、示例、使用效果和注意事项。

> **当前项目版本：** React `19.2.7`，TypeScript `~6.0.2`，依赖全部沿用第 1-4 周。
>
> **当前项目范围说明：** 本次在第 4 周基础上新增用户管理模块，包含用户类型定义、Mock 数据与 API 层、Redux 用户状态模块（userSlice）、用户 CRUD 页面与组件、登录页重构（用户认证）、侧边栏导航与路由。

---

## 一、本周新增内容概览

第 5 周没有引入新的依赖库，核心新增内容如下：

| 新增内容 | 涉及文件 | 核心概念 |
|---------|---------|---------|
| 用户类型定义 | `src/types/timeEntry.ts` | TypeScript 联合类型、数组类型字段 |
| 用户 Mock 数据与 API | `src/api/mockApi.ts` / `timeEntryApi.ts` / `mockAdapter.ts` | RESTful 路由注册、登录验证端点 |
| Redux 多 Slice 管理 | `src/store/userSlice.ts` / `index.ts` | 多 Slice 状态树、`currentUser` 状态片 |
| 用户 CRUD 页面 | `UserListPage` / `UserDetailPage` / `UserCreatePage` / `UserEditPage` | 前端分页、查询过滤、动态 import |
| 登录页重构 | `LoginPage.tsx` | `login` API 调用、`dispatch(setCurrentUser)` |
| 侧边栏用户信息 | `AppLayout.tsx` | `useSelector` 读取 `currentUser` |

---

## 二、知识点详解

### 1. 用户类型定义

#### 定义

在 `src/types/timeEntry.ts` 中新增 `User` 类型、`UserRole` 联合类型和 `UserQuery` 接口，为整个用户管理模块提供类型基础。

#### 示例

```ts
// 用户角色枚举：联合类型，只能是两个字符串之一
export type UserRole = '管理员' | '普通用户'

// 用户类型
export type User = {
  id: string
  username: string
  password: string          // mock 数据使用明文，不展示给前端用户
  roles: UserRole[]         // 一对多，为第6周多角色权限管理预留
  createdAt: string
}

// 用户查询条件
export interface UserQuery {
  username?: string
  role?: UserRole | ''
}
```

- **`UserRole`**：联合类型，IDE 会提供自动补全，编译时防止传入非法角色值
- **`roles: UserRole[]`**：设计为数组而非单个值，为第 6 周多角色权限管理预留扩展空间
- **`UserQuery.role?: UserRole | ''`**：允许空字符串表示「全部角色」，空值在查询时被过滤掉

#### 使用效果

```ts
import type { User, UserRole, UserQuery } from '../types/timeEntry'

const user: User = { id: '1', username: 'admin', password: 'xxx', roles: ['管理员'], createdAt: '2024-01-01' }
const query: UserQuery = { username: 'admin', role: '管理员' }
```

#### 注意事项

- `password` 字段仅在 mock 数据中存在，真实后端不应在前端暴露密码字段。
- `UserQuery.role` 类型为 `UserRole | ''`，空字符串在查询时会被过滤，不传给 API。

---

### 2. Mock 数据与 API 层扩展

#### 定义

在 mock 层新增 3 条默认用户数据，以及登录验证、用户 CRUD 相关的 API 函数和 mock 端点。

#### 示例 — Mock 数据

```ts
// src/api/mockApi.ts

const users: User[] = [
  { id: '1', username: 'admin', password: 'admin123', roles: ['管理员'], createdAt: '2024-01-01T00:00:00Z' },
  { id: '2', username: 'user1', password: 'user123', roles: ['普通用户'], createdAt: '2024-01-02T00:00:00Z' },
  { id: '3', username: 'user2', password: 'user123', roles: ['普通用户'], createdAt: '2024-01-03T00:00:00Z' },
]

// 登录验证：查找匹配用户名和密码的用户
export async function login(username: string, password: string): Promise<User> {
  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) return Promise.reject(new Error('用户名或密码错误'))
  return Promise.resolve(user)
}

// 按条件查询用户：username 模糊匹配，role 精确匹配
export async function queryUsers(query: UserQuery): Promise<User[]> {
  let result = [...users]
  if (query.username) {
    result = result.filter((u) => u.username.includes(query.username!))
  }
  if (query.role) {
    result = result.filter((u) => u.roles.includes(query.role as UserRole))
  }
  return Promise.resolve(result)
}
```

- **`login`**：返回完整的 `User` 对象（含 roles），供 `dispatch(setCurrentUser)` 使用
- **`queryUsers`**：`username` 使用 `includes` 模糊匹配，`role` 使用 `includes` 精确匹配（因为 `roles` 是数组）

#### 示例 — Mock Adapter 路由注册

```ts
// src/api/mockAdapter.ts

// 登录端点：POST /users/login
mock.onPost('/users/login').reply((config) => {
  const body = JSON.parse(config.data) as { username: string; password: string }
  return login(body.username, body.password).then(
    (data) => [200, data],
    (err) => [401, { message: err instanceof Error ? err.message : '登录失败' }]
  )
})

// 查询端点：GET /users/query?username=xxx&role=管理员
mock.onGet('/users/query').reply((config) => {
  const params = new URLSearchParams(config.url?.split('?')[1] ?? '')
  const query: UserQuery = {
    username: params.get('username') ?? undefined,
    role: (params.get('role') as any) ?? undefined,
  }
  return queryUsers(query).then(
    (data) => [200, data],
    (err) => [500, { message: err instanceof Error ? err.message : '查询失败' }]
  )
})

// 按 ID 获取用户：正则匹配 /users/:id（排除 /users/query 等）
mock.onGet(/\/users\/[^/]+$/).reply((config) => {
  const id = (config.url ?? '').split('/').pop() ?? ''
  return getUserById(id).then(
    (data) => [200, data],
    (err) => [404, { message: err instanceof Error ? err.message : '用户不存在' }]
  )
})
```

#### 使用效果

用户管理相关的 API 调用与工时记录的 API 调用共用同一个 `httpClient` 和 `mockAdapter`，通过不同的 URL 路径区分。

#### 注意事项

- 登录端点使用 `POST /users/login` 而非 GET，符合 RESTful 规范中「验证操作使用 POST」的惯例。
- `queryUsers` 通过 GET 请求的 `params` 传递查询条件，而非 body。
- `/users` 的精确匹配和 `/users/:id` 的正则匹配需要注意顺序——精确匹配必须放在正则匹配之前。

---

### 3. Redux 多 Slice 管理

#### 定义

第 5 周在已有的 `timesheetSlice`（工时状态）之外，新增 `userSlice`（用户状态），实现 Redux 多 Slice 管理。状态树从单层扩展为双层。

#### 示例 — userSlice.ts

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/timeEntry'

interface UserState {
  users: User[]
  currentUser: User | null    // 当前登录用户
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload
    },
    addUser(state, action: PayloadAction<User>) {
      state.users.unshift(action.payload)
    },
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload
    },
    clearCurrentUser(state) {
      state.currentUser = null
    },
  },
})

export const {
  setUsers, addUser, updateUser, deleteUser,
  setCurrentUser, clearCurrentUser,
} = userSlice.actions

export default userSlice.reducer
```

- **`currentUser: User | null`**：当前登录用户状态片，登录成功后由 `setCurrentUser` 设置，退出登录时由 `clearCurrentUser` 清除
- **`setUsers`**：用于加载用户列表数据（登录时批量加载、新增/编辑/删除后刷新）
- **`clearCurrentUser`**：无 payload 的 reducer，直接设置 `currentUser = null`

#### 示例 — Store 注册

```ts
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import timesheetReducer from './timesheetSlice'
import userReducer from './userSlice'

const store = configureStore({
  reducer: {
    timesheet: timesheetReducer,
    user: userReducer,    // 新增
  },
})
```

#### 状态树结构

```ts
{
  timesheet: { entries: [...], loading: false, error: null },
  user: {
    users: [...],
    currentUser: { id: '1', username: 'admin', roles: ['管理员'], ... } | null,
    loading: false,
    error: null,
  },
}
```

#### 使用效果

```ts
// 读取用户列表
const users = useSelector((state: RootState) => state.user.users)

// 读取当前登录用户
const currentUser = useSelector((state: RootState) => state.user.currentUser)

// 登录成功
dispatch(setCurrentUser(user))

// 退出登录
dispatch(clearCurrentUser())
```

#### 注意事项

- `currentUser` 是 `User | null` 类型，组件中需要做空值判断：`currentUser?.username ?? '未登录'`。
- `userSlice` 和 `timesheetSlice` 共享同一个 Store，通过不同的命名空间隔离。
- 当前 `extraReducers` 为空。如果需要异步登录操作（如 `createAsyncThunk`），可在 `extraReducers` 中处理。

---

### 4. 登录页重构（用户认证）

#### 定义

第 5 周将登录页从简单的前端校验重构为调用 `login` API 验证用户，验证成功后 `dispatch(setCurrentUser)` 保存用户信息到 Redux Store，同时加载用户列表供后续使用。

#### 示例

```tsx
const handleFormSubmit = async (values: LoginFormValues) => {
  const username = values.username.trim()
  const password = values.password
  const expectedPassword = QUICK_LOGIN_MAP[username]

  // 前端校验用户名和密码
  if (!expectedPassword) {
    form.setFields([{ name: 'username', errors: ['用户名不存在'] }, { name: 'password', errors: [] }])
    return
  }
  if (password !== expectedPassword) {
    form.setFields([{ name: 'username', errors: [] }, { name: 'password', errors: ['密码错误'] }])
    return
  }

  try {
    // 调用登录 API 验证
    const user = await loginApi(username, password)

    // 保存登录态 + 用户名 + 用户信息
    login()
    saveUsername(username)
    dispatch(setCurrentUser(user))

    // 登录时同时加载用户列表，避免用户管理页面首次加载时重复请求
    const users = await getUsers()
    dispatch(setUsers(users))

    // 跳转到主页或原本想访问的页面
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  } catch (err) {
    message.error(err instanceof Error ? err.message : '登录失败')
  }
}
```

- **`loginApi`**：调用 `/users/login` API 验证用户，返回完整 `User` 对象
- **`dispatch(setCurrentUser(user))`**：登录成功后保存用户信息到 Redux，侧边栏立即显示用户名
- **`dispatch(setUsers(await getUsers()))`**：登录时预加载用户列表，性能优化——避免用户管理页面首次加载时重复请求
- **`useLayoutEffect`**：根据 URL（如 `/login/admin`）自动填充快捷登录的账号密码，使用 `useLayoutEffect` 而非 `useEffect` 确保在浏览器绘制前完成填充，避免闪烁

#### 使用效果

- 输入正确的用户名和密码 → 登录成功 → 保存用户信息到 Redux → 跳转到主页 → 侧边栏显示用户名
- 访问 `/login/admin` → 自动填充 admin/admin123 → 点击登录即可

#### 注意事项

- 登录页的密码校验在**前端完成**（`QUICK_LOGIN_MAP`），`loginApi` 是额外的 API 调用。真实后端应将密码校验放在服务端。
- 登录成功后同时加载用户列表（`getUsers`），这是性能优化。如果用户管理页面不常用，可改为按需加载。

---

### 5. 用户列表页：前端分页 + 查询过滤

#### 定义

用户列表页使用前端分页（`Array.slice` 切片）+ 本地查询过滤（`filtered` 状态），与工时列表页的分页逻辑类似，但增加了查询过滤与 Redux 状态的协调。

#### 示例

```tsx
function UserListPage() {
  const { users, loading } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  // 挂载时加载用户数据
  useEffect(() => {
    if (users.length === 0 && !loading) {
      getUsers().then((data) => dispatch(setUsers(data)))
    }
  }, [])

  // 查询结果保存在本地 state：null 表示未过滤，显示 Store 全量
  const [filtered, setFiltered] = useState<User[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 待展示记录：有查询结果用查询结果，否则用 Store 全量
  const visibleUsers = filtered ?? users

  // 前端分页切片
  const currentUsers = visibleUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // 提交查询
  const handleQuery = useCallback(
    async (query: { username?: string; role?: string }) => {
      const { username, role } = query
      if (!username && !role) {
        setFiltered(null)    // 清空查询，恢复 Store 全量
      } else {
        setFiltered(await queryUsers(query))
      }
      setCurrentPage(1)    // 查询条件变化时重置页码
    },
    []
  )

  // 删除用户：同时更新 filtered 保持查询状态同步
  const handleDelete = useCallback(
    async (id: string) => {
      dispatch(deleteUser(id))
      message.success('删除成功')
      setFiltered((prev) => {
        if (!prev) return prev
        const newFiltered = prev.filter((u) => u.id !== id)
        // 删除当前页最后一条记录时自动跳转到上一页
        if (newFiltered.length > 0) {
          const newTotalPages = Math.ceil(newFiltered.length / pageSize)
          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages)
          }
        }
        return newFiltered
      })
    },
    [dispatch, currentPage, pageSize]
  )
}
```

- **`filtered ?? users`**：查询结果优先于 Store 全量。`null` 表示未查询，`User[]` 表示查询结果
- **`filtered` 使用本地 state 而非 Redux**：查询是局部状态，不影响全局用户列表
- **删除后页码调整**：删除当前页最后一条记录时自动跳转到上一页，避免空页
- **`role` 列渲染**：`roles` 是数组，使用 `map` 遍历渲染多个 `Tag`

#### 使用效果

用户列表页展示查询表单 + Table 列表 + 分页控件。查询时调用 `queryUsers` 获取过滤结果，前端切片分页。

#### 注意事项

- 前端分页适用于数据量小的场景（当前 mock 数据仅 3 条）。如果数据量大，应改为服务端分页。
- 删除操作先 dispatch `deleteUser` 更新 Redux，再手动更新 `filtered` 保持查询状态同步。

---

### 6. 用户新增/编辑页：动态 import

#### 定义

用户新增页和编辑页使用 `await import('../api/timeEntryApi')` 动态导入 API 模块，实现代码分割。

#### 示例

```tsx
// UserCreatePage.tsx
const handleSubmit = async (data: { username: string; roles: User['roles'] }) => {
  // 动态 import：只在提交时加载 API 模块
  const { addUser: addUserApi } = await import('../api/timeEntryApi')
  await addUserApi(data)
  const { getUsers } = await import('../api/timeEntryApi')
  dispatch(setUsers(await getUsers()))
  navigate('/users')
}
```

#### 使用效果

Vite 打包时，`timeEntryApi` 会被拆分为独立的 chunk 文件。新增页和编辑页按需加载该 chunk，减少首屏加载体积。

#### 注意事项

- 动态 import 返回 Promise，需要使用 `await` 获取模块。
- 学习项目中 API 模块体积小，代码分割收益不明显。生产环境中对路由级组件使用动态 import 收益更大。

---

### 7. 侧边栏显示当前登录用户

#### 定义

在 `AppLayout.tsx` 中通过 `useSelector` 读取 Redux 中的 `currentUser`，在侧边栏显示当前登录用户名。

#### 示例

```tsx
function AppLayout() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  return (
    <div className={styles.sidebar}>
      {/* 导航菜单 */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={[
          { key: '/', icon: <FileTextOutlined />, label: '工时列表' },
          { key: '/timesheet/create', icon: <PlusOutlined />, label: '新增工时' },
          { key: '/users', icon: <UserOutlined />, label: '用户管理' },
        ]}
        onClick={({ key }) => navigate(key)}
        theme="dark"
      />

      {/* 用户信息区 */}
      <div className={styles.userMenu}>
        <Avatar icon={<UserOutlined />} className={styles.userAvatar} />
        <span className={styles.userName}>
          {currentUser?.username ?? getUsername() ?? '未登录'}
        </span>
        <Button icon={<LogoutOutlined />} onClick={handleLogout} />
      </div>
    </div>
  )
}
```

- **`currentUser?.username`**：优先从 Redux 读取（登录成功后设置），回退到 localStorage（页面刷新后 Redux 清空时），再回退到 `getUsername()`
- **`logout` + `clearCurrentUser`**：退出登录时同时清除 Redux 状态和 localStorage

#### 使用效果

登录后侧边栏显示当前用户名，退出登录时清除 Redux 状态和 localStorage，用户名显示回退到「未登录」。

---

## 三、其他实现

### 1. 路由注册顺序

#### 定义

用户管理路由包含 `/users/create`（静态路径）和 `/users/:id`（动态路径），注册时静态路径必须放在动态路径之前，否则 `:id` 会匹配到 `create` 字符串。

#### 示例

```tsx
// 正确顺序：/users/create 在 /users/:id 之前
<Route path="users" element={<UserListPage />} />
<Route path="users/create" element={<UserCreatePage />} />
<Route path="users/:id" element={<UserDetailPage />} />
<Route path="users/:id/edit" element={<UserEditPage />} />
```

#### 注意事项

- 如果顺序反过来，访问 `/users/create` 时 `:id` 会匹配到 `create`，导致渲染用户详情页并提示「未找到该用户」。
- 这是 React Router v7 的路由匹配规则：精确匹配优先于参数匹配，但需要在路由表中先声明。

---

## 四、第 5 周需求与技术栈对照检查

### 技术栈覆盖

| 技术 | 计划要求 | 实现情况 |
|------|---------|---------|
| TypeScript 类型定义 | `User` / `UserRole` / `UserQuery` | ✅ 联合类型、数组类型字段 |
| Mock 数据与 API 层 | 用户 CRUD + 登录 API | ✅ 3 条默认用户 + 7 个 API 函数 |
| Redux 多 Slice 管理 | `userSlice` + Store 注册 | ✅ `userSlice.ts` 6 个 reducers + `index.ts` 注册 |
| 用户 CRUD 页面 | 前端分页 + 查询过滤 + 三态处理 | ✅ `UserListPage` / `UserDetailPage` / `UserCreatePage` / `UserEditPage` |
| 登录页重构 | 用户认证 + Redux 用户信息 | ✅ `login` API + `dispatch(setCurrentUser)` | ✅ 登录时预加载用户列表 |
| 侧边栏导航 | 「用户管理」菜单项 + 用户名显示 | ✅ `UserOutlined` 菜单项 + `currentUser?.username` |
| 路由注册 | `/users` 受保护路由 + 顺序正确 | ✅ 4 个路由，`/users/create` 在 `/users/:id` 之前 |

### 第 5 周产出确认

| 计划产出 | 完成情况 |
|---------|---------|
| ① 用户类型定义 | ✅ `User` / `UserRole` / `UserQuery` |
| ② Mock 数据（3 条默认用户） | ✅ `admin/admin123`、`user1/user123`、`user2/user123` |
| ③ API 层扩展（7 个函数） | ✅ `login` / `getUsers` / `queryUsers` / `getUserById` / `addUser` / `updateUser` / `deleteUser` |
| ④ Redux userSlice | ✅ 6 个 reducers：`setUsers` / `addUser` / `updateUser` / `deleteUser` / `setCurrentUser` / `clearCurrentUser` |
| ⑤ Store 注册 user reducer | ✅ `user: userReducer` |
| ⑥ 用户 CRUD 页面 | ✅ 4 个页面，三态处理 + 前端分页 |
| ⑦ 登录页重构 | ✅ `login` API + `dispatch(setCurrentUser)` + 用户列表预加载 |
| ⑧ 侧边栏导航 | ✅ `UserOutlined` 菜单项 + `currentUser?.username` 显示 |
| ⑨ 路由注册顺序 | ✅ `/users/create` 在 `/users/:id` 之前 |

### 边界与说明

- **登录态管理**：使用 localStorage 存储登录态，页面刷新后保留。真实项目应使用 HTTP-only Cookie。
- **前端分页**：当前数据量小（3 条），前端分页够用。数据量大时应改为服务端分页。
- **密码存储**：Mock 数据使用明文密码，真实后端应使用 bcrypt 等哈希算法。
- **动态 import**：学习项目中收益不明显，生产环境对路由级组件使用动态 import 收益更大。
- **快捷登录**：URL 路径 `/login/admin` 自动填充账号密码，仅用于开发调试。

---

## 五、学习路径建议

按照从易到难的顺序，建议按以下路径学习第 5 周代码：

1. **用户类型定义** → 理解 `User` / `UserRole` / `UserQuery` 类型设计（联合类型、数组字段）
2. **Mock 数据与 API 层** → 7 个 API 函数 + Mock Adapter 路由注册（登录端点、查询端点）
3. **Redux 多 Slice 管理** → `userSlice.ts` 6 个 reducers + Store 注册 + 状态树结构
4. **登录页重构** → `login` API + `dispatch(setCurrentUser)` + 用户列表预加载 + `useLayoutEffect`
5. **用户列表页** → 前端分页 + 查询过滤 + `filtered ?? users` 协调逻辑 + 删除后页码调整
6. **用户新增/编辑页** → 动态 import 代码分割 + 提交后刷新列表
7. **侧边栏显示用户名** → `useSelector` 读取 `currentUser` + 回退逻辑
8. **路由注册顺序** → `/users/create` 在 `/users/:id` 之前