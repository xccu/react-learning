## Context

当前结构（见 proposal.md - Why）：
- 侧边栏在 `src/components/timesheet/AppLayout.tsx`，底部只有一个独立"退出登录"按钮（`logoutBtn`），无用户信息展示。
- 登录页 `LoginPage.tsx` 只在本地 state 保存用户名，`auth.ts` 仅持久化 `isLoggedIn` 布尔值，未保存用户名。
- `Header.tsx` 标题写死为 "React Learning App"；`TimeSheetPage`（工时填报）已使用 `<Header />`，`TimeEntryListPage`（工时列表）用的是原生 `<h1>工时列表</h1>`。
- 项目使用 CSS Modules（`*.module.css`）与 `react-router-dom`。

## Goals / Non-Goals

**Goals:**
- 用最少改动让用户名在登录后可见、刷新后仍保留。
- `Header` 组件可复用，标题由页面传入。
- 保持现有 CSS Modules 与组件拆分风格。

**Non-Goals:**
- 不做用户名链接的真实跳转（点击无行为）。
- 不做用户管理、头像、多用户等更完整用户体系。

## Decisions

- **用户名持久化键**：在 `auth.ts` 新增 `getUsername` / `saveUsername`，沿用现有 `localStorage` 工具风格，新增键 `react-app:username`。`LoginPage` 提交成功后调用 `saveUsername(username)`；`logout()` 同步移除用户名。备选：存在同一对象里 —— 改动更大、与现有 `isLoggedIn` 结构不一致，不采用。
- **用户菜单布局**：`AppLayout` 侧边栏底部用一个 `userMenu` 容器将用户名链接（`<Link>`）与"退出登录"按钮并列，用户名链接 `to="/"` 但拦截点击不跳转（`preventDefault`），满足"点击暂不跳转"。备选：改为纯 `<span>` 展示 —— 需求明确要求"链接"，故用 `Link` + 拦截。
- **Header 标题参数化**：`Header` 接收可选 `title?: string`，缺省回退为 "React Learning App"。工时填报传"工时填报"，工时列表传"工时列表"。备选：用 `useLocation` 自动推导标题 —— 增加耦合、页面名与路由的映射需硬编码，不采用。
- **登录用户名与导航栏同步**：用户名在登录时写入 localStorage，`AppLayout` 渲染时通过 `getUsername()` 读取。不引入 Context/全局状态，因为用户名只在登录页写入、在布局读取，无共享变更场景。

## Risks / Trade-offs

- [用户名可能在登录后由页面直接读取不到（依赖登录页调用 `saveUsername`）] → 将保存逻辑收敛在 `auth.ts`，由 `login()` 统一处理，避免漏调。
- [Header 标题缺省值保留 "React Learning App"，可能出现页面忘记传 title 显示旧标题] → 默认值兜底，代码审查时核对两处页面均传参。
