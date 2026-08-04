## 1. 创建目录结构

- [x] 1.1 创建 `src/components/timesheet/` 目录
- [x] 1.2 确保 `src/types/` 目录存在

## 2. 迁移类型定义

- [x] 2.1 从 `api/mockApi.ts` 提取 `TimeEntry` 和 `ApprovalStatus` 类型到 `src/types/timeEntry.ts`
- [x] 2.2 更新 `api/mockApi.ts` 从 `src/types/timeEntry.ts` 导入类型

## 3. 提取样式为 CSS Modules

- [x] 3.1 为 `TimeEntryForm` 创建 `TimeEntryForm.module.css` 并更新组件引用
- [x] 3.2 为 `TimeEntryList` 创建 `TimeEntryList.module.css` 并更新组件引用
- [x] 3.3 为 `TimeEntryItem` 创建 `TimeEntryItem.module.css` 并更新组件引用
- [x] 3.4 为 `Stats` 创建 `Stats.module.css` 并更新组件引用
- [x] 3.5 为 `Header` 创建 `Header.module.css` 并更新组件引用
- [x] 3.6 为 `ApprovalStatusSelector` 创建 `ApprovalStatusSelector.module.css` 并更新组件引用
- [x] 3.7 为 `AppLayout` 创建 `AppLayout.module.css` 并更新组件引用

## 4. 移动组件文件

- [x] 4.1 将 `TimeEntryForm.tsx` 移至 `components/timesheet/`（保持原名）
- [x] 4.2 将 `TimeEntryList.tsx` 移至 `components/timesheet/`（保持原名）
- [x] 4.3 将 `TimeEntryItem.tsx` 移至 `components/timesheet/`（保持原名）
- [x] 4.4 将 `Stats.tsx` 移至 `components/timesheet/`（保持原名）
- [x] 4.5 将 `ApprovalStatusSelector.tsx` 移至 `components/timesheet/`（保持原名）
- [x] 4.6 更新 `components/timesheet/` 内组件间的导入路径
- [x] 4.7 更新 `pages/TimeSheetPage.tsx` 中的组件导入路径
- [x] 4.8 删除 `components/` 根目录下已移动的组件文件

## 5. 简化页面组件

- [x] 5.1 在 `pages/TimeSheetPage.tsx` 内简化冗余逻辑，保持组件简洁

## 6. 优化 Context

- [x] 6.1 在 `context/TimeEntryContext.tsx` 内优化 API 调用方式，保持职责清晰

## 7. 清理与验证

- [x] 7.1 删除空的 `components/Timesheet/` 目录
- [x] 7.2 验证所有导入路径正确
- [x] 7.3 验证应用正常运行且 UI 无变化