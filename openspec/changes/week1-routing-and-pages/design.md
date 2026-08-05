## Context

当前应用（`react-app/`）是单页结构：`App.tsx` 使用 `useState` 驱动 `AppLayout` 的侧边导航切换右侧内容，`TimeSheetPage` 在同屏渲染表单、统计、列表，编辑采用页面内联模式（`editingEntry` 状态）。`react-router-dom@^7.18.1` 已安装，`main.tsx` 已配置 `BrowserRouter`，`App.tsx` 已有 `/docs-examples` 声明式路由。学习计划第 1 周要求引入路由将应用拆分为多页面结构（见 proposal.md - Why）。

目标是把导航机制从「组件状态切换」迁移到「URL 驱动」，同时保持 `TimeSheetPage` 原有功能与 `/docs-examples` 路由不受影响。

## Goals / Non-Goals

**Goals:**
- 建立完整路由表：登录页、受保护的嵌套主布局、404 兜底
- 新增列表页 / 详情页 / 编辑页，复用现有 `TimeEntryList`、`Stats`、`TimeEntryForm`、`TimeEntryItem`
- 将 `AppLayout` 改为路由化布局（`NavLink` 高亮 + `<Outlet />` + 退出登录）
- 保持原 `TimeSheetPage` 的增删改查与内联编辑行为不变，通过可选回调保持 `TimeEntryItem`/`TimeEntryList` 向后兼容

**Non-Goals:**
- 不接入真实后端/登录鉴权，仅做前端模拟登录态（localStorage）
- 不做数据请求层改造（保持 Context + mock API，属第 2 周）
- 不引入 Redux、Ant Design（属第 4 周）
- 不改动 `/docs-examples` 路由

## Decisions

### 决策 1：路由采用声明式 `<Routes>` 而非 `createBrowserRouter`
保持现有 `App.tsx` 的 `<Routes>/<Route>` 写法，仅新增/调整路由条目。应用规模小，声明式写法更贴近学习计划第 1 周的「URL 与页面组件映射」概念；`createBrowserRouter`（对象式）留待第 6 周工程化时再引入。

路由表设计：
```
/login                        → LoginPage（无守卫）
/（RequireAuth 包裹）         → AppLayout（嵌套主布局）
  index                       → TimeEntryListPage（默认列表页）
  timesheet/:id/edit          → TimeEntryEditPage
  timesheet/:id               → TimeEntryDetailPage
  timesheet                   → TimeSheetPage（原页面，功能不变）
*                             → NotFoundPage（404，置于最后）
```

备选：将原 `TimeSheetPage` 保留在 `AppLayout` 的 state 导航中。否决理由：保留两套导航机制会增加初学者理解负担，且第 1 周明确要求主布局使用路由导航与退出登录。

### 决策 2：列表项导航通过可选回调注入，保持向后兼容
`TimeEntryItem` 新增可选 prop `onViewDetail?: () => void`，`TimeEntryList` 同步透传。仅当回调存在时渲染「详情」按钮；「编辑」「删除」prop 保持不变。
- 新列表页 `TimeEntryListPage`：`onViewDetail` → `navigate('/timesheet/' + id)`，`onEdit` → `navigate('/timesheet/' + id + '/edit')`，`onDelete` → 调 `deleteEntry`。
- 原 `TimeSheetPage`：不传 `onViewDetail`，继续内联编辑，行为与改造前一致。

备选：直接修改 `TimeEntryItem` 内部使用 `useNavigate`。否决理由：会让原 `TimeSheetPage` 的内联编辑失效，违反「原页面功能不变」约束；用 prop 注入是「组合优于继承/硬编码」的最小侵入方案。

### 决策 3：登录态使用独立 auth 模块 + localStorage
新建 `src/utils/auth.ts`，导出 `isLoggedIn()`、`login()`、`logout()`，以 localStorage 布尔标志持久化登录态（刷新不丢失）。新建 `src/components/auth/RequireAuth.tsx`，用 `useLocation()` 记录来源路径，未登录时 `<Navigate to="/login" state={{ from }} replace />`；`LoginPage` 成功后 `navigate(from ?? '/', { replace: true })`。

备选：把登录态放进 Context。否决理由：登录态与业务数据（工时记录）生命周期不同，独立模块职责更清晰，也符合学习材料 3.1 的示例结构。

### 决策 4：详情页为只读镜像，复用表单布局样式
新建 `TimeEntryDetailPage`，按 `TimeEntryForm` 的字段顺序与视觉（项目名称、工作内容、工时、审批状态 + 创建时间）以只读方式渲染，直接复用 `TimeEntryForm.module.css` 的布局类。通过 `useParams()` 取 `id`，从 `useTimeEntries().entries` 中 `find`；找不到时显示提示 + 返回列表入口。

备选：把 `TimeEntryForm` 改造为支持只读模式。否决理由：给表单组件引入 readOnly 分支会同时影响新增/编辑两条路径，侵入大、易引入回归；只读详情页是独立职责，镜像布局更安全。

### 决策 5：编辑页复用 TimeEntryForm 编辑模式
新建 `TimeEntryEditPage`，从 entries 中 `find` 记录作为 `initialData`，`onSubmit` 调 `updateEntry(id, entry)` 后 `navigate('/timesheet')`，`onCancel` 返回列表页；记录不存在时提示 + 返回入口。无需修改 `TimeEntryForm` 本身（其编辑模式已支持预填与取消）。

### 决策 6：AppLayout 改为路由化，移除 state 导航
`AppLayout` 移除 `activeNav`/`navPages`/`navItems` props，改为 `NavLink` + `<Outlet />`，`NavLink` 通过回调类名实现高亮（列表导航用 `end` 避免误高亮），并增加「退出登录」按钮（`logout()` 后 `navigate('/login')`）。原 `TimeSheetPage` 以 `timesheet` 子路由形式保留在布局中，功能组件本身不改动。

### 决策 7：主布局左侧导航栏新增「工时列表」入口，指向 TimeEntryListPage
`App.tsx` 挂载的主布局（`AppLayout`）左侧导航栏 SHALL 提供「工时列表」导航项，通过 `<NavLink to="/" end>` 指向受保护主布局的 index 子路由 `TimeEntryListPage`，使其成为登录后的默认落地页；`end` 保证仅在根路径 `/` 时高亮，进入详情页 `/timesheet/:id` 或编辑页 `/timesheet/:id/edit` 时不误高亮。原「工时填报」导航项保留，以 `<NavLink to="/timesheet">` 指向 `TimeSheetPage`。导航项配置随决策 6 的路由化重构内聚于 `AppLayout`，`App.tsx` 不再维护 `navItems`/`navPages`。

备选：在现有 `App.tsx` 的 `navItems` 中追加一条指向 `TimeEntryListPage` 的项。否决理由：与决策 6 路由化重构冲突，会保留「组件状态 + URL」两套导航机制，违背第 1 周「URL 驱动导航」目标。

## Risks / Trade-offs

- [ `AppLayout` 重构破坏导航高亮或路由匹配 ] → 高亮使用 `NavLink` + `end` 精确匹配；改造后手动验证 列表/详情/编辑/原页面 四处导航。
- [ 原 `TimeSheetPage` 因列表项 prop 调整出现回归 ] → `onViewDetail` 为可选 prop，默认不渲染；验证原页面内联编辑与删除正常。
- [ 刷新/深链 `/timesheet/:id` 时 404 ] → Vite dev server 默认 SPA 回退；若出现需配置 `appType: 'spa'`（默认即启用）。
- [ 详情/编辑页在 Context 数据未加载完成时短暂「记录不存在」 ] → 利用 `TimeEntryContext` 的 `loading` 状态在加载中不判定不存在，加载完成后再 find。
- [ 移除 `navPages` 机制影响后续页面扩展 ] → 扩展走新子路由，语义更清晰，属预期收益而非风险。

## Migration Plan

1. 实现 auth 模块与 RequireAuth、LoginPage、NotFoundPage。
2. 调整 `App.tsx` 路由表（新增登录/嵌套布局/404，保留 `/docs-examples`）。
3. 重构 `AppLayout` 为路由化布局（NavLink + Outlet + 退出登录）。
4. 给 `TimeEntryItem`/`TimeEntryList` 增加可选 `onViewDetail`。
5. 新增列表页、详情页、编辑页，接入既有组件。
6. 回归验证：原 `TimeSheetPage` 增删改查不变、`/docs-examples` 不变、`npm run build` 与 `npm run lint` 通过。
回滚策略：全程单分支小步提交；任一步骤出现回归时通过 git revert 回退对应提交。

## Open Questions

无。
