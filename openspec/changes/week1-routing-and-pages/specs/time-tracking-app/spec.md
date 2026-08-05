## ADDED Requirements

### Requirement: 列表项提供详情跳转入口
`TimeEntryItem` SHALL 在「编辑」「删除」操作旁提供「详情」跳转入口，用于导航到该条记录的详情页。

#### Scenario: 点击详情入口跳转详情页
- **WHEN** 用户点击某条记录列表项上的「详情」按钮
- **THEN** 系统导航到该记录的详情页，并携带该记录标识

### Requirement: 路由化列表页中编辑跳转编辑页
在路由化的列表页中，「编辑」按钮 SHALL 导航到对应记录的编辑页，而非进行页面内联编辑。

#### Scenario: 路由化列表页点击编辑
- **WHEN** 用户在路由化的列表页点击某条记录的「编辑」按钮
- **THEN** 系统导航到该记录的编辑页

### Requirement: 原有内联编辑行为保持
`TimeEntryItem` / `TimeEntryList` SHALL 通过可选回调提供详情与编辑跳转能力；当回调未提供时，列表项 SHALL 保持原有行为（页面内联编辑、无详情入口），确保原 `TimeSheetPage` 功能不变。

#### Scenario: 未提供跳转回调时保持原行为
- **WHEN** 原 `TimeSheetPage` 渲染列表且未提供跳转回调
- **THEN** 列表项仍支持原有内联编辑与删除，功能与改造前一致

#### Scenario: 提供跳转回调时启用导航
- **WHEN** 路由化列表页渲染列表且提供跳转回调
- **THEN** 列表项显示「详情」按钮，编辑点击导航至编辑页
