## Why

按《React 生态与工程化 — 学习计划》第 1 周规划，将现有的「工时填报」单页应用改造为多页面结构：引入 React Router 完成页面拆分（登录、主布局、列表、详情、编辑、404），并保留原有 TimeSheetPage 的功能不变。本次为整个第 3 阶段（6 周）提供页面骨架，后续周次的数据请求、表单、审批等均在此结构上扩展。

## What Changes

- 引入 React Router 配置基础路由：登录页、受保护的主布局（嵌套路由）、通配 404 兜底
- 新增**登录页**：登录表单与基本校验，成功后保存登录状态并跳转至原目标页面
- 新增**登录守卫**：未登录访问受保护页面时自动跳转登录页，登录成功后返回用户原本想访问的页面
- 新增**列表页**：复用 `TimeEntryList.tsx` 与 `Stats.tsx`，作为主布局的默认子页面
- 新增**详情页**：动态路由 `/timesheet/:id` 定位单条记录，详情页布局与 `TimeEntryForm.tsx` 高度相似（只读展示）
- 新增**编辑页**：动态路由 `/timesheet/:id/edit`，复用 `TimeEntryForm.tsx`（编辑模式预填数据）
- 修改 `TimeEntryItem.tsx`：在「编辑」「删除」按钮旁新增「详情」跳转按钮；「编辑」按钮在路由化列表页中跳转至编辑页（通过可选回调实现，原有内联编辑行为保持不变）
- 新增 **404 页面**：提示页面不存在并提供返回入口
- 原 `TimeSheetPage` 功能保持不变，与新增路由页面共存
- 主布局侧边导航与退出登录整合到路由化的主布局中

## Capabilities

### New Capabilities
- `app-routing`: 应用路由结构——登录页、主布局嵌套路由、动态路由、404 兜底
- `login-auth`: 登录页、登录状态持久化与登录守卫（未登录拦截 + 登录后返回原页面）
- `timesheet-detail-page`: 工时记录详情页（动态路由参数读取、只读展示）
- `timesheet-edit-page`: 工时记录编辑页（复用 TimeEntryForm，编辑模式预填）

### Modified Capabilities
- `time-tracking-app`: 列表项新增「详情」跳转入口，「编辑」在路由化列表页中跳转编辑页；行为通过可选回调注入，原有页面内联编辑行为保持

## Impact

- 新增页面文件：`LoginPage.tsx`、`NotFoundPage.tsx`、`TimeEntryListPage.tsx`、`TimeEntryDetailPage.tsx`、`TimeEntryEditPage.tsx`（位于 `src/pages/`）
- 修改 `App.tsx`：接入 React Router 路由表（登录、受保护主布局、404）
- 修改 `AppLayout.tsx`：由 `useState` 导航切换改为路由化导航（`NavLink` + `<Outlet />`），侧边导航高亮
- 修改 `TimeEntryItem.tsx` / `TimeEntryList.tsx`：新增可选「详情/编辑跳转」回调，保持向后兼容
- 新增登录态模块（`src/utils/auth.ts` 或等价模块），负责登录状态读写（localStorage）与守卫判断
- 依赖：`react-router-dom`（已存在于 package.json，^7.18.1）
- 无 API 接口变更，无数据层变更
