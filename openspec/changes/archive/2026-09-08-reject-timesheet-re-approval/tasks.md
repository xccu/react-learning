## 1. 新增 submitEntry Redux reducer

- [x] 1.1 在 timesheetSlice.ts 中新增 submitEntry reducer，将状态设为"待审批"并清空 rejectReason
- [x] 1.2 导出 submitEntry action

## 2. 修改 TimeEntryForm 组件

- [x] 2.1 在 TimeEntryFormProps 中新增 isRejected 布尔字段
- [x] 2.2 当 isRejected 为 true 时，在表单顶部显示 Ant Design Alert 提示横幅（warning 类型），内容为"此工时已被驳回，保存后将重新提交审批"
- [x] 2.3 当 isRejected 为 true 时，保存按钮文案变为"保存并重新提交"
- [x] 2.4 当 isRejected 为 false 时，按钮文案保持"保存修改"

## 3. 修改 TimeEntryEditPage 页面

- [x] 3.1 在 handleSubmit 中判断 isRejected 状态
- [x] 3.2 当 isRejected 为 true 时，先 dispatch submitEntry(id) 重置状态
- [x] 3.3 再 dispatch updateEntry 保存修改后的工时数据
- [x] 3.4 确保 submitEntry 和 updateEntry 的执行顺序正确（先重置状态再保存数据）
- [x] 3.5 将 entry.approvalStatus === '已驳回' 的结果作为 isRejected prop 传递给 TimeEntryForm

## 4. 验证与测试

- [x] 4.1 验证驳回状态工时编辑页面显示 Alert 提示横幅且按钮文案为"保存并重新提交"
- [x] 4.2 验证非驳回状态工时编辑页面不显示提示横幅，按钮文案为"保存修改"
- [x] 4.3 验证驳回状态下点击"保存并重新提交"后状态变为"待审批"且 rejectReason 清空
- [x] 4.4 验证内联编辑（TimeSheetPage）不受影响