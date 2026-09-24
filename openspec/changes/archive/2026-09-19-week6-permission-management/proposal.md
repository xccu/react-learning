## Why

当前应用只有简单的登录状态校验（isLoggedIn），没有基于角色的权限管理（RBAC）。第六周需要引入完整的权限管理体系，包括用户-角色-权限实体模型、权限管理页面、基于权限的导航/按钮/页面/API访问控制。

## What Changes

- **新增实体模型**: 定义 User、Role、Permission 类型，建立 User:Role=1:n、Role:Permission=1:n 关系
- **新增权限定义**: 定义 TimeSheet.Read/Write/Export/Import/approval、User.Read/Write、Role.Read/Write 等权限标识
- **新增默认角色**: Administrator、ProjectManager、User 三种角色，每种角色预分配对应权限
- **新增默认用户**: 三种角色各一个默认用户，用户名与角色名一致，密码统一为 Pass@word0
- **新增权限管理页面**: 表格展示角色列表，支持删除角色（Administrator不可删除），支持新增角色
- **新增权限分配功能**: 使用 Ant Design Transfer 组件，左侧显示未分配权限，右侧显示已分配权限
- **更新登录页面**: 快捷登录改为 Administrator/ProjectManager/User，密码统一为 Pass@word0
- **更新左侧导航栏**: 添加权限管理菜单链接
- **实现权限控制**: 页面路由、导航菜单、按钮/组件、API请求四级权限控制，无权限返回403或隐藏
- **Token存储用户权限**: 登录后将用户角色和权限存入token，页面访问时从token获取权限进行控制

## Capabilities

### New Capabilities
- `permission-model`: 定义User、Role、Permission实体类型及关系，默认角色和权限定义，默认用户数据
- `permission-management-ui`: 权限管理页面（角色列表表格+搜索+新增角色），权限分配页面（Ant Design Transfer组件）
- `role-based-access-control`: 基于RBAC的权限控制，包括路由守卫扩展、导航菜单动态渲染、按钮/组件权限控制、API请求权限拦截
- `permission-auth-flow`: 更新登录流程，token存储用户权限信息，登录后权限驱动的路由跳转和403处理

### Modified Capabilities
- `login-auth`: 登录快捷入口从admin/user1/user2改为Administrator/ProjectManager/User，密码统一为Pass@word0，登录成功后token包含权限信息
- `user-management`: 用户管理页面增加角色字段显示，用户类型从单一角色变为多角色
- `app-routing`: 路由增加权限控制，未登录跳转登录页，登录后无权限跳转403
- `user-menu`: 用户菜单和导航栏从静态改为基于权限动态渲染

## Impact

- **types/timeEntry.ts**: 新增Role、Permission类型定义，UserRole扩展为'Administrator' | 'ProjectManager' | 'User'
- **api/mockApi.ts**: 新增roles和permissions mock数据，修改users默认数据，新增角色CRUD API
- **api/httpClient.ts**: 请求拦截器从token中提取权限信息
- **api/timeEntryApi.ts**: API函数增加权限校验逻辑
- **store/userSlice.ts**: 新增role/permissions状态管理，登录thunk返回权限信息
- **utils/auth.ts**: 登录/登出逻辑更新，token中存储权限信息
- **pages/LoginPage.tsx**: 更新快捷登录映射和密码
- **components/timesheet/AppLayout.tsx**: 导航菜单改为基于权限动态渲染
- **components/auth/RequireAuth.tsx**: 扩展为支持权限检查的路由守卫
- **App.tsx**: 路由配置增加权限控制，新增权限管理路由
- **新增页面**: PermissionListPage（权限管理列表）、PermissionAssignPage（权限分配）
- **新增组件**: PermissionTransfer（权限分配Transfer组件）、RequirePermission（权限控制HOC/组件）