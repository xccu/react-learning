## 1. 类型定义

- [x] 1.1 在 `src/types/timeEntry.ts` 中新增 `User` 类型（id、username、password、roles、createdAt）
- [x] 1.2 在 `src/types/timeEntry.ts` 中新增 `UserRole` 类型（'管理员' | '普通用户'）
- [x] 1.3 在 `src/types/timeEntry.ts` 中新增 `UserQuery` 接口（username?、role?）
- [x] 1.4 确认类型编译通过：`npm run typecheck`

## 2. Mock 数据与 API 层

- [x] 2.1 在 `src/api/mockApi.ts` 中新增用户 mock 数据（3 条默认用户：admin/admin123、user1/user123、user2/user123）
- [x] 2.2 在 `src/api/mockApi.ts` 中新增 `getUsers`、`queryUsers`、`getUserById`、`addUser`、`updateUser`、`deleteUser` 函数
- [x] 2.3 在 `src/api/mockApi.ts` 中新增 `login(username, password)` 函数，验证用户名+密码
- [x] 2.4 在 `src/api/timeEntryApi.ts` 中新增对应用户的 HTTP 请求函数（含 login）
- [x] 2.5 在 `src/api/mockAdapter.ts` 中注册 `/users` 相关端点的 mock 路由（含 `POST /users/login`）
- [x] 2.6 确认 API 层编译通过：`npm run typecheck`

## 3. Redux 用户状态模块

- [x] 3.1 新建 `src/store/userSlice.ts`，定义 UserState 接口和初始状态
- [x] 3.2 使用 `createSlice` 定义同步 reducers：setUsers、addUser、updateUser、deleteUser
- [x] 3.3 使用 `createSlice` 定义当前用户 reducers：setCurrentUser、clearCurrentUser
- [x] 3.4 导出 actions 和 reducer
- [x] 3.5 在 `src/store/index.ts` 中注册 user reducer
- [x] 3.6 确认 Store 配置编译通过：`npm run typecheck`

## 4. 用户表单组件

- [x] 4.1 新建 `src/components/timesheet/UserForm.tsx`
- [x] 4.2 使用 React Hook Form + Ant Design Form/Input/Select/Button 实现表单结构
- [x] 4.3 用户名字段：Form.Item + Input，必填校验
- [x] 4.4 角色字段：Form.Item + Select（支持多选），选项为 ['管理员', '普通用户']，必填校验
- [x] 4.5 支持新增模式（空表单）和编辑模式（预填数据，用户名 disabled）
- [x] 4.6 提交按钮 + 取消按钮（调用 onCancel 回调）
- [x] 4.7 验证表单校验逻辑：空用户名/角色时阻止提交

## 5. 用户查询表单组件

- [x] 5.1 新建 `src/components/timesheet/UserQueryForm.tsx`
- [x] 5.2 使用 React Hook Form + Ant Design Form/Input/Select/Button/Space 实现查询表单
- [x] 5.3 查询字段：用户名（Input allowClear）、角色（Select: 全部/管理员/普通用户）
- [x] 5.4 按钮：查询（primary）、清空、新增用户（dashed 类型，导航到 /users/create）
- [x] 5.5 清空时恢复显示全部用户
- [x] 5.6 验证查询功能：输入用户名/选择角色后点击查询，列表正确过滤

## 6. 用户列表页面

- [x] 6.1 新建 `src/pages/UserListPage.tsx`
- [x] 6.2 从 Redux Store 读取用户列表和 loading 状态
- [x] 6.3 页面挂载时从 API 加载用户数据，dispatch setUsers
- [x] 6.4 使用 Ant Design Table 渲染用户列表：用户名、角色(Tag)、创建时间、操作列
- [x] 6.5 角色列使用 Tag 组件：管理员=蓝色，普通用户=绿色
- [x] 6.6 操作列：详情按钮（导航到 /users/:id）、编辑按钮（导航到 /users/:id/edit）、删除按钮（Popconfirm 包裹）
- [x] 6.7 顶部新增用户按钮：导航到 /users/create
- [x] 6.8 集成 UserQueryForm 查询表单
- [x] 6.9 实现前端分页：每页 5 条，使用 Ant Design Pagination 组件
- [x] 6.10 空状态：无用户数据时显示"暂无用户数据"
- [x] 6.11 操作成功后显示 message.success 提示

## 7. 用户详情页面

- [x] 7.1 新建 `src/pages/UserDetailPage.tsx`
- [x] 7.2 使用 useParams 读取路由中的 :id 参数
- [x] 7.3 页面挂载时经 getUserById API 加载用户数据
- [x] 7.4 加载中显示"加载中..."，加载失败显示"未找到该用户" + 返回列表入口
- [x] 7.5 只读展示：用户名、角色(Tag)、创建时间
- [x] 7.6 按钮：编辑（Link to /users/:id/edit）、返回列表（Link to /users）
- [x] 7.7 字段使用纯文本展示，不使用输入框样式

## 8. 用户新增页面

- [x] 8.1 新建 `src/pages/UserCreatePage.tsx`
- [x] 8.2 使用 useDispatch + useNavigate
- [x] 8.3 提交时调用 addUser API，成功后 navigate('/users')
- [x] 8.4 复用 UserForm 组件（新增模式，不传 initialData）

## 9. 用户编辑页面

- [x] 9.1 新建 `src/pages/UserEditPage.tsx`
- [x] 9.2 使用 useParams + useDispatch + useNavigate
- [x] 9.3 页面挂载时经 getUserById API 加载用户数据
- [x] 9.4 加载中/失败处理同详情页
- [x] 9.5 提交时调用 updateUser API，成功后 navigate('/users')
- [x] 9.6 复用 UserForm 组件（编辑模式，传 initialData={user}）

## 10. 登录页重构（用户认证）

- [x] 10.1 在 `LoginPage.tsx` 中导入 `loginUser` API 函数和 `setCurrentUser` action
- [x] 10.2 在 `handleFormSubmit` 中调用 `loginUser(username, password)` 验证用户
- [x] 10.3 验证成功：调用 `login()` 保存登录态、`saveUsername()` 保存用户名、`dispatch(setCurrentUser(user))` 保存用户信息
- [x] 10.4 验证失败：使用 `message.error` 提示"用户名或密码错误"
- [x] 10.5 在 `src/store/userSlice.ts` 中确保 `clearCurrentUser` 在退出登录时被调用
- [x] 10.6 在 `src/components/timesheet/AppLayout.tsx` 的 `handleLogout` 中调用 `clearCurrentUser`
- [ ] 10.7 验证登录功能：使用默认用户（admin/admin123）登录成功，使用错误密码登录失败

## 11. 侧边栏导航与路由

- [x] 11.1 在 `src/components/timesheet/AppLayout.tsx` 的 menuItems 中新增"用户管理"项
- [x] 11.2 使用 `UserOutlined` 图标
- [ ] 11.3 验证 Menu 选中态高亮：访问 `/users` 时"用户管理"菜单项高亮
- [x] 11.4 在 `src/App.tsx` 中新增用户管理相关路由（/users、/users/create、/users/:id、/users/:id/edit）
- [x] 11.5 `/users/create` 路由放在 `/users/:id` 之前，避免冲突
- [x] 11.6 所有用户管理路由受 RequireAuth 保护

## 12. 验证与收尾

- [x] 12.1 `npm run typecheck` 通过
- [ ] 12.2 `npm run lint` 通过
- [ ] 12.3 手动验证默认用户登录：admin/admin123 登录成功，user1/user123 登录成功
- [ ] 12.4 手动验证登录失败：错误用户名或密码时提示"用户名或密码错误"
- [ ] 12.5 手动验证登录后侧边栏显示用户名
- [ ] 12.6 手动验证退出登录：清除登录态和用户信息，跳转到登录页
- [ ] 12.7 手动验证用户列表页渲染正常，查询表单可用
- [ ] 12.8 手动验证用户列表查询：按用户名/角色过滤，清空恢复全部
- [ ] 12.9 手动验证分页功能正常
- [ ] 12.10 手动验证用户详情：点击详情 → 只读展示 → 编辑/返回列表
- [ ] 12.11 手动验证用户新增：点击新增 → 填写表单 → 提交 → 返回列表
- [ ] 12.12 手动验证用户编辑：点击编辑 → 预填数据 → 修改 → 提交 → 返回列表
- [ ] 12.13 手动验证删除用户：点击删除 → 确认 → 列表刷新
- [ ] 12.14 手动验证角色 Tag 颜色正确（管理员=蓝色，普通用户=绿色）
- [ ] 12.15 手动验证侧边栏"用户管理"导航可点击并跳转