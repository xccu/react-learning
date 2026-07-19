## 1. 项目初始化

- [x] 1.1 创建 React 项目基础结构（package.json、vite.config.js 等）
- [x] 1.2 创建项目目录结构（src/components、src/context、src/styles、src/utils）
- [x] 1.3 安装项目依赖（react、react-dom）
- [x] 1.4 配置 Vite 构建工具和开发服务器

## 2. 全局状态管理（Context + useReducer）

- [x] 2.1 创建 TimesheetContext 上下文
- [x] 2.2 定义 useReducer 状态管理逻辑（ADD、UPDATE、DELETE、SET_TIMESHEETS、SET_FILTERS 等 action）
- [x] 2.3 创建 TimesheetProvider 组件，封装 Context.Provider
- [x] 2.4 创建 ThemeContext 上下文，管理亮色/暗色主题
- [x] 2.5 创建 ThemeProvider 组件，封装主题切换逻辑
- [x] 2.6 在 App 组件中嵌套 Provider 组件

## 3. 工时数据模型与工具函数

- [x] 3.1 定义工时条目 TypeScript/JavaScript 类型定义
- [x] 3.2 创建工具函数：生成唯一 id（generateId）
- [x] 3.3 创建工具函数：格式化日期（formatDate）
- [x] 3.4 创建工具函数：验证工时数据（validateTimesheet）
- [x] 3.5 创建工具函数：计算工时统计（calculateSummary）

## 4. 工时录入表单组件（useState + useRef + 事件处理）

- [x] 4.1 创建 TimesheetForm 函数组件
- [x] 4.2 使用 useState 管理表单状态（date、project、taskType、description、hours）
- [x] 4.3 使用 useRef 管理表单输入框的 DOM 引用
- [x] 4.4 实现 onChange 事件处理函数，实时更新表单状态
- [x] 4.5 实现 onSubmit 事件处理函数，触发表单提交
- [x] 4.6 实现表单验证逻辑，显示错误提示
- [x] 4.7 实现编辑模式支持，通过 Props 接收编辑数据
- [x] 4.8 实现取消编辑功能

## 5. 工时列表组件（列表渲染 + Props）

- [x] 5.1 创建 TimesheetList 函数组件
- [x] 5.2 使用 map 方法遍历工时数据并渲染列表
- [x] 5.3 创建 TimesheetItem 函数组件，展示单个工时条目
- [x] 5.4 通过 Props 传递工时数据和操作回调函数
- [x] 5.5 实现编辑按钮点击事件，触发编辑模式
- [x] 5.6 实现删除按钮点击事件，触发删除确认
- [x] 5.7 实现空状态条件渲染，显示"暂无数据"提示

## 6. 筛选组件（条件渲染 + useState）

- [x] 6.1 创建 TimesheetFilters 函数组件
- [x] 6.2 使用 useState 管理筛选状态（dateRange、project、taskType）
- [x] 6.3 实现日期范围筛选输入
- [x] 6.4 实现项目名称下拉筛选
- [x] 6.5 实现任务类型下拉筛选
- [x] 6.6 实现组合筛选逻辑
- [x] 6.7 实现重置筛选按钮
- [x] 6.8 实现筛选结果计数显示

## 7. 统计汇总组件（useEffect + 列表渲染）

- [x] 7.1 创建 TimesheetSummary 函数组件
- [x] 7.2 使用 useEffect 计算每日工时统计
- [x] 7.3 使用 useEffect 计算每周工时统计
- [x] 7.4 使用 useEffect 计算按项目分类统计
- [x] 7.5 使用 useEffect 计算按任务类型分类统计
- [x] 7.6 实现 CSS 样式条形图展示数据
- [x] 7.7 实现无数据时的条件渲染提示

## 8. 数据持久化（useEffect + localStorage）

- [x] 8.1 在 TimesheetProvider 中使用 useEffect 监听工时数据变化
- [x] 8.2 实现状态变化时自动保存到 localStorage
- [x] 8.3 在应用初始化时从 localStorage 加载数据
- [x] 8.4 实现数据导出功能（JSON 格式）

## 9. 根组件与路由（条件渲染）

- [x] 9.1 创建 App 根组件
- [x] 9.2 使用 useState 管理当前视图状态（表单/列表/统计）
- [x] 9.3 使用条件渲染切换不同视图
- [x] 9.4 集成 TimesheetProvider 和 ThemeProvider
- [x] 9.5 创建导航栏组件

## 10. 样式与优化

- [x] 10.1 创建全局样式文件（CSS Modules）
- [x] 10.2 实现表单组件样式
- [x] 10.3 实现列表组件样式
- [x] 10.4 实现筛选组件样式
- [x] 10.5 实现统计组件样式
- [x] 10.6 实现主题切换样式（亮色/暗色）
- [x] 10.7 使用 React.memo 优化组件渲染性能
- [x] 10.8 响应式布局适配

## 11. 测试与验收

- [x] 11.1 验证工时条目 CRUD 功能
- [x] 11.2 验证表单验证逻辑
- [x] 11.3 验证筛选功能（日期、项目、类型、组合）
- [x] 11.4 验证统计汇总功能
- [x] 11.5 验证数据持久化（刷新页面数据保留）
- [x] 11.6 验证主题切换功能
- [x] 11.7 验证所有 Hooks 正确使用（useState、useEffect、useContext、useRef）