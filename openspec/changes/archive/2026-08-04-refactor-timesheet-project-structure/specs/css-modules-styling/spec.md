## ADDED Requirements

### Requirement: CSS Modules for component styling
所有 timesheet 组件 SHALL 使用 CSS Modules 替代内联样式（`React.CSSProperties`），样式文件与组件文件同名并附加 `.module.css` 后缀。

#### Scenario: Style file creation
- **WHEN** 组件样式被提取
- **THEN** 必须创建对应的 `.module.css` 文件（如 `TimesheetForm.module.css`）

#### Scenario: Style import in component
- **WHEN** 组件需要使用样式
- **THEN** 必须通过 `import styles from './TimesheetForm.module.css'` 导入并使用

### Requirement: No inline styles in components
组件文件中 SHALL 不得包含 `React.CSSProperties` 类型的内联样式对象定义。

#### Scenario: Inline style removal
- **WHEN** 组件文件被重构
- **THEN** 所有 `const styles: Record<string, React.CSSProperties>` 必须被移除

#### Scenario: CSS module usage
- **WHEN** 组件渲染元素
- **THEN** 必须使用 `style={styles.className}` 而非 `style={styles.property}`

### Requirement: Style consistency
CSS Modules 文件 SHALL 保持与原有内联样式相同的外观和行为，包括颜色、间距、布局等视觉属性。

#### Scenario: Visual parity
- **WHEN** 样式迁移完成
- **THEN** 组件渲染效果与重构前完全一致