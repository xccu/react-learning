## Context

当前工时填报应用使用 React 19 + TypeScript + Vite 构建，状态管理基于 React Context + useState，数据通过 Axios + mock adapter 模拟 CRUD。列表页已实现分页、导入导出、查询过滤功能。审批状态（待审批/已通过/已驳回）仅作为静态字段展示，无流程操作。

第4周学习计划引入 Redux Toolkit（全局状态管理）和 Ant Design（企业级 UI 组件库），这是全程难度峰值。需要实现完整的审批流程：提交→待审批→通过/驳回→重填→再提交。

## Goals / Non-Goals

**Goals:**
- 安装并配置 Redux Toolkit 和 Ant Design
- 将工时数据从 Context + useState 迁移到 Redux slice
- 实现完整的审批流程（提交、通过、驳回、重填）
- 用 Ant Design 组件逐步替换现有 UI 组件
- 按状态控制列表和详情页的操作按钮

**Non-Goals:**
- 不迁移用户管理模块（第5周内容）
- 不实现权限控制（第6周内容）
- 不替换所有自定义样式组件（渐进式替换）
- 不引入 Redux DevTools 扩展配置（学习项目可接受默认配置）

## Decisions

### 1. Redux Store 架构

**决定**: 创建 `src/store/` 目录，包含 `index.ts`（configureStore）和 `timesheetSlice.ts`（工时状态模块）

```
src/store/
  index.ts          — configureStore + RootState/AppDispatch 类型推导
  timesheetSlice.ts — createSlice: 初始状态、同步 reducers、异步 thunks
```

**理由**: 
- 当前只有一个业务模块（工时），只需一个 slice
- 第5周用户管理模块新增时，在 `src/store/` 下新增 `userSlice.ts` 即可
- 类型推导使用 `RootState` 和 `AppDispatch`，保证类型安全

**替代方案**: 
- 保留 Context 并叠加 Redux（增加认知负担，不推荐）
- 将所有状态放在一个 slice（当前够用，后续按模块拆分）

### 2. 从 Context 迁移到 Redux 的策略

**决定**: 渐进式迁移，先创建 Redux slice 并注入 Provider，再逐步替换组件中的 Context 消费为 Redux hooks

**迁移顺序**:
1. 创建 store 和 slice（不替换组件）
2. 在 `main.tsx` 中用 `<Provider>` 包裹应用
3. 替换 `TimeEntryListPage` 中的 `useTimeEntries` 为 `useSelector`/`useDispatch`
4. 替换 `TimeEntryDetailPage` 中的本地 state 为 Redux
5. 替换 `TimeEntryEditPage`/`TimeEntryCreatePage` 中的操作为 dispatch
6. 删除 `TimeEntryContext.tsx`

**理由**: 避免一次性大量改动导致难以调试，每步可独立验证

### 3. 审批流程状态机

**决定**: 使用状态机思维定义合法流转，用 Redux reducer 实现状态转换

```
                    提交
  已通过 ←─────── 待审批 ───────→ 已驳回
                    ↑              │
                    └──── 重填 ────┘
```

**状态转换规则**:
- 所有新创建的记录初始状态为"待审批"
- "待审批" → 可执行：审批通过、驳回
- "已驳回" → 可执行：重填（跳转到编辑页，编辑后再次提交变为"待审批"）
- "已通过" → 不可执行审批操作，仅可查看和编辑内容

**驳回原因**: 在 `TimeEntry` 类型中新增 `rejectReason?: string` 可选字段，记录驳回原因

### 4. Redux Slice 设计

**决定**: 使用 `createSlice` 定义同步 reducers，使用 `createAsyncThunk` 定义异步操作

```ts
// timesheetSlice.ts
interface TimesheetState {
  entries: TimeEntry[]
  loading: boolean
  error: string | null
}

// 同步 reducers（使用 Immer，可直接修改 state）
const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    addEntry: (state, action) => { state.unshift(action.payload) },
    updateEntry: (state, action) => { /* 按 id 查找并更新 */ },
    deleteEntry: (state, action) => { /* 过滤掉 */ },
    approveEntry: (state, action) => { /* 状态改为'已通过' */ },
    rejectEntry: (state, action) => { /* 状态改为'已驳回'，记录原因 */ },
    setEntries: (state, action) => { state.entries = action.payload },
  },
  extraReducers: (builder) => {
    // 处理异步 thunk 的 pending/fulfilled/rejected
  },
})
```

**理由**: 
- `createSlice` 自动生成 action creators，减少样板代码
- Immer 内置，reducer 中可直接 `state.push()` 等可变操作
- `extraReducers` 处理异步 thunk 的三态

### 5. API 层扩展

**决定**: 在 `src/api/timeEntryApi.ts` 和 `mockApi.ts` 中新增审批相关接口

```ts
// 新增 API
export async function submitEntry(id: string): Promise<TimeEntry>
export async function approveEntry(id: string): Promise<TimeEntry>
export async function rejectEntry(id: string, reason: string): Promise<TimeEntry>
```

**Mock 实现**:
- `submitEntry`: 将记录的 `approvalStatus` 改为"待审批"
- `approveEntry`: 将记录的 `approvalStatus` 改为"已通过"
- `rejectEntry`: 将记录的 `approvalStatus` 改为"已驳回"，记录 `rejectReason`

**Mock Adapter**: 注册 `PUT /time-entries/:id/submit`、`PUT /time-entries/:id/approve`、`PUT /time-entries/:id/reject` 端点

### 6. Ant Design 集成策略

**决定**: 在 `main.tsx` 中用 `<ConfigProvider locale={zhCN}>` 包裹应用，逐步替换组件

**替换优先级**:
1. **列表页**：自定义 div 列表 → Ant Design Table（最高价值，Table 是核心组件）
2. **状态标签**：自定义 span → Ant Design Tag
3. **确认弹窗**：`window.confirm` → Ant Design Popconfirm
4. **消息提示**：`alert` → Ant Design message
5. **表单**：保留 React Hook Form，但 UI 元素（Input、TextArea、Select）替换为 Ant Design 组件
6. **操作栏/分页**：自定义 → Ant Design Space / Pagination

**理由**: 从最复杂、价值最高的组件开始替换，Table 替换后视觉效果提升最明显

### 7. 列表组件改造

**决定**: 将 `TimeEntryList` 的自定义 div 列表替换为 Ant Design Table

```tsx
const columns: ColumnsType<TimeEntry> = [
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
  { title: '工作内容', dataIndex: 'description', key: 'description' },
  { title: '工时', dataIndex: 'hours', key: 'hours', render: (v) => `${v} 小时` },
  { 
    title: '审批状态', 
    dataIndex: 'approvalStatus', 
    key: 'approvalStatus',
    render: (status) => <Tag color={statusColor[status]}>{statusText[status]}</Tag>
  },
  { 
    title: '创建时间', 
    dataIndex: 'createdAt', 
    key: 'createdAt',
    render: (v) => formatDate(v)
  },
  { 
    title: '操作', 
    key: 'action',
    render: (_, record) => (
      <>
        <Button size="small" onClick={() => onViewDetail(record)}>详情</Button>
        <Button size="small" onClick={() => onEdit(record)}>编辑</Button>
        <Popconfirm ...><Button danger size="small">删除</Button></Popconfirm>
        {/* 按状态显示审批操作按钮 */}
        {record.approvalStatus === '待审批' && (
          <>
            <Button size="small" type="primary" onClick={() => onApprove(record.id)}>通过</Button>
            <Button size="small" onClick={() => showRejectModal(record.id)}>驳回</Button>
          </>
        )}
      </>
    )
  },
]
```

**理由**: Table 组件内置分页、排序、筛选能力，配合 `pagination` prop 可替代自定义分页逻辑

### 8. 驳回操作实现方式

**决定**: 使用 Ant Design Modal + Form 实现驳回原因输入

```tsx
const [rejectModal, setRejectModal] = useState<{ open: boolean; entryId: string | null }>({
  open: false,
  entryId: null,
})

// 点击驳回按钮
const handleReject = (id: string) => {
  setRejectModal({ open: true, entryId: id })
}

// Modal 中
<Modal open={rejectModal.open} onOk={handleRejectSubmit} onCancel={() => closeModal}>
  <Form form={rejectForm}>
    <Form.Item name="reason" rules={[{ required: true, message: '请输入驳回原因' }]}>
      <TextArea placeholder="请输入驳回原因" rows={3} />
    </Form.Item>
  </Form>
</Modal>
```

**理由**: 
- 驳回需要用户输入原因，Modal 是最自然的交互方式
- 使用 Form.useForm 管理表单实例，validateFields 校验后提交
- Modal 开启 `destroyOnClose` 避免表单残留

### 9. 审批操作的位置

**决定**: 审批操作按钮放在列表的"操作"列中，按状态条件渲染

- "待审批"状态：显示「通过」「驳回」按钮
- "已通过"状态：不显示审批按钮
- "已驳回"状态：不显示审批按钮，但详情页显示驳回原因和「重填」入口

**理由**: 
- 审批操作是列表级别的常见操作，放在操作列最直观
- 按状态条件渲染，避免无关操作干扰用户
- 详情页作为只读视图，展示驳回原因但不执行操作

### 10. 编辑表单中审批状态只读

**决定**: 编辑模式下，审批状态字段显示当前值但不可修改；新建模式下审批状态可编辑（默认"待审批"）

```tsx
// TimeEntryForm.tsx
<Controller
  name="approvalStatus"
  render={({ field }) => (
    <ApprovalStatusSelector
      value={field.value}
      onChange={initialData ? undefined : field.onChange}
      disabled={!!initialData}
    />
  )}
/>
```

**ApprovalStatusSelector 改造**:
```tsx
interface ApprovalStatusSelectorProps {
  value: ApprovalStatus
  onChange?: (status: ApprovalStatus) => void
  disabled?: boolean
}
```

**显示效果**: 禁用状态下样式与正常状态完全一致（颜色、圆点、背景不变），仅不可点击

**理由**:
- 审批状态应由审批流程控制，不应由填报人随意修改
- 编辑表单的目的是修改项目名、工作内容、工时等内容，审批状态应保持不变
- 新建记录时允许选择初始状态（默认"待审批"），保留灵活性
- 禁用状态下保持视觉一致性，避免用户困惑

**替代方案**:
- 隐藏审批状态字段（用户不知道当前状态，不友好）
- 显示为纯文本（失去颜色标识，信息传达减弱）

- **[Redux 学习曲线陡]** → Redux 是全新范式，初学者可能难以理解单向数据流。缓解：严格按照学习计划，先理解概念再动手；代码注释详细说明每个步骤
- **[组件替换工作量大]** → 需要替换多个组件。缓解：按优先级逐步替换，先核心后边缘；保留部分自定义组件（如 Header）
- **[Context 与 Redux 并存期]** → 迁移期间两个状态管理方案共存。缓解：明确迁移时间表，尽快完成替换
- **[antd 包体积]** → antd 较大。缓解：学习项目可接受；生产环境可考虑按需导入
- **[rejectReason 字段]** → 新增可选字段可能影响已有数据。缓解：使用可选类型 `rejectReason?: string`，不影响现有记录

### 11. 分页组件替换为 Ant Design Pagination

**决定**: 将列表页的自定义分页控件（上一页/下一页按钮 + 页码显示）替换为 Ant Design `Pagination` 组件

**替换前（手动实现）**：
```tsx
// 手动计算分页
const pageSize = 5
const totalPages = Math.ceil(visibleEntries.length / pageSize)
const startIndex = (currentPage - 1) * pageSize
const currentEntries = visibleEntries.slice(startIndex, startIndex + pageSize)

// 手动渲染分页控件
<div className={styles.pagination}>
  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</button>
  <span>第 {currentPage}/{totalPages} 页，共 {visibleEntries.length} 条</span>
  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>下一页</button>
</div>
```

**替换后（使用 Pagination）**：
```tsx
import { Pagination } from 'antd'

// 方案一：保留前端切片，Pagination 仅控制页码
<Pagination
  current={currentPage}
  pageSize={5}
  total={visibleEntries.length}
  onChange={(page) => setCurrentPage(page)}
  showTotal={(total) => `共 ${total} 条`}
/>
// 数据切片逻辑保持不变

// 方案二（推荐）：Table 内置分页，完全删除手动分页逻辑
<Table
  dataSource={visibleEntries}  // 传入全量数据
  pagination={{
    current: currentPage,
    pageSize: 5,
    total: visibleEntries.length,
    onChange: (page) => setCurrentPage(page),
    showTotal: (total) => `共 ${total} 条`,
  }}
  columns={columns}
/>
```

**Pagination 属性说明**：
- `current`：当前页码，受控于 `currentPage` state
- `pageSize`：每页条数，固定为 5
- `total`：总条数，驱动分页按钮的启用/禁用
- `onChange`：翻页时回调，更新 `currentPage`
- `showTotal`：自定义总条数显示文案

**自动处理**：
- 首页时「上一页」按钮自动禁用
- 末页时「下一页」按钮自动禁用
- 只有一页时自动隐藏分页控件
- 自动显示「共 X 条」和页码导航

**理由**：
- Pagination 是 Ant Design 最成熟的组件之一，API 简单直观
- 自动处理边界状态（首页/末页禁用），无需手动判断
- 与 Table 配合使用时，Table 的 `pagination` prop 底层就是 Pagination 组件
- 学习成本低，代码量大幅减少

**替代方案**：
- 保留自定义分页（失去 Ant Design 视觉一致性）
- 服务端分页（当前为 mock 数据，前端分页足够）

### 12. 登录页替换为 Ant Design Form

**决定**: 将 LoginPage 的自定义表单替换为 Ant Design `Form` + `Input` + `Card`

**替换前**：
```tsx
<div className={styles.container}>
  <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.card} noValidate>
    <div className={styles.brand}>
      <span className={styles.brandIcon}>⚛️</span>
      <span className={styles.brandText}>React App</span>
    </div>
    <h1 className={styles.title}>登录</h1>
    <div className={styles.field}>
      <label>用户名</label>
      <input {...register('username', { required: '用户名不能为空' })} />
      {errors.username && <span>{errors.username.message}</span>}
    </div>
    <div className={styles.field}>
      <label>密码</label>
      <input type="password" {...register('password', { required: '密码不能为空' })} />
      {errors.password && <span>{errors.password.message}</span>}
    </div>
    <button type="submit" disabled={isSubmitting}>{isSubmitting ? '登录中...' : '登录'}</button>
  </form>
</div>
```

**替换后**：
```tsx
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

<Card bordered={false} className={styles.loginCard}>
  <h2>登录</h2>
  <Form onFinish={handleFormSubmit} layout="vertical">
    <Form.Item name="username" rules={[{ required: true, message: '用户名不能为空' }]}>
      <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
    </Form.Item>
    <Form.Item name="password" rules={[{ required: true, message: '密码不能为空' }]}>
      <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={isSubmitting} block>
        {isSubmitting ? '登录中...' : '登录'}
      </Button>
    </Form.Item>
  </Form>
</Card>
```

**替换项**：
- `<form>` → `Form`（保留 React Hook Form 的校验逻辑，UI 用 Ant Design）
- `<input>` → `Input`（带 `prefix` 图标）
- `<input type="password">` → `Input.Password`
- `<span>` 错误提示 → `Form.Item` 的 `rules` 自动处理
- `<button>` → `Button` `type="primary"` `htmlType="submit"` `loading`
- 卡片容器 → `Card` `bordered={false}`

**理由**：
- `Input.Password` 内置密码显示/隐藏切换，比原生 `<input type="password">` 体验更好
- `prefix` 图标提升表单可读性
- `Card` 提供统一的圆角和阴影效果
- `Form.Item` 的 `rules` 自动处理校验和错误提示，减少手动 DOM 操作

### 13. 404 页面替换为 Ant Design Result

**决定**: 将 NotFoundPage 的自定义 404 展示替换为 Ant Design `Result` 组件

**替换前**：
```tsx
<div className={styles.container}>
  <h1 className={styles.code}>404</h1>
  <p className={styles.message}>页面不存在</p>
  <Link to="/" className={styles.homeLink}>返回首页</Link>
</div>
```

**替换后**：
```tsx
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<Result
  status="404"
  title="404"
  subTitle="页面不存在"
  extra={<Button type="primary" onClick={() => navigate('/')}>返回首页</Button>}
/>
```

**替换项**：
- `<h1>404</h1>` + `<p>` + `<Link>` → `Result` `status="404"`
- `Result` 自动渲染 404 插图、标题、副标题和按钮槽位

**理由**：
- `Result` 是 Ant Design 专门用于展示操作结果和错误状态的组件
- 内置 404/403/500/success 等预设状态，视觉效果统一
- `extra` 插槽放置操作按钮，语义清晰

### 14. 统计卡片替换为 Ant Design Statistic

**决定**: 将 Stats 组件的自定义统计展示替换为 Ant Design `Statistic` 组件

**替换前**：
```tsx
<div className={styles.stats}>
  <h3 className={styles.statsTitle}>总工时</h3>
  <p className={styles.statsValue}>{totalHours} 小时</p>
</div>
```

**替换后**：
```tsx
import { Statistic } from 'antd';

<Statistic title="总工时" value={totalHours} suffix="小时" />
```

**替换项**：
- `<h3>` + `<p>` → `Statistic`
- `suffix` 属性显示后缀单位

**理由**：
- `Statistic` 专门用于展示数值型统计信息
- 内置数字动画、千分位格式化等能力
- `suffix` 属性比手动拼接字符串更语义化

### 15. 查询表单替换为 Ant Design Form

**决定**: 将 TimeEntryQueryForm 的自定义查询表单替换为 Ant Design `Form` + `Input` + `Select` + `Button`

**替换前**：
```tsx
<form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
  <div className={styles.fieldsRow}>
    <div className={styles.field}>
      <label>项目名称</label>
      <input {...register('projectName')} />
    </div>
    <div className={styles.field}>
      <label>工作内容</label>
      <input {...register('description')} />
    </div>
    <div className={styles.field}>
      <label>审批状态</label>
      <select {...register('approvalStatus')}>
        <option value="">全部</option>
        <option value="待审批">待审批</option>
        <option value="已通过">已通过</option>
        <option value="已驳回">已驳回</option>
      </select>
    </div>
  </div>
  <div className={styles.buttonGroup}>
    <button type="submit">查询</button>
    <button type="button" onClick={handleClear}>清空</button>
    <button type="button" onClick={onCreate}>+ 新增工时</button>
  </div>
</form>
```

**替换后**：
```tsx
import { Form, Input, Select, Button, Space } from 'antd';

<Form layout="inline" onFinish={handleFormSubmit} className={styles.queryForm}>
  <Form.Item name="projectName" label="项目名称">
    <Input allowClear placeholder="请输入项目名称" />
  </Form.Item>
  <Form.Item name="description" label="工作内容">
    <Input allowClear placeholder="请输入工作内容" />
  </Form.Item>
  <Form.Item name="approvalStatus" label="审批状态">
    <Select allowClear placeholder="请选择状态" options={statusOptions} />
  </Form.Item>
  <Form.Item>
    <Space>
      <Button type="primary" htmlType="submit">查询</Button>
      <Button onClick={handleClear}>清空</Button>
      <Button type="dashed" onClick={onCreate}>+ 新增工时</Button>
    </Space>
  </Form.Item>
</Form>
```

**替换项**：
- `<form>` → `Form` `layout="inline"`（查询字段水平排列）
- `<input>` → `Input` `allowClear`（自带清除按钮）
- `<select>` → `Select` `options`（受控下拉选项）
- `<button>` → `Button`（primary / default / dashed 类型区分操作优先级）
- 按钮组 → `Space`（自动处理间距）

**理由**：
- `layout="inline"` 使查询表单在水平方向排列，节省垂直空间
- `Input.allowClear` 提供一键清除功能，比原生 input 体验更好
- `Select.options` 用数组声明选项，比 `<option>` 更简洁
- `Space` 自动处理按钮间距，比手动 CSS margin 更可靠

### 16. 侧边栏替换为 Ant Design Layout + Menu

**决定**: 将 AppLayout 的自定义侧边栏替换为 Ant Design `Layout.Sider` + `Menu`

**替换前**：
```tsx
<nav className={styles.sidebar}>
  <div className={styles.sidebarLogo}>
    <span>⚛️</span>
    <span>React App</span>
  </div>
  <ul className={styles.navList}>
    <li>
      <NavLink to="/" end className={navLinkClass}>
        <span>📋</span>
        <span>工时列表</span>
      </NavLink>
    </li>
    <li>
      <NavLink to="/timesheet/create" end className={navLinkClass}>
        <span>➕</span>
        <span>新增工时</span>
      </NavLink>
    </li>
  </ul>
  <div className={styles.userMenu}>
    <span className={styles.userAvatar}>{username?.charAt(0)}</span>
    <span>{username ?? '未登录'}</span>
    <span onClick={handleLogout}>退出登录</span>
  </div>
</nav>
```

**替换后**：
```tsx
import { Layout, Menu, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const navigate = useNavigate();
const location = useLocation();

<Sider className={styles.sidebar} width={200}>
  <div className={styles.sidebarLogo}>
    <span>⚛️</span>
    <span>React App</span>
  </div>
  <Menu
    mode="inline"
    selectedKeys={[location.pathname]}
    items={[
      { key: '/', icon: <span>📋</span>, label: '工时列表' },
      { key: '/timesheet/create', icon: <span>➕</span>, label: '新增工时' },
    ]}
    onClick={({ key }) => navigate(key)}
  />
  <div className={styles.userMenu}>
    <Avatar icon={<UserOutlined />} />
    <span>{username ?? '未登录'}</span>
    <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} />
  </div>
</Sider>
```

**替换项**：
- `<nav>` + `<ul>` + `<li>` → `Layout.Sider` + `Menu`
- `NavLink` 高亮 → `Menu` `selectedKeys` 自动处理
- 用户头像 `<span>` → `Avatar`
- 退出登录 `<span>` → `Button` `type="text"` + `LogoutOutlined` 图标
- 导航项 → `Menu` `items` 数组声明

**理由**：
- `Layout.Sider` 提供标准的侧边栏布局和固定宽度
- `Menu` 自动处理选中态高亮，无需手动 isActive 回调
- `items` 数组声明导航项，比 `<li>` + `<NavLink>` 更简洁
- `Avatar` 提供统一的圆形头像样式

### 17. 页面标题保留自定义（低优先级）

**决定**: Header 组件暂时保留自定义实现，不做 Ant Design 替换

**理由**：
- Header 组件代码量少（12 行），替换收益低
- 自定义实现已满足需求（图标 + 标题）
- 作为低优先级项，可在后续迭代中考虑替换为 `PageHeader`

**替代方案**：
- 替换为 `PageHeader`（功能更丰富，但当前不需要面包屑、回退等高级功能）