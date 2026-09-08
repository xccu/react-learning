## Why

当前工时系统驳回后，用户在编辑界面修改工时内容时，工时状态不会自动重置为"待审批"，导致驳回的工时记录无法再次进入审批流程。需要在驳回状态的工时编辑界面增加提示横幅和重新提交按钮，保存修改后自动将状态改回"待审批"。

## What Changes

- 在驳回状态的工时编辑页面顶部新增 Alert 提示横幅，告知用户"此工时已被驳回，保存后将重新提交审批"
- 驳回状态下，保存按钮文案从"保存修改"变为"保存并重新提交"
- 点击"保存并重新提交"后，自动将状态改为"待审批"，清空 rejectReason，并保存修改
- 调用 submitEntry API 或 dispatch submitEntry action 完成状态重置

## Capabilities

### New Capabilities
- `timesheet-re-approval`: 驳回工时的重新审批功能，包括提示横幅、按钮文案变化和状态重置逻辑

### Modified Capabilities
- 无（不修改现有规格，仅新增能力）

## Impact

- **Affected Code**:
  - `react-app/src/components/timesheet/TimeEntryForm.tsx` - 新增 Alert 提示横幅、按钮文案变化逻辑
  - `react-app/src/pages/TimeEntryEditPage.tsx` - 传递 isRejected 状态给表单
  - `react-app/src/store/timesheetSlice.ts` - 新增 submitEntry reducer
  - `react-app/src/api/timeEntryApi.ts` - submitEntry API 已存在，无需修改
- **API**: 无新增 API，复用已有的 submitEntry 端点
- **Dependencies**: 无新增依赖