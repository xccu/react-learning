## 1. 迁移权限检查函数

- [x] 1.1 在 src/utils/auth.ts 中新增 hasPermissionFromRoles 函数（从 userRoles 和角色列表检查权限）
- [x] 1.2 在 src/utils/auth.ts 中新增 getUserPermissionsFromRoles 函数（从 userRoles 和角色列表合并权限）
- [x] 1.3 更新 src/store/userSlice.ts 导入路径，移除 mockApi.ts 的权限函数引用；清理 permissions/index.ts 导出

## 2. 删除 Mock 文件

- [x] 2.1 删除 src/api/mockApi.ts
- [x] 2.2 删除 src/api/mockAdapter.ts
- [x] 2.3 验证所有页面组件不再引用 mockApi 或 mockAdapter（TimeEntryQuery 类型迁移到 types/timeEntry.ts，main.tsx 移除 mockAdapter 导入）

## 3. 清理依赖

- [x] 3.1 从 react-app/package.json 中移除 axios-mock-adapter 依赖
- [x] 3.2 运行 npm install 更新 package-lock.json
- [x] 3.3 运行 npm run build 验证构建无错误

## 4. 配置 Vite 代理

- [x] 4.1 在 vite.config.ts 中添加 server.proxy 配置，将 /api 代理到 http://localhost:8000
- [x] 4.2 配置 changeOrigin: true 解决 CORS 问题

## 5. 手动验证（需启动服务后在浏览器中测试）

- [x] 5.1 启动 web-api-server（cd web-api-server && uvicorn main:app --reload）- 已移除内存缓存机制，每次请求从 JSON 文件读取
- [x] 5.2 启动 react-app（cd react-app && npm run dev）
- [x] 5.3 验证登录功能：分别用 Administrator/Pass@word0、ProjectManager/Pass@word0、User/Pass@word0 登录 - 后端已返回 roles 字段
- [x] 5.4 验证工时列表 CRUD：增删改查操作是否正常，数据是否持久化到 JSON 文件 - 已修复所有页面调用 API
- [ ] 5.5 验证批量导入功能：上传 Excel 文件批量导入工时记录
- [ ] 5.6 验证用户管理 CRUD：增删改查用户功能
- [ ] 5.7 验证角色管理 CRUD：增删改角色，确认 Administrator 不可删除
- [ ] 5.8 验证权限控制：不同角色登录后看到不同的菜单和按钮
- [ ] 5.9 验证 API 错误处理：输入错误密码提示错误信息，无权限访问跳转 403 页面
- [ ] 5.10 验证数据持久化：刷新页面后数据保留，重启服务器后数据仍存在