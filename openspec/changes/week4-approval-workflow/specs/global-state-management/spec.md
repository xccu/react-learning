## ADDED Requirements

### Requirement: 系统使用 Redux 管理全局状态
系统必须使用 Redux Toolkit 作为全局状态管理方案，工时相关数据集中存放于唯一的 Store 中。

#### Scenario: Store 配置
- **WHEN** 应用启动
- **THEN** `src/store/index.ts` 通过 `configureStore` 创建全局 Store，注册 `timesheet` 状态模块

#### Scenario: 类型化 Hooks
- **WHEN** 组件需要读取或更新状态
- **THEN** 使用 `useSelector<RootState>` 读取状态，使用 `useDispatch<AppDispatch>` 派发 action

#### Scenario: 状态更新驱动 UI 刷新
- **WHEN** 通过 dispatch 更新状态
- **THEN** 所有订阅该状态片的组件自动重新渲染

### Requirement: 系统使用 Ant Design 组件库
系统必须使用 Ant Design 作为 UI 组件库，提供表格、表单、弹窗、状态标签、消息提示等组件。

#### Scenario: 全局中文配置
- **WHEN** 应用启动
- **THEN** `main.tsx` 中通过 `<ConfigProvider locale={zhCN}>` 配置中文语言包

#### Scenario: 表格组件替代自定义列表
- **WHEN** 列表页渲染工时记录
- **THEN** 使用 Ant Design Table 组件，配置 columns、dataSource、rowKey 和 pagination

#### Scenario: 状态标签使用 Tag 组件
- **WHEN** 展示审批状态
- **THEN** 使用 Ant Design Tag 组件，不同状态对应不同颜色

#### Scenario: 确认操作使用 Popconfirm
- **WHEN** 用户执行删除等危险操作
- **THEN** 使用 Ant Design Popconfirm 组件替代 window.confirm

#### Scenario: 操作反馈使用 message
- **WHEN** 用户执行新增、删除、审批等操作
- **THEN** 使用 Ant Design message 组件显示成功/失败提示

### Requirement: 列表页使用 Ant Design Table 渲染
系统必须将列表页的自定义 div 列表替换为 Ant Design Table 组件。

#### Scenario: Table 列配置
- **WHEN** 列表页渲染
- **THEN** Table 展示项目名称、工作内容、工时、审批状态（Tag）、创建时间、操作列

#### Scenario: Table 分页
- **WHEN** 工时记录数量超过每页条数
- **THEN** Table 自动分页，显示页码信息和翻页按钮

#### Scenario: Table 加载状态
- **WHEN** 数据加载中
- **THEN** Table 显示 loading 骨架屏

#### Scenario: Table rowKey
- **WHEN** Table 渲染数据行
- **THEN** 使用 `rowKey="id"` 指定唯一标识，避免 React 警告

## MODIFIED Requirements

### Requirement: 使用 Context 管理全局状态
系统必须使用 Redux Toolkit 管理工时数据的全局状态，替代原有的 React Context 方案。

#### Scenario: Redux 提供数据
- **WHEN** 应用启动
- **THEN** Store 通过 Provider 提供工时数据和相关操作方法

#### Scenario: 组件消费数据
- **WHEN** 表单或列表组件需要工时数据
- **THEN** 通过 useSelector 消费 Store 中的数据

#### Scenario: 组件更新数据
- **WHEN** 用户执行新增、编辑、删除、审批操作
- **THEN** 通过 useDispatch 派发 action，reducer 更新状态

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

### Requirement: 工时数据经统一请求层执行
系统 SHALL 将工时记录的增删改查经统一请求层执行，业务代码通过请求模块调用，而非直接调用内存 mockApi。

#### Scenario: 增删改查经请求层执行
- **WHEN** 业务代码进行增删改查操作
- **THEN** 操作经统一请求层执行并返回操作结果

#### Scenario: 请求层操作失败
- **WHEN** 请求层操作失败
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

### Requirement: 列表数据加载三态
工时列表页 SHALL 在数据加载期间展示加载中状态，加载失败时展示错误与重试入口，数据为空时展示空状态提示。

#### Scenario: 加载中显示
- **WHEN** 列表页发起数据加载且尚未完成
- **THEN** 页面展示加载中提示

#### Scenario: 加载失败显示错误
- **WHEN** 列表数据加载失败
- **THEN** 页面展示失败提示并提供重试入口

#### Scenario: 空数据显示空状态
- **WHEN** 列表数据为空
- **THEN** 页面展示「暂无工时记录」提示

### Requirement: 表单提交中禁用按钮
工时表单（新增/编辑）SHALL 在提交进行中禁用提交按钮，防止重复提交。

#### Scenario: 提交中禁用
- **WHEN** 用户提交表单且请求尚未完成
- **THEN** 提交按钮被禁用并显示提交中状态

### Requirement: 工时规则校验
工时表单 SHALL 校验工时为大于 0 且为 0.5 的倍数，不满足时提示错误且不提交。

#### Scenario: 工时非法时阻止提交
- **WHEN** 用户填写小于等于 0 或非 0.5 倍数的工时
- **THEN** 表单显示校验错误提示且不提交