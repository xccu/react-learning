## Why

React 官方文档（https://zh-hans.react.dev/learn）提供了完整的学习路径和示例代码，但缺少可直接运行的本地示例项目。创建一个包含所有示例代码的实践项目，可以帮助初学者快速理解和学习 React 的核心概念。

## What Changes

在 `react-app` 中添加一个新的 `docs-examples` 页面，按 React 文档的学习顺序组织各章节示例，包含：

- 组件创建与嵌套
- JSX 语法
- 样式添加（className）
- 数据显示（变量嵌入、表达式）
- 条件渲染（if/else、三元运算符、逻辑与）
- 列表渲染（map、key）
- 事件响应（onClick）
- State 管理（useState）
- 组件间数据共享（状态提升）

每个示例以独立的可运行组件形式呈现，通过侧边栏导航切换。

## Capabilities

### New Capabilities
- `react-learn-examples`: 按 React 官方文档学习路径组织的示例页面，涵盖组件、JSX、样式、数据、条件渲染、列表、事件、State、Hook、数据共享等核心概念

### Modified Capabilities
（无）

## Impact

- 在 `react-app/src/` 下新增 `docs-examples/` 目录
- 新增路由配置和导航组件
- 新增约 10 个示例组件文件
- 修改 `App.tsx` 添加路由支持
- 新增 `react-router-dom` 依赖