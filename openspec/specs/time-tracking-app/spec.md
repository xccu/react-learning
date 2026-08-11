## Purpose

TBD

## Requirements

### Requirement: 用户能够创建工时记录
系统必须允许用户通过表单创建工时记录，包含项目名称、工作内容和工时数。

#### Scenario: 成功创建工时记录
- **WHEN** 用户填写项目名称、工作内容和工时数后点击"提交"按钮
- **THEN** 系统创建一条新的工时记录并显示在列表中

#### Scenario: 表单字段为空时阻止提交
- **WHEN** 用户未填写必填字段点击"提交"按钮
- **THEN** 系统不创建记录并提示用户填写完整信息

### Requirement: 用户能够查看工时记录列表
系统必须显示所有工时记录的列表，每条记录展示项目名称、工作内容、工时数和创建时间。

#### Scenario: 显示工时记录列表
- **WHEN** 系统加载或有新的工时记录
- **THEN** 列表渲染所有记录，按创建时间倒序排列

#### Scenario: 空状态显示
- **WHEN** 没有任何工时记录
- **THEN** 显示"暂无工时记录"的提示信息

### Requirement: 用户能够删除工时记录
系统必须允许用户删除任意一条工时记录。

#### Scenario: 删除工时记录
- **WHEN** 用户点击某条记录的"删除"按钮
- **THEN** 该记录从列表中移除

### Requirement: 工时数据持久化
系统必须将工时数据保存到 localStorage，页面刷新后数据不丢失。

#### Scenario: 数据自动保存
- **WHEN** 用户创建或删除工时记录
- **THEN** 数据自动保存到 localStorage

#### Scenario: 页面刷新恢复数据
- **WHEN** 用户刷新页面
- **THEN** 从 localStorage 恢复工时记录并显示

### Requirement: 显示工时统计
系统必须显示总工时统计信息。

#### Scenario: 显示总工时
- **WHEN** 工时记录列表发生变化
- **THEN** 显示所有记录的总工时数

### Requirement: 使用 Context 管理全局状态
系统必须使用 React Context 管理工时数据的全局状态。

#### Scenario: Context 提供数据
- **WHEN** 应用启动
- **THEN** TimeEntryContext 提供工时数据和相关操作方法

#### Scenario: 子组件消费数据
- **WHEN** 表单或列表组件需要工时数据
- **THEN** 通过 useContext 消费 Context 中的数据

### Requirement: 使用 useRef 聚焦输入框
系统必须使用 useRef 在表单提交后自动聚焦到项目名称输入框。

#### Scenario: 提交后聚焦
- **WHEN** 用户成功提交表单
- **THEN** 项目名称输入框自动获得焦点

### Requirement: 使用 useEffect 同步数据
系统必须使用 useEffect 在数据变化时同步到 localStorage。

#### Scenario: 数据变化时持久化
- **WHEN** 工时记录数组发生变化
- **THEN** 自动将最新数据写入 localStorage

### Requirement: 使用 Props 传递数据
系统必须使用 Props 在父组件和子组件之间传递数据。

#### Scenario: 父组件传递数据
- **WHEN** 父组件渲染子组件
- **THEN** 通过 Props 将工时记录或回调函数传递给子组件

### Requirement: 使用条件渲染
系统必须使用条件渲染显示不同的 UI 状态。

#### Scenario: 根据数据状态显示不同内容
- **WHEN** 工时记录列表为空
- **THEN** 显示空状态提示；当有记录时显示列表

### Requirement: 使用列表渲染
系统必须使用列表渲染展示工时记录。

#### Scenario: 渲染记录列表
- **WHEN** 工时记录数组不为空
- **THEN** 遍历数组渲染每条记录，每条记录使用唯一 key

### Requirement: App 页面布局包含左侧导航栏和右侧内容区
系统必须将 App.tsx 页面布局改造为左侧深色导航栏 + 右侧内容区的结构。

#### Scenario: 左侧深色导航栏
- **WHEN** 应用加载
- **THEN** 页面左侧显示深色背景的导航栏，包含应用图标和标题

#### Scenario: 右侧内容区展示页面内容
- **WHEN** 导航栏中点击 Timesheet 链接
- **THEN** 右侧内容区展示工时填报页面（包含表单、列表和统计）

### Requirement: Header 显示当前页面名称
系统必须在页面顶部 Header 区域显示应用图标和当前页面名称，Header 组件通过 `title` 属性接收标题文本。

#### Scenario: Header 展示页面标题
- **WHEN** 应用加载
- **THEN** 页面顶部 Header 显示 React 图标和传入的页面标题

#### Scenario: 工时填报页使用 Header
- **WHEN** 用户访问工时填报页面
- **THEN** 页面顶部 Header 标题显示"工时填报"

#### Scenario: 工时列表页使用 Header
- **WHEN** 用户访问工时列表页面
- **THEN** 页面顶部 Header 标题显示"工时列表"

### Requirement: 导航栏包含 Timesheet 链接
系统必须在左侧导航栏中提供 Timesheet 导航链接。

#### Scenario: 导航链接可点击
- **WHEN** 用户在导航栏看到 Timesheet 链接
- **THEN** 点击链接后右侧内容区切换到工时填报页面

### Requirement: 使用模拟 API 进行数据操作
系统必须使用模拟 API（mock API）层处理工时记录的增删改查操作。

#### Scenario: 模拟 API 返回成功数据
- **WHEN** mock API 操作成功
- **THEN** 返回包含操作结果的 Promise 对象

#### Scenario: 模拟 API 处理错误
- **WHEN** mock API 操作失败
- **THEN** 返回错误信息供组件捕获处理

### Requirement: 用户能够编辑工时记录
系统必须允许用户编辑已有的工时记录。

#### Scenario: 进入编辑模式
- **WHEN** 用户点击某条记录的"编辑"按钮
- **THEN** 表单填充该记录的现有数据并进入编辑状态

#### Scenario: 保存编辑后的记录
- **WHEN** 用户修改表单数据后点击"提交"按钮
- **THEN** 系统更新对应的工时记录并刷新列表

### Requirement: 列表项提供详情跳转入口
`TimeEntryItem` SHALL 在「编辑」「删除」操作旁提供「详情」跳转入口，用于导航到该条记录的详情页。

#### Scenario: 点击详情入口跳转详情页
- **WHEN** 用户点击某条记录列表项上的「详情」按钮
- **THEN** 系统导航到该记录的详情页，并携带该记录标识

### Requirement: 路由化列表页中编辑跳转编辑页
在路由化的列表页中，「编辑」按钮 SHALL 导航到对应记录的编辑页，而非进行页面内联编辑。

#### Scenario: 路由化列表页点击编辑
- **WHEN** 用户在路由化的列表页点击某条记录的「编辑」按钮
- **THEN** 系统导航到该记录的编辑页

### Requirement: 原有内联编辑行为保持
`TimeEntryItem` / `TimeEntryList` SHALL 通过可选回调提供详情与编辑跳转能力；当回调未提供时，列表项 SHALL 保持原有行为（页面内联编辑、无详情入口），确保原 `TimeSheetPage` 功能不变。

#### Scenario: 未提供跳转回调时保持原行为
- **WHEN** 原 `TimeSheetPage` 渲染列表且未提供跳转回调
- **THEN** 列表项仍支持原有内联编辑与删除，功能与改造前一致

#### Scenario: 提供跳转回调时启用导航
- **WHEN** 路由化列表页渲染列表且提供跳转回调
- **THEN** 列表项显示「详情」按钮，编辑点击导航至编辑页

### Requirement: 列表支持按条件过滤展示
工时记录列表 SHALL 支持按查询条件（项目名称、工作内容、审批状态）过滤展示；无查询条件时显示全部记录。

#### Scenario: 有查询条件时显示过滤结果
- **WHEN** 用户在列表页提交非空查询条件
- **THEN** 列表仅显示满足条件的记录

#### Scenario: 无查询条件时显示全部
- **WHEN** 查询条件为空
- **THEN** 列表显示全部记录

### Requirement: 详情页只读展示，不使用输入框样式
工时记录详情页 SHALL 以只读文本形式展示字段（标签 + 文本值），不使用文本输入框样式；仅保留「编辑」「返回列表」操作。

#### Scenario: 详情页字段为纯文本展示
- **WHEN** 用户打开某条记录的详情页
- **THEN** 各字段以「标签 + 纯文本」形式展示，无输入框边框/背景样式，也不可编辑

#### Scenario: 详情页仅保留操作按钮
- **WHEN** 详情页渲染完成
- **THEN** 页面只展示「编辑」和「返回列表」按钮，不展示任何可输入的控件