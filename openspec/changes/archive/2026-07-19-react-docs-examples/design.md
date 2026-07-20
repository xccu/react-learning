## Context

当前 `react-app` 是 Vite + React 19 + TypeScript 项目，使用默认模板。需要在不破坏现有项目结构的前提下，添加一个完整的 React 文档示例学习页面。

## Goals / Non-Goals

**Goals:**
- 创建独立的 `docs-examples` 页面，按 React 文档章节组织示例
- 每个示例可独立运行，代码与官方文档一致
- 提供侧边栏导航，方便按章节浏览
- 保持与现有项目结构兼容

**Non-Goals:**
- 不修改现有的 `App.tsx` 主页面逻辑
- 不添加测试代码
- 不添加后端或 API 功能
- 不实现 React 文档中的所有高级概念（如 Context、Reducer 等），仅覆盖基础学习章节

## Decisions

1. **路由方案：使用 `react-router-dom`**
   - 理由：官方推荐的路由方案，支持声明式导航和嵌套路由
   - 替代方案：手动用 state 切换组件，但不够灵活

2. **目录结构：`src/docs-examples/`**
   - 所有示例组件放在此目录下
   - 按章节分文件组织，每个文件对应 React 文档的一个章节
   - 理由：与 React 文档结构一一对应，便于对照学习

3. **示例组织方式：侧边栏 + 主内容区**
   - 使用固定侧边栏导航，主内容区展示当前章节示例
   - 理由：提供类似文档的阅读体验

4. **样式方案：使用 CSS 模块或独立 CSS 文件**
   - 使用独立的 `.css` 文件，避免 CSS 模块的复杂性
   - 理由：初学者更容易理解，与 React 文档风格一致

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|----------|
| 新增 `react-router-dom` 依赖 | 仅作为开发学习用途，体积小，不影响构建性能 |
| 示例组件过多导致维护困难 | 每个组件保持简单，直接对应文档代码 |
| 与现有项目风格不一致 | 使用项目已有的 Prettier + Oxlint 规范代码风格 |

## Migration Plan

1. 安装 `react-router-dom`
2. 创建 `docs-examples` 目录和组件文件
3. 修改 `main.tsx` 添加 Router 包裹
4. 修改 `App.tsx` 添加导航链接
5. 运行 `npm run lint` 和 `npm run typecheck` 验证