## Context

本项目是一个 React 学习项目，目标是创建一个工时填报单页应用。应用不涉及后端服务，所有数据存储在本地 state 中。需要全面展示 React 核心能力，包括函数组件、Props、State、事件处理、条件渲染、列表渲染以及四大 Hooks（useState、useEffect、useContext、useRef）。

## Goals / Non-Goals

**Goals:**
- 实现工时记录的完整 CRUD 操作
- 使用 useContext 管理全局应用状态和主题
- 使用 useState 管理组件级状态
- 使用 useEffect 处理副作用（数据持久化到 localStorage）
- 使用 useRef 管理表单焦点和 DOM 引用
- 展示条件渲染（空状态、筛选结果、编辑模式）
- 展示列表渲染（工时列表、筛选列表）
- 实现响应式布局和美观的 UI

**Non-Goals:**
- 不涉及后端 API 开发
- 不涉及用户认证和权限管理
- 不涉及数据库操作
- 不涉及 TypeScript（使用 JavaScript）
- 不涉及单元测试和集成测试

## Decisions

### 1. 状态管理方案：React Context + useReducer
- **选择理由**：使用 useContext 管理全局状态，符合项目对 useContext 的学习要求。相比 Redux，Context 更轻量，适合中小型应用。
- **替代方案**：使用 useState 逐层传递 props（Context 提升）—— 但会导致 props drilling 问题。
- **最终决策**：使用 useContext + useReducer 组合，提供全局状态管理能力。

### 2. 数据持久化：localStorage + useEffect
- **选择理由**：使用 useEffect 在状态变化时同步到 localStorage，实现数据持久化。
- **替代方案**：IndexedDB —— 更复杂，不适合本项目规模。
- **最终决策**：使用 localStorage 配合 useEffect 实现自动持久化。

### 3. 组件拆分策略
- **选择理由**：将应用拆分为多个函数组件，每个组件职责单一，通过 Props 传递数据和回调函数。
- **组件列表**：
  - `App`：根组件，提供 Context 提供者
  - `TimesheetForm`：工时录入表单
  - `TimesheetList`：工时列表展示
  - `TimesheetItem`：单个工时条目
  - `TimesheetFilters`：筛选组件
  - `TimesheetSummary`：统计汇总组件
  - `ThemeContext`：主题上下文

### 4. 样式方案：CSS Modules
- **选择理由**：CSS Modules 提供组件级样式隔离，避免样式冲突。
- **替代方案**：Tailwind CSS / styled-components —— 增加额外依赖。
- **最终决策**：使用 CSS Modules 保持简洁。

### 5. 路由方案：单页面内视图切换
- **选择理由**：作为学习项目，不需要完整的路由库，使用条件渲染切换视图即可。
- **替代方案**：React Router —— 增加复杂度。
- **最终决策**：使用 useState 管理当前视图状态，条件渲染切换。

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| localStorage 存储限制 | 大量工时数据可能导致存储超限 | 限制本地存储条目数量，超出时提示用户 |
| 状态管理复杂度 | 多个组件共享状态可能导致状态不一致 | 使用 useReducer 集中管理状态变更逻辑 |
| 性能问题 | 大量工时条目渲染可能导致性能下降 | 使用 React.memo 优化组件渲染，虚拟列表（如需要） |
| 数据丢失 | 清除浏览器数据会导致工时丢失 | 提供导出功能，支持数据备份 |

## Migration Plan

本项目为全新开发，不涉及迁移。按以下顺序实现：
1. 搭建项目基础结构
2. 实现 Context 和状态管理
3. 实现表单组件（添加/编辑工时）
4. 实现列表组件（展示工时）
5. 实现筛选和统计功能
6. 优化 UI 和交互

## Open Questions

- 是否需要支持导入/导出 Excel 格式？（当前方案仅支持 JSON 格式导出）
- 是否需要支持多用户切换？（当前方案为单用户）
- 是否需要国际化支持？（当前方案仅支持中文）