## Why

项目需要一个"工时填报"单页面作为 React 核心概念的综合性学习示例，展示 JSX、函数组件、Props、State、事件处理、条件/列表渲染以及 React Hooks（useState、useEffect、useContext、useRef）的实际应用。数据完全存储于本地 state，无需后端依赖。

## What Changes

- 在 `react-app/src/` 下新增 `timesheet/` 目录，包含工时填报页面及相关组件
- 创建 `TimesheetPage` 主页面组件，集成工时填报、列表展示、统计汇总功能
- 创建可复用子组件：`TimesheetForm`（填报表单）、`TimesheetList`（列表渲染）、`TimesheetStats`（统计面板）、`StatusBadge`（状态标签）
- 创建 `TimesheetContext` 上下文，演示 `useContext` 的使用
- 在 `App.tsx` 中注册 `/timesheet` 路由
- 新增 `TimesheetItem` TypeScript 类型定义
- 所有数据仅存于本地 state，不依赖任何外部存储或 API

## Capabilities

### New Capabilities

- `timesheet-page`: 工时填报单页面，涵盖 React 核心概念的综合示例，包含表单录入、列表展示、条件渲染、统计汇总、上下文状态管理

### Modified Capabilities

<!-- 无 -->

## Impact

- 修改：`react-app/src/App.tsx`（新增路由）
- 新增：`react-app/src/timesheet/` 目录及所有组件文件
- 新增：`react-app/src/timesheet/types.ts`（类型定义）
- 新增：`react-app/src/timesheet/TimesheetContext.tsx`（上下文）
- 新增：`react-app/src/timesheet/TimesheetPage.tsx`（主页面）
- 新增：`react-app/src/timesheet/components/` 目录下所有子组件
- 无外部依赖变更