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
| Redux 多 Slice 管理 | `src/store/userSlice.ts` / `index.ts` | 多 Slice 状态树、`currentUser` 状态片、`createAsyncThunk`（6 个 thunks） |
| 用户 CRUD 页面 | `UserListPage` / `UserDetailPage` / `UserCreatePage` / `UserEditPage` | 前端分页、查询过滤、Redux 缓存读取、thunk 操作 |
| 登录页重构 | `LoginPage.tsx` | `loginUser` thunk、`fetchUsers` thunk、`.unwrap()` |
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

### 3. Redux 多 Slice 管理 + createAsyncThunk

#### 定义

第 5 周在已有的 `timesheetSlice`（工时状态）之外，新增 `userSlice`（用户状态），实现 Redux 多 Slice 管理。状态树从单层扩展为双层。同时引入 `createAsyncThunk` 处理异步操作（获取用户列表、获取单个用户、创建/更新/删除用户、登录），统一异步请求的 pending / fulfilled / rejected 状态管理。

#### 示例 — userSlice.ts（含 async thunks）

```ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/timeEntry'
import { getUsers as getUsersApi, getUserById as getUserByIdApi, addUser as addUserApi, updateUser as updateUserApi, deleteUser as deleteUserApi, login as loginApi } from '../api/timeEntryApi'

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

// 异步 thunks：获取用户列表
export const fetchUsers = createAsyncThunk<User[]>('user/fetchUsers', async () => {
  return getUsersApi()
})

// 异步 thunks：根据 ID 获取单个用户
export const fetchUserById = createAsyncThunk<User, string>('user/fetchUserById', async (id) => {
  return getUserByIdApi(id)
})

// 异步 thunks：创建用户
export const createUser = createAsyncThunk<User, Omit<User, 'id' | 'createdAt'>>('user/createUser', async (userData) => {
  return addUserApi(userData)
})

// 异步 thunks：更新用户
export const updateUser = createAsyncThunk<User, { id: string; updates: Partial<Omit<User, 'id' | 'createdAt' | 'password'>> }>(
  'user/updateUser',
  async ({ id, updates }) => {
    return updateUserApi(id, updates)
  }
)

// 异步 thunks：删除用户
export const removeUser = createAsyncThunk<void, string, { rejectValue: string }>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await deleteUserApi(id)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : '删除失败')
  }
})

// 异步 thunks：用户登录
export const loginUser = createAsyncThunk<User, { username: string; password: string }>('user/loginUser', async (credentials) => {
  return loginApi(credentials.username, credentials.password)
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置所有用户（用于加载数据）
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload
    },
    // 新增用户：放到数组最前面
    addUser(state, action: PayloadAction<User>) {
      state.users.unshift(action.payload)
    },
    // 更新用户：按 id 查找并替换
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    // 删除用户
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    // 设置当前登录用户
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload
    },
    // 清除当前用户
    clearCurrentUser(state) {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? '加载用户列表失败' })

    // fetchUserById / createUser / updateUser / removeUser / loginUser 类似处理...
  },
})

export const {
  setUsers, addUser, updateUser: updateUserSync, deleteUser,
  setCurrentUser, clearCurrentUser,
} = userSlice.actions

export default userSlice.reducer
```

- **`createAsyncThunk`**：将异步 API 调用封装为 Redux action，自动管理 pending / fulfilled / rejected 三种状态
- **`rejectWithValue`**：在异步操作失败时携带自定义错误信息，通过 `action.payload` 传递给 rejected reducer
- **`extraReducers`**：处理 async thunk 的状态变化，与同步 `reducers` 分开定义
- **命名规范**：每个 thunk 的 action type 为 `user/fetchUsers`、`user/createUser` 等，由 slice name（`user`）+ thunk name 自动拼接
- **同步 vs 异步 reducer 区分**：`updateUser` 同步 reducer 重命名为 `updateUserSync`，避免与 `updateUser` async thunk 同名冲突

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

// 使用 async thunk：获取用户列表
await dispatch(fetchUsers()).unwrap()

// 使用 async thunk：创建用户
await dispatch(createUser({ username: 'newuser', roles: ['普通用户'] })).unwrap()

// 使用 async thunk：登录
await dispatch(loginUser({ username: 'admin', password: 'admin123' })).unwrap()
```

#### 注意事项

- `currentUser` 是 `User | null` 类型，组件中需要做空值判断：`currentUser?.username ?? '未登录'`。
- `userSlice` 和 `timesheetSlice` 共享同一个 Store，通过不同的命名空间隔离。
- `createAsyncThunk` 返回的 Promise 需要使用 `.unwrap()` 才能获取 payload 或捕获错误。
- 同步 reducer 和 async thunk 同名时，同步 reducer 需要重命名（如 `updateUserSync`）。

---

### 4. 登录页重构（用户认证 + async thunks）

#### 定义

第 5 周将登录页从简单的前端校验重构为调用 `loginUser` thunk 验证用户，验证成功后自动保存用户信息到 Redux Store，同时通过 `fetchUsers` thunk 加载用户列表供后续使用。

#### 示例

```tsx
import { loginUser, fetchUsers } from '../store/userSlice'

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
    // 调用 loginUser thunk，自动处理 pending/fulfilled/rejected
    await dispatch(loginUser({ username, password })).unwrap()

    // 保存登录态 + 用户名
    login()
    saveUsername(username)

    // 同时加载用户列表
    await dispatch(fetchUsers()).unwrap()

    // 跳转到主页或原本想访问的页面
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  } catch (err) {
    message.error(err instanceof Error ? err.message : '登录失败')
  }
}
```

- **`dispatch(loginUser({ username, password }))`**：调用 loginUser thunk，内部自动调用 `loginApi`，成功时 Redux 自动设置 `currentUser`
- **`.unwrap()`**：将 thunk 返回的 Promise  unwrap 为 payload，成功时 resolve payload，失败时 reject error
- **`dispatch(fetchUsers()).unwrap()`**：登录时预加载用户列表，避免用户管理页面首次加载时重复请求
- **`useLayoutEffect`**：根据 URL（如 `/login/admin`）自动填充快捷登录的账号密码，使用 `useLayoutEffect` 而非 `useEffect` 确保在浏览器绘制前完成填充，避免闪烁

#### 使用效果

- 输入正确的用户名和密码 → 登录成功 → 保存用户信息到 Redux → 跳转到主页 → 侧边栏显示用户名
- 访问 `/login/admin` → 自动填充 admin/admin123 → 点击登录即可

#### 注意事项

- 登录页的密码校验在**前端完成**（`QUICK_LOGIN_MAP`），`loginApi` 是额外的 API 调用。真实后端应将密码校验放在服务端。
- 登录成功后同时加载用户列表（`fetchUsers`），这是性能优化。如果用户管理页面不常用，可改为按需加载。
- `.unwrap()` 是 RTK 提供的方法，将 thunk 的 fulfilled action 的 payload 提取出来。如果不使用 `.unwrap()`，需要通过 `then((action) => action.payload)` 访问 payload。

---

### 5. 用户列表页：前端分页 + 查询过滤 + async thunks

#### 定义

用户列表页使用前端分页（`Array.slice` 切片）+ 本地查询过滤（`filtered` 状态），与工时列表页的分页逻辑类似，但增加了查询过滤与 Redux 状态的协调。数据加载通过 `fetchUsers` thunk 完成，删除操作通过 `removeUser` thunk 完成。

#### 示例

```tsx
import { fetchUsers, removeUser } from '../store/userSlice'

function UserListPage() {
  const { users, loading, error } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()

  // 挂载时通过 thunk 加载用户数据
  useEffect(() => {
    if (users.length === 0 && !loading) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users.length, loading])

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

  // 删除用户：通过 removeUser thunk 异步删除
  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(removeUser(id))
      message.success('删除成功')
      setFiltered((prev) => {
        if (!prev) return prev
        const newFiltered = prev.filter((u) => u.id !== id)
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

- **`dispatch(fetchUsers())`**：通过 thunk 加载用户列表，自动处理 loading 和 error 状态
- **`dispatch(removeUser(id))`**：通过 thunk 异步删除用户，成功后自动从 `state.users` 中移除，无需手动 dispatch `deleteUser`
- **`filtered ?? users`**：查询结果优先于 Store 全量。`null` 表示未查询，`User[]` 表示查询结果
- **`filtered` 使用本地 state 而非 Redux**：查询是局部状态，不影响全局用户列表
- **删除后页码调整**：删除当前页最后一条记录时自动跳转到上一页，避免空页
- **`role` 列渲染**：`roles` 是数组，使用 `map` 遍历渲染多个 `Tag`

#### 使用效果

用户列表页展示查询表单 + Table 列表 + 分页控件。查询时调用 `queryUsers` 获取过滤结果，前端切片分页。

#### 注意事项

- 前端分页适用于数据量小的场景（当前 mock 数据仅 3 条）。如果数据量大，应改为服务端分页。
- 删除操作通过 `removeUser` thunk 完成，包含完整的错误处理（`rejectWithValue`），删除失败时 Redux 的 `error` 会被设置。

---

### 6. 用户新增/编辑页：Redux 缓存 + async thunks

#### 定义

用户新增页和编辑页的核心改进有两点：
1. **新增页**：使用 `createUser` thunk 替代「调用 API + 全量刷新列表」的模式，创建成功后 Redux 自动将新用户插入 `state.users` 数组
2. **编辑/详情页**：优先从 Redux 缓存读取用户数据（`users.find`），缓存未命中时 dispatch `fetchUserById` 发起请求，避免重复 API 调用

#### 示例 — UserCreatePage.tsx

```tsx
import { createUser } from '../store/userSlice'

function UserCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 提交新增：通过 createUser thunk 创建用户，成功后自动更新 Store
  const handleSubmit = async (data: { username: string; roles: User['roles'] }) => {
    await dispatch(createUser(data))
    navigate('/users')
  }

  return (
    <div className={styles.page}>
      <UserForm onSubmit={handleSubmit} />
    </div>
  )
}
```

- **`dispatch(createUser(data))`**：创建用户后，`extraReducers` 中的 `createUser.fulfilled` 自动将新用户 `unshift` 到 `state.users`，无需手动 `setUsers(await getUsers())`
- **对比之前**：旧方案需要 `addUserApi(data)` → `getUsers()` → `setUsers(data)` 三步，新方案只需一步

#### 示例 — UserDetailPage.tsx / UserEditPage.tsx

```tsx
import { fetchUserById } from '../store/userSlice'

function UserDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, error } = useSelector((state: RootState) => state.user)

  // 从 Redux Store 中查找用户（缓存命中）
  const cachedUser = users.find((u) => u.id === id)
  const [user, setUser] = useState<User | null>(cachedUser ?? null)

  // 挂载时：如果缓存中没有，则发起请求
  useEffect(() => {
    if (!id) return
    if (!cachedUser) {
      dispatch(fetchUserById(id))
    }
  }, [id, cachedUser, dispatch])

  // 如果缓存未命中且 thunk 已加载完成，从 users 中更新
  useEffect(() => {
    if (cachedUser && !user) {
      setUser(cachedUser)
    }
  }, [cachedUser, user])

  // 加载中 / 加载失败 / 用户不存在 的三态处理...
}
```

- **`users.find((u) => u.id === id)`**：优先从 Redux 缓存读取，避免重复 API 调用
- **`dispatch(fetchUserById(id))`**：缓存未命中时发起请求，`extraReducers` 自动处理 loading 和 error
- **两个 useEffect**：第一个在挂载时判断是否需要请求，第二个在缓存就绪后更新本地 state

#### 使用效果

- 新增用户：提交后 Redux 自动更新列表，导航回列表页时直接显示新用户
- 编辑/详情页：如果用户列表已在 Store 中（如登录后预加载），无需额外 API 请求

#### 注意事项

- 缓存策略的前提是用户列表已加载。如果用户列表未加载，详情页/编辑页仍会发起 API 请求。
- 编辑成功后，`updateUser` thunk 的 `fulfilled` reducer 会自动更新 `state.users` 中的对应用户。

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
| Redux 多 Slice 管理 | `userSlice` + Store 注册 | ✅ `userSlice.ts` 6 个 sync reducers + 6 个 async thunks + `index.ts` 注册 |
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
| ④ Redux userSlice | ✅ 6 个 sync reducers + 6 个 async thunks：`fetchUsers` / `fetchUserById` / `createUser` / `updateUser` / `removeUser` / `loginUser` |
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