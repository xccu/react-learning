## 1. 请求层与 mock 适配器

- [x] 1.1 安装依赖：`npm i axios react-hook-form`，`npm i -D axios-mock-adapter`
- [x] 1.2 新建 `src/api/httpClient.ts`：用 `axios.create({ baseURL: '/api', timeout })` 创建请求实例
- [x] 1.3 在 `httpClient.ts` 中注册请求拦截器：从 localStorage 读取登录凭证并附加到请求头（未登录不附加）
- [x] 1.4 在 `httpClient.ts` 中注册响应拦截器：业务错误抛带可展示信息的异常；`401` 时清除登录态并跳转登录页
- [x] 1.5 新建 `src/api/mockAdapter.ts`：用 `axios-mock-adapter` 模拟后端 CRUD 端点（列表、查询、详情、新增、编辑、删除），复用 `mockApi.ts` 作为内存数据源
- [x] 1.6 在 `src/api/mockAdapter.ts` 中注册 mock 到请求实例，使 `/api/*` 请求落入 mock 处理

## 2. 数据请求模块

- [x] 2.1 新建 `src/api/timeEntryApi.ts`：导出 `getEntries` / `queryEntries` / `getEntryById` / `addEntry` / `updateEntry` / `deleteEntry`，签名与现有 `mockApi.ts` 一致，内部经请求实例发起请求
- [x] 2.2 在 `timeEntryApi.ts` 中复用 `TimeEntryQuery` 查询类型并保证返回 `Promise<TimeEntry[]>` 等类型形状不变
- [x] 2.3 确保 `TimeEntryContext` 与新请求模块的 import 替换后 `npm run typecheck` 通过

## 3. Context 接入请求层

- [x] 3.1 修改 `TimeEntryContext.tsx`：将 `getEntries` 等 mockApi 调用替换为 `timeEntryApi` 请求模块调用
- [x] 3.2 在 Context 中补充列表加载失败错误状态（`error`），供列表页渲染「加载失败 + 重试」
- [x] 3.3 提供 `retry` 能力：加载失败后重新执行初始加载
- [x] 3.4 验证新增 / 更新 / 删除后全局 `entries` 与操作结果保持一致

## 4. 表单重构为 React Hook Form

- [x] 4.1 重构 `TimeEntryForm.tsx`：用 `useForm<T>` + `register` 注册 projectName / description / hours 字段
- [x] 4.2 配置校验规则：必填、工时大于 0、工时为 0.5 的倍数（自定义 `validate`），逐字段错误提示
- [x] 4.3 用 `Controller` 桥接 `ApprovalStatusSelector` 受控组件
- [x] 4.4 编辑模式：用 `reset(initialData)` 实现异步预填；新增模式提交成功后 `reset()` 清空
- [x] 4.5 提交中禁用按钮：`formState.isSubmitting` 控制 disabled 与按钮文案
- [x] 4.6 保持 `onSubmit` / `initialData` / `onCancel` props 接口不变，`npm run typecheck` 通过
- [x] 4.7 回归验证旧页面 `TimeSheetPage` 的新增 / 内联编辑功能不受影响（构建 + 类型检查 + 请求层冒烟测试通过，浏览器点检见 7.4）
- [x] 4.8 重构 `LoginPage.tsx` 登录表单：用 `useForm` + `register` 注册 username / password，必填校验，提交中禁用登录按钮，保持跳转逻辑不变
- [x] 4.9 重构 `TimeEntryQueryForm.tsx` 查询表单：用 `useForm` + `register` 注册查询字段，查询 / 清空行为保持不变

## 5. 列表页三态与删除确认

- [x] 5.1 修改 `TimeEntryListPage.tsx`：按 Context 的 `loading` / `error` 渲染「加载中」与「加载失败 + 重试入口」
- [x] 5.2 列表数据为空时展示「暂无工时记录」空状态提示
- [x] 5.3 删除操作前二次确认（确认 / 取消），取消时不删除、确认后调用 `deleteEntry`
- [x] 5.4 查询条件经 `timeEntryApi` 请求模块执行，空条件时恢复显示全部

## 6. 详情页与编辑页按标识加载

- [x] 6.1 修改 `TimeEntryDetailPage.tsx`：按 `useParams` 的 id 经 `getEntryById` 加载记录
- [x] 6.2 详情页处理「加载中」与「记录不存在」两种状态
- [x] 6.3 修改 `TimeEntryEditPage.tsx`：按 id 经 `getEntryById` 加载记录并预填表单
- [x] 6.4 编辑页处理「加载中」与「记录不存在」两种状态，取消 / 保存后返回列表

## 7. 验证与收尾

- [x] 7.1 `npm run typecheck` 通过
- [x] 7.2 `npm run lint` 通过
- [x] 7.3 `npm run build` 通过
- [x] 7.4 手动回归：登录（含提交禁用）→ 列表加载 → 查询/清空 → 新增 → 编辑 → 详情 → 删除确认全链路可用，旧页面 `TimeSheetPage` 功能正常
