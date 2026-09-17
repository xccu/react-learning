## Why

react-app 目前使用 mock API（前端模拟数据）进行开发和演示，无法对接真实后端。根据 `web-api-design.md`（本 change 目录内）定义的所有接口规范，需要开发一个独立的 Python Web API 服务来替换 mock API，提供完整的 RESTful 接口，支持工时记录(TimeEntry)、用户(User)、角色(Role)的 CRUD 操作，并以 Swagger UI 风格展示 API 文档。

## What Changes

- 在 react-app 同级目录创建独立的 Python Web API 项目 (`web-api-server`)
- 使用 Python 3.12 + FastAPI 实现所有 API 端点
- 以 Swagger UI 风格展示所有接口文档（FastAPI 内置）
- 数据使用 JSON 文件硬编码（`data/` 目录），不包含数据库集成
- 不需要认证授权中间件
- 实现以下所有端点：
  - TimeEntry: 9 个端点（CRUD + 批量新增 + 提交/审批/驳回）
  - User: 6 个端点（CRUD + 登录）
  - Role: 5 个端点（CRUD）
- 响应格式严格遵循 `web-api-design.md`（本 change 目录内）规范

## Capabilities

### New Capabilities
- `web-api-server`: Python FastAPI Web API 服务，实现工时填报应用的所有后端接口

### Modified Capabilities
<!-- 无 -->

## Impact

- 新增: `web-api-server/` 目录（与 react-app 平级）
- 新增依赖: Python 3.12, FastAPI, uvicorn
- 不影响 react-app 现有代码
- react-app 的 httpClient 无需修改即可对接真实后端（Base URL 改为 `http://localhost:8000/api`）