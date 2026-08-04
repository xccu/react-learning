## Context

当前 react-app 项目的 timesheet 功能模块存在以下问题：
- 组件散落在 `components/` 根目录，缺乏模块化管理
- `components/Timesheet/` 空目录存在但未使用
- 所有组件使用内联样式（`React.CSSProperties`），导致文件冗长且难以维护
- 类型定义与 API 层耦合
- 页面组件承担过多业务逻辑
- Context 直接调用 API，职责不清

本项目是一个 React 学习项目，面向初学者，代码需要简洁、注释清晰、易于理解。重构需严格遵循以下原则：
- **不生成新的 .ts 文件**（CSS Modules 的 .module.css 文件不在此限）
- **不引入新概念**（保持初学者友好）
- **保持原有 React 技术栈不变**（useState、useEffect、useContext、useRef、Props、条件/列表渲染）

## Goals / Non-Goals

**Goals:**
- 将 timesheet 组件按功能模块组织到 `components/timesheet/` 目录
- 提取样式为 CSS Modules，减少组件文件体积（符合 `timesheet-app/design.md` 的设计决策）
- 将类型定义移至 `src/types/` 目录
- 在现有文件内简化页面组件逻辑
- 在现有 Context 内优化 API 调用方式
- 不生成新的 .ts 文件，仅重构现有文件

**Non-Goals:**
- 不创建新的 .ts 文件（不新增 Hook 文件）
- 不重命名组件（仅移动位置，保持命名一致）
- 不改变 timesheet 功能的行为和 UI 外观
- 不添加新功能
- 不引入新的外部依赖
- 不修改 docs-examples 相关代码

## Decisions

### 决策 1: 使用 CSS Modules
- **选择**: 使用 React 原生的 CSS Modules（`.module.css`）
- **理由**: 
  - 无需引入新的依赖库
  - Vite 已原生支持 CSS Modules
  - 与 `timesheet-app/design.md` 中"使用 CSS Modules 保持简洁"的设计决策一致
  - 保持轻量级
- **备选**: styled-components（需要安装依赖，增加复杂度）

### 决策 2: 不创建新 Hook 文件
- **选择**: 在现有 Context 和页面组件内优化逻辑，不创建新的 Hook 文件
- **理由**:
  - 约束：不生成新的 .ts 文件
  - 保持文件数量不变，降低初学者理解负担
  - Context 内部优化即可，无需额外抽象
- **备选**: 创建独立的 Hook 文件（违反约束，增加复杂度）

### 决策 3: 不重命名组件
- **选择**: 组件仅移动位置，保持原有命名
- **理由**:
  - 减少混淆，避免初学者理解新旧名称
  - 功能不变，命名无需改变
  - 降低重构风险
- **备选**: 重命名为 TimesheetForm 等（不必要，增加改动范围）

### 决策 4: 类型定义文件命名
- **选择**: `src/types/timeEntry.ts`
- **理由**:
  - 文件名与类型内容一致
  - 清晰表达文件用途
  - 遵循小写加连字符的命名规范

## Risks / Trade-offs

### [Risk] CSS Modules 类名变更导致样式不匹配
→ **Mitigation**: 迁移时逐一比对原有内联样式属性，确保视觉一致性

### [Risk] 重构过程中可能引入回归 bug
→ **Mitigation**: 保持功能行为不变，逐文件重构并验证

### [Trade-off] 保持内联样式意味着组件文件仍然较长
→ **Mitigation**: 当前学习项目可接受，后续可考虑 CSS Modules

## Migration Plan

### 步骤 1: 创建目录结构
- 创建 `src/components/timesheet/` 目录
- 创建 `src/types/` 目录（如不存在）

### 步骤 2: 迁移类型定义
- 从 `api/mockApi.ts` 提取 `TimeEntry` 和 `ApprovalStatus` 类型
- 创建类型定义文件

### 步骤 3: 提取样式为 CSS Modules
- 为每个组件创建对应的 `.module.css` 文件
- 将内联样式对象转换为 CSS 类
- 更新组件中的样式引用

### 步骤 4: 移动组件文件
- 将 timesheet 相关组件移至 `components/timesheet/`（保持原名）
- 更新组件间的导入路径

### 步骤 5: 简化页面组件
- 在 `TimeSheetPage.tsx` 内简化冗余逻辑
- 保持组件简洁

### 步骤 6: 优化 Context
- 在 `TimeEntryContext.tsx` 内优化 API 调用方式
- 保持职责清晰

### 步骤 7: 清理
- 删除空的 `components/Timesheet/` 目录
- 验证所有导入路径正确
- 验证应用正常运行

## Open Questions

- Header 组件是否属于 timesheet 模块？（当前建议保留在 `components/` 根目录，因为它是全局组件）