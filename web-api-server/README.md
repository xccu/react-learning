# 工时填报 Web API 服务

## 项目简介

React 工时填报应用的后端 API 服务，提供工时记录(TimeEntry)、用户(User)、角色(Role)的 RESTful 接口。

## 技术栈

- Python 3.12
- FastAPI
- Pydantic v2
- Uvicorn

## 快速开始

```bash
cd web-api-server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

访问 Swagger UI: http://localhost:8000/docs

## API 端点

### TimeEntry (工时记录)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/time-entries | 列表/查询（支持 projectName, description, approvalStatus 过滤） |
| GET | /api/time-entries/{id} | 详情 |
| POST | /api/time-entries | 新增 |
| POST | /api/time-entries/batch | 批量新增 |
| PUT | /api/time-entries/{id} | 编辑 |
| DELETE | /api/time-entries/{id} | 删除 |
| PUT | /api/time-entries/{id}/submit | 提交审批 |
| PUT | /api/time-entries/{id}/approve | 审批通过 |
| PUT | /api/time-entries/{id}/reject | 驳回 |

### User (用户)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/users | 列表/查询（支持 username, role 过滤） |
| GET | /api/users/{id} | 详情 |
| POST | /api/users | 新增 |
| PUT | /api/users/{id} | 编辑 |
| DELETE | /api/users/{id} | 删除 |
| POST | /api/users/login | 登录 |

### Role (角色)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/roles | 列表 |
| GET | /api/roles/{id} | 详情 |
| POST | /api/roles | 创建 |
| PUT | /api/roles/{id} | 更新 |
| DELETE | /api/roles/{id} | 删除（禁止删除 Administrator） |

## 数据模型

### TimeEntry

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 记录 ID |
| projectName | string | 项目名称 |
| description | string | 工作描述 |
| hours | number | 工时 (>0) |
| approvalStatus | string | 审批状态：待审批/已通过/已驳回 |
| rejectReason | string \| undefined | 驳回原因 |
| createdAt | string | 创建时间 (ISO 8601) |

### User

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 用户 ID |
| username | string | 用户名 |
| password | string | 密码 |
| createdAt | string | 创建时间 (ISO 8601) |

> **注意**: `GET /api/users` 和 `GET /api/users/{id}` 返回不包含 `roles` 字段。

### User (Login Response)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 用户 ID |
| username | string | 用户名 |
| password | string | 密码 |
| roles | string[] | 角色列表 |
| permissions | string[] | 权限标识列表（从角色合并） |
| createdAt | string | 创建时间 (ISO 8601) |

> **注意**: `POST /api/users/login` 返回包含 `roles` 和 `permissions` 字段。

### Role

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 角色 ID |
| name | string | 角色名称 |
| permissions | string[] | 权限标识列表 |

## 响应格式

**成功响应** — 直接返回业务数据
```json
{ "id": "1", "projectName": "React 学习", ... }
```

**错误响应**
```json
{ "message": "错误信息" }
```

**状态码**

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 401 | 认证失败 |
| 403 | 禁止操作 |
| 404 | 资源不存在 |

## 项目结构

```
web-api-server/
├── main.py              # FastAPI 应用入口
├── models.py            # Pydantic 数据模型
├── routes_time_entry.py # TimeEntry 路由
├── routes_user.py       # User 路由
├── routes_role.py       # Role 路由
├── data_loader.py       # JSON 数据加载
├── data/                # 初始数据文件
│   ├── time_entries.json
│   ├── users.json
│   └── roles.json
├── requirements.txt
└── web-api-server.http  # REST Client 请求示例
```

## 初始数据

内置 3 个用户、3 个角色、3 条工时记录，详见 `data/` 目录。