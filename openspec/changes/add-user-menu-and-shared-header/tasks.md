## 1. 用户名持久化

- [x] 1.1 在 `src/utils/auth.ts` 新增用户名常量 `react-app:username`，并实现 `saveUsername(username: string)` 与 `getUsername(): string | null`
- [x] 1.2 在 `logout()` 中同步移除用户名
- [x] 1.3 在 `src/pages/LoginPage.tsx` 登录成功时调用 `saveUsername(username)`

## 2. 侧边栏用户菜单

- [x] 2.1 在 `src/components/timesheet/AppLayout.tsx` 底部新增用户名链接（`<Link>`），读取 `getUsername()` 展示当前用户名，点击时 `preventDefault` 不跳转
- [x] 2.2 将"退出登录"改为非 `<button>` 的文本入口，与用户名并列，并与用户名一起固定于侧边栏最底端
- [x] 2.3 在 `AppLayout.module.css` 将侧边栏改为纵向 flex，新增 `userMenu`、头像、用户名及退出入口样式

## 3. Header 组件复用

- [x] 3.1 在 `src/components/timesheet/Header.tsx` 新增可选 `title` 属性，缺省回退 "React Learning App"
- [x] 3.2 `src/pages/TimeSheetPage.tsx` 改为 `<Header title="工时填报" />`
- [x] 3.3 `src/pages/TimeEntryListPage.tsx` 用 `<Header title="工时列表" />` 替换原生 `<h1>工时列表</h1>`

## 4. 验证

- [x] 4.1 运行构建/类型检查，确认无编译错误
- [ ] 4.2 手动验证：登录后侧边栏底部显示用户名，点击用户名不跳转，退出登录按钮并列可登出
- [ ] 4.3 手动验证：工时列表与工时填报页顶部 Header 标题分别为"工时列表""工时填报"
- [ ] 4.4 手动验证：刷新页面后用户名仍显示
