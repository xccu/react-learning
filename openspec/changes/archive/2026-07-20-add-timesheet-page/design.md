## Context

当前 `react-app` 是一个基于 Vite + React 19 + TypeScript 的学习项目，已有 `docs-examples` 目录用于展示 React 概念。项目使用 `react-router-dom` 进行路由管理，无后端服务，所有数据演示均基于本地 state。

新增"工时填报"单页面，作为 React 核心概念的综合性学习示例，覆盖 JSX 语法、函数组件、Props 传递、State 管理、事件处理、条件渲染、列表渲染以及四大 Hooks（useState、useEffect、useContext、useRef）。

## Goals / Non-Goals

**Goals:**
- 实现一个完整的工时填报页面，包含表单录入、列表展示、统计汇总
- 演示 `useState` 用于表单状态和工时数据管理
- 演示 `useEffect` 用于页面加载时初始化示例数据、状态变更时的副作用
- 演示 `useContext` 用于跨组件共享工时数据和操作函数
- 演示 `useRef` 用于聚焦表单输入框
- 演示条件渲染（状态标签、空状态提示）
- 演示列表渲染（工时记录列表）
- 演示事件处理（表单提交、删除、状态切换）
- 演示 Props 在父子组件间的数据传递
- 所有数据存于本地 state，不依赖任何外部存储或 API

**Non-Goals:**
- 不涉及后端 API 集成
- 不涉及持久化存储（localStorage、IndexedDB 等）
- 不涉及用户认证
- 不涉及复杂的权限控制
- 不涉及数据导出功能

## Decisions

### 决策 1：使用 Context + useState 管理全局工时状态
- **选择**：在页面内部创建 `TimesheetContext`，通过 `useState` 管理工时数据数组
- **理由**：项目无需全局状态管理库（如 Redux/Zustand），Context + useState 足以满足单页面跨组件通信需求
- **替代方案**：将所有逻辑放在 `TimesheetPage` 中通过 Props 逐层传递 —— 但会导致 props drilling，不符合学习 useContext 的目标

### 决策 2：组件拆分粒度
- **选择**：拆分为 4 个子组件（`TimesheetForm`、`TimesheetList`、`TimesheetStats`、`StatusBadge`）+ 1 个页面组件（`TimesheetPage`）
- **理由**：每个组件职责单一，便于展示 Props 传递和组件化思想
- **替代方案**：单文件组件 —— 但无法充分展示组件拆分和 Props 概念

### 决策 3：工时状态枚举
- **选择**：定义 `TimesheetStatus` 枚举：`pending`（待提交）、`submitted`（已提交）、`approved`（已审批）
- **理由**：覆盖条件渲染的不同分支，便于展示 `StatusBadge` 组件的条件渲染逻辑

### 决策 4：使用 TypeScript 类型定义
- **选择**：在 `types.ts` 中定义 `TimesheetItem`、`TimesheetFormData` 等类型
- **理由**：项目使用 TypeScript，类型安全是最佳实践

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 页面刷新后数据丢失 | 明确说明这是学习示例，数据仅存于内存 state |
| 组件过多导致学习曲线陡峭 | 每个组件保持简洁，职责单一，代码注释清晰 |
| Context 导致不必要的重渲染 | 将数据和操作函数拆分到不同 Context，或进行合理的状态拆分 |

## Migration Plan

1. 在 `react-app/src/timesheet/` 下创建所有组件文件
2. 在 `react-app/src/App.tsx` 中注册 `/timesheet` 路由
3. 验证路由可正常访问，页面功能正常

## Open Questions

- 无