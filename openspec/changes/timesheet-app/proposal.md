## Why

团队需要一款轻量级的工时填报工具，用于记录和查看每日工作耗时。由于是学习项目，所有数据存储在本地 state 中，不依赖后端服务。该应用将全面展示 React 核心能力，作为团队成员学习 React 最佳实践的参考实现。

## What Changes

- 新增一个完整的工时填报单页应用（Timesheet App）
- 支持工时记录的增删改查（CRUD）操作
- 支持按日期、项目、任务类型进行筛选和统计
- 所有数据存储在本地 state 中，刷新页面后数据保留在内存中
- 全面使用 React 函数组件、Hooks（useState、useEffect、useContext、useRef）
- 展示条件渲染、列表渲染、事件处理等核心概念

## Capabilities

### New Capabilities
- `timesheet-management`: 工时记录的管理功能，包括添加、编辑、删除、查询工时条目
- `timesheet-filters`: 工时数据的筛选功能，支持按日期范围、项目名称、任务类型进行过滤
- `timesheet-summary`: 工时统计汇总功能，展示每日/每周工时统计和图表化展示
- `timesheet-context`: 全局状态管理，使用 useContext 管理应用级状态和主题

### Modified Capabilities
<!-- 无 -->

## Impact

- 新增 React 单页应用，独立于现有项目
- 新增依赖：React 及相关 Hooks
- 新增文件：组件文件、样式文件、上下文提供者
- 不涉及后端 API 或外部数据存储