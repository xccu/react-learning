## Why

React 工时填报应用目前使用 `mockApi.ts` 和 `axios-mock-adapter` 提供模拟数据，所有 API 调用都在浏览器内存中运行，数据刷新后丢失。Web API Server（FastAPI）已实现完整的 RESTful API，支持 JSON 文件持久化。需要将前端所有 Mock API 替换为真实的 Web API 调用，实现数据的持久化和多用户协作。

## What Changes

- 移除 `mockApi.ts` 和 `mockAdapter.ts` 文件及所有 Mock 数据
- 启用 `timeEntryApi.ts` 中的真实 HTTP 客户端调用（已有封装函数，只需切换）
- 更新 `mockAdapter.ts` 中的路由注册逻辑，移除所有 mock 路由
- 确保所有页面组件从 `timeEntryApi.ts` 获取数据而非 `mockApi.ts`
- 处理 API 错误状态码（401 未登录、404 不存在、403 无权限等）的用户提示
- 保持 TypeScript 类型定义不变（`Role`、`User`、`TimeEntry` 等接口）

## Capabilities

### New Capabilities
- `real-api-integration`: 前端与 FastAPI Web API 的完整集成，包括时间条目、用户、角色的 CRUD 操作

### Modified Capabilities
- 无（不修改现有 spec 级别的行为要求，仅替换实现方式）

## Impact

**影响代码：**
- `src/api/mockApi.ts` — 删除
- `src/api/mockAdapter.ts` — 删除或清空
- `src/api/timeEntryApi.ts` — 确认 httpClient 配置正确（baseURL）
- `src/api/httpClient.ts` — 确认 baseURL 和拦截器配置
- `src/store/userSlice.ts` — thunks 调用 timeEntryApi 函数（无需修改，已解耦）
- 所有页面组件（`LoginPage.tsx`、`PermissionListPage.tsx`、`PermissionAssignPage.tsx`、`TimeEntryListPage.tsx` 等）— 确认导入路径

**不影响：**
- TypeScript 类型定义（`src/types/timeEntry.ts`）
- Redux store 结构
- 页面组件 UI 逻辑
- 权限控制组件（`RequirePermission`、`usePermission`）
- 路由配置（`App.tsx`）