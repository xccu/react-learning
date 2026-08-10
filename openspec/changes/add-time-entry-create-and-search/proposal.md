## Why

当前新增工时记录只能通过「工时填报」页（`TimeSheetPage`）的内联表单完成，列表页没有独立的「新增」入口；同时列表页只能展示全部记录，无法按条件筛选。需要新增一个独立「新增工时」页面复用 `TimeEntryForm`，并在列表页提供查询表单与「新增」按钮，让新增、查询流程更清晰。仅使用现有技术栈（React Router、Context、CSS Modules、mockApi、useState/useEffect），不引入新技术栈（无 Axios / React Hook Form / Redux / Ant Design）。

## What Changes

- 新增 `TimeEntryCreatePage` 页面，表单部分复用 `TimeEntryForm`（新增模式，不传 `initialData`），路由 `/timesheet/create`（静态段优先于动态 `/timesheet/:id` 匹配）
- `App.tsx` 路由表注册 `timesheet/create` 子路由
- 左侧导航栏（`AppLayout.tsx`）新增「新增工时」导航项，链接到 `/timesheet/create`
- `TimeEntryListPage` 新增查询表单（受控组件 + 简单校验，参照现有代码风格），按项目名称 / 工作内容 / 审批状态过滤工时记录
- 查询过滤逻辑在 `mockApi.ts` 新增 `queryEntries` 函数实现，返回过滤后的记录数组
- 查询按钮旁并列「新增工时」按钮，点击跳转 `/timesheet/create`
- `TimeEntryCreatePage` 提交成功后编程式跳转回列表页（复用 `navigate`）
- `TimeEntryDetailPage` 详情展示重构为只读文本形式（独立样式模块），不再复用 `TimeEntryForm` 的输入框样式

## Capabilities

### New Capabilities
- `time-entry-create-page`: 独立新增工时页面——复用 `TimeEntryForm`（新增模式），提供侧边导航与列表页按钮两个入口，提交成功后返回列表页
- `time-entry-search`: 列表页查询表单——按项目名称 / 工作内容 / 审批状态过滤工时记录，过滤逻辑由 mockApi 查询函数实现

### Modified Capabilities
- `time-tracking-app`: 「查看工时记录列表」需求扩展——列表支持按查询条件过滤展示（原为始终展示全部记录）；工时记录详情页以只读文本展示，不使用输入框样式

## Impact

- 新增页面：`src/pages/TimeEntryCreatePage.tsx`（复用 `TimeEntryForm`，位于 `src/pages/`）
- 修改 `src/App.tsx`：路由表注册 `timesheet/create`
- 修改 `src/components/timesheet/AppLayout.tsx`：侧边导航新增「新增工时」导航项
- 修改 `src/pages/TimeEntryListPage.tsx`：新增查询表单 + 「新增工时」跳转按钮
- 修改 `src/api/mockApi.ts`：新增 `queryEntries` 查询过滤函数
- 修改 `src/context/TimeEntryContext.tsx`：如需向列表页暴露查询方法
- 修改 `src/pages/TimeEntryDetailPage.tsx`：详情展示改为只读文本，移除对 `TimeEntryForm.module.css` 输入框样式的复用
- 新增 `src/pages/TimeEntryDetailPage.module.css`：详情页只读展示样式
- 相关 `*.module.css` 新增查询表单与按钮样式
- 依赖：无新增，仅使用现有 `react-router-dom`、React Context、CSS Modules、mockApi
- 无数据层结构变更（仍为内存 mock）
