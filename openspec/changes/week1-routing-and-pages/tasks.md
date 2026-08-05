## 1. 登录态与登录守卫

- [x] 1.1 新建 `src/utils/auth.ts`，实现 `isLoggedIn()`、`login()`、`logout()`，使用 localStorage 持久化登录态
- [x] 1.2 新建 `src/components/auth/RequireAuth.tsx`，未登录时记录来源路径并 `<Navigate to="/login" state={{ from }} replace />`
- [x] 1.3 新建 `src/pages/LoginPage.tsx`，登录表单 + 必填校验，成功后保存登录态并跳转来源路径（默认 `/`）
- [x] 1.4 在 `App.tsx` 中新增 `/login` 路由，并用 `RequireAuth` 包裹受保护主布局

## 2. 路由化主布局与 404

- [x] 2.1 重构 `src/components/timesheet/AppLayout.tsx`：移除 `activeNav`/`navPages`/`navItems` props，改用 `NavLink`（激活高亮，列表导航用 `end`）+ `<Outlet />`
- [x] 2.2 在 `AppLayout` 增加「退出登录」入口：调用 `logout()` 后 `navigate('/login')`
- [x] 2.3 新建 `src/pages/NotFoundPage.tsx`（404 提示 + 返回入口），在路由表末尾添加 `*` 兜底
- [x] 2.4 调整 `App.tsx` 路由表：受保护 `/` 嵌套主布局（index 为列表页），保留 `/docs-examples` 路由
- [x] 2.5 将原 `TimeSheetPage` 挂为 `/timesheet` 子路由，确保其功能组件本身不被改动

## 3. 列表项导航能力（向后兼容）

- [x] 3.1 给 `TimeEntryItem.tsx` 增加可选 prop `onViewDetail?: () => void`，仅当存在时渲染「详情」按钮
- [x] 3.2 给 `TimeEntryList.tsx` 增加并透传可选 prop `onViewDetail`
- [x] 3.3 验证原 `TimeSheetPage` 不传 `onViewDetail` 时，内联编辑与删除行为与改造前一致

## 4. 列表页

- [x] 4.1 新建 `src/pages/TimeEntryListPage.tsx`，复用 `Stats` 与 `TimeEntryList`，展示总工时
- [x] 4.2 列表页中 `onViewDetail` 导航至 `/timesheet/:id`，`onEdit` 导航至 `/timesheet/:id/edit`，`onDelete` 调用 `deleteEntry`
- [x] 4.3 将列表页设为受保护主布局的 index 默认页面

## 5. 详情页

- [x] 5.1 新建 `src/pages/TimeEntryDetailPage.tsx`，用 `useParams()` 读取 `id`，从 `entries` 中 `find` 记录
- [x] 5.2 复用 `TimeEntryForm.module.css` 布局类，以只读方式按字段顺序展示项目名称、工作内容、工时、审批状态、创建时间
- [x] 5.3 利用 `useTimeEntries().loading` 处理加载中状态，避免误判「记录不存在」
- [x] 5.4 记录不存在时显示提示并提供返回列表入口

## 6. 编辑页

- [x] 6.1 新建 `src/pages/TimeEntryEditPage.tsx`，用 `useParams()` 读取 `id` 并从 `entries` 中 `find` 记录
- [x] 6.2 复用 `TimeEntryForm`：`initialData` 传记录，`onSubmit` 调 `updateEntry` 后 `navigate('/timesheet')`，`onCancel` 返回列表
- [x] 6.3 记录不存在时显示提示并提供返回列表入口

## 7. 验证与收尾

- [x] 7.1 运行 `npm run lint`（oxlint）并修复提示
- [x] 7.2 运行 `npm run typecheck` 并修复类型错误
- [x] 7.3 运行 `npm run build`，确认生产构建成功
- [x] 7.4 回归验证：原 `TimeSheetPage` 增删改查、`/docs-examples`、登录/守卫、列表/详情/编辑/404 导航均正常
