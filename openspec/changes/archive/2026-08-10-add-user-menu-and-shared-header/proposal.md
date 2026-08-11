## Why

当前左侧导航栏底部只有孤立的"退出登录"按钮，用户无法在界面上看到当前登录用户名；同时"工时列表"页用原生 `<h1>`、"工时填报"页用 `Header` 组件但标题为静态的 "React Learning App"，两页页头形态不一致。需要统一页头并展示用户信息，提升一致性与可用性。

## What Changes

- 左侧导航栏（`AppLayout.tsx`）底部新增用户名链接，展示当前登录用户名，点击暂不跳转；"退出登录"按钮移至用户名链接旁边，与其同行展示。
- 登录成功时持久化当前用户名（localStorage），刷新后仍能显示。
- `Header` 组件改为接收 `title` 属性，标题文本与当前页面名称一致。
- "工时列表"页与"工时填报"页复用同一个 `Header` 组件，标题分别为"工时列表"、"工时填报"。

## Capabilities

### New Capabilities
- `user-menu`: 左侧导航栏底部展示当前登录用户名链接，退出登录按钮与用户名链接并列展示

### Modified Capabilities
- `time-tracking-app`: Header 组件行为变更——由固定显示 "React Learning App" 改为接收 `title` 属性显示当前页面名称，工时列表页与工时填报页共用该组件

## Impact

- `react-app/src/components/timesheet/AppLayout.tsx`：侧边栏底部结构调整（用户名链接 + 退出登录）
- `react-app/src/components/timesheet/AppLayout.module.css`：新增用户菜单样式
- `react-app/src/components/timesheet/Header.tsx`：新增 `title` 属性
- `react-app/src/components/timesheet/Header.module.css`：如有需要微调标题样式
- `react-app/src/pages/TimeSheetPage.tsx`：`Header` 传入页面标题
- `react-app/src/pages/TimeEntryListPage.tsx`：用 `Header` 替换原生 `<h1>`
- `react-app/src/pages/LoginPage.tsx`：登录成功时保存用户名
- `react-app/src/utils/auth.ts`：新增保存/读取用户名方法
