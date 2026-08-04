## Why

当前 react-app 项目的 timesheet 功能组件散落在 `components/` 根目录，类型定义与 API 层耦合，样式使用内联样式导致组件文件冗长且难以维护，页面组件承担了过多逻辑职责。需要重构项目结构以提升代码可维护性和可读性。

## What Changes

- 将 timesheet 相关组件从 `components/` 根目录移至 `components/timesheet/` 模块目录，**不重命名组件**
- 将 `TimeEntry` 和 `ApprovalStatus` 类型定义从 `api/mockApi.ts` 移至 `src/types/` 目录
- 将所有组件的内联样式（`React.CSSProperties`）提取为独立的 CSS Modules 文件（`.module.css`）
- 在现有文件内简化 `TimeSheetPage.tsx` 的业务逻辑，不创建新的 Hook 文件
- 在现有 `TimeEntryContext.tsx` 内优化 API 调用逻辑，不创建新的 Hook 文件
- 删除空的 `components/Timesheet/` 目录
- **不生成新的 .ts 文件，仅重构现有文件**（CSS Modules 的 .module.css 文件不在此限）
- 保持所有原有 React 技术栈不变（useState、useEffect、useContext、useRef、Props、条件/列表渲染）
- 保持用户体验不变：功能、UI 样式与重构前完全一致

## Capabilities

### New Capabilities
- `timesheet-modules`: 定义 timesheet 组件模块的组织结构和目录规范
- `css-modules-styling`: 定义使用 CSS Modules 替代内联样式的规范

### Modified Capabilities
- `timesheet-page`: 页面组件结构简化，移除冗余逻辑
- `time-entry-context`: Context 优化 API 调用方式，职责更清晰

## Impact

- 影响文件：
  - `src/components/` 下的 TimeEntryForm.tsx, TimeEntryList.tsx, TimeEntryItem.tsx, Stats.tsx, ApprovalStatusSelector.tsx, AppLayout.tsx
  - `src/pages/TimeSheetPage.tsx`
  - `src/context/TimeEntryContext.tsx`
  - `src/api/mockApi.ts`
- 新增文件：CSS Modules 文件（TimeEntryForm.module.css, TimeEntryList.module.css, TimeEntryItem.module.css, Stats.module.css, Header.module.css, ApprovalStatusSelector.module.css, AppLayout.module.css）
- 修改文件：类型定义文件、组件文件、Context 文件、页面文件
- 无 API 接口变更
- 无外部依赖变更
- 不生成新的 .ts 文件