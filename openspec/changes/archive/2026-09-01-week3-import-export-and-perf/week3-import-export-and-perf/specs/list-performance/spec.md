## Purpose

通过组件缓存（React.memo）优化工时列表的渲染性能，避免列表项在数据未变化时进行无谓重渲染，同时建立"先确认性能问题再优化、不滥用"的优化原则。

## ADDED Requirements

### Requirement: 列表项组件缓存
工时列表项组件 SHALL 使用 React.memo 包裹，当传入的 props 未变化时不重新渲染。

#### Scenario: 数据未变化时跳过渲染
- **WHEN** 父组件因无关状态变化重新渲染，但传给某个列表项的 props 未变化
- **THEN** 该列表项组件跳过重新渲染，保持之前的输出

#### Scenario: 数据变化时正常渲染
- **WHEN** 传给某个列表项的 entry 数据或其他 props 发生变化
- **THEN** 该列表项组件正常重新渲染，显示最新内容

### Requirement: 回调函数引用稳定
列表组件 SHALL 使用 useCallback 稳定传递给子组件的回调函数引用，确保 React.memo 能正确判断 props 是否变化。

#### Scenario: 回调引用在多次渲染间保持稳定
- **WHEN** 列表页组件重新渲染
- **THEN** 传递给 TimeEntryList 和 TimeEntryItem 的回调函数（onEdit、onDelete、onViewDetail）引用保持不变

### Requirement: 优化原则实践
开发过程中 SHALL 遵循"先确认性能问题再优化"的原则，避免过度优化。

#### Scenario: 仅对列表项应用 memo
- **WHEN** 进行性能优化
- **THEN** 仅对明确存在不必要重渲染的列表项组件（TimeEntryItem）使用 React.memo，不对所有组件滥用缓存
