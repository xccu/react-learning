## MODIFIED Requirements

### Requirement: 新增表单校验复用
系统 SHALL 在新增页复用 `TimeEntryForm` 的校验行为，未通过校验时不创建记录，提交进行中禁用提交按钮。

#### Scenario: 校验失败不创建
- **WHEN** 用户未填写必填字段或工时非法点击提交
- **THEN** 表单显示校验错误提示，不创建记录、不跳转

#### Scenario: 提交中禁用按钮
- **WHEN** 用户提交有效数据且请求尚未完成
- **THEN** 提交按钮禁用，防止重复提交
