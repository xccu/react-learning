## 1. 依赖安装与环境准备

- [x] 1.1 在 react-app 中安装 xlsx 依赖：`npm i xlsx`
- [x] 1.2 确认安装成功：检查 react-app/package.json 中出现 xlsx 依赖

## 2. Excel 导出功能

- [x] 2.1 新建 `src/utils/excel.ts`，导出 `exportToExcel` 函数
- [x] 2.2 在 `exportToExcel` 中使用 `xlsx.utils.json_to_sheet` 将数据转为工作表
- [x] 2.3 配置表头映射：projectName→项目名称、description→工作内容、hours→工时数、approvalStatus→审批状态、createdAt→创建时间
- [x] 2.4 使用 `xlsx.write` 生成 workbook 并转为 Blob
- [x] 2.5 创建临时下载链接触发浏览器下载，下载后清理链接
- [x] 2.6 生成测试用 Excel 文件：在项目根目录创建 `test-import.xlsx`，包含 3-5 条样例工时记录（含合法数据和一条非法数据用于测试导入校验）

## 3. Excel 导入功能

- [x] 3.1 在 `src/utils/excel.ts` 中导出 `importFromExcel` 函数，接收 File 对象
- [x] 3.2 使用 FileReader 将文件读取为 ArrayBuffer
- [x] 3.3 使用 `xlsx.read` 解析 workbook，获取第一个工作表
- [x] 3.4 使用 `xlsx.utils.sheet_to_json` 将工作表转为对象数组
- [x] 3.5 定义表头反向映射：项目名称→projectName、工作内容→description 等
- [x] 3.6 逐条校验数据（projectName 和 hours 必填），收集合法行和非法行
- [x] 3.7 返回解析结果：`{ validRows: TimeEntry[], invalidCount: number }`

## 4. API 层批量添加接口

- [x] 4.1 在 `src/api/timeEntryApi.ts` 中新增 `addEntries` 函数，接收 `TimeEntry[]` 数组
- [x] 4.2 在 `src/api/mockApi.ts` 中实现批量添加逻辑，逐条写入内存数据源
- [x] 4.3 在 `src/api/mockAdapter.ts` 中注册批量添加的 mock 端点

## 5. 列表页集成导入导出

- [x] 5.1 在 TimeEntryListPage 的查询表单与列表之间添加操作栏容器
- [x] 5.2 在操作栏左侧放置 Stats 统计组件（总工时）
- [x] 5.3 在操作栏右侧添加「导出」按钮，点击时调用 `exportToExcel`
- [x] 5.4 在操作栏右侧添加「导入」按钮和隐藏的 `<input type="file" accept=".xlsx">`
- [x] 5.5 为操作栏添加 CSS Modules 样式：flex 布局，左侧统计信息，右侧按钮组
- [x] 5.6 实现导入流程：选择文件 → 调用 `importFromExcel` → 调用 `addEntries` → 刷新列表
- [x] 5.7 处理导入结果反馈：成功条数、失败条数，通过状态或 alert 显示
- [x] 5.8 处理边界情况：文件格式错误提示、空文件提示

## 6. 列表分页功能

- [x] 6.1 在 TimeEntryListPage 中添加 `currentPage` 状态（默认值 1）和 `pageSize` 常量（每页 10 条）
- [x] 6.2 计算总页数：`Math.ceil(visibleEntries.length / pageSize)`
- [x] 6.3 计算当前页数据：对 `visibleEntries` 进行切片，传给 TimeEntryList
- [x] 6.4 在 TimeEntryList 底部添加分页控件容器
- [x] 6.5 实现「上一页」按钮：点击时 `setCurrentPage(p => p - 1)`，第 1 页时禁用
- [x] 6.6 实现「下一页」按钮：点击时 `setCurrentPage(p => p + 1)`，最后一页时禁用
- [x] 6.7 显示页码信息：「第 {currentPage}/{totalPages} 页」
- [x] 6.8 为分页控件添加 CSS Modules 样式：居中显示，按钮间距合理
- [x] 6.9 处理边界：查询条件变化时重置 `currentPage` 为 1
- [x] 6.10 处理边界：删除当前页最后一条记录时自动跳转到上一页

## 7. 列表性能优化

- [x] 7.1 用 `React.memo` 包裹 `TimeEntryItem` 组件
- [x] 7.2 在 `TimeEntryList` 中使用 `useCallback` 包裹 onEdit、onDelete、onViewDetail 回调
- [x] 7.3 在 `TimeEntryListPage` 中使用 `useCallback` 包裹 handleEdit、handleDelete、handleViewDetail
- [x] 7.4 验证 memo 生效：在开发模式下修改无关状态，观察 TimeEntryItem 是否跳过渲染

## 8. 验证与收尾

- [x] 8.1 `npm run typecheck` 通过
- [x] 8.2 `npm run lint` 通过
- [x] 8.3 `npm run build` 通过
- [ ] 8.4 手动验证导出功能：点击导出按钮，确认下载的 Excel 文件包含正确表头和数据
- [ ] 8.5 手动验证导入功能：选择有效的 xlsx 文件，确认数据正确导入并显示在列表中
- [ ] 8.6 手动验证导入错误处理：选择格式错误的文件、空文件，确认提示信息正确
- [ ] 8.7 手动验证分页功能：翻页操作、页码显示、边界情况（首页/末页禁用按钮）
- [ ] 8.8 手动验证性能优化：在开发模式下观察列表项渲染行为
