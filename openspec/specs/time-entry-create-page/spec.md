## Purpose

Provide a dedicated page for creating a new time entry by reusing the existing TimeEntryForm in add mode, with entry points from the sidebar navigation and the list page.

## Requirements

### Requirement: 独立新增工时页面
系统 SHALL 提供独立的新增工时页面，其表单部分复用 `TimeEntryForm`（新增模式，不预填数据）。

#### Scenario: 从侧边导航进入新增页
- **WHEN** 用户点击左侧导航栏的「新增工时」导航项
- **THEN** 系统导航到新增页并显示新增表单

#### Scenario: 从列表页按钮进入新增页
- **WHEN** 用户在工时列表页点击查询按钮旁并列的「新增工时」按钮
- **THEN** 系统导航到新增页并显示新增表单

#### Scenario: 新增表单初始为空
- **WHEN** 新增页表单首次渲染
- **THEN** 表单字段为空，表单标题显示「新增工时」，提交按钮显示「提交」

### Requirement: 新增提交成功返回列表
系统 SHALL 在新增记录成功后跳转回工时列表页，且列表页展示新记录。

#### Scenario: 提交成功后返回列表
- **WHEN** 用户填写有效数据并提交新增表单
- **THEN** 系统创建记录并导航回列表页，列表展示该新记录

### Requirement: 新增表单校验复用
系统 SHALL 在新增页复用 `TimeEntryForm` 的既有必填校验行为，未通过校验时不创建记录。

#### Scenario: 校验失败不创建
- **WHEN** 用户未填写必填字段点击提交
- **THEN** 表单显示校验错误提示，不创建记录、不跳转
