## Context

当前工时填报应用使用 React 19 + TypeScript + Vite 构建，数据通过 Axios + mock adapter 模拟 CRUD。列表页（TimeEntryListPage）渲染所有工时记录，TimeEntryItem 组件没有使用 React.memo，每次父组件渲染时所有列表项都会重新渲染。xlsx（SheetJS）已存在于根目录 package.json 但未被应用引用。

## Goals / Non-Goals

**Goals:**
- 实现 Excel 导出功能，将列表数据导出为 `.xlsx` 文件
- 实现 Excel 导入功能，解析 `.xlsx` 文件并批量写入数据
- 使用 React.memo 优化 TimeEntryItem 渲染性能
- 为 TimeEntryList 添加分页功能，支持前后翻页、显示总页数和当前页码
- 保持代码结构清晰，符合现有项目架构

**Non-Goals:**
- 不实现服务端导入导出（当前为纯前端 mock 数据）
- 不实现 CSV 格式支持（仅支持 .xlsx）
- 不引入虚拟列表（分页已解决大数据量渲染问题）
- 不对所有组件进行 memo 优化（仅优化明确有性能问题的列表项）

## Decisions

### 1. xlsx 库安装位置
**决定**: 在 `react-app/package.json` 中安装 `xlsx` 依赖

**理由**: xlsx 目前仅在根目录 package.json 中声明，react-app 无法直接引用。需要在 react-app 中安装才能在应用代码中使用。

**替代方案**: 通过 monorepo 方式共享依赖（过于复杂，不适合当前项目规模）

### 2. Excel 工具函数位置
**决定**: 创建 `src/utils/excel.ts`，导出 `exportToExcel` 和 `importFromExcel` 两个纯函数

**理由**: 导入导出是纯数据转换逻辑，不涉及 API 调用或 React 组件，放在 utils 目录符合现有代码组织方式。

**替代方案**: 
- 放在 api 目录（不合适，这不是 HTTP 请求）
- 放在组件内（不合适，逻辑过于复杂且可复用）

### 3. 导出实现方式
**决定**: 使用 `xlsx.utils.json_to_sheet` 将对象数组转为工作表，添加表头映射，通过 `xlsx.write` 生成 buffer 后创建 Blob 触发下载

**数据映射**:
```
projectName → 项目名称
description → 工作内容
hours → 工时数
approvalStatus → 审批状态
createdAt → 创建时间
```

### 4. 导入实现方式
**决定**: 使用 `<input type="file" accept=".xlsx">` 选择文件，FileReader 读取为 ArrayBuffer，`xlsx.read` 解析，从第一个工作表提取数据，逐条调用 `addEntry` 写入

**错误处理**:
- 文件格式校验：检查文件扩展名和 xlsx.read 是否抛出异常
- 数据校验：检查必填字段（projectName, hours），跳过非法行
- 结果反馈：收集成功/失败计数，通过 alert 或状态显示

### 5. 导入导出按钮布局
**决定**: 在 TimeEntryListPage 的查询表单与列表之间添加操作栏，左侧显示统计信息（总工时），右侧显示「导入」和「导出」按钮

**布局结构**:
```
┌─────────────────────────────────────┐
│  Header: 工时列表                    │
├─────────────────────────────────────┤
│  TimeEntryQueryForm (查询/清空)      │
├─────────────────────────────────────┤
│  Stats (总工时)  │  [导入] [导出]    │  ← 操作栏
├─────────────────────────────────────┤
│  TimeEntryList (记录列表)            │
│    ├── TimeEntryItem 1               │
│    ├── TimeEntryItem 2               │
│    └── ...                           │
├─────────────────────────────────────┤
│  [上一页]  第 1/3 页  [下一页]       │  ← 分页控件
└─────────────────────────────────────┘
```

**理由**: 
- 导出是"导出当前看到的数据"，放在列表页最自然
- 导入后数据立即显示在列表中，形成操作闭环
- 与统计信息同行显示，不占用额外垂直空间
- 按钮紧邻数据展示区，上下文清晰

**替代方案**:
- 单独的导入导出页面（增加导航复杂度，不必要）
- 放在 Header 区域（Header 用于页面标题，不适合放操作按钮）
- 放在侧边栏（导入导出是页面级操作，不是全局导航）

### 6. 列表分页设计
**决定**: 在 TimeEntryList 组件内部实现前端分页，每页显示 10 条记录，底部显示分页控件

**分页逻辑**:
- 状态管理：在 TimeEntryListPage 中维护 `currentPage` 状态（从 1 开始）
- 数据切片：根据 `currentPage` 和 `pageSize` 对 `visibleEntries` 进行切片，传给 TimeEntryList
- 总页数计算：`Math.ceil(visibleEntries.length / pageSize)`
- 翻页操作：「上一页」按钮在第 1 页时禁用，「下一页」按钮在最后一页时禁用

**分页控件布局**:
```
[上一页]  第 {currentPage}/{totalPages} 页  [下一页]
```

**理由**:
- 前端分页实现简单，适合当前 mock 数据场景
- 每页 10 条是常见默认值，平衡展示密度和滚动长度
- 分页控件放在列表底部，符合用户浏览习惯
- 与 React.memo 配合：分页后每页渲染的 Item 数量固定，memo 效果更明显

**替代方案**:
- 服务端分页（当前为 mock 数据，无需服务端分页）
- 无限滚动（实现复杂，超出本周学习范围）
- 不分页直接渲染（数据量大时影响性能）

### 6. 性能优化策略
**决定**: 
- 使用 `React.memo` 包裹 TimeEntryItem，利用浅比较判断 props 变化
- 在 TimeEntryList 中使用 `useCallback` 包裹传递给 TimeEntryItem 的回调函数
- 在 TimeEntryListPage 中使用 `useCallback` 包裹 handleEdit、handleDelete、handleViewDetail

**理由**: React.memo 默认使用浅比较，对于简单的 props（对象引用、函数引用）足够有效。useCallback 稳定函数引用是 memo 生效的前提。

**替代方案**: 
- 使用 useMemo 缓存计算结果（当前 totalHours 计算简单，收益不大）
- 自定义比较函数（当前 props 结构简单，不需要）

## Risks / Trade-offs

- **[xlsx 包体积]** → xlsx 库较大（约 500KB），可能影响首屏加载。缓解：当前为学习项目，可接受；生产环境可考虑按需加载或使用更轻量的库
- **[导入数据量]** → 大量数据逐条写入可能较慢。缓解：当前为 mock 数据，300ms 延迟模拟真实场景；实际生产环境应使用批量 API
- **[memo 过度优化风险]** → 初学者可能误用 memo 导致代码复杂度增加。缓解：仅对 TimeEntryItem 应用 memo，并在代码注释中说明优化原因
