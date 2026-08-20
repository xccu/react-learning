## Why

工时填报应用目前缺少批量数据处理能力——用户无法将现有工时记录导出为 Excel 文件备份，也无法从 Excel 文件批量导入数据。同时，列表页的 TimeEntryItem 组件在每次状态变化时都会重新渲染，当数据量增大时会影响性能。本周作为 React 生态与工程化的第三周，需要完成导入导出功能并引入组件缓存优化。

## What Changes

- **新增 Excel 导出功能**：将当前列表数据导出为 `.xlsx` 文件，包含表头（项目名称、工作内容、工时数、审批状态、创建时间），用户点击导出按钮后触发浏览器下载
- **新增 Excel 导入功能**：通过文件选择控件选取本地 `.xlsx` 文件，解析表格内容，逐条写入数据接口，汇总反馈成功与失败条数，完成后刷新列表
- **列表性能优化**：用 `React.memo` 包裹 `TimeEntryItem` 组件，数据未变化时避免重复渲染；同时用 `useCallback` 稳定回调函数引用，确保 memo 生效
- **优化原则实践**：明确"先确认性能问题再优化、不滥用"的使用原则，作为性能优化的入门教学

## Capabilities

### New Capabilities

- `data-import-export`: Excel 导入导出功能，包括 xlsx 文件读取与生成、文件选择控件、导入结果反馈、导出触发下载
- `list-performance`: 列表组件性能优化，包括 React.memo 组件缓存、useCallback 回调稳定、浅比较原理实践

### Modified Capabilities

- `time-tracking-app`: 在工时列表页增加导入和导出操作按钮

## Impact

- **依赖变更**：`react-app/package.json` 需添加 `xlsx`（SheetJS）依赖（当前仅在根目录 package.json 中存在，未被应用引用）
- **新增文件**：`src/utils/excel.ts`（导入导出工具函数）、相关测试文件
- **修改文件**：`src/pages/TimeEntryListPage.tsx`（添加导入导出按钮和逻辑）、`src/components/timesheet/TimeEntryItem.tsx`（包裹 React.memo）、`src/components/timesheet/TimeEntryList.tsx`（useCallback 优化）
- **API 层**：`src/api/timeEntryApi.ts` 需新增批量添加接口用于导入
