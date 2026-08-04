## Context

这是一个 React 学习项目，目标是创建一个工时填报单页应用。项目位于 `react-app` 目录，使用 Vite + React 构建。面向 React 初学者，代码需要简洁、注释清晰、易于理解。

## Goals / Non-Goals

**Goals:**
- 展示 React 核心概念：JSX、函数组件、Props、State、事件处理、条件/列表渲染
- 展示常用 Hooks：useState、useEffect、useContext、useRef
- 使用模拟 API 进行数据增删改查，模拟真实 API 调用流程
- 组件化设计，每个功能独立组件

**Non-Goals:**
- 不需要真实后端 API
- 不需要用户认证
- 不需要复杂的样式设计
- 不需要 TypeScript

## Decisions

1. **使用 Context 而非 Redux**：项目简单，Context 足够管理全局工时数据，降低学习成本
2. **使用 mock API 模拟后端接口**：使用内存数组提供数据增删改查能力，不引入额外依赖
3. **使用 Vite 创建项目**：轻量、快速，适合学习项目
4. **所有组件放在一个目录下**：保持结构简单，便于初学者理解
5. **使用内联样式或简单 CSS**：不引入 UI 框架，保持依赖最少
6. **使用 CSS Flexbox 实现左右布局**：左侧固定宽度导航栏 + 右侧自适应内容区，不引入路由库
7. **使用状态管理切换页面**：用 useState 管理当前选中导航项，条件渲染右侧内容
8. **mock API 使用 Promise 封装**：模拟真实 API 的异步调用方式，便于后续替换为真实 API

## Risks / Trade-offs

- [Risk] 初学者可能难以理解 Context 和自定义 Hook 的概念 → 通过详细注释和简单示例降低难度
- [Risk] 不使用路由库（如 react-router）可能限制后续扩展 → 当前阶段保持简单，后续可迁移到路由
- [Trade-off] mock API 数据在页面刷新后丢失 → 可通过 localStorage 缓存模拟数据作为备选方案