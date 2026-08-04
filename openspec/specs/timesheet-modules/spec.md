## Purpose

TBD

## Requirements

### Requirement: Timesheet components organized in module directory
所有 timesheet 相关的组件 SHALL 放置在 `src/components/timesheet/` 目录下，不得散落在 `components/` 根目录或其他位置。

#### Scenario: New timesheet component location
- **WHEN** 需要新增 timesheet 相关组件
- **THEN** 组件文件 SHALL 创建在 `src/components/timesheet/` 目录下

#### Scenario: Empty Timesheet directory removed
- **WHEN** 项目结构重构完成
- **THEN** `src/components/Timesheet/` 空目录 SHALL 被删除

### Requirement: Component file naming convention
timesheet 模块下的组件文件 SHALL 保持原有 PascalCase 命名，仅移动位置，不重命名。

#### Scenario: Component naming preserved
- **WHEN** 组件文件被移动
- **THEN** 文件名 SHALL 保持原有 PascalCase 命名（如 `TimeEntryForm.tsx`, `TimeEntryItem.tsx`）

### Requirement: Type definitions in types directory
TimeEntry 和 ApprovalStatus 类型定义 SHALL 放置在 `src/types/` 目录下，不得定义在 API 文件或组件文件中。

#### Scenario: Type definition location
- **WHEN** 需要引用 TimeEntry 或 ApprovalStatus 类型
- **THEN** 必须从 `src/types/timeEntry.ts` 导入

#### Scenario: Type import in components
- **WHEN** timesheet 组件需要类型定义
- **THEN** 组件必须从 `src/types/timeEntry.ts` 导入类型，而非从 `api/mockApi.ts` 导入