## ADDED Requirements

### Requirement: 工时记录数据模型
系统 SHALL 定义工时记录的数据结构，包含以下字段：
- `id`: 唯一标识符（字符串）
- `date`: 工作日期（字符串，格式 YYYY-MM-DD）
- `project`: 项目名称（字符串）
- `task`: 任务描述（字符串）
- `hours`: 工时数（数字，范围 0.5-12）
- `status`: 状态（枚举：`pending` / `submitted` / `approved`）
- `description`: 详细说明（字符串，可选）

#### Scenario: 工时记录类型定义
- **WHEN** 系统定义工时记录类型
- **THEN** 包含 id、date、project、task、hours、status、description 七个字段

### Requirement: 工时填报表单
系统 SHALL 提供一个表单组件 `TimesheetForm`，允许用户录入新的工时记录。表单包含以下输入项：
- 日期选择器（必填）
- 项目名称输入框（必填）
- 任务描述输入框（必填）
- 工时数输入框（必填，数字类型，最小 0.5，最大 12）
- 详细说明输入框（可选，文本域）
- 提交按钮

#### Scenario: 成功提交工时记录
- **WHEN** 用户填写所有必填字段并点击"提交"按钮
- **THEN** 系统创建一条新的工时记录，状态为 `pending`，并重置表单

#### Scenario: 表单验证失败
- **WHEN** 用户未填写必填字段或工时数超出范围（< 0.5 或 > 12）
- **THEN** 系统显示验证错误提示，不创建记录

#### Scenario: 表单提交后聚焦
- **WHEN** 用户成功提交表单
- **THEN** 系统使用 `useRef` 将焦点聚焦到日期输入框

### Requirement: 工时记录列表展示
系统 SHALL 提供一个列表组件 `TimesheetList`，以表格形式展示所有工时记录。列表应包含：
- 日期列
- 项目名称列
- 任务列
- 工时列
- 状态列（使用 `StatusBadge` 组件）
- 操作列（删除按钮、状态切换按钮）

#### Scenario: 列表渲染工时记录
- **WHEN** 工时数据数组非空
- **THEN** 系统渲染表格，每行显示一条工时记录的各字段

#### Scenario: 空状态提示
- **WHEN** 工时数据数组为空
- **THEN** 系统显示"暂无工时记录，请填报"的条件渲染提示

### Requirement: 状态标签组件
系统 SHALL 提供一个 `StatusBadge` 组件，根据工时状态显示不同的视觉标签：
- `pending`：显示"待提交"（橙色）
- `submitted`：显示"已提交"（蓝色）
- `approved`：显示"已审批"（绿色）

#### Scenario: 不同状态显示不同标签
- **WHEN** StatusBadge 组件接收不同的 status prop
- **THEN** 系统根据 status 值显示对应的文字和颜色

### Requirement: 工时统计面板
系统 SHALL 提供一个 `TimesheetStats` 组件，展示工时统计信息：
- 总工时数
- 待提交数量
- 已提交数量
- 已审批数量

#### Scenario: 统计信息实时更新
- **WHEN** 工时数据发生变更（新增、删除、状态切换）
- **THEN** 统计面板自动重新计算并显示最新数据

### Requirement: 工时数据上下文管理
系统 SHALL 使用 `useContext` 创建一个 `TimesheetContext`，在组件树中共享工时数据和操作函数：
- `records`: 工时记录数组
- `addRecord`: 添加工时记录的函数
- `deleteRecord`: 删除工时记录的函数
- `toggleStatus`: 切换工时记录状态的函数

#### Scenario: 子组件通过 Context 访问数据
- **WHEN** TimesheetForm、TimesheetList、TimesheetStats 作为 TimesheetContext.Provider 的子组件
- **THEN** 所有子组件可以通过 `useContext(TimesheetContext)` 访问数据和操作函数

### Requirement: 页面生命周期管理
系统 SHALL 在 `TimesheetPage` 组件中使用 `useEffect` 实现以下生命周期行为：
- 组件挂载时初始化示例数据
- 组件卸载时清理副作用

#### Scenario: 页面加载初始化示例数据
- **WHEN** TimesheetPage 组件首次挂载
- **THEN** 系统使用 useEffect 初始化 3 条示例工时记录

### Requirement: 状态切换功能
系统 SHALL 允许用户点击操作列中的状态切换按钮，按 `pending → submitted → approved → pending` 的顺序循环切换工时记录状态。

#### Scenario: 循环切换状态
- **WHEN** 用户点击某条记录的"切换状态"按钮
- **THEN** 该记录的状态按顺序循环切换，并更新列表和统计面板

### Requirement: 删除功能
系统 SHALL 允许用户点击操作列中的删除按钮，移除对应的工时记录。

#### Scenario: 删除工时记录
- **WHEN** 用户点击某条记录的"删除"按钮
- **THEN** 该记录从列表中移除，统计面板自动更新