## ADDED Requirements

### Requirement: 示例页面提供侧边栏导航
系统 SHALL 提供一个侧边栏导航组件，列出 React 文档学习章节的所有示例入口。

#### Scenario: 侧边栏显示所有章节链接
- **WHEN** 用户访问示例页面
- **THEN** 侧边栏显示所有章节标题（组件、JSX、样式、数据、条件渲染、列表渲染、事件响应、State、Hook、数据共享）

#### Scenario: 点击导航切换章节
- **WHEN** 用户点击侧边栏中的某个章节链接
- **THEN** 主内容区切换到对应章节的示例内容，URL 路径同步更新

### Requirement: 组件创建与嵌套示例
系统 SHALL 提供展示 React 组件创建和嵌套的示例代码，包含 `MyApp` 和 `MyButton` 两个组件。

#### Scenario: 示例展示组件嵌套
- **WHEN** 用户查看"组件创建与嵌套"章节
- **THEN** 页面渲染出"欢迎来到我的应用"标题和"我是一个按钮"按钮

#### Scenario: 示例代码可复制
- **WHEN** 用户查看示例代码区域
- **THEN** 代码以高亮格式展示，包含 `MyButton` 和 `MyApp` 的完整定义

### Requirement: JSX 语法示例
系统 SHALL 提供展示 JSX 基本语法的示例，包括标签闭合和 Fragment 的使用。

#### Scenario: 示例展示 Fragment 用法
- **WHEN** 用户查看"JSX 语法"章节
- **THEN** 页面渲染出 `<h1>关于</h1>` 和包含 `<br />` 的段落

#### Scenario: 示例展示严格标签闭合
- **WHEN** 用户查看示例代码
- **THEN** 代码中包含自闭合标签 `<br />` 的用法

### Requirement: 样式添加示例
系统 SHALL 提供展示 `className` 和 `style` 属性的示例。

#### Scenario: 示例展示 className 样式
- **WHEN** 用户查看"添加样式"章节
- **THEN** 页面渲染带有 `avatar` class 的图片，应用圆形边框样式

#### Scenario: 示例展示内联样式
- **WHEN** 用户查看"添加样式"章节
- **THEN** 代码中包含 `style={{ width: user.imageSize, height: user.imageSize }}` 的内联样式用法

### Requirement: 数据显示示例
系统 SHALL 提供展示如何在 JSX 中嵌入变量和表达式的示例。

#### Scenario: 示例展示变量嵌入
- **WHEN** 用户查看"显示数据"章节
- **THEN** 页面渲染出 `{user.name}` 的值（如 "Hedy Lamarr"）

#### Scenario: 示例展示表达式嵌入
- **WHEN** 用户查看"显示数据"章节
- **THEN** 代码中包含字符串拼接表达式 `'Photo of ' + user.name`

### Requirement: 条件渲染示例
系统 SHALL 提供展示三种条件渲染方式的示例：if/else、三元运算符、逻辑与。

#### Scenario: 示例展示 if/else 条件渲染
- **WHEN** 用户查看"条件渲染"章节
- **THEN** 页面展示基于 `isLoggedIn` 状态切换不同组件的代码

#### Scenario: 示例展示三元运算符
- **WHEN** 用户查看"条件渲染"章节
- **THEN** 页面展示 `{isLoggedIn ? <AdminPanel /> : <LoginForm />}` 的三元运算符用法

#### Scenario: 示例展示逻辑与运算符
- **WHEN** 用户查看"条件渲染"章节
- **THEN** 页面展示 `{isLoggedIn && <AdminPanel />}` 的逻辑与用法

### Requirement: 列表渲染示例
系统 SHALL 提供展示使用 `map()` 和 `key` 属性渲染列表的示例。

#### Scenario: 示例展示产品列表
- **WHEN** 用户查看"渲染列表"章节
- **THEN** 页面渲染出卷心菜、大蒜、苹果三个列表项

#### Scenario: 示例展示 key 属性
- **WHEN** 用户查看"渲染列表"章节
- **THEN** 代码中每个 `<li>` 元素都包含 `key={product.id}` 属性

#### Scenario: 示例展示条件样式
- **WHEN** 用户查看"渲染列表"章节
- **THEN** 水果类列表项显示为品红色，其他显示为深绿色

### Requirement: 事件响应示例
系统 SHALL 提供展示事件处理函数和 `onClick` 事件的示例。

#### Scenario: 示例展示按钮点击事件
- **WHEN** 用户查看"响应事件"章节
- **THEN** 页面展示 `onClick={handleClick}` 的事件绑定方式

#### Scenario: 示例展示事件处理函数
- **WHEN** 用户查看"响应事件"章节
- **THEN** 代码中包含 `function handleClick() { alert('You clicked me!'); }` 的定义

### Requirement: State 管理示例
系统 SHALL 提供展示 `useState` Hook 的示例，包含计数器功能。

#### Scenario: 示例展示单个计数器
- **WHEN** 用户查看"更新界面"章节
- **THEN** 页面展示一个按钮，点击后显示 "Clicked {count} times"

#### Scenario: 示例展示多个独立计数器
- **WHEN** 用户查看"更新界面"章节
- **THEN** 页面渲染两个独立的 MyButton 组件，每个按钮维护自己的 count 状态

### Requirement: Hook 使用规范示例
系统 SHALL 提供展示 Hook 使用规则的示例，强调 Hook 必须在组件顶层调用。

#### Scenario: 示例展示 Hook 顶层调用
- **WHEN** 用户查看"使用 Hook"章节
- **THEN** 代码展示 `useState` 在组件函数顶层直接调用，不在条件或循环中

### Requirement: 组件间数据共享示例
系统 SHALL 提供展示状态提升（lifting state up）的示例，包含父组件共享 state 给子组件。

#### Scenario: 示例展示状态提升前
- **WHEN** 用户查看"组件间共享数据"章节
- **THEN** 页面展示两个 MyButton 各自独立维护 count 状态的代码

#### Scenario: 示例展示状态提升后
- **WHEN** 用户查看"组件间共享数据"章节
- **THEN** 页面展示 count state 提升到 MyApp，通过 props 传递给 MyButton 的代码

#### Scenario: 示例展示 props 传递
- **WHEN** 用户查看"组件间共享数据"章节
- **THEN** 点击任一 MyButton 时，两个按钮的 count 同时更新

### Requirement: 示例页面整体布局
系统 SHALL 提供一个包含侧边栏和主内容区的布局组件。

#### Scenario: 布局响应式适配
- **WHEN** 用户在不同宽度视口查看页面
- **THEN** 侧边栏和主内容区正确排列，主内容区占据剩余空间

#### Scenario: 当前章节高亮
- **WHEN** 用户在某个章节页面
- **THEN** 侧边栏中对应章节链接处于高亮选中状态