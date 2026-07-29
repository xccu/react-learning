## 1. 项目初始化

- [x] 1.1 使用 Vite 创建 React 项目（如果尚未创建）
- [x] 1.2 安装必要依赖（仅 React，不引入额外 UI 库）
- [x] 1.3 创建项目目录结构（src/components、src/context、src/api）

## 2. 创建模拟 API 层

- [x] 2.1 创建 src/api/mockApi.ts，定义工时记录的数据类型接口（id、projectName、description、hours、createdAt）
- [x] 2.2 在内存中初始化模拟数据数组（包含 3 条示例记录）
- [x] 2.3 实现 getEntries 函数：返回所有工时记录
- [x] 2.4 实现 addEntry 函数：添加新记录并返回
- [x] 2.5 实现 updateEntry 函数：更新指定 ID 的记录并返回
- [x] 2.6 实现 deleteEntry 函数：删除指定 ID 的记录并返回
- [x] 2.7 所有 API 函数返回 Promise，使用 async/await 处理结果

## 3. 创建 Context 全局状态

- [x] 3.1 创建 TimeEntryContext，定义初始状态和上下文结构
- [x] 3.2 实现 useTimeEntries 自定义 Hook，封装 useState、useEffect 和 mock API 调用
- [x] 3.3 在 useEffect 中组件挂载时调用 getEntries 获取初始数据
- [x] 3.4 在 Context 中提供 addEntry、updateEntry、deleteEntry 方法
- [x] 3.5 在 App 组件中用 TimeEntryProvider 包裹整个应用

## 4. 创建工时表单组件

- [x] 4.1 创建 TimeEntryForm 函数组件，接收 onSubmit 和 initialData 作为 Props
- [x] 4.2 使用 useState 管理表单输入状态（项目名称、工作内容、工时数）
- [x] 4.3 实现表单验证：必填字段检查
- [x] 4.4 实现事件处理：输入框 onChange、提交按钮 onClick
- [x] 4.5 使用 useRef 创建项目名称输入框的引用
- [x] 4.6 表单提交成功后用 ref.current.focus() 聚焦输入框
- [x] 4.7 支持编辑模式：当传入 initialData 时预填充表单

## 5. 创建工时列表组件

- [x] 5.1 创建 TimeEntryList 函数组件，接收 entries 作为 Props
- [x] 5.2 使用条件渲染：无记录时显示"暂无工时记录"
- [x] 5.3 使用列表渲染：遍历 entries 数组，用 map 渲染每条记录
- [x] 5.4 为每条记录设置唯一的 key（使用 id 字段）

## 6. 创建工时单项组件

- [x] 6.1 创建 TimeEntryItem 函数组件，接收单条记录和 onDelete、onEdit 回调作为 Props
- [x] 6.2 显示项目名称、工作内容、工时数、创建时间
- [x] 6.3 实现删除按钮，点击调用 onDelete 回调
- [x] 6.4 实现编辑按钮，点击调用 onEdit 回调并传入当前记录数据

## 7. 创建统计组件

- [x] 7.1 创建 Stats 函数组件，接收总工时数作为 Props
- [x] 7.2 使用条件渲染显示总工时统计

## 8. 创建布局组件

- [x] 8.1 创建 AppLayout 函数组件，实现左右布局结构
- [x] 8.2 左侧导航栏使用深色背景（如 #1a1a2e），固定宽度 240px
- [x] 8.3 右侧内容区使用 flex: 1 自适应剩余空间
- [x] 8.4 使用 useState 管理当前激活的导航项（默认 Timesheet）
- [x] 8.5 导航栏点击事件切换 activeNav 状态
- [x] 8.6 使用条件渲染：根据 activeNav 显示对应的右侧页面

## 9. 创建 Header 组件

- [x] 9.1 创建 Header 函数组件
- [x] 9.2 在 Header 中显示 React 图标（使用 SVG 或 emoji）和"React Learning App"标题
- [x] 9.3 将 Header 放在页面顶部，横跨整个宽度
- [x] 9.4 添加基础样式：深色背景、白色文字、居中对齐

## 10. 组装 App 组件

- [x] 10.1 在 App.tsx 中组合 Header、AppLayout 组件
- [x] 10.2 在 AppLayout 的右侧内容区渲染 TimeEntryForm、TimeEntryList、Stats 组件
- [x] 10.3 传递 Props 连接各组件
- [x] 10.4 添加全局基础样式（reset CSS 或简单全局样式）

## 11. 测试与验证

- [x] 11.1 验证表单创建、编辑、删除功能正常
- [x] 11.2 验证 mock API 调用正常
- [x] 11.3 验证空状态和列表渲染正确
- [x] 11.4 验证统计数字计算正确
- [x] 11.5 验证左侧深色导航栏样式正确
- [x] 11.6 验证 Header 图标和标题显示正常
- [x] 11.7 验证导航链接点击后右侧内容切换正确
- [x] 11.8 验证代码中包含所有要求的 React 概念（JSX、Hooks、Props 等）