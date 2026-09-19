## Context

React 工时填报应用当前使用 `axios-mock-adapter` 拦截所有 `/api/*` 请求并在浏览器内存中返回模拟数据。`mockApi.ts` 包含所有业务数据（TimeEntry、User、Role）和操作函数，`mockAdapter.ts` 将 axios 请求路由到这些函数。

后端 FastAPI 服务（`web-api-server/`）已完整实现所有 RESTful API，支持 JSON 文件持久化。前端 `timeEntryApi.ts` 已有所有 API 调用的封装函数，使用 `httpClient`（axios 实例，`baseURL: '/api'`）发起请求。

当前状态：`userSlice.ts` 仍从 `mockApi.ts` 导入 `hasPermission` 和 `getUserPermissions` 权限检查函数，这是唯一还在引用 mockApi 的地方。其他页面组件已通过 `timeEntryApi.ts` 调用 API（但被 mockAdapter 拦截）。

## Goals / Non-Goals

**Goals:**
- 删除 `mockApi.ts` 和 `mockAdapter.ts`，移除所有 Mock 数据
- 移除 `axios-mock-adapter` 依赖
- 将 `mockApi.ts` 中的 `hasPermission` 和 `getUserPermissions` 函数迁移到独立工具文件
- 配置 Vite 开发服务器代理，将 `/api` 请求转发到 `http://localhost:8000`
- 确保所有页面组件通过真实 API 获取和提交数据

**Non-Goals:**
- 不修改后端 API 代码（FastAPI 端保持不变）
- 不修改 Redux store 结构或 thunks 逻辑
- 不修改页面组件 UI 逻辑
- 不修改 TypeScript 类型定义
- 不引入新的依赖库

## Decisions

### Decision 1: 迁移 hasPermission/getUserPermissions 到独立工具文件
**选择：** 在 `src/utils/auth.ts` 中新增 `hasPermissionFromRoles` 和 `getUserPermissionsFromRoles` 函数，替代从 `mockApi.ts` 导入的版本。

**理由：**
- `auth.ts` 已有权限相关的 localStorage 操作函数（`savePermissions`、`getPermissions`、`hasPermission`）
- 这些函数只依赖角色数据，不依赖 HTTP 客户端，适合放在工具层
- 避免创建新的 API 目录文件

**替代方案：** 在 `src/api/mockApi.ts` 中保留这两个函数直到最后删除。但这样会延长 mockApi 文件的存活时间，增加混淆风险。

### Decision 2: Vite 代理配置
**选择：** 在 `vite.config.ts` 中添加 `server.proxy` 配置，将 `/api` 代理到 `http://localhost:8000`。

**理由：**
- 开发环境下 React 运行在 `localhost:5173`，FastAPI 运行在 `localhost:8000`，存在跨域问题
- Vite 内置代理功能无需额外配置，开发体验最好
- 生产环境部署时 API 由同一服务器提供，无需代理

**配置示例：**
```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### Decision 3: 分步骤移除 mock 代码
**选择：** 
1. 先迁移 `hasPermission`/`getUserPermissions` 到 `auth.ts`
2. 更新 `userSlice.ts` 导入路径
3. 删除 `mockApi.ts` 和 `mockAdapter.ts`
4. 更新 `package.json` 移除 `axios-mock-adapter`
5. 配置 Vite 代理

**理由：** 逐步变更便于回滚，每步都可独立验证。

## Risks / Trade-offs

### Risk: 后端服务未启动
**影响：** 前端请求全部失败，应用无法使用
**缓解：** 开发文档中明确说明需要先启动 `web-api-server`；可在 `httpClient` 中添加离线提示

### Risk: CORS 问题
**影响：** 浏览器拦截跨域请求
**缓解：** Vite 代理配置 `changeOrigin: true` 可解决开发环境 CORS；生产环境由同一服务器提供

### Risk: 数据格式差异
**影响：** Mock 数据和真实 API 返回的数据格式可能不完全一致
**缓解：** 已验证 `timeEntryApi.ts` 的函数签名与 `mockApi.ts` 一致，TypeScript 类型定义也已对齐

### Risk: 批量创建持久化遗漏
**影响：** `POST /api/time-entries/batch` 可能不会持久化到 JSON 文件
**缓解：** 已在之前修复（`routes_time_entry.py` 第 76 行添加 `save_time_entries`）

## Migration Plan

1. **准备阶段：** 在 `src/utils/auth.ts` 中新增 `hasPermissionFromRoles` 和 `getUserPermissionsFromRoles` 函数
2. **更新引用：** 修改 `src/store/userSlice.ts` 的导入路径，从 `auth.ts` 导入而非 `mockApi.ts`
3. **删除 Mock 文件：** 删除 `src/api/mockApi.ts` 和 `src/api/mockAdapter.ts`
4. **清理依赖：** 从 `react-app/package.json` 中移除 `axios-mock-adapter`，运行 `npm install`
5. **配置代理：** 在 `vite.config.ts` 中添加开发服务器代理配置
6. **验证：** 启动 FastAPI 和 Vite dev server，测试所有 CRUD 操作

## Open Questions

无。所有技术决策已明确。