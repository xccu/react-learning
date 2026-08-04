## Purpose

TBD

## Requirements

### Requirement: App.tsx 与 TimeSheetPage 解耦
系统必须将 App.tsx 与 TimeSheetPage 的业务逻辑分离，App.tsx 仅保留布局壳和导航配置。

#### Scenario: App.tsx 不内联 TimeSheetPage 逻辑
- **WHEN** 查看 App.tsx 文件内容
- **THEN** App.tsx 不包含 TimeSheetPage 的 useState、事件处理、数据计算等业务逻辑

#### Scenario: App.tsx 通过配置渲染页面
- **WHEN** App.tsx 根据 activeNav 状态渲染右侧内容
- **THEN** App.tsx 通过 navPages 配置对象映射导航 key 到页面组件

### Requirement: TimeSheetPage 独立为单独文件
系统必须将 TimeSheetPage 提取为独立的页面组件文件。

#### Scenario: TimeSheetPage 文件存在
- **WHEN** 查看项目文件结构
- **THEN** src/pages/TimeSheetPage.tsx 文件存在，包含完整的工时填报业务逻辑

#### Scenario: TimeSheetPage 功能不变
- **WHEN** 访问工时填报页面
- **THEN** 表单创建、编辑、删除、统计等功能与解耦前完全一致

### Requirement: 导航配置驱动页面渲染
系统必须通过导航配置对象将导航项与页面组件建立映射关系。

#### Scenario: 导航配置包含 Timesheet 映射
- **WHEN** 查看 navPages 配置
- **THEN** 配置中包含 'timesheet' key 映射到 TimeSheetPage 组件

#### Scenario: 点击导航切换页面
- **WHEN** 用户点击左侧导航栏的 Timesheet 链接
- **THEN** 右侧内容区渲染 TimeSheetPage 组件

### Requirement: 保持所有 React 技术栈不变
系统必须保持所有原有的 React 核心概念和技术栈。

#### Scenario: 所有 Hooks 仍在使用
- **WHEN** 查看 TimeSheetPage 和 App.tsx 代码
- **THEN** 代码中包含 useState、useEffect、useContext、useRef 的使用

#### Scenario: Props 传递仍在使用
- **WHEN** 查看组件间数据传递
- **THEN** 组件间通过 Props 传递数据和回调函数

#### Scenario: 条件渲染和列表渲染仍在使用
- **WHEN** 查看 TimeSheetPage 和子组件代码
- **THEN** 代码中包含条件渲染（空状态、编辑模式）和列表渲染（map 遍历）

### Requirement: 对初学者友好
系统必须确保重构后对初学者友好，不引入超出当前学习范围的新概念。

#### Scenario: navPages 配置简单易懂
- **WHEN** 查看 App.tsx 中的 navPages 配置
- **THEN** 配置为简单的对象映射 `{ timesheet: TimeSheetPage }`，仅使用初学者已掌握的对象字面量和组件引用

#### Scenario: 不引入路由库
- **WHEN** 查看项目依赖和代码
- **THEN** 不引入 react-router 等路由库，继续使用 useState + 条件渲染管理页面切换

#### Scenario: 代码结构清晰
- **WHEN** 初学者阅读项目代码
- **THEN** App.tsx 仅包含布局壳（约 20 行），TimeSheetPage.tsx 包含完整业务逻辑，职责分离清晰