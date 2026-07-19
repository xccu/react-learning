## ADDED Requirements

### Requirement: 全局状态上下文
系统必须使用 useContext 提供全局状态管理。

#### Scenario: 创建上下文
- **WHEN** 系统初始化应用
- **THEN** 系统创建 TimesheetContext 提供全局状态和操作方法

#### Scenario: 消费上下文
- **WHEN** 子组件需要使用全局状态
- **THEN** 子组件通过 useContext Hook 访问全局状态

### Requirement: 主题上下文
系统必须使用 useContext 管理应用主题状态。

#### Scenario: 切换主题
- **WHEN** 用户点击主题切换按钮
- **THEN** 系统更新主题状态并重新渲染所有组件

#### Scenario: 默认主题
- **WHEN** 系统首次加载
- **THEN** 系统使用亮色主题作为默认主题

### Requirement: useReducer 状态管理
系统必须使用 useReducer 管理工时数据状态。

#### Scenario: 添加工时
- **WHEN** 系统收到 ADD_TIMESHEET action
- **THEN** 系统添加新工时条目到状态中

#### Scenario: 更新工时
- **WHEN** 系统收到 UPDATE_TIMESHEET action
- **THEN** 系统更新匹配的工时条目

#### Scenario: 删除工时
- **WHEN** 系统收到 DELETE_TIMESHEET action
- **THEN** 系统从状态中移除匹配的工时条目

### Requirement: useEffect 数据持久化
系统必须使用 useEffect 实现数据持久化。

#### Scenario: 状态变化时持久化
- **WHEN** 工时数据状态发生变化
- **THEN** 系统通过 useEffect 将数据保存到 localStorage

#### Scenario: 初始化时加载数据
- **WHEN** 系统首次加载
- **THEN** 系统通过 useEffect 从 localStorage 加载数据

### Requirement: useRef DOM 引用
系统必须使用 useRef 管理 DOM 引用。

#### Scenario: 表单焦点管理
- **WHEN** 用户进入编辑模式
- **THEN** 系统通过 useRef 将焦点设置到项目名称输入框

#### Scenario: 滚动引用
- **WHEN** 用户添加新工时条目
- **THEN** 系统通过 useRef 滚动到新添加的条目