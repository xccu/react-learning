## Why

工时填报应用已完成路由、数据请求、增删改查、导入导出与审批流程。当前系统缺少用户管理功能，且登录页无任何用户认证——任意用户名+密码即可登录，无法维护用户列表与角色信息，第6周的权限管理也缺少用户数据基础。第5周通过用户管理模块，巩固第4周学到的 Redux 状态管理和 Ant Design 组件使用，同时将登录页改造为基于用户数据的真实认证。

## What Changes

- **新增用户状态模块（userSlice）**：在既有 Redux Store 中注册第二个业务模块，管理用户列表与当前登录用户信息
- **新增用户数据请求模块**：封装用户的列表、新增、编辑、删除、登录数据接口（基于现有模式扩展 mockApi）
- **新增用户管理页面**：用户列表页（含查询表单 + Table 表格 + 分页），表格操作列包含详情、编辑、删除按钮，顶部有"新增用户"按钮
- **新增用户详情页面**：只读展示用户信息，包含编辑和返回列表按钮
- **新增用户新增页面**：独立表单页面，提交后返回列表
- **新增用户编辑页面**：加载用户数据预填表单，提交后返回列表
- **重构登录页认证**：登录时调用用户登录接口，验证用户名+密码；验证成功后保存用户信息到 Redux store，失败则提示错误
- **侧边栏新增用户管理导航项**：在 AppLayout 菜单中添加"用户管理"入口
- **默认用户数据**：内置 3 条用户（admin/admin123 管理员、user1/user123 普通用户、user2/user123 普通用户）

## Capabilities

### New Capabilities

- `user-management`: 用户管理 CRUD，包括用户列表页（查询表单 + Table + 分页）、用户详情（只读展示）、用户新增（独立表单页面）、用户编辑（预填数据独立表单页面）、删除（确认弹窗）
- `user-authentication`: 用户认证，包括登录页调用用户登录接口验证用户名+密码、验证成功保存用户信息到 Redux、验证失败提示错误、退出登录清除用户信息

### Modified Capabilities

- `app-routing`: 新增用户管理页面路由 `/users`、用户详情路由 `/users/:id`、用户新增路由 `/users/create`、用户编辑路由 `/users/:id/edit`
- `time-tracking-app`: 侧边栏导航新增用户管理入口

## Impact

- **新增文件**：`src/store/userSlice.ts`、`src/pages/UserListPage.tsx`、`src/pages/UserDetailPage.tsx`、`src/pages/UserCreatePage.tsx`、`src/pages/UserEditPage.tsx`、`src/components/timesheet/UserQueryForm.tsx`、`openspec/specs/user-management/spec.md`、`openspec/specs/user-authentication/spec.md`
- **修改文件**：`src/store/index.ts`（注册 user reducer）、`src/types/timeEntry.ts`（新增 User 类型含 password 和 roles）、`src/api/mockApi.ts`（新增用户 mock 数据与接口含登录）、`src/api/timeEntryApi.ts`（新增用户 API）、`src/api/mockAdapter.ts`（注册用户端点含登录）、`src/pages/LoginPage.tsx`（重构为调用用户认证接口）、`src/components/timesheet/AppLayout.tsx`（新增导航项 + 退出时清除用户信息）、`src/App.tsx`（新增路由）
- **修改类型**：`User` 类型包含 password 字段（仅用于 mock 认证，不展示给前端用户）和 roles 字段（UserRole[]，为第6周多角色权限管理预留）