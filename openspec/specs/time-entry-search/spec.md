## Purpose

Allow users to filter the time entry list by project name, work content, and approval status through a query form on the list page, so large lists are easier to browse.

## Requirements

### Requirement: 列表页查询表单
系统 SHALL 在工时列表页提供查询表单，至少包含项目名称、工作内容、审批状态三类查询条件，并在提交时过滤列表。

#### Scenario: 按项目名称查询
- **WHEN** 用户输入项目名称关键字并点击「查询」
- **THEN** 列表仅显示项目名称包含该关键字的记录

#### Scenario: 按工作内容查询
- **WHEN** 用户输入工作内容关键字并点击「查询」
- **THEN** 列表仅显示工作内容包含该关键字的记录

#### Scenario: 按审批状态查询
- **WHEN** 用户选择审批状态并点击「查询」
- **THEN** 列表仅显示该审批状态的记录

#### Scenario: 组合条件查询
- **WHEN** 用户同时填写多个查询条件并提交
- **THEN** 列表仅显示同时满足所有条件的记录

#### Scenario: 无条件查询显示全部
- **WHEN** 用户不填写任何条件点击「查询」
- **THEN** 列表显示全部记录

### Requirement: 查询逻辑经 mockApi 实现
系统 SHALL 将查询过滤逻辑实现于 mockApi 的查询函数中，返回过滤后的记录数组，列表页通过该函数获取查询结果。

#### Scenario: 查询返回过滤结果
- **WHEN** 列表页以一组查询条件调用 mockApi 查询函数
- **THEN** 该函数返回满足条件的记录数组

### Requirement: 清空查询恢复全部
系统 SHALL 允许用户清空查询条件以恢复显示全部记录。

#### Scenario: 清空条件
- **WHEN** 用户清空查询条件并重新查询
- **THEN** 列表恢复显示全部记录
