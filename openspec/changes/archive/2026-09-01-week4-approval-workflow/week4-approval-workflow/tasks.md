## 1. 依赖安装

- [x] 1.1 在 react-app 中安装 Redux Toolkit 和 React Redux：`npm i @reduxjs/toolkit react-redux`
- [x] 1.2 在 react-app 中安装 Ant Design：`npm i antd`
- [x] 1.3 确认安装成功：检查 react-app/package.json 中出现对应依赖

## 2. Redux Store 搭建

- [x] 2.1 新建 `src/store/` 目录结构
- [x] 2.2 新建 `src/store/timesheetSlice.ts`，定义 TimeEntry 状态接口和初始状态
- [x] 2.3 使用 `createSlice` 定义同步 reducers：setEntries、addEntry、updateEntry、deleteEntry
- [x] 2.4 使用 `createSlice` 定义审批相关 reducers：approveEntry、rejectEntry
- [x] 2.5 导出 actions 和 reducer
- [x] 2.6 新建 `src/store/index.ts`，使用 `configureStore` 创建 Store，注册 timesheet reducer
- [x] 2.7 导出 `RootState` 和 `AppDispatch` 类型
- [x] 2.8 在 `main.tsx` 中用 `<Provider store={store}>` 包裹 App 组件

## 3. API 层扩展（审批接口）

- [x] 3.1 在 `src/types/timeEntry.ts` 中新增 `rejectReason?: string` 可选字段
- [x] 3.2 在 `src/api/timeEntryApi.ts` 中新增 `submitEntry`、`approveEntry`、`rejectEntry` 三个 API 函数
- [x] 3.3 在 `src/api/mockApi.ts` 中实现 `submitEntry`、`approveEntry`、`rejectEntry` 的 mock 逻辑
- [x] 3.4 在 `src/api/mockAdapter.ts` 中注册 `/time-entries/:id/submit`、`/time-entries/:id/approve`、`/time-entries/:id/reject` 端点

## 4. 从 Context 迁移到 Redux（渐进式）

- [x] 4.1 替换 `TimeEntryListPage`：将 `useTimeEntries` 改为 `useSelector` + `useDispatch`
- [x] 4.2 替换 `TimeEntryListPage` 中的操作：`addEntry`/`updateEntry`/`deleteEntry` 改为 dispatch
- [x] 4.3 替换 `TimeEntryDetailPage`：将本地 state 改为从 Redux 读取，操作改为 dispatch
- [x] 4.4 替换 `TimeEntryEditPage`：表单提交改为 dispatch updateEntry
- [x] 4.5 替换 `TimeEntryCreatePage`：表单提交改为 dispatch addEntry
- [x] 4.6 验证所有页面功能正常后，删除 `src/context/TimeEntryContext.tsx`
- [x] 4.7 在 `App.tsx` 中移除 `<TimeEntryProvider>` 包裹

## 5. Ant Design 基础配置

- [x] 5.1 在 `main.tsx` 中引入 `ConfigProvider` 和 `zhCN` 语言包
- [x] 5.2 在 `main.tsx` 中引入 `antd/dist/reset.css` 全局样式
- [x] 5.3 用 `<ConfigProvider locale={zhCN}>` 包裹应用

## 6. 列表页改造为 Ant Design Table

- [x] 6.1 在 `TimeEntryListPage` 中引入 Ant Design Table、Tag、Popconfirm、message、Space 等组件
- [x] 6.2 定义 Table columns：项目名称、工作内容、工时、审批状态（Tag）、创建时间、操作列
- [x] 6.3 配置审批状态 Tag 的颜色映射：待审批=orange、已通过=green、已驳回=red
- [x] 6.4 操作列渲染：详情按钮、编辑按钮、删除按钮（Popconfirm 包裹）、审批按钮（条件渲染）
- [x] 6.5 按状态条件渲染审批按钮："待审批"显示通过/驳回，其他状态不显示
- [x] 6.6 替换自定义分页控件为 Table 的 `pagination` prop
- [x] 6.6a 在 TimeEntryListPage 中引入 Ant Design Pagination 组件
- [x] 6.6b 用 Pagination 替换手动上一页/下一页按钮 + 页码显示
- [x] 6.6c 配置 Pagination 属性：current、pageSize、total、onChange、showTotal
- [x] 6.6d 验证翻页时上一页/下一页自动禁用状态正确
- [x] 6.6e 验证只有一页时 Pagination 自动隐藏
- [x] 6.7 配置 Table 的 `loading` 状态
- [x] 6.8 替换 `window.confirm` 为 Popconfirm
- [x] 6.9 替换 `alert` 为 message.success / message.error / message.loading
- [x] 6.10 移除自定义 TimeEntryList 和 TimeEntryItem 组件的引用（或保留作为备用）
- [x] 6.11 移除列表页的 CSS Modules 样式文件（或标记为废弃）

## 7. 审批流程功能实现

- [x] 7.1 在 `TimeEntryListPage` 中实现审批通过：dispatch approveEntry，成功后 message.success
- [x] 7.2 在 `TimeEntryListPage` 中实现驳回：打开 Modal 输入驳回原因，dispatch rejectEntry
- [x] 7.3 创建驳回 Modal 组件（或内联实现）：Form.Item + TextArea + 校验规则
- [x] 7.4 在详情页显示驳回原因：当状态为"已驳回"时展示 rejectReason
- [x] 7.5 在详情页"已驳回"状态显示"重填"按钮，点击跳转到编辑页
- [x] 7.6 验证审批流程完整链路：提交→待审批→通过/驳回→重填→再提交

## 8. 表单组件替换为 Ant Design

- [x] 8.1 在 `TimeEntryForm` 中引入 Ant Design Form、Input、TextArea、Select 组件
- [x] 8.2 使用 Ant Design Form 替代 React Hook Form（或保留 RHF 但替换 UI 组件为 Ant Design）
- [x] 8.3 将 Input/TextArea/Select 替换为 Ant Design 对应组件
- [x] 8.4 提交按钮使用 Ant Design Button，保持提交中禁用逻辑
- [x] 8.5 验证新增和编辑表单功能正常
- [x] 8.6 改造 ApprovalStatusSelector：新增 disabled 属性，禁用时样式不变
- [x] 8.7 在 TimeEntryForm 中：编辑模式下 disabled={!!initialData}，新建模式下正常可选
- [x] 8.8 验证编辑表单中审批状态只读且样式不变

## 9. 其他页面替换为 Ant Design

- [x] 9.1 替换 LoginPage：`Form` + `Input`（带 prefix 图标）+ `Input.Password` + `Card`
- [x] 9.2 替换 NotFoundPage：`Result` `status="404"` + `Button`
- [x] 9.3 替换 Stats 组件：`Statistic` `title` + `value` + `suffix`
- [x] 9.4 替换 TimeEntryQueryForm：`Form` `layout="inline"` + `Input.allowClear` + `Select.options` + `Button` + `Space`
- [x] 9.5 替换 AppLayout 侧边栏：`Layout.Sider` + `Menu` + `Avatar` + `Button`
- [x] 9.6 Header 组件保留自定义实现（优先级低）
- [x] 9.7 验证所有替换页面功能正常，视觉风格统一

## 10. 验证与收尾

- [x] 9.1 `npm run typecheck` 通过
- [x] 9.2 `npm run lint` 通过
- [x] 9.3 `npm run build` 通过
- [ ] 9.4 手动验证列表页 Table 渲染正常，分页功能正常
- [ ] 9.5 手动验证审批通过功能：点击通过按钮→确认→状态变为"已通过"
- [ ] 9.6 手动验证驳回功能：点击驳回按钮→输入原因→确认→状态变为"已驳回"
- [ ] 9.7 手动验证重填功能：已驳回记录→详情页重填→编辑→提交→状态回到"待审批"
- [ ] 9.8 手动验证详情页展示驳回原因
- [ ] 9.9 手动验证操作按钮按状态条件显示
- [ ] 9.10 手动验证 message 消息提示正常显示