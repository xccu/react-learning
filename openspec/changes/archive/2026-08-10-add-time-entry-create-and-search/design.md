## Context

现状（见 proposal.md - Why）：
- 新增记录只能走 `TimeSheetPage`（`/timesheet`）内联表单，`TimeEntryForm` 已被编辑页复用（`TimeEntryEditPage` 传 `initialData`），新增模式（不传 `initialData`）尚未有独立页面。
- 列表页 `TimeEntryListPage`（`/` index）只读 Context 的 `entries` 渲染全部记录，无查询入口。
- 数据层为 `src/api/mockApi.ts`（内存数组 + Promise 函数），`TimeEntryContext` 封装增删改，不暴露查询。
- 技术栈约束：React 19 + react-router-dom v7（声明式模式）+ Context + CSS Modules + TypeScript。禁止引入新技术栈（无 Axios / React Hook Form / Redux / Ant Design）。

## Goals / Non-Goals

**Goals:**
- 独立新增页复用 `TimeEntryForm` 新增模式，不复制表单代码。
- 列表页查询表单走 mockApi 过滤，不改动共享 `entries` 全局状态（查询是只读视图，不污染数据源）。
- 全部使用现有技术栈与代码风格（受控组件、CSS Modules、组件化拆分）。

**Non-Goals:**
- 不做真实后端查询、不做服务端分页/排序（第 2 周 Axios 接入时再定）。
- 不做列表项级联/模糊多词匹配，仅包含关系过滤（`includes`）。
- 不改动 `TimeSheetPage` 既有行为。

## Decisions

- **新增页路由 `/timesheet/create`**：React Router 按静态段优先于动态段打分，`timesheet/create` 不会被 `timesheet/:id` 吞掉（`id="create"` 分支失效）。注册顺序放在 `timesheet/:id/edit` 之前以提升可读性。备选 `/timesheet/new`：与组件命名不一致，不采用。
- **`TimeEntryCreatePage` 复用 `TimeEntryForm`**：渲染 `<TimeEntryForm onSubmit={handleSubmit} />` 不传 `initialData`，标题为「新增工时」、按钮为「提交」。`handleSubmit` 调 Context `addEntry` 后 `navigate('/')` 回列表页。备选：新写一份新增表单 —— 复制代码、违背复用目标，不采用。
- **mockApi 新增 `queryEntries(query)`**：在 `mockApi.ts` 定义并导出 `TimeEntryQuery`（`projectName` / `description` / `approvalStatus` 可选，`approvalStatus` 空串表示不限），实现为对内存数组 `filter` + `toLowerCase().includes`，返回 `Promise.resolve` 过滤后的副本，不改动 `entries` 本身。备选：直接让列表页本地过滤 —— 违背「查询功能在 mockApi 中实现」的要求，不采用。
- **Context 新增 `queryEntries`**：`TimeEntryContextType` 增加 `queryEntries: (q: TimeEntryQuery) => Promise<TimeEntry[]>`，内部透传 mockApi。列表页把过滤结果保存在**本地 state**，不写回全局 `entries`，避免「清空查询后丢失全部数据」。
- **查询表单组件 `TimeEntryQueryForm`**：新增 `src/components/timesheet/TimeEntryQueryForm.tsx`，字段为项目名称、工作内容（受控文本）、审批状态（原生 `<select>`，含「全部」空选项）；按钮组「查询」+「新增工时」。组件保持展示型，通过 `onQuery` / `onCreate` 回调交给列表页处理。备选：复用 `ApprovalStatusSelector`（单选按钮组）——其类型无「全部」空值、语义是表单状态选择而非查询条件，不采用；直接用原生 select，仍属现有技术栈。
- **侧边导航「新增工时」项**：`AppLayout` 新增 `<NavLink to="/timesheet/create" end>`（`end` 精确匹配避免 `/timesheet/create/...` 误高亮）。「工时填报」维持现有不加 `end` 的部分匹配（详情/编辑页高亮需求不变）。
- **列表页展示逻辑**：本地 state `filtered: TimeEntry[] | null`，`visible = filtered ?? entries`；提交查询 → `setFiltered(await queryEntries(q))`，清空/无条件 → `setFiltered(null)` 回退 Context 全量。查询期间不做额外 loading（mock 即时返回）。
- **详情页只读展示**：`TimeEntryDetailPage` 当前用 `div className={styles.input}` 复用 `TimeEntryForm.module.css` 的 `.input`（带边框/背景），值呈输入框外观但不可编辑，且页面并未复用 `TimeEntryForm` 组件。重构为独立 `src/pages/TimeEntryDetailPage.module.css`，字段以「标签 + 文本」呈现（定义无边框的 `.value` 类），仅保留「编辑」「返回列表」按钮，移除对 `TimeEntryForm.module.css` 的 import。备选：沿用现有样式 —— 只读语义与「可编辑输入框」外观不一致，且详情页本身不依赖该表单组件，不采用。

## Risks / Trade-offs

- [在 `/timesheet/create` 页时「工时填报」（部分匹配 `/timesheet`）与「新增工时」（`end` 精确）可能同时高亮] → 新增工时用 `end` 保证自身高亮；若视觉上可接受则保留，否则后续可给「工时填报」加 `end`（需接受详情页不再高亮）。
- [查询只作用于本地视图，新增/删除后列表与查询结果可能不同步] → 提交新增后跳回列表页会重置 `filtered` 回退全量；删除仍走 Context（全局），查询结果在下次查询时刷新。
- [`TimeEntryQuery` 的类型定义若与后端接口字段不一致，第 2 周接 Axios 时需调整] → 类型收敛在 `mockApi.ts`，切换数据源时只改该模块。
