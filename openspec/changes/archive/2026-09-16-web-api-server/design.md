## Context

react-app 目前使用前端 mock API 模拟数据，缺乏真实后端服务。`web-api-design.md`（本 change 目录内）文档已定义了完整的 API 接口规范，包括 TimeEntry（工时记录）、User（用户）、Role（角色）三大模块共 20 个端点。需要开发一个独立的 Python Web API 服务来替换这些 mock 接口。

## Goals / Non-Goals

**Goals:**
- 实现 `web-api-design.md`（本 change 目录内）中定义的所有 API 端点
- 使用 FastAPI 框架，自动生成交互式 Swagger UI 文档
- 数据使用 JSON 文件硬编码（`data/time_entries.json`, `data/users.json`, `data/roles.json`），启动时加载
- 响应格式、状态码、错误处理严格遵循 API 设计文档
- 项目独立于 react-app，可单独启动运行

**Non-Goals:**
- 不包含数据库集成（后续可扩展）
- 不包含认证授权中间件（文档说明登录后才携带 token，但服务端不做验证）
- 不包含 JSON 文件写入（新增/修改操作仅在内存中进行，不回写 JSON 文件）
- 不包含单元测试（后续补充）

## Decisions

### 1. 使用 FastAPI 而非 Flask
- **选择**: FastAPI
- **理由**: 内置 Swagger UI（`/docs`）和 ReDoc（`/redoc`），自动生成交互式 API 文档；支持 Pydantic 数据验证；类型提示自动序列化；性能优于 Flask
- **替代方案**: Flask + Flask-RESTful（需手动编写文档，无内置 Swagger）

### 2. 使用 Pydantic v2 定义数据模型
- **选择**: Pydantic v2（FastAPI 内置）
- **理由**: 自动请求体验证、响应序列化、OpenAPI schema 生成；支持 `Partial` 更新（通过 `Field(default=None)`）
- **替代方案**: 手动解析 JSON + 字典验证

### 3. JSON 文件数据存储
- **选择**: 使用 JSON 文件存储初始数据（`data/time_entries.json`, `data/users.json`, `data/roles.json`）
- **理由**: 数据持久化，重启不丢失；便于查看和手动修改初始数据；无需数据库依赖
- **实现**: 应用启动时加载 JSON 文件到内存，后续操作在内存中进行
- **替代方案**: 内存数据（重启丢失，不便维护）

### 4. ID 生成策略
- **选择**: 使用时间戳 `str(int(time.time() * 1000))`
- **理由**: 与 mock API 保持一致，简单且保证唯一性
- **替代方案**: UUID

### 5. 项目结构
```
web-api-server/
├── main.py              # FastAPI 应用入口，路由注册
├── models.py            # Pydantic 数据模型
├── data_loader.py       # JSON 文件加载逻辑
├── data/                # 硬编码数据文件
│   ├── time_entries.json
│   ├── users.json
│   └── roles.json
├── requirements.txt     # Python 依赖
└── README.md            # 项目说明
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| 新增/修改操作不持久化到 JSON 文件 | 明确说明这是临时方案，后续可接入数据库时替换 |
| 并发安全问题 | 当前为单线程开发/演示用途，不涉及高并发 |
| 密码明文存储 | 与 mock API 保持一致，后续接入数据库时增加密码哈希 |
| 缺少输入验证 | 通过 Pydantic 模型自动验证，覆盖必填字段、类型检查 |