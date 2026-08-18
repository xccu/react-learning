## Context

见 proposal.md（Why / What）。当前实现：`src/api/mockApi.ts` 为内存数据源，`TimeEntryContext.tsx` 直接调用它并持有 `entries` 全局状态；`TimeEntryForm.tsx` 为手写 `useState` + 手工 `validate()` 表单；列表页无「加载中 / 失败 / 空」三态、无删除确认；详情页与编辑页从 Context 的 `entries` 中 `find` 记录。第 1 周引入的旧页面 `TimeSheetPage.tsx` 与路由化列表页共用 `TimeEntryForm`（`onSubmit` / `initialData` / `onCancel` 三个 props）与 `TimeEntryList`，重构必须保持这些组件接口不变。当前依赖仅 react / react-dom / react-router-dom，TypeScript 严格模式（`tsc --noEmit` 校验）。

## Goals / Non-Goals

**Goals:**
- 建立统一请求层：Axios 实例 + 请求/响应拦截器（附加登录凭证、统一错误处理、401 清除登录态并跳转登录页），配合 `axios-mock-adapter` 模拟后端 CRUD 接口
- 新增数据请求模块，页面统一通过它获取列表 / 详情 / 新增 / 编辑 / 删除结果
- 用 React Hook Form 重构 `TimeEntryForm`：字段注册、校验规则、提交中禁用、编辑预填，接口保持与旧页面兼容
- 列表页补齐「加载中 / 失败 / 空」三态与重试；删除前二次确认；详情页 / 编辑页按路由标识经请求层加载
- 明确真实 WebAPI 的接入时机，保证当前设计可平滑切换

**Non-Goals:**
- 不引入真实后端（mock 适配器模拟，真实接入留待第 4 周与 Redux 异步数据流一并引入）；不引入 Redux（第 4 周）；不引入 Ant Design / xlsx 等后续周次技术
- 不改变 `TimeSheetPage` 的结构与既有增删改查交互（仅按系统级需求补删除确认）
- 不改变 `TimeEntry` / `ApprovalStatus` 类型与路由结构

## Decisions

1. **Axios + axios-mock-adapter（替代直接调用内存 mockApi）** — 数据层采用统一请求实例 + 拦截器 + mock 适配器模拟 HTTP 端点。理由：完整学习 Axios 的实例、拦截器、响应形状与异步错误流；未来接真实后端只需移除 mock 注册、调整 `baseURL`，页面代码不变。备选：保留内存 mockApi 仅重排为请求模块（不引入新依赖，但无法学习真实请求语义）；MSW（更贴近网络层，但心智模型与配置成本更高，且偏离学习计划对 axios-mock-adapter 的指向）。已按学习计划采用 Axios + mock 适配器。

2. **数据请求模块接口形状** — `src/api/timeEntryApi.ts` 导出与现有 mockApi 一致的函数签名（`getEntries` / `queryEntries` / `getEntryById` / `addEntry` / `updateEntry` / `deleteEntry`），内部经 Axios 实例发起 `/api/...` 请求。理由：`TimeEntryContext` 只需替换 import 来源与错误传播，页面层几乎无感知；签名一致也为将来切换真实后端提供稳定契约。

3. **Context 保留为全局共享层** — `TimeEntryContext` 继续负责 `entries` 全局状态与「新增 / 更新 / 删除 / 查询」操作，但其内部调用改为请求模块，并在操作时管理加载状态。理由：学习计划第 4 周才引入 Redux，届时再迁移；当前保留 Context 最小化改动面。列表加载三态由 Context 提供 `loading` / `error`，页面展示。

4. **React Hook Form 重构全部表单** — 项目中所有 `<form>`（`TimeEntryForm`、`LoginPage`、`TimeEntryQueryForm`）统一迁移至 React Hook Form：用 `useForm<T>` + `register` 管理字段，校验规则用对象形式（必填、工时 `> 0` 且为 0.5 的倍数、自定义 `validate`），`handleSubmit` 提交、`reset` 实现编辑预填、`formState.isSubmitting` 禁用按钮。`ApprovalStatusSelector` 等受控组件用 `Controller` 桥接。理由：与学习计划一致；非受控方式减少重渲染；统一全项目表单实现方式；登录表单（用户名/密码必填 + 提交禁用）与查询表单（查询 / 清空）收益同构，避免项目内同时存在两套表单范式。

5. **列表页三态与删除确认** — 列表页从 Context 取 `loading` / `error`，分别渲染「加载中 / 失败 + 重试 / 空数据」；`window.confirm` 或轻量确认提示实现删除二次确认。理由：满足 spec「列表数据加载三态」「删除前二次确认」，实现成本低，不引入额外 UI 库。

6. **详情页 / 编辑页按标识加载** — 页面挂载时经请求模块 `getEntryById(id)` 获取记录，替代从 Context `entries` 中 `find`。理由：符合学习计划「详情页数据加载」目标与 spec「经统一请求层加载」；同时为第 4 周 Redux 异步数据流（`createAsyncThunk` 按 id 拉取）做铺垫。

## Risks / Trade-offs

- **mock 适配器掩盖真实网络差异**（无真实延迟 / CORS / 状态码） → 真实接入定在第 4 周（随 Redux 异步数据流引入真实后端，练习真实异步时序与错误流）；当前以拦截器与响应形状对齐为验收重点，Network 面板看不到请求属预期，不视为缺陷
- **`TimeEntryForm` 重构可能影响旧页面 `TimeSheetPage`** → 保持组件 props 接口不变，编辑预填用 `reset` 兼容异步数据；以构建与类型检查 + 旧页面手动回归作为验收
- **登录 / 查询表单迁移可能影响既有交互**（`noValidate`、按钮文案、清空逻辑） → 保持对外行为（校验文案、查询/清空结果）不变，仅替换内部实现；以构建与类型检查 + 手动回归作为验收
- **Context 与请求模块两层抽象在中期冗余** → 第 4 周迁移 Redux 时移除 Context；当前为最小改动保留，属学习路径上的临时结构
- **React Hook Form 与 `ApprovalStatusSelector`（受控 select）集成** → 使用 `Controller` 桥接，避免 `register` 与手动 `value`/`onChange` 冲突

## Migration Plan

- 新增依赖（`axios`、`axios-mock-adapter`、`react-hook-form`）后增量实施：先建请求层与 mock 适配器 → 再改 Context 消费请求模块 → 再重构表单 → 最后改页面三态与详情/编辑加载
- 每步保持 `npm run typecheck` 通过；旧页面 `TimeSheetPage` 在表单重构后回归验证
- 回滚策略：各改动集中在独立文件（新增文件可整体删除；Context/表单改动可通过恢复对应文件回滚），无数据迁移

## Open Questions

- 删除确认使用 `window.confirm` 还是自绘轻量弹层：二者均满足 spec，实现阶段按 UI 简洁度决定，不影响规格与任务划分
