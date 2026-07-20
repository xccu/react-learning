## 1. 类型定义与上下文

- [x] 1.1 创建 `react-app/src/timesheet/types.ts`，定义 `TimesheetItem`、`TimesheetFormData`、`TimesheetStatus` 类型
- [x] 1.2 创建 `react-app/src/timesheet/TimesheetContext.tsx`，使用 `createContext` 创建 `TimesheetContext`，导出 `TimesheetProvider` 组件和 `useTimesheet` 自定义 Hook

## 2. 子组件开发

- [x] 2.1 创建 `react-app/src/timesheet/components/StatusBadge.tsx`，实现状态标签组件，根据 `pending`/`submitted`/`approved` 显示不同颜色和文字
- [x] 2.2 创建 `react-app/src/timesheet/components/TimesheetForm.tsx`，实现工时填报表单，使用 `useState` 管理表单状态，使用 `useRef` 聚焦输入框，通过 `useContext` 调用 `addRecord`
- [x] 2.3 创建 `react-app/src/timesheet/components/TimesheetList.tsx`，实现工时记录列表，使用列表渲染展示所有记录，使用条件渲染处理空状态，通过 `useContext` 调用 `deleteRecord` 和 `toggleStatus`
- [x] 2.4 创建 `react-app/src/timesheet/components/TimesheetStats.tsx`，实现统计面板，展示总工时和各状态数量

## 3. 主页面与路由集成

- [x] 3.1 创建 `react-app/src/timesheet/TimesheetPage.tsx`，作为页面入口，使用 `TimesheetProvider` 包裹子组件，使用 `useEffect` 初始化示例数据
- [x] 3.2 修改 `react-app/src/App.tsx`，导入 `TimesheetPage` 组件，在 `Routes` 中添加 `/timesheet` 路由
- [x] 3.3 在导航或首页添加"工时填报"入口链接

## 4. 验证与调整

- [x] 4.1 运行 `npm run dev` 启动开发服务器，验证页面可正常访问
- [x] 4.2 验证表单提交功能：填写必填字段后提交，记录出现在列表中
- [x] 4.3 验证表单验证：不填必填字段或工时超出范围时显示错误提示
- [x] 4.4 验证删除功能：点击删除按钮移除记录，列表和统计面板同步更新
- [x] 4.5 验证状态切换：点击切换按钮，状态按 pending → submitted → approved → pending 循环
- [x] 4.6 验证统计面板：数据变更后统计数字实时更新
- [x] 4.7 运行 `npm run lint` 和 `npm run typecheck` 确保代码无错误