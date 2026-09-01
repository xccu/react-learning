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

#### Scenario: 列表页提供导入导出操作
- **WHEN** 用户访问工时列表页面
- **THEN** 页面在查询表单与列表之间的操作栏区域提供「导入」和「导出」按钮，与统计信息同行显示

#### Scenario: 导入导出按钮布局
- **WHEN** 列表页渲染操作栏
- **THEN** 左侧显示统计信息（总工时），右侧显示「导入」和「导出」两个操作按钮，按钮与统计信息保持同一水平线

#### Scenario: 点击导出按钮
- **WHEN** 用户点击「导出」按钮
- **THEN** 系统将当前列表中可见的工时数据导出为 Excel 文件

#### Scenario: 点击导入按钮
- **WHEN** 用户点击「导入」按钮
- **THEN** 系统打开文件选择对话框，允许用户选择 Excel 文件进行导入

#### Scenario: 列表分页显示
- **WHEN** 工时记录数量超过每页显示条数（10 条）
- **THEN** 列表仅显示当前页的数据，底部显示分页控件

#### Scenario: 分页控件显示
- **WHEN** 列表数据需要分页
- **THEN** 列表底部显示「上一页」按钮、当前页码/总页数、下一页」按钮

#### Scenario: 点击上一页
- **WHEN** 用户点击「上一页」按钮，且当前不是第一页
- **THEN** 列表显示上一页的数据，页码减 1

#### Scenario: 点击下一页
- **WHEN** 用户点击「下一页」按钮，且当前不是最后一页
- **THEN** 列表显示下一页的数据，页码加 1

#### Scenario: 首页禁用上一页
- **WHEN** 当前页码为第 1 页
- **THEN** 「上一页」按钮显示为禁用状态

#### Scenario: 末页禁用下一页
- **WHEN** 当前页码为最后一页
- **THEN** 「下一页」按钮显示为禁用状态

#### Scenario: 查询条件变化重置页码
- **WHEN** 用户提交新的查询条件
- **THEN** 页码重置为第 1 页

### Requirement: 用户能够删除工时记录
系统 SHALL 允许用户删除任意一条工时记录，删除前须二次确认。

#### Scenario: 删除工时记录
- **WHEN** 用户点击某条记录的"删除"按钮
- **THEN** 系统提示确认删除，用户确认后该记录从列表中移除

#### Scenario: 取消删除不生效
- **WHEN** 用户在删除确认提示中点击取消
- **THEN** 记录保持不变，不执行删除

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

### Requirement: 用户能够提交工时记录审批
系统必须允许用户将工时记录提交审批，提交后记录状态变为"待审批"。

#### Scenario: 提交审批
- **WHEN** 用户点击某条工时记录的"提交"按钮
- **THEN** 系统将该记录状态更新为"待审批"，并在列表和详情页同步显示

#### Scenario: 已通过记录不可提交
- **WHEN** 用户查看一条"已通过"状态的工时记录
- **THEN** 不显示"提交"按钮

#### Scenario: 已驳回记录不可提交
- **WHEN** 用户查看一条"已驳回"状态的工时记录
- **THEN** 不显示"提交"按钮，而是显示"重填"入口

### Requirement: 用户能够审批通过工时记录
系统必须允许审批人对"待审批"状态的记录执行审批通过操作。

#### Scenario: 审批通过
- **WHEN** 用户点击"待审批"记录的"通过"按钮
- **THEN** 系统将该记录状态更新为"已通过"，并在列表和详情页同步显示

#### Scenario: 审批通过确认
- **WHEN** 用户点击"通过"按钮
- **THEN** 系统弹出 Popconfirm 确认气泡，用户确认后才执行通过操作

#### Scenario: 取消审批通过
- **WHEN** 用户在确认气泡中点击"取消"
- **THEN** 记录状态保持不变，不执行通过操作

### Requirement: 用户能够驳回工时记录
系统必须允许审批人对"待审批"状态的记录执行驳回操作，并记录驳回原因。

#### Scenario: 驳回操作弹出原因输入
- **WHEN** 用户点击"待审批"记录的"驳回"按钮
- **THEN** 系统弹出 Modal，要求用户输入驳回原因

#### Scenario: 驳回原因必填
- **WHEN** 用户在 Modal 中未输入驳回原因点击确定
- **THEN** 系统提示"请输入驳回原因"，不执行驳回操作

#### Scenario: 驳回成功
- **WHEN** 用户在 Modal 中输入驳回原因并点击确定
- **THEN** 系统将该记录状态更新为"已驳回"，记录驳回原因，并在列表和详情页同步显示

#### Scenario: 取消驳回
- **WHEN** 用户在 Modal 中点击取消
- **THEN** 不执行驳回操作，Modal 关闭

### Requirement: 已驳回记录支持重填
系统必须允许用户重新编辑已驳回的工时记录，编辑后再次提交审批。

#### Scenario: 已驳回记录显示重填入口
- **WHEN** 用户查看一条"已驳回"状态的工时记录
- **THEN** 详情页显示"重填"按钮

#### Scenario: 重填跳转到编辑页
- **WHEN** 用户点击"重填"按钮
- **THEN** 系统导航到该记录的编辑页，并预填现有数据

#### Scenario: 编辑后再次提交变为待审批
- **WHEN** 用户在编辑页修改数据并提交
- **THEN** 系统更新记录内容，并将状态改为"待审批"

### Requirement: 按状态控制操作按钮显示
系统必须依据工时记录的审批状态，在列表和详情页显示不同的操作按钮。

#### Scenario: 待审批状态显示操作按钮
- **WHEN** 工时记录状态为"待审批"
- **THEN** 列表操作列显示「通过」「驳回」按钮，详情页显示审批操作入口

#### Scenario: 已通过状态不显示审批按钮
- **WHEN** 工时记录状态为"已通过"
- **THEN** 列表和详情页不显示任何审批操作按钮

#### Scenario: 已驳回状态显示驳回原因
- **WHEN** 工时记录状态为"已驳回"
- **THEN** 详情页显示驳回原因文本，并显示"重填"按钮

### Requirement: 编辑表单中审批状态不可修改
系统必须在编辑表单中，使审批状态字段不可修改，显示当前审批状态值。

#### Scenario: 编辑模式下审批状态只读
- **WHEN** 用户在编辑页打开表单
- **THEN** 审批状态字段显示当前记录的状态值，不可点击修改

#### Scenario: 新建模式下审批状态可编辑
- **WHEN** 用户在新增页打开表单
- **THEN** 审批状态字段可选择，默认值为"待审批"

#### Scenario: 禁用状态下样式不变
- **WHEN** 编辑模式下审批状态字段处于禁用状态
- **THEN** 显示效果与可编辑状态完全一致（颜色、圆点、背景不变）

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

### Requirement: 工时数据持久化
系统必须将工时数据保存到 localStorage，页面刷新后数据不丢失。

#### Scenario: 数据自动保存
- **WHEN** 用户创建或删除工时记录，或执行审批操作
- **THEN** 数据自动保存到 localStorage

#### Scenario: 页面刷新恢复数据
- **WHEN** 用户刷新页面
- **THEN** 从 localStorage 恢复工时记录并显示，包括审批状态

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

### Requirement: 侧边栏包含用户管理导航项
系统必须在左侧导航栏中提供"用户管理"导航链接。

#### Scenario: 导航项可点击
- **WHEN** 用户在侧边栏看到"用户管理"链接
- **THEN** 点击链接后右侧内容区切换到用户管理页面

#### Scenario: 导航高亮
- **WHEN** 用户当前在用户管理页面
- **THEN** 侧边栏"用户管理"菜单项处于选中高亮状态