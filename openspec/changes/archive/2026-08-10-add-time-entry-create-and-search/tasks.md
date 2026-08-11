## 1. 数据层（mockApi + Context）

- [x] 1.1 在 `react-app/src/api/mockApi.ts` 导出 `TimeEntryQuery` 类型（`projectName` / `description` / `approvalStatus` 均为可选，`approvalStatus` 空串表示不限）
- [x] 1.2 在 `react-app/src/api/mockApi.ts` 实现 `queryEntries(query)`：对内存数组按包含关系过滤（`toLowerCase().includes`），返回 `Promise<TimeEntry[]>` 过滤副本，不改动原数组
- [x] 1.3 在 `react-app/src/context/TimeEntryContext.tsx` 为 `TimeEntryContextType` 新增 `queryEntries`，内部透传 mockApi 实现

## 2. 查询表单组件

- [x] 2.1 新建 `react-app/src/components/timesheet/TimeEntryQueryForm.tsx`（展示型组件）：项目名称、工作内容受控文本 + 审批状态原生 `<select>`（含「全部」空选项）
- [x] 2.2 组件按钮组：查询按钮 + 「新增工时」按钮；通过 `onQuery(query)` / `onCreate()` 回调交给父组件
- [x] 2.3 新建 `TimeEntryQueryForm.module.css`，布局与配色沿用现有表单风格

## 3. 列表页集成

- [x] 3.1 `react-app/src/pages/TimeEntryListPage.tsx` 引入 `TimeEntryQueryForm`，本地 state `filtered`（初始 `null`），`visible = filtered ?? entries`
- [x] 3.2 提交查询：`setFiltered(await queryEntries(query))`；`onCreate` 调 `navigate('/timesheet/create')`
- [x] 3.3 清空/无条件查询：`setFiltered(null)` 回退 Context 全量

## 4. 新增页

- [x] 4.1 新建 `react-app/src/pages/TimeEntryCreatePage.tsx`：渲染 `<TimeEntryForm onSubmit={handleSubmit} />`（不传 `initialData`），`handleSubmit` 调 Context `addEntry` 后 `navigate('/')`
- [x] 4.2 新建 `TimeEntryCreatePage.module.css`，复用现有页面骨架样式

## 5. 详情页展示重构

- [x] 5.1 新建 `react-app/src/pages/TimeEntryDetailPage.module.css`：字段以「标签 + 文本」只读展示（无输入框边框/背景），按钮沿用既有布局风格
- [x] 5.2 `react-app/src/pages/TimeEntryDetailPage.tsx` 改用自有样式模块，字段以纯文本展示，移除对 `TimeEntryForm.module.css` 的 import 与 `styles.input` 复用
- [x] 5.3 确认详情页无输入框外观、字段不可编辑，仅保留「编辑」「返回列表」按钮

## 6. 路由与侧边导航

- [x] 6.1 `react-app/src/App.tsx` 路由表新增 `<Route path="/timesheet/create" element={<TimeEntryCreatePage />} />`，置于 `timesheet/:id` 相关路由之前
- [x] 6.2 `react-app/src/components/timesheet/AppLayout.tsx` 侧边导航新增「新增工时」`NavLink`（`to="/timesheet/create"`，加 `end`），与既有项同风格

## 7. 验证

- [x] 7.1 `npm run typecheck` 通过
- [x] 7.2 `npm run lint` 通过（不新增告警）
- [x] 7.3 手动验证：侧边导航进入新增页提交后回列表并出现新记录；列表按项目/内容/状态组合查询生效；无条件查询恢复全部；「新增工时」按钮跳转新增页
- [x] 7.4 手动验证详情页以只读文本展示（无输入框外观），仅保留「编辑」「返回列表」按钮
