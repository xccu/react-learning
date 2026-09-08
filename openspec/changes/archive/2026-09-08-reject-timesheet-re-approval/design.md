## Context

工时系统（Timesheet）使用 React + TypeScript + Ant Design + Redux Toolkit 构建。当前审批流程支持"待审批"、"已通过"、"已驳回"三种状态。驳回后用户可通过"重填"按钮进入编辑页面修改工时，但保存后状态仍为"已驳回"，无法再次进入审批流程。

现有 `submitEntry` API（PUT /time-entries/:id/submit）已存在但 Redux 层缺少配套 reducer。

## Goals / Non-Goals

**Goals:**
- 驳回状态的工时编辑页面顶部显示 Alert 提示横幅，告知用户保存后将重新提交审批
- 驳回状态下保存按钮文案变为"保存并重新提交"
- 点击"保存并重新提交"后自动将状态重置为"待审批"并清空驳回原因

**Non-Goals:**
- 不修改审批列表页和详情页的审批操作逻辑
- 不新增 API 端点
- 不修改工时创建流程
- 不处理并发审批冲突

## Decisions

### 1. 使用 Alert 提示横幅 + 按钮文案变化替代复选框
驳回状态下，在表单顶部显示 Ant Design `Alert` 组件提示用户，同时将保存按钮文案改为"保存并重新提交"。理由：
- 复选框语义不当，复选框暗示"可选的额外操作"，但重新提交应该是编辑的主要意图
- 提示横幅明确告知用户行为，降低认知负担
- 按钮文案直接表明行为，用户无需额外操作
- 与 Ant Design 的 Alert 组件风格一致

### 2. 提示横幅和按钮文案变化放在 TimeEntryForm 组件中
理由：
- `TimeEntryForm` 已在编辑模式下展示审批状态（通过 `showApprovalStatus` prop）
- 提示横幅和按钮文案变化与审批状态展示同属审批相关逻辑，放在同一组件更合理
- 内联编辑（`TimeSheetPage`）未来也可能需要此功能

### 3. 新增 submitEntry Redux reducer
`timesheetSlice` 中暂无 `submitEntry` reducer，需要新增。该 reducer 接收 entry id，将状态设为"待审批"并清空 `rejectReason`。理由：
- API 层已有 `submitEntry` 端点，Redux 层需配套 reducer
- 保持 Redux 状态管理的一致性
- 同时支持 mock 和真实 API

### 4. 通过 prop 传递 isRejected 状态给 TimeEntryForm
`TimeEntryEditPage` 判断 entry 状态是否为"已驳回"，通过 prop 传递给 `TimeEntryForm`。理由：
- 不修改 `TimeEntry` 类型定义，避免影响其他模块
- 通过 prop 传递状态，保持组件接口简洁
- `submitEntry` action 仅接受 `id` 参数，状态重置逻辑在 Redux 层处理

## Risks / Trade-offs

| Risk | Mitigation |
|------|------|
| 用户未修改任何内容就点击"保存并重新提交" | 业务可接受，审批人仍有权审批 |
| 用户未注意到提示横幅 | 提示横幅使用 Ant Design Alert 的 warning 类型，红色醒目 |
| Redux 与 API 状态不同步 | 统一通过 Redux action 处理，mock 和真实 API 都 dispatch action |

## Migration Plan

无需数据迁移。此变更仅涉及 UI 和状态管理逻辑，不影响已有数据。

部署步骤：
1. 修改 `TimeEntryForm.tsx` 添加 Alert 提示横幅和按钮文案变化逻辑
2. 修改 `TimeEntryEditPage.tsx` 传递 isRejected 状态给表单
3. 在 `timesheetSlice.ts` 中新增 submitEntry reducer
4. 测试驳回状态工时编辑和保存流程