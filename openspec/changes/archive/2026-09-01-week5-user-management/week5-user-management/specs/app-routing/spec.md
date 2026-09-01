## ADDED Requirements

### Requirement: 用户管理页面路由
应用 SHALL 通过路由将用户管理相关路径映射到对应的页面组件。

#### Scenario: 用户列表页面可访问
- **WHEN** 用户访问 `/users` 路径
- **THEN** 应用渲染用户列表页面

#### Scenario: 用户列表页面受保护
- **WHEN** 未登录用户访问 `/users` 路径
- **THEN** 系统重定向到登录页，登录后返回 `/users`

#### Scenario: 用户详情页面可访问
- **WHEN** 用户访问 `/users/:id` 路径
- **THEN** 应用渲染用户详情页面

#### Scenario: 用户新增页面可访问
- **WHEN** 用户访问 `/users/create` 路径
- **THEN** 应用渲染用户新增页面

#### Scenario: 用户编辑页面可访问
- **WHEN** 用户访问 `/users/:id/edit` 路径
- **THEN** 应用渲染用户编辑页面