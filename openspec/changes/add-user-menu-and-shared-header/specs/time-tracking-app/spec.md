## MODIFIED Requirements

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
