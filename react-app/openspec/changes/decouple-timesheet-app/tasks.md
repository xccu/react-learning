## 1. 创建页面目录结构

- [x] 1.1 创建 src/pages 目录
- [x] 1.2 在 src/pages 下创建 TimeSheetPage.tsx 文件

## 2. 提取 TimeSheetPage 组件

- [x] 2.1 从 App.tsx 中提取 TimeSheetPage 的完整逻辑（useState、事件处理、数据计算）
- [x] 2.2 在 TimeSheetPage.tsx 中保留 useState、useEffect、useContext、useRef 的使用
- [x] 2.3 确保 TimeSheetPage 正确消费 TimeEntryContext
- [x] 2.4 保持 TimeSheetPage 原有的 Header、TimeEntryForm、Stats、TimeEntryList 组件组合不变

## 3. 改造 App.tsx 为布局壳

- [x] 3.1 移除 App.tsx 中内联的 TimeSheetPage 组件定义和业务逻辑
- [x] 3.2 从 src/pages/TimeSheetPage 导入 TimeSheetPage 组件
- [x] 3.3 创建 navPages 配置对象：`{ timesheet: TimeSheetPage }`
- [x] 3.4 使用条件渲染渲染 navPages 中对应的页面组件：`{navPages[activeNav] && <Page />}`
- [x] 3.5 保持 TimeEntryProvider 包裹整个应用
- [x] 3.6 保持 AppLayout 和导航栏逻辑不变

## 4. 验证功能

- [x] 4.1 验证工时填报功能（创建、编辑、删除、统计）正常
- [x] 4.2 验证左侧导航点击后右侧内容正确切换
- [x] 4.3 验证所有 React 技术栈（Hooks、Props、条件/列表渲染）仍在使用
- [x] 4.4 验证 TypeScript 类型检查通过