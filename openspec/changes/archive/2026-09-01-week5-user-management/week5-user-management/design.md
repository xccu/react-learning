## Context

当前工时填报应用已完成第1-4周学习，使用 React 19 + TypeScript + Vite 构建，状态管理基于 Redux Toolkit（timesheet slice），UI 使用 Ant Design 组件库。数据通过 Axios + mock adapter 模拟 CRUD。登录页目前无任何用户认证——任意用户名+密码即可登录，仅设置 localStorage 标记。

第5周目标是新增用户管理模块，这是第4周难度峰值后的"巩固周"——完全复用 Redux 状态管理 + Ant Design 的模式，只是换一个业务领域。同时将登录页改造为基于用户数据的真实认证（mock 数据层面），为第6周权限管理提供用户数据基础。

用户管理页面参照第2周的工时页面模式：独立列表页（含查询表单 + Table）、独立详情页、独立新增页、独立编辑页。

## Goals / Non-Goals

**Goals:**
- 在既有 Redux Store 中注册第二个业务模块（userSlice），管理用户列表与当前用户信息
- 实现用户列表页：含查询表单（用户名/角色过滤）、Table 表格展示、分页、操作列（详情/编辑/删除）、新增按钮
- 实现用户详情页：只读展示用户信息，含编辑和返回列表按钮
- 实现用户新增页：独立表单页面，提交后返回列表
- 实现用户编辑页：加载用户数据预填表单，提交后返回列表
- 重构登录页：调用用户登录接口验证用户名+密码，验证成功保存用户信息，失败提示错误
- 内置 3 条默认用户（admin/admin123 管理员、user1/user123 普通用户、user2/user123 普通用户）
- 侧边栏新增"用户管理"导航项
- 新增用户管理页面路由 `/users`

**Non-Goals:**
- 不实现基于角色的权限控制（第6周内容）
- 不实现动态菜单过滤（第6周内容）
- 不实现密码加密存储（mock 数据使用明文，不引入新依赖）
- 不引入真实数据库和真实 WebAPI
- 不替换用户管理相关的自定义样式为 Ant Design（保持与现有风格一致）

## Decisions

### 1. 用户状态模块结构

**决定**: 在 `src/store/` 下新建 `userSlice.ts`，与 `timesheetSlice.ts` 并列

```
src/store/
  index.ts          — configureStore（注册 timesheet + user）
  timesheetSlice.ts — 工时状态模块（不变）
  userSlice.ts      — 用户状态模块（新增）
```

**理由**:
- 第4周已建立"一个业务领域一个 slice"的模式，第5周直接复用
- `userSlice` 的 API 与 `timesheetSlice` 高度相似（CRUD + loading/error），降低学习成本
- 第6周扩展时，在 `src/store/` 下继续新增 slice 即可

**userSlice 设计**:
```ts
interface UserState {
  users: User[]
  currentUser: User | null    // 当前登录用户
  loading: boolean
  error: string | null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action) => { state.users = action.payload },
    addUser: (state, action) => { state.users.unshift(action.payload) },
    updateUser: (state, action) => { /* 按 id 查找并更新 */ },
    deleteUser: (state, action) => { state.users = state.users.filter(u => u.id !== action.payload) },
    setCurrentUser: (state, action) => { state.currentUser = action.payload },
    clearCurrentUser: (state) => { state.currentUser = null },
  },
  extraReducers: (builder) => {
    // 处理异步 login 的 pending/fulfilled/rejected
  },
})
```

### 2. 用户类型定义

**决定**: 在 `src/types/timeEntry.ts` 中新增 `User` 类型（不新建类型文件）

```ts
export type User = {
  id: string
  username: string
  password: string          // mock 数据使用明文，不展示给前端用户
  roles: UserRole[]         // 一对多，为第6周多角色权限管理预留
  createdAt: string
}

export type UserRole = '管理员' | '普通用户'
```

**理由**:
- 当前项目只有一个类型文件 `timeEntry.ts`，新增 User 类型在同一文件保持简洁
- 新建类型文件会增加 import 路径认知负担，初学者不需要过早引入模块组织概念
- `UserRole` 使用字符串字面量联合类型（与 `ApprovalStatus` 一致），保持风格统一
- `password` 字段仅用于 mock 认证，不展示给前端用户

### 3. 默认用户数据

**决定**: 在 `mockApi.ts` 中内置 3 条默认用户

```ts
let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    roles: ['管理员'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    username: 'user1',
    password: 'user123',
    roles: ['普通用户'],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    username: 'user2',
    password: 'user123',
    roles: ['普通用户'],
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
]
```

**理由**:
- 与工时 mock 数据模式一致（3 条示例记录）
- 提供管理员和普通用户两种角色，便于第6周权限测试
- 密码使用简单明文（学习项目可接受）

### 4. Mock 数据与 API 层扩展

**决定**: 在现有 `mockApi.ts`、`timeEntryApi.ts`、`mockAdapter.ts` 中追加用户相关函数（不新建文件）

**mockApi.ts 新增**:
```ts
export async function getUsers(): Promise<User[]>
export async function queryUsers(query: UserQuery): Promise<User[]>
export async function getUserById(id: string): Promise<User>
export async function addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User>
export async function deleteUser(id: string): Promise<void>
export async function login(username: string, password: string): Promise<User>
```

**login 实现**:
```ts
export async function login(username: string, password: string): Promise<User> {
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) {
    return Promise.reject(new Error('用户名或密码错误'))
  }
  return Promise.resolve({ ...user })
}
```

**UserQuery 类型**:
```ts
export interface UserQuery {
  username?: string
  role?: UserRole | ''
}
```

**timeEntryApi.ts 新增**: 对应用户的 HTTP 请求函数，使用 `httpClient` 调用 `/users` 端点

**mockAdapter.ts 新增**: 注册 `/users` 相关端点的 mock 路由（含 `POST /users/login`）

**理由**:
- 当前 API 层文件较少，追加函数不会造成认知负担
- 保持"现有模式不变"的原则，不引入新的文件组织结构
- 初学者先理解"同一模式可以扩展到不同领域"

### 5. 用户列表页面（参照工时列表页模式）

**决定**: 新建 `src/pages/UserListPage.tsx`，参照 `TimeEntryListPage` 的结构

```tsx
// UserListPage.tsx 结构
function UserListPage() {
  const { users, loading } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [filtered, setFiltered] = useState<User[] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 查询：调用 queryUsers API，更新 filtered state
  // 列表展示：用户名 + 角色(Tag) + 创建时间
  // 操作列：详情(导航到 /users/:id)、编辑(导航到 /users/:id/edit)、删除(Popconfirm)
  // 顶部按钮：新增用户(导航到 /users/create)
  // 分页：前端分页，每页 5 条
}
```

**Table columns**:
```tsx
const columns: ColumnsType<User> = [
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '角色', dataIndex: 'roles', key: 'roles', render: (roles: UserRole[]) => roles.map(r => <Tag color={roleColor[r]}>{r}</Tag>) },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (v) => formatDate(v) },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button size="small" onClick={() => navigate(`/users/${record.id}`)}>详情</Button>
        <Button size="small" onClick={() => navigate(`/users/${record.id}/edit`)}>编辑</Button>
        <Popconfirm title="确定删除该用户吗？" onConfirm={() => handleDelete(record.id)}>
          <Button danger size="small">删除</Button>
        </Popconfirm>
      </Space>
    ),
  },
]
```

**理由**:
- 完全复用第2周 TimeEntryListPage 的 Redux + Ant Design + 路由导航模式
- 分页逻辑与 TimeEntryListPage 一致（前端分页，每页 5 条）
- 操作列使用导航（navigate）而非 Modal，与工时页面保持一致
- 角色使用 Ant Design Tag 组件，管理员=蓝色，普通用户=绿色

### 6. 用户查询表单组件

**决定**: 新建 `src/components/timesheet/UserQueryForm.tsx`，参照 `TimeEntryQueryForm` 的结构

```tsx
// UserQueryForm.tsx 结构
interface UserQueryFormProps {
  onQuery: (query: UserQuery) => void
  onCreate: () => void
}

function UserQueryForm({ onQuery, onCreate }) {
  // 使用 React Hook Form + Ant Design Form/Input/Select/Button/Space
  // 查询字段：用户名（Input）、角色（Select: 全部/管理员/普通用户）
  // 按钮：查询、清空、新增用户（dashed 类型，导航到 /users/create）
}
```

**理由**:
- 与第2周 TimeEntryQueryForm 模式一致（React Hook Form + Ant Design 组件）
- 查询字段更简单（只有用户名和角色两个条件）
- `onCreate` 回调调用 `navigate('/users/create')`

### 7. 用户详情页（参照工时详情页模式）

**决定**: 新建 `src/pages/UserDetailPage.tsx`，参照 `TimeEntryDetailPage` 的结构

```tsx
// UserDetailPage.tsx 结构
function UserDetailPage() {
  const { id } = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 挂载时经请求模块按 id 加载用户
  useEffect(() => {
    getUserById(id).then(setUser).catch(setError).finally(() => setLoading(false))
  }, [id])

  // 加载中显示"加载中..."
  // 加载失败显示"未找到该用户" + 返回列表
  // 成功则只读展示：用户名、角色(Tag)、创建时间
  // 按钮：编辑(Link to /users/:id/edit)、返回列表(Link to /users)
}
```

**理由**:
- 完全复用第2周 TimeEntryDetailPage 的"加载中/失败/成功"三态模式
- 只读展示，不使用输入框样式
- 使用 Link 声明式导航到编辑页和列表页

### 8. 用户新增页（参照工时新增页模式）

**决定**: 新建 `src/pages/UserCreatePage.tsx`，参照 `TimeEntryCreatePage` 的结构

```tsx
// UserCreatePage.tsx 结构
function UserCreatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleSubmit = async (data: { username: string; roles: UserRole[] }) => {
    // 调用 addUser API，成功后 navigate('/')
    await addUser(data)
    navigate('/users')
  }

  return (
    <div>
      <UserForm onSubmit={handleSubmit} />
    </div>
  )
}
```

**理由**:
- 与第2周 TimeEntryCreatePage 模式一致（独立页面 + dispatch + navigate）
- 复用 UserForm 组件（新增模式，不传 initialData）

### 9. 用户编辑页（参照工时编辑页模式）

**决定**: 新建 `src/pages/UserEditPage.tsx`，参照 `TimeEntryEditPage` 的结构

```tsx
// UserEditPage.tsx 结构
function UserEditPage() {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 挂载时经请求模块按 id 加载用户
  useEffect(() => {
    getUserById(id).then(setUser).catch(setError).finally(() => setLoading(false))
  }, [id])

  // 加载中/失败处理同详情页
  // 提交：dispatch updateUser，成功后 navigate('/users')
  // 表单：UserForm 编辑模式，传 initialData={user}
}
```

**理由**:
- 与第2周 TimeEntryEditPage 模式一致（加载记录 → 预填表单 → 提交更新 → 返回列表）
- 复用 UserForm 组件（编辑模式，传 initialData）

### 10. 用户表单组件

**决定**: 新建 `src/components/timesheet/UserForm.tsx`，供新增页和编辑页复用

```tsx
interface UserFormProps {
  onSubmit: (values: { username: string; roles: UserRole[] }) => void
  initialData?: User
  onCancel?: () => void
}

function UserForm({ onSubmit, initialData, onCancel }) {
  // 使用 React Hook Form + Ant Design Form/Input/Select/Button
  // 字段：用户名（Input，必填）、角色（Select，必填）
  // 编辑模式：用户名字段 disabled（不可修改）
  // 按钮：提交、取消（调用 onCancel）
}
```

**理由**:
- 新增和编辑共用同一表单，通过 `initialData` 区分模式
- 与第2周 TimeEntryForm 的设计模式一致（复用表单组件）
- 编辑模式下用户名不可修改（与工时编辑页中审批状态只读的设计一致）

### 11. 登录页重构

**决定**: 重构 `LoginPage.tsx`，调用用户登录接口验证用户名+密码

```tsx
const handleFormSubmit = async (values: LoginFormValues) => {
  try {
    // 调用登录接口验证
    const user = await loginUser(values.username.trim(), values.password)
    
    // 验证成功：保存登录态 + 用户信息
    login()
    saveUsername(values.username.trim())
    dispatch(setCurrentUser(user))
    
    // 跳转到主页
    const state = location.state as { from?: string } | null
    navigate(state?.from ?? '/', { replace: true })
  } catch (err) {
    // 验证失败：提示错误
    message.error(err instanceof Error ? err.message : '登录失败')
  }
}
```

**理由**:
- 登录是用户认证的自然入口
- 验证成功后同时保存登录态（localStorage）和用户信息（Redux），为第6周权限判断提供数据基础
- 验证失败时提示用户，不改变登录态
- 与第4周审批流程中"异步操作 + 错误处理"模式一致

### 12. 侧边栏新增导航项

**决定**: 在 `AppLayout.tsx` 的 `menuItems` 数组中追加用户管理项

```ts
const menuItems = [
  { key: '/', icon: <FileTextOutlined />, label: '工时列表' },
  { key: '/timesheet/create', icon: <PlusOutlined />, label: '新增工时' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },  // 新增
]
```

**理由**:
- 修改量极小，只需在数组中追加一项
- Menu 组件自动处理选中态高亮（通过 `selectedKeys={[location.pathname]}`）
- 使用 `UserOutlined` 图标，与 Ant Design 图标库风格一致

### 13. 路由配置

**决定**: 在 `App.tsx` 的受保护路由下新增用户管理相关路由

```tsx
<Route element={<RequireAuth><AppLayout /></RequireAuth>}>
  <Route index element={<TimeEntryListPage />} />
  <Route path="timesheet/create" element={<TimeEntryCreatePage />} />
  <Route path="timesheet/:id" element={<TimeEntryDetailPage />} />
  <Route path="timesheet/:id/edit" element={<TimeEntryEditPage />} />
  <Route path="timesheet" element={<TimeSheetPage />} />
  <Route path="users" element={<UserListPage />} />
  <Route path="users/create" element={<UserCreatePage />} />
  <Route path="users/:id" element={<UserDetailPage />} />
  <Route path="users/:id/edit" element={<UserEditPage />} />
</Route>
```

**理由**:
- 所有用户管理路由都是受保护路由，需要登录才能访问
- `/users/create` 放在 `/users/:id` 之前，避免被误匹配为 timesheet 的 id 参数

## Risks / Trade-offs

- **[Mock 数据与 Redux 并存]**：用户数据在 mockApi（内存）和 Redux store（客户端）之间同步。缓解：与工时数据模式一致，通过 API 层桥接
- **[密码明文存储]**：mock 数据中密码使用明文。缓解：学习项目可接受；真实项目需加密存储
- **[表单复用]**：用户表单与时工表单结构不同，不能复用 TimeEntryForm。缓解：新建 UserForm，结构更简单（只有用户名+角色两个字段）
- **[页面数量增加]**：用户管理新增 4 个页面（列表/详情/新增/编辑）+ 1 个组件（查询表单）。缓解：每个页面代码量少（参照工时页面模板），学习成本低