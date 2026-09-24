## Context

当前应用（react-learning）是一个工时管理React应用，已有用户管理、工时CRUD、审批流程、导入导出等功能。认证系统基于localStorage + Redux，仅有简单的isLoggedIn()检查，无权限控制。用户类型只有'管理员'和'普通用户'两种，硬编码在UserRole类型中。mock数据通过axios-mock-adapter模拟API。

## Goals / Non-Goals

**Goals:**
- 实现完整的RBAC（基于角色的访问控制）模型：User → Role → Permission 三层关系
- 定义9个权限标识，覆盖工时和用户的读写、审批、导入导出操作
- 定义3个默认角色（Administrator、ProjectManager、User），各有不同权限集合
  - User: TimeSheet.Read, TimeSheet.Write
  - ProjectManager: TimeSheet.Read, TimeSheet.Write, TimeSheet.Export, TimeSheet.Import, TimeSheet.approval, User.Read, User.Write
  - Administrator: TimeSheet.Read, User.Read, User.Write, Role.Read, Role.Write
- 实现权限管理UI：角色列表管理 + 权限分配（Select多选组件）
- 实现四级权限控制：路由、导航栏、按钮/组件、API请求
- 登录流程改造：token存储用户权限，权限驱动页面访问和403处理
- 保持mock架构不变，所有数据在内存中管理

**Non-Goals:**
- 不实现真正的JWT token，仍使用mock-token架构
- 不实现权限持久化到数据库（mock数据存内存）
- 不实现细粒度权限（如按项目/部门隔离）
- 不实现权限变更的实时通知
- 不实现用户密码加密

## Decisions

### Decision 1: 权限数据存储位置
**选择**: 权限信息同时存在于两处：
1. Redux store (userSlice) - 作为状态管理来源，供UI组件读取
2. localStorage / token - 作为路由守卫和API拦截器的判断依据

**理由**: 
- Redux store适合UI组件（导航菜单、按钮）的响应式渲染
- localStorage/token适合路由守卫和axios拦截器读取（不依赖React上下文）
- 两者数据源统一来自loginUser thunk的返回值

### Decision 2: 权限检查方式
**选择**: 使用自定义Hook + HOC/组件组合的方式
1. `usePermission(permission: string)` - Hook，返回是否有权限，供组件内逻辑判断
2. `<RequirePermission permissions={[]} fallback={<Unauthorized />}>` - 组件，控制子元素渲染
3. 扩展`RequireAuth`组件，增加可选的`permissions`参数

**理由**:
- Hook方式灵活，适合按钮级别的权限控制
- 组件方式声明式，适合页面级别的权限守卫
- 与现有RequireAuth模式一致，降低学习成本

### Decision 3: 导航菜单动态渲染
**选择**: 在AppLayout组件中，根据currentUser.permissions动态生成菜单项

**理由**:
- 菜单项与权限的映射关系在组件内定义（硬编码映射表）
- 权限变化时菜单自动更新（currentUser在Redux store中）
- 不引入额外的路由配置系统，保持简单

### Decision 4: 角色和权限的mock数据结构
**选择**: 
```typescript
type Permission = string  // 如 "TimeSheet.Read"
type RoleName = 'Administrator' | 'ProjectManager' | 'User'
type UserRole = RoleName  // 扩展原有类型

interface Role {
  id: string
  name: RoleName
  permissions: Permission[]
}

interface User {
  // 现有字段...
  roles: UserRole[]  // 改为字符串数组，支持多角色
}
```

**理由**:
- Permission用string类型足够，不需要复杂对象
- RoleName用字面量类型保证类型安全
- User.roles从单角色改为多角色数组，向后兼容

### Decision 5: 权限分配组件
**选择**: 使用Ant Design的Select组件（mode="multiple"）进行权限分配

**理由**:
- Select多选组件简洁直观，适合权限数量较少的场景（仅9个权限）
- 支持搜索过滤、全选功能
- 新增角色和编辑角色共用同一页面（PermissionAssignPage）
- 编辑模式下角色名称不可修改（isEditMode时disabled）

### Decision 6: 403处理方式
**选择**: 
1. 路由级别：未匹配到权限 → Navigate到403页面
2. 组件/按钮级别：usePermission(false) → 不渲染元素
3. API级别：mock API返回403状态码，axios拦截器处理

**理由**:
- 与现有401处理保持一致的error handling模式
- 403页面可以显示友好提示和返回首页链接
- 组件级隐藏比禁用更合理（没有权限就不该看到元素）

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| 权限映射表硬编码在组件中，维护困难 | 将权限到菜单项的映射集中到常量文件中（AppLayout.tsx中定义） |
| Select多选组件权限数量增长时体验问题 | 当前权限数量少（9个），无需优化；如增长可改为Transfer组件 |
| localStorage存储权限信息可能被篡改 | 纯前端mock环境，无需担心；生产环境应使用签名token |
| 角色名与用户名耦合（默认用户名=角色名） | 仅在默认数据中这样设计，不强制约束，后续可扩展 |
| mock数据内存存储在刷新后丢失 | 符合mock设计初衷；如需持久化可改用localStorage |

## Migration Plan

1. **类型定义阶段**: 修改types/timeEntry.ts，新增Role/Permission类型，扩展UserRole
2. **Mock数据阶段**: 修改api/mockApi.ts，新增角色/权限数据，修改默认用户
3. **Store阶段**: 修改store/userSlice.ts，新增权限状态和登录逻辑
4. **工具函数阶段**: 修改utils/auth.ts，token中存储权限信息
5. **登录页面阶段**: 修改pages/LoginPage.tsx，更新快捷登录和密码（Administrator/ProjectManager/User，密码Pass@word0）
6. **权限UI阶段**: 新建PermissionListPage（角色列表+搜索+删除）和PermissionAssignPage（角色创建/编辑+权限分配）
7. **权限控制阶段**: 扩展RequireAuth，新增RequirePermission组件和usePermission Hook
8. **导航栏阶段**: 修改AppLayout.tsx，动态菜单渲染（基于权限过滤）
9. **路由阶段**: 修改App.tsx，添加权限路由和权限管理路由（/permissions, /permissions/assign）
10. **API拦截阶段**: 修改httpClient.ts和timeEntryApi.ts，增加权限校验（401/403处理）

所有步骤在同一PR中完成，一次性部署。回滚只需撤销PR即可。

## Open Questions

1. 是否需要权限搜索/过滤功能（在Select组件中）？Ant Design Select内置支持
2. 角色编辑时是否可以修改角色名称？需求未明确，暂只允许修改权限分配
3. 用户创建/编辑时是否支持多角色分配？UserForm已有roles多选，需确认
4. 403页面是否需要独立页面组件，还是复用NotFoundPage？建议新建UnauthorizedPage