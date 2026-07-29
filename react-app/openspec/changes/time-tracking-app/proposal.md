## Why

初学者在学习 React 时需要一个综合练习 JSX、函数组件、Props、State、事件处理、条件/列表渲染以及常用 Hooks（useState、useEffect、useContext、useRef）的实战项目。工时填报是一个贴近日常工作的场景，功能简单清晰，适合展示 React 核心概念。

## What Changes

- 创建一个新的 React 单页应用——工时填报系统
- 支持创建、查看、编辑、删除工时记录
- 使用模拟 API（mock API）进行数据的增删改查操作，仅提供数据操作能力
- 使用 Context 提供全局工时数据
- 使用 useRef 聚焦输入框
- 使用 useEffect 在组件加载时调用 API 获取数据
- 使用 useState 管理表单状态和列表状态
- 使用 Props 在组件间传递数据
- 使用条件渲染显示空状态和统计信息
- 使用列表渲染展示工时记录
- 修改 App.tsx 页面布局：左侧深色导航栏、顶部 Header（图标+标题）、右侧内容区
- 导航栏包含 Timesheet 链接，点击后在右侧内容区展示工时填报页面

## Capabilities

### New Capabilities
- `time-tracking-app`: 工时填报单页应用，包含工时记录的增删查、数据持久化、全局状态管理

### Modified Capabilities
<!-- 无 -->

## Impact

- 新建 React 项目或在新路由下添加工时填报页面
- 新增组件：App、TimeEntryForm、TimeEntryList、TimeEntryItem、Stats、AppLayout、Header、MockApi
- 新增 Context：TimeEntryContext
- 新增自定义 Hook：useTimeEntries（封装 useState、useEffect、mock API 调用）
- 新增 mock API 层：模拟增删改查接口，仅提供数据操作能力
- 无外部依赖，仅使用 React 核心库