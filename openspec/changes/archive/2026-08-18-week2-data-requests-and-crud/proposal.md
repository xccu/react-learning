## Why

按《React 生态与工程化 — 学习计划》第 2 周「数据请求与增删改查」规划，为「工时填报」应用引入统一数据请求层与表单库：用 Axios 统一 HTTP 客户端（实例、拦截器、统一错误处理、登录失效处理）+ `axios-mock-adapter` 模拟后端 CRUD 接口，替代当前 Context 直接调用内存 `mockApi.ts` 的方式；用 React Hook Form 替代手写 `useState` + 手工校验的表单。本次产出为第 2 周的 ④ 增删改查（列表查询、新增、编辑、删除、详情数据加载），补齐列表「加载中 / 失败 / 空」三态与删除二次确认，为第 4 周 Redux 异步数据流与真实后端接入铺路。

## What Changes

- 引入 **Axios + axios-mock-adapter**：创建统一请求实例（`baseURL: '/api'`、超时），请求拦截器统一附加登录凭证，响应拦截器统一错误处理、`401` 时清除登录态并跳转登录页；mock 适配器模拟后端 CRUD 接口（列表、查询、详情、新增、编辑、删除）
- 新增**数据请求模块**（`src/api/timeEntryApi.ts`）：将列表查询、详情、新增、编辑、删除整理为独立 API 函数，页面统一通过该模块调用
- **重构 `TimeEntryContext.tsx`**：从直接调用 `mockApi.ts` 改为消费数据请求模块，保留 Context 作为全局共享层（第 4 周再迁移至 Redux）
- **重构 `TimeEntryForm.tsx`**：改为 React Hook Form 管理字段注册与校验（必填、工时大于 0 且为 0.5 的倍数、提交前统一校验），新增/编辑复用同一表单，编辑预填数据，提交中禁用按钮（`isSubmitting`）防止重复提交
- **重构 `LoginPage.tsx` 登录表单**：同样迁移至 React Hook Form（用户名/密码必填校验、提交中禁用按钮），统一全项目表单实现方式
- **重构 `TimeEntryQueryForm.tsx` 查询表单**：迁移至 React Hook Form（查询 / 清空条件），去除手写 `useState` 受控字段
- **列表页**：页面挂载时经请求模块加载数据；补齐「加载中 / 加载失败 / 空数据」三态与失败重试；查询条件经请求模块过滤
- **删除**：删除前二次确认，成功后即时更新列表
- **详情页 / 编辑页**：按路由标识经请求模块加载单条记录，处理加载中与记录不存在状态
- **真实 WebAPI 实施阶段说明**：接入点定在第 4 周，伴随 Redux 异步数据流一并引入真实后端——用 `createAsyncThunk` 经请求层衔接真实 HTTP 请求，练习「进行中 / 成功 / 失败」在全局状态下的真实流转（真实延迟、CORS、状态码），同时配置 Vite dev 代理（`/api` → 真实服务器）。第 2 周仍用 `axios-mock-adapter` 模拟；由于业务代码只依赖请求模块签名，第 4 周移除 mock 注册并指向真实服务器即可，页面代码零改动。第 6 周工程化收尾则用于环境变量（`VITE_API_BASE_URL`）与生产构建验证

## Capabilities

### New Capabilities
- `data-request-layer`: 统一 HTTP 请求层——Axios 实例、请求/响应拦截器（凭证附加、统一错误处理、401 登录失效跳转）、mock 适配器模拟的 CRUD 数据接口

### Modified Capabilities
- `time-tracking-app`: 增删改查经统一请求层执行（替代直接调用 mockApi）；列表新增「加载中 / 失败 / 空」三态；删除前二次确认；新增/编辑提交中禁用按钮
- `time-entry-search`: 查询过滤逻辑经统一请求层执行（替代 spec 中「经 mockApi 实现」的表述）；查询表单改用 React Hook Form 管理查询条件
- `time-entry-create-page`: 新增表单改用 React Hook Form 校验（必填、工时规则），提交中禁用按钮防止重复提交
- `timesheet-edit-page`: 编辑表单改用 React Hook Form 预填与校验，提交中禁用按钮防止重复提交
- `timesheet-detail-page`: 详情数据经请求层按路由标识加载，而非从全局 entries 读取
- `login-auth`: 登录表单改用 React Hook Form 校验（用户名/密码必填），提交中禁用按钮防止重复提交

## Impact

- 新增依赖：`axios`、`axios-mock-adapter`、`react-hook-form`
- 新增文件：`src/api/httpClient.ts`（Axios 实例 + 拦截器）、`src/api/timeEntryApi.ts`（CRUD 请求模块）、mock 适配器配置（`src/api/mockAdapter.ts`）
- 修改文件：`TimeEntryContext.tsx`（改消费请求模块）、`TimeEntryForm.tsx`（改 React Hook Form）、`LoginPage.tsx`（登录表单改 React Hook Form）、`TimeEntryQueryForm.tsx`（查询表单改 React Hook Form）、`TimeEntryListPage.tsx`（三态 + 删除确认）、`TimeEntryDetailPage.tsx` / `TimeEntryEditPage.tsx`（按 id 经请求层加载）
- 保留：`mockApi.ts` 可保留作为 mock 适配器的数据源，不再被业务层直接引用；`TimeEntry` / `ApprovalStatus` 类型与路由结构不变
- 兼容性：旧页面 `TimeSheetPage.tsx` 及 `TimeEntryForm` / `TimeEntryList` 组件接口保持不变，避免破坏既有页面
