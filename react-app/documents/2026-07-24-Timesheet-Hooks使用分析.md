# Timesheet Hooks 使用分析

> 生成日期：2026-07-24

## 一、项目结构

```
react-learning/
├── react-app/src/timesheet/                    # TypeScript 实现（教学版）
│   ├── types.ts
│   ├── TimesheetContext.tsx
│   ├── TimesheetPage.tsx
│   └── components/
│       ├── StatusBadge.tsx
│       ├── TimesheetForm.tsx
│       ├── TimesheetList.tsx
│       └── TimesheetStats.tsx
│
└── timesheet-app/src/                          # JavaScript 实现（生产版）
    ├── context/
    │   ├── TimesheetContext.js
    │   ├── Provider.jsx
    │   └── reducer.js
    ├── App.jsx
    └── components/
        ├── TimesheetForm.jsx
        ├── TimesheetList.jsx
        ├── TimesheetFilters.jsx
        └── TimesheetSummary.jsx
```

## 二、整体架构

```
react-app (TypeScript - 教学版)
├── TimesheetProvider (useState + Context)
│   ├── TimesheetForm (useState + useRef)
│   ├── TimesheetStats (useTimesheet)
│   └── TimesheetList (useTimesheet)

timesheet-app (JavaScript - 生产版)
├── TimesheetProvider (useReducer + useState + Context)
│   ├── TimesheetForm (useState + useEffect + useRef)
│   ├── TimesheetList (memo)
│   ├── TimesheetFilters (useState + useEffect + useMemo)
│   └── TimesheetSummary (useMemo x2)
```

## 三、Hook 使用总览

| Hook | react-app 文件数 | timesheet-app 文件数 | 主要用途 |
|------|-----------------|---------------------|---------|
| `useState` | 2 | 3 | 表单数据、错误状态、全局 records、主题、本地筛选 |
| `useEffect` | 1 | 3 | 数据初始化、localStorage 持久化、编辑模式同步 |
| `useContext` | 1 | 1 | 消费全局 timesheet 状态和主题 |
| `useReducer` | 0 | 1 | 复杂状态管理（records/filters/editing/view） |
| `useMemo` | 0 | 2 | 唯一项目列表、汇总统计计算、总工时 |
| `useRef` | 1 | 1 | DOM 聚焦管理 |
| `createContext` | 1 | 1 | 创建全局状态通信通道 |
| `memo` | 0 | 1 | 列表项性能优化 |

## 四、按 Hook 类型详解

---

### 4.1 useState — 状态管理

**使用文件**：

| 文件 | 行号 | 变量名 | 初始值 |
|------|------|--------|--------|
| `react-app/TimesheetContext.tsx` | 27 | `records` | `[]` |
| `react-app/components/TimesheetForm.tsx` | 18 | `formData` | `{ date: '', project: '', ... }` |
| `react-app/components/TimesheetForm.tsx` | 27 | `errors` | `{}` |
| `timesheet-app/context/Provider.jsx` | 68 | `theme` | `() => localStorage.getItem('theme') || 'light'` |
| `timesheet-app/components/TimesheetForm.jsx` | 14 | `formData` | `emptyForm` |
| `timesheet-app/components/TimesheetForm.jsx` | 15 | `errors` | `{}` |
| `timesheet-app/components/TimesheetFilters.jsx` | 6 | `localFilters` | `{ dateRange: {...}, project: '', taskType: '' }` |

#### react-app 中的 useState

**全局 records 状态** — `react-app/TimesheetContext.tsx:27`

```typescript
// 第26-27行
function TimesheetProvider({ children }: TimesheetProviderProps) {
  const [records, setRecords] = useState<TimesheetItem[]>([])
```

| 维度 | 说明 |
|------|------|
| 功能 | 声明 `records` 状态和 `setRecords` 更新函数，初始为空数组 |
| 目的 | 作为整个应用的唯一数据源，存储所有工时记录 |
| 效果 | `records` 变更时，所有消费该 Context 的组件（Form、List、Stats）自动重新渲染 |

**相关更新操作**（同一文件）：

```typescript
// 第41行：追加记录
setRecords((prev) => [...prev, newRecord])

// 第46行：删除记录
setRecords((prev) => prev.filter((record) => record.id !== id))

// 第51-59行：切换状态
setRecords((prev) =>
  prev.map((record) => {
    if (record.id !== id) return record
    const currentIndex = TIMESHEET_STATUS_ORDER.indexOf(record.status)
    const nextIndex = (currentIndex + 1) % TIMESHEET_STATUS_ORDER.length
    return { ...record, status: TIMESHEET_STATUS_ORDER[nextIndex] }
  }),
)
```

**表单数据状态** — `react-app/components/TimesheetForm.tsx:18-24`

```typescript
// 第18-24行
const [formData, setFormData] = useState<TimesheetFormData>({
  date: '',
  project: '',
  task: '',
  hours: '',
  description: '',
})
```

| 维度 | 说明 |
|------|------|
| 功能 | 管理表单所有字段的输入值，初始为空字符串 |
| 目的 | 作为受控组件的数据源，用户输入时更新状态，状态决定显示值 |
| 效果 | 每次按键触发 `handleChange`，通过 `setFormData(prev => ({ ...prev, [name]: value }))` 更新对应字段 |

**验证错误状态** — `react-app/components/TimesheetForm.tsx:27`

```typescript
// 第27行
const [errors, setErrors] = useState<Record<string, string>>({})
```

| 维度 | 说明 |
|------|------|
| 功能 | 存储字段级验证错误信息，键为字段名，值为错误消息 |
| 目的 | 在表单验证失败时，显示对应字段的错误提示 |
| 效果 | 提交时 `validate()` 构建错误对象并 `setErrors(newErrors)`；输入时清除对应错误；提交成功后 `setErrors({})` |

#### timesheet-app 中的 useState

**主题管理** — `timesheet-app/context/Provider.jsx:68-71`

```javascript
// 第68-71行
const [theme, setTheme] = useState(() => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored || 'light';
});
```

| 维度 | 说明 |
|------|------|
| 功能 | 使用 lazy initializer 从 localStorage 加载主题，初始值为 'light' 或 'dark' |
| 目的 | 独立管理主题状态，与 timesheet 数据解耦 |
| 效果 | 主题切换通过 `setTheme(prev => prev === 'light' ? 'dark' : 'light')`（第79行）实现 |

**表单数据** — `timesheet-app/components/TimesheetForm.jsx:14-15`

```javascript
// 第14-15行
const [formData, setFormData] = useState(emptyForm);
const [errors, setErrors] = useState({});
```

| 维度 | 说明 |
|------|------|
| 功能 | 管理表单输入数据和验证错误 |
| 目的 | 支持新增和编辑两种模式，表单数据根据 `editingTimesheet` prop 动态变化 |
| 效果 | 新增模式初始化为当天日期的空表单，编辑模式通过 useEffect 回填数据 |

**本地筛选状态** — `timesheet-app/components/TimesheetFilters.jsx:6-10`

```javascript
// 第6-10行
const [localFilters, setLocalFilters] = useState({
  dateRange: { start: filters.dateRange.start, end: filters.dateRange.end },
  project: filters.project,
  taskType: filters.taskType
});
```

| 维度 | 说明 |
|------|------|
| 功能 | 维护本地筛选状态，初始值从父组件的 `filters` prop 同步 |
| 目的 | 提供本地编辑缓冲区，筛选变化通过 `onFilterChange` 回调通知父组件 |
| 效果 | 父组件的 `filters` 变化时，通过 useEffect（第12-18行）同步到本地状态 |

---

### 4.2 useEffect — 副作用处理

**使用文件**：

| 文件 | 行号 | 依赖数组 | 用途 |
|------|------|---------|------|
| `react-app/TimesheetPage.tsx` | 19 | `[]` | 页面初始化示例数据 |
| `timesheet-app/context/Provider.jsx` | 14 | `[state.timesheets]` | 数据持久化到 localStorage |
| `timesheet-app/context/Provider.jsx` | 73 | `[theme]` | 主题同步到 localStorage 和 DOM |
| `timesheet-app/components/TimesheetForm.jsx` | 18 | `[editingTimesheet]` | 编辑模式数据同步 |
| `timesheet-app/components/TimesheetFilters.jsx` | 12 | `[filters]` | 父组件筛选变化时同步本地状态 |

#### react-app 中的 useEffect

**页面初始化** — `react-app/TimesheetPage.tsx:19-22`

```typescript
// 第17行：获取全局方法
const { addRecord } = useTimesheet()

// 第19-22行
useEffect(() => {
  INITIAL_DATA.forEach((data) => addRecord(data))
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
```

| 维度 | 说明 |
|------|------|
| 功能 | 组件首次挂载时，遍历 `INITIAL_DATA` 插入 3 条示例记录 |
| 目的 | 页面加载即显示示例数据，避免空白状态 |
| 效果 | 依赖数组 `[]` 表示仅在组件挂载时执行一次。`addRecord` 不需要放入依赖数组（来自 Context，不会变化） |

#### timesheet-app 中的 useEffect

**数据持久化** — `timesheet-app/context/Provider.jsx:14-20`

```javascript
// 第14-20行
useEffect(() => {
  try {
    localStorage.setItem(TIMESHEET_STORAGE_KEY, JSON.stringify(state.timesheets));
  } catch (e) {
    console.error('保存数据失败:', e);
  }
}, [state.timesheets]);
```

| 维度 | 说明 |
|------|------|
| 功能 | 监听 `state.timesheets` 变化，自动写入 localStorage |
| 目的 | 刷新页面数据不丢失 |
| 效果 | 每次 records 变更触发写入，`try/catch` 处理存储失败 |

**主题同步** — `timesheet-app/context/Provider.jsx:73-76`

```javascript
// 第73-76行
useEffect(() => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

| 维度 | 说明 |
|------|------|
| 功能 | 监听 `theme` 变化，同步到 localStorage 和 DOM 的 `data-theme` 属性 |
| 目的 | 主题变更持久化并驱动 CSS 变量 |
| 效果 | 切换主题后立即生效，刷新后保持 |

**编辑模式同步** — `timesheet-app/components/TimesheetForm.jsx:18-34`

```javascript
// 第18-34行
useEffect(() => {
  if (editingTimesheet) {
    setFormData({
      date: editingTimesheet.date,
      project: editingTimesheet.project,
      taskType: editingTimesheet.taskType,
      description: editingTimesheet.description,
      hours: editingTimesheet.hours.toString()
    });
    if (projectInputRef.current) {
      projectInputRef.current.focus();
    }
  } else {
    setFormData(emptyForm);
  }
  setErrors({});
}, [editingTimesheet]);
```

| 维度 | 说明 |
|------|------|
| 功能 | 监听 `editingTimesheet` prop 变化，自动填充或清空表单 |
| 目的 | 点击编辑按钮时表单自动回填该记录数据；切换回新增模式时重置 |
| 效果 | 编辑模式下聚焦项目输入框，提升用户体验 |

**筛选状态同步** — `timesheet-app/components/TimesheetFilters.jsx:12-18`

```javascript
// 第12-18行
useEffect(() => {
  setLocalFilters({
    dateRange: { start: filters.dateRange.start, end: filters.dateRange.end },
    project: filters.project,
    taskType: filters.taskType
  });
}, [filters]);
```

| 维度 | 说明 |
|------|------|
| 功能 | 监听父组件 `filters` prop 变化，同步到本地状态 |
| 目的 | 确保本地筛选 UI 与父组件状态保持一致 |
| 效果 | 其他组件重置筛选时，本地 UI 自动更新 |

---

### 4.3 useContext — 跨组件共享数据

**使用文件**：

| 文件 | 行号 | 使用方式 |
|------|------|---------|
| `react-app/TimesheetContext.tsx` | 12 | `useContext(TimesheetContext)`（自定义 Hook 内部） |
| `timesheet-app/App.jsx` | 13 | `useContext(TimesheetContext)`（直接消费） |

#### react-app 中的 useContext

**自定义 Hook 封装** — `react-app/TimesheetContext.tsx:11-17`

```typescript
// 第11-17行
function useTimesheet(): TimesheetContextValue {
  const context = useContext(TimesheetContext)
  if (!context) {
    throw new Error('useTimesheet must be used within a TimesheetProvider')
  }
  return context
}
```

| 维度 | 说明 |
|------|------|
| 功能 | 封装 `useContext` 调用，添加空值校验 |
| 目的 | 提供类型安全的全局状态访问，避免在每个组件中重复编写 useContext 和 null 检查 |
| 效果 | 组件不在 TimesheetProvider 内使用时抛出错误，方便调试 |

**使用位置**：

| 文件 | 行号 | 使用方式 |
|------|------|---------|
| `TimesheetPage.tsx` | 17 | `const { addRecord } = useTimesheet()` |
| `TimesheetForm.tsx` | 14 | `const { addRecord } = useTimesheet()` |
| `TimesheetList.tsx` | 12 | `const { records, deleteRecord, toggleStatus } = useTimesheet()` |
| `TimesheetStats.tsx` | 15 | `const { records } = useTimesheet()` |

#### timesheet-app 中的 useContext

**直接消费** — `timesheet-app/App.jsx:13`

```javascript
// 第13行
const { state, addTimesheet, updateTimesheet, deleteTimesheet, setEditingId, setView, setFilters, resetFilters } = useContext(TimesheetContext);
```

| 维度 | 说明 |
|------|------|
| 功能 | 直接通过 `useContext(TimesheetContext)` 获取全局状态和所有操作方法 |
| 目的 | App 组件作为路由层，根据 `state.currentView` 切换显示 Form/List/Summary 视图 |
| 效果 | 所有 CRUD 操作和视图切换方法直接从 Context 获取，无需中间组件透传 |

---

### 4.4 useReducer — 复杂状态管理

**使用文件**：

| 文件 | 行号 | 状态管理内容 |
|------|------|-------------|
| `timesheet-app/context/Provider.jsx` | 12 | records、filters、editingId、currentView |

#### timesheet-app 中的 useReducer

**复杂状态管理** — `timesheet-app/context/Provider.jsx:12`

```javascript
// 第1行：导入
import { useReducer, useEffect, useState } from 'react';
import { timesheetReducer, loadFromStorage } from './reducer';

// 第11-12行
export const TimesheetProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timesheetReducer, null, loadFromStorage);
```

| 维度 | 说明 |
|------|------|
| 功能 | 使用 reducer 模式管理复杂状态，lazy initializer 从 localStorage 加载数据 |
| 目的 | 管理 records、filters、editingId、currentView 等多个子状态，替代多个 useState |
| 效果 | 状态变更通过 `dispatch(action)` 触发，reducer 函数根据 action.type 返回新状态，所有变更集中管理 |

**相关 dispatch 操作**（同一文件）：

```javascript
// 第22-24行：新增
const addTimesheet = (timesheet) => { dispatch({ type: 'ADD_TIMESHEET', payload: timesheet }) }

// 第26-28行：更新
const updateTimesheet = (timesheet) => { dispatch({ type: 'UPDATE_TIMESHEET', payload: timesheet }) }

// 第30-32行：删除
const deleteTimesheet = (id) => { dispatch({ type: 'DELETE_TIMESHEET', payload: id }) }

// 第34-36行：设置筛选
const setFilters = (filters) => { dispatch({ type: 'SET_FILTERS', payload: filters }) }

// 第42-44行：设置编辑ID
const setEditingId = (id) => { dispatch({ type: 'SET_EDITING_ID', payload: id }) }

// 第46-48行：设置视图
const setView = (view) => { dispatch({ type: 'SET_VIEW', payload: view }) }
```

---

### 4.5 useMemo — 缓存计算结果

**使用文件**：

| 文件 | 行号 | 计算内容 | 依赖 |
|------|------|---------|------|
| `timesheet-app/components/TimesheetFilters.jsx` | 20 | 唯一项目列表 | `[timesheets]` |
| `timesheet-app/components/TimesheetSummary.jsx` | 41 | 汇总统计（每日/每周/按项目/按类型） | `[timesheets]` |
| `timesheet-app/components/TimesheetSummary.jsx` | 43 | 总工时 | `[timesheets]` |

#### timesheet-app 中的 useMemo

**唯一项目列表** — `timesheet-app/components/TimesheetFilters.jsx:20-23`

```javascript
// 第20-23行
const uniqueProjects = useMemo(() => {
  const projects = [...new Set(timesheets.map(ts => ts.project))];
  return projects.sort();
}, [timesheets]);
```

| 维度 | 说明 |
|------|------|
| 功能 | 从所有工时记录中提取唯一的项目名称，排序后返回 |
| 目的 | 为筛选下拉框提供项目选项，避免每次渲染重复执行 Set 去重操作 |
| 效果 | `timesheets` 不变时直接返回缓存结果，提升性能 |

**汇总统计计算** — `timesheet-app/components/TimesheetSummary.jsx:41-45`

```javascript
// 第41行
const summary = useMemo(() => calculateSummary(timesheets), [timesheets]);

// 第43-45行
const totalHours = useMemo(() => {
  return timesheets.reduce((sum, ts) => sum + parseFloat(ts.hours), 0);
}, [timesheets]);
```

| 维度 | 说明 |
|------|------|
| 功能 | 第一次：调用 `calculateSummary` 计算四维统计；第二次：累加总工时 |
| 目的 | 缓存昂贵的计算结果，timesheets 不变时不重算 |
| 效果 | 所有柱状图数据基于单一缓存的 `summary` 对象，避免重复计算 |

---

### 4.6 useRef — DOM 引用

**使用文件**：

| 文件 | 行号 | 用途 |
|------|------|------|
| `react-app/components/TimesheetForm.tsx` | 15 | 日期输入框聚焦 |
| `timesheet-app/components/TimesheetForm.jsx` | 16 | 项目输入框聚焦 |

#### react-app 中的 useRef

**日期输入框聚焦** — `react-app/components/TimesheetForm.tsx:15`

```typescript
// 第15行：创建 ref
const dateRef = useRef<HTMLInputElement>(null)

// 第137-143行：绑定到 input
<input
  ref={dateRef}
  type="date"
  name="date"
  value={formData.date}
  onChange={handleChange}
  style={inputStyle('date')}
/>

// 第93-95行：提交后聚焦
if (dateRef.current) {
  dateRef.current.focus()
}
```

| 维度 | 说明 |
|------|------|
| 功能 | 获取日期输入框的 DOM 引用，提交后自动聚焦 |
| 目的 | 提升键盘可访问性，用户提交后无需手动点击即可继续输入下一条记录 |
| 效果 | 修改 `dateRef.current` 不会触发重新渲染，仅操作 DOM |

#### timesheet-app 中的 useRef

**项目输入框聚焦** — `timesheet-app/components/TimesheetForm.jsx:16`

```javascript
// 第16行：创建 ref
const projectInputRef = useRef(null);

// 第27-29行：编辑模式下聚焦
if (projectInputRef.current) {
  projectInputRef.current.focus();
}

// 第109-117行：绑定到 input
<input
  id="project"
  name="project"
  type="text"
  value={formData.project}
  onChange={handleChange}
  ref={projectInputRef}
  placeholder="请输入项目名称"
  className={errors.project ? styles.inputError : ''}
/>
```

| 维度 | 说明 |
|------|------|
| 功能 | 获取项目输入框 DOM 引用，在编辑模式下自动聚焦 |
| 目的 | 编辑时用户可以直接修改项目名，无需手动点击 |
| 效果 | 编辑模式下聚焦项目输入框，提升用户体验 |

---

### 4.7 createContext — 创建上下文

**使用文件**：

| 文件 | 行号 | 创建内容 |
|------|------|---------|
| `react-app/TimesheetContext.tsx` | 7 | `TimesheetContext` |
| `timesheet-app/context/Provider.jsx` | 9 | `TimesheetContext`（从 TimesheetContext.js 导入） |

#### react-app 中的 createContext

**创建全局 Context** — `react-app/TimesheetContext.tsx:7`

```typescript
// 第2行：导入 React 核心 API
import { createContext, useContext, useState, ReactNode } from 'react'

// 第7行：创建 Context
const TimesheetContext = createContext<TimesheetContextValue | null>(null)
```

| 维度 | 说明 |
|------|------|
| 功能 | 创建一个 React Context 对象，作为全局状态的通信通道。初始值为 `null`，实际值由 `TimesheetProvider` 通过 `<TimesheetContext.Provider value={...}>` 提供 |
| 目的 | 避免 prop drilling（props 逐层传递），让深层子组件直接获取全局数据 |
| 效果 | 所有子组件通过 `useContext(TimesheetContext)` 或自定义 Hook `useTimesheet()` 读取共享状态 |

---

### 4.8 memo — 性能优化

**使用文件**：

| 文件 | 行号 | 优化内容 |
|------|------|---------|
| `timesheet-app/components/TimesheetList.jsx` | 13 | `TimesheetItem` 组件 |

#### timesheet-app 中的 memo

**列表项性能优化** — `timesheet-app/components/TimesheetList.jsx:13`

```javascript
// 第1行：导入
import { memo } from 'react';

// 第13-54行
export const TimesheetItem = memo(({ timesheet, onEdit, onDelete }) => {
  const typeColor = taskTypeColors[timesheet.taskType] || '#607D8B';

  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <span className={styles.itemDate}>{timesheet.date}</span>
        <span className={styles.itemProject}>{timesheet.project}</span>
        <span className={styles.itemHours}>{timesheet.hours}h</span>
      </div>
      <div className={styles.itemBody}>
        <span className={styles.taskTypeBadge} style={{ backgroundColor: typeColor }}>
          {timesheet.taskType}
        </span>
        <p className={styles.itemDescription}>{timesheet.description}</p>
      </div>
      <div className={styles.itemActions}>
        <button className={styles.editBtn} onClick={() => onEdit(timesheet)}>编辑</button>
        <button className={styles.deleteBtn} onClick={() => {
          if (window.confirm(`确定要删除 ${timesheet.date} 的工时记录吗？`)) {
            onDelete(timesheet.id);
          }
        }}>删除</button>
      </div>
    </div>
  );
});
```

| 维度 | 说明 |
|------|------|
| 功能 | 使用 `memo` 包裹 `TimesheetItem` 组件，进行 props 浅比较 |
| 目的 | 防止列表项不必要的重渲染 |
| 效果 | 当 timesheets 数据变化时，React 只重渲染 props 发生变化的列表项，而非全部 |

---

## 五、数据流对比

### react-app 数据流

```
用户操作 (表单提交/删除/切换状态)
        │
        ▼
┌─────────────────┐
│  TimesheetPage  │  useEffect:19 初始化数据
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  TimesheetProvider      │
│  useState:27 更新 records│
└────────┬────────────────┘
         │ 重新渲染
         ▼
┌─────────────────────────┐
│  子组件消费 Context     │
│  TimesheetForm (useState:18)│
│  TimesheetStats (reduce) │
│  TimesheetList (map)     │
└─────────────────────────┘
```

### timesheet-app 数据流

```
用户操作 (表单提交/删除/切换/筛选)
        │
        ▼
┌─────────────────────────┐
│  dispatch(action)       │  useReducer:12 处理
└────────┬────────────────┘
         │ 状态变更
         ▼
┌─────────────────────────┐     ┌──────────────────┐
│  子组件消费 Context     │     │  useEffect       │
│  TimesheetForm          │     │  Provider:14     │
│  TimesheetList (memo)   │     │  localStorage    │
│  TimesheetFilters       │     │  持久化写入      │
│  TimesheetSummary       │     └──────────────────┘
│  (useMemo 缓存计算)     │
└─────────────────────────┘
```

## 六、架构模式对比

### 6.1 状态管理方案

| 维度 | react-app (TS) | timesheet-app (JS) |
|------|---------------|-------------------|
| 状态存储 | `useState:27` | `useReducer:12` |
| 状态共享 | `createContext:7` + Provider | `createContext` + Provider |
| 状态消费 | 自定义 Hook `useTimesheet:11` | `useContext:13` 直接消费 |
| 适用场景 | 教学/简单场景 | 生产级应用 |

### 6.2 功能对比

| 功能 | react-app | timesheet-app |
|------|-----------|--------------|
| 新增记录 | 有 | 有 |
| 删除记录 | 有 | 有 |
| 切换状态 | 有 | 有 |
| 编辑记录 | 无 | 有 (`useEffect:18` 同步) |
| 数据筛选 | 无 | 有 (`useMemo:20` + `useState:6`) |
| 高级统计 | 基础 4 卡片 | 柱状图 + 4 维统计 (`useMemo:41`) |
| 主题切换 | 无 | 有 (`useState:68` + `useEffect:73`) |
| 数据持久化 | 无 | 有 (`useEffect:14`) |
| 性能优化 | 无 | `memo:13` |
| 数据导出 | 无 | JSON 导出 |

### 6.3 Hook 使用场景总结

| Hook | react-app 场景 | timesheet-app 场景 |
|------|--------------|-------------------|
| `useState` | 全局 records (`:27`)、表单数据 (`:18`)、错误状态 (`:27`) | 表单数据 (`:14`)、错误状态 (`:15`)、主题 (`:68`)、本地筛选 (`:6`) |
| `useEffect` | 页面初始化 (`TimesheetPage.tsx:19`) | localStorage 持久化 (`Provider.jsx:14`)、主题同步 (`Provider.jsx:73`)、编辑模式同步 (`TimesheetForm.jsx:18`) |
| `useContext` | 自定义 Hook 内部 (`TimesheetContext.tsx:12`) | App 直接消费 (`App.jsx:13`) |
| `useReducer` | 无 | 复杂状态 (`Provider.jsx:12`) |
| `useMemo` | 无 | 唯一项目列表 (`TimesheetFilters.jsx:20`)、汇总统计 (`TimesheetSummary.jsx:41`) |
| `useRef` | 日期输入聚焦 (`TimesheetForm.tsx:15`) | 项目输入聚焦 (`TimesheetForm.jsx:16`) |
| `memo` | 无 | 列表项优化 (`TimesheetList.jsx:13`) |

## 七、设计模式总结

### 7.1 Provider-Consumer 模式

两个项目都使用 `createContext` + `Provider` 实现全局状态共享，避免 prop drilling。

### 7.2 自定义 Hook 模式

- **react-app**：`useTimesheet()` (`TimesheetContext.tsx:11`) 封装 useContext + 空值校验
- **timesheet-app**：`useTheme()` 封装 useContext 获取主题

### 7.3 单向数据流

数据从 Provider 单向流向子组件，操作通过回调或 dispatch 触发，符合 React 单向数据流原则。

### 7.4 组件分层架构

```
页面层 (TimesheetPage / App)
    │ 负责：Provider 包裹、页面布局
    ▼
功能组件层 (Form / Stats / List / Filters)
    │ 负责：业务逻辑、数据操作、列表渲染
    ▼
展示组件层 (StatusBadge / TimesheetRow / TimesheetItem)
    └─ 负责：UI 渲染、样式展示、接收 props
```

## 八、Hook 选择指南

### 何时使用 useState

- 状态变更逻辑简单（如表单数据、开关状态）
- 状态之间无复杂依赖关系
- 数据量小，结构简单

### 何时使用 useReducer

- 状态逻辑复杂，涉及多个子状态
- 下一个状态依赖前一个状态
- 需要集中管理状态变更逻辑
- 状态变更类型多（如 CRUD + 筛选 + 视图切换）

### 何时使用 useMemo

- 计算结果昂贵（如遍历大数组、复杂计算）
- 计算依赖的值不频繁变化
- 避免重复计算提升性能

### 何时使用 useEffect

- 需要处理副作用（数据获取、DOM 操作、订阅）
- 需要与外部系统交互（localStorage、API）
- 需要在组件挂载/卸载时执行清理

### 何时使用 useRef

- 需要直接操作 DOM 元素
- 需要保存不触发重新渲染的值
- 需要访问子组件实例

### 何时使用 memo

- 组件树较深，props 变化频繁
- 组件渲染成本高
- props 变化不会导致 UI 变化时可跳过渲染

## 九、新人知识点手册

本章面向 React 新人，讲解 timesheet 中用到的核心 Hook 知识。

---

### 9.1 React Hooks 核心概念

**Hook 是什么？**

Hook 是 React 16.8 引入的新特性，让你在不编写 class 组件的情况下使用 state 和其他 React 特性。简单说，Hook 就是"在函数组件里用的特殊函数"。

**Timesheet 中用到的 Hook：**

| Hook | 作用 | react-app 使用位置 | timesheet-app 使用位置 |
|------|------|-------------------|----------------------|
| `useState` | 管理组件内部状态 | TimesheetContext, TimesheetForm | Provider, TimesheetForm, TimesheetFilters |
| `useContext` | 消费 Context 提供的数据 | TimesheetContext (自定义 Hook) | App |
| `useEffect` | 处理副作用（初始化、持久化、同步） | TimesheetPage | Provider (x2), TimesheetForm |
| `useReducer` | 管理复杂状态 | 无 | Provider |
| `useMemo` | 缓存计算结果 | 无 | TimesheetFilters, TimesheetSummary |
| `useRef` | 获取 DOM 引用 | TimesheetForm | TimesheetForm |
| `memo` | 性能优化，跳过不必要的渲染 | 无 | TimesheetList |

---

### 9.2 useState - 状态管理

**作用**：在函数组件中添加状态变量，使组件能够"记住"数据并响应变化。

**核心概念**：
- 状态（State）是组件的"记忆"，存储可能变化的数据
- 状态变化时，React 自动重新渲染组件，更新 UI
- 没有状态 = 纯展示组件，状态变化 = 响应式 UI

**基本语法**：
```javascript
const [状态变量, 更新函数] = useState(初始值)
```

**示例 - 管理工时记录列表**：
```javascript
// react-app: TimesheetContext.tsx:27
const [records, setRecords] = useState([])
```

**示例 - 管理表单数据**：
```javascript
// react-app: TimesheetForm.tsx:18
const [formData, setFormData] = useState({
  date: '', project: '', task: '', hours: '', description: ''
})
```

**示例 - 管理复杂状态**：
```javascript
// timesheet-app: Provider.jsx:12
const [state, dispatch] = useReducer(timesheetReducer, null, loadFromStorage)
```

**重要规则**：
1. 不要直接修改状态，始终使用 `setXxx` 函数
2. 使用函数式更新确保基于最新状态：`setRecords(prev => [...prev, newItem])`
3. 状态更新是异步的，调用后不会立即变化
4. 对象状态更新需要展开运算符，否则会用新对象完全替换

---

### 9.3 useContext - 跨组件共享数据

**作用**：在组件树中共享数据，避免"prop drilling"（逐层传递 props）。

**使用场景**：
- 全局主题（light/dark）
- 用户认证信息
- 全局状态管理（如 timesheet 的工时记录）

**两步使用流程**：

**第一步：创建 Context 并提供数据**
```javascript
// react-app: TimesheetContext.tsx:7
const TimesheetContext = createContext(null)

// react-app: TimesheetContext.tsx:63-67
<TimesheetContext.Provider value={{ records, addRecord, deleteRecord, toggleStatus }}>
  {children}
</TimesheetContext.Provider>
```

**第二步：在子组件中消费数据**
```javascript
// react-app：通过自定义 Hook (TimesheetContext.tsx:11)
const { records, addRecord } = useTimesheet()

// timesheet-app：直接消费 (App.jsx:13)
const { state, dispatch } = useContext(TimesheetContext)
```

---

### 9.4 useEffect - 处理副作用

**作用**：在组件渲染后执行副作用操作，如数据获取、DOM 操作、订阅等。

**基本语法**：
```javascript
useEffect(回调函数, 依赖数组)
```

**依赖数组的三种写法**：

| 写法 | 含义 | 执行时机 | timesheet 示例 |
|------|------|---------|---------------|
| `[]` | 仅首次执行 | 组件挂载时 | react-app: TimesheetPage.tsx:19 |
| `[dep]` | 依赖变化时执行 | 挂载 + 依赖变化时 | timesheet-app: Provider.jsx:14, TimesheetForm.jsx:18 |
| 不传 | 每次渲染都执行 | 每次渲染后 | 一般不推荐 |

**示例 - 页面初始化**：
```javascript
// react-app: TimesheetPage.tsx:19
useEffect(() => {
  INITIAL_DATA.forEach(data => addRecord(data))
}, [])
```

**示例 - 数据持久化**：
```javascript
// timesheet-app: Provider.jsx:14
useEffect(() => {
  localStorage.setItem('timesheet_data', JSON.stringify(state.timesheets))
}, [state.timesheets])
```

**示例 - 编辑模式同步**：
```javascript
// timesheet-app: TimesheetForm.jsx:18
useEffect(() => {
  if (editingTimesheet) {
    setFormData({ ...editingTimesheet, hours: editingTimesheet.hours.toString() })
  } else {
    setFormData(emptyForm)
  }
  setErrors({})
}, [editingTimesheet])
```

**清理函数**：
```javascript
useEffect(() => {
  const timer = setInterval(() => console.log('定时执行'), 1000)
  return () => clearInterval(timer)  // 清理函数，防止内存泄漏
}, [])
```

---

### 9.5 useReducer - 复杂状态管理

**作用**：当状态逻辑复杂时，用 reducer 模式替代 useState，使状态变更更可预测。

**核心概念**：
- `state`：当前状态对象
- `dispatch(action)`：发送动作，触发状态变更
- `reducer(state, action)`：纯函数，根据 action 返回新状态

**示例 - timesheet-app Provider.jsx:12**：
```javascript
const [state, dispatch] = useReducer(timesheetReducer, null, loadFromStorage)

function timesheetReducer(state, action) {
  switch (action.type) {
    case 'ADD_TIMESHEET':
      return { ...state, timesheets: [...state.timesheets, action.payload] }
    case 'UPDATE_TIMESHEET':
      return { ...state, timesheets: state.timesheets.map(ts =>
        ts.id === action.payload.id ? action.payload : ts
      )}
    case 'DELETE_TIMESHEET':
      return { ...state, timesheets: state.timesheets.filter(ts => ts.id !== action.payload) }
    // ... 更多 action 类型
  }
}
```

**useReducer vs useState 对比**：

| 维度 | useState | useReducer |
|------|----------|-----------|
| 适用场景 | 简单状态 | 复杂状态、多子状态 |
| 状态更新 | 直接设置新值 | 通过 dispatch(action) |
| 逻辑集中 | 分散在组件中 | 集中在 reducer 中 |
| 调试友好 | 一般 | 更好（action 可追踪） |
| timesheet 使用 | react-app | timesheet-app |

---

### 9.6 useMemo - 缓存计算结果

**作用**：缓存昂贵的计算结果，依赖值不变时不重算。

**基本语法**：
```javascript
const memoizedValue = useMemo(() => 计算函数, [依赖数组])
```

**示例 - 唯一项目列表**：
```javascript
// timesheet-app: TimesheetFilters.jsx:20
const uniqueProjects = useMemo(() => {
  const projects = [...new Set(timesheets.map(ts => ts.project))]
  return projects.sort()
}, [timesheets])
```

**示例 - 汇总统计**：
```javascript
// timesheet-app: TimesheetSummary.jsx:41
const summary = useMemo(() => calculateSummary(timesheets), [timesheets])
const totalHours = useMemo(() => timesheets.reduce((sum, ts) => sum + parseFloat(ts.hours), 0), [timesheets])
```

**何时使用 useMemo**：
- 计算结果昂贵（遍历大数组、复杂计算）
- 计算依赖的值不频繁变化
- 避免重复计算提升性能

---

### 9.7 useRef - 获取 DOM 引用

**作用**：获取或引用 DOM 元素，或保存一个不触发重新渲染的值。

**与 useState 的区别**：修改 ref.current **不会**触发重新渲染。

**示例 - DOM 聚焦**：
```javascript
// react-app: TimesheetForm.tsx:15
const dateRef = useRef<HTMLInputElement>(null)

// 提交后聚焦 (TimesheetForm.tsx:93)
if (dateRef.current) {
  dateRef.current.focus()
}
```

**useRef vs useState 对比**：

| 特性 | useRef | useState |
|------|--------|----------|
| 修改后是否重新渲染 | 否 | 是 |
| 适用场景 | DOM 引用、临时值 | 影响 UI 的数据 |
| 读取值 | `ref.current` | 直接读取变量 |

---

### 9.8 memo - 性能优化

**作用**：包裹组件，props 不变时跳过重新渲染。

**示例 - timesheet-app TimesheetList.jsx:13**：
```javascript
export const TimesheetItem = memo(({ timesheet, onEdit, onDelete }) => {
  // 组件内容
})
```

**使用场景**：
- 组件树较深，props 变化频繁
- 组件渲染成本高
- props 变化不会导致 UI 变化时可跳过渲染

---

### 9.9 关键知识点速查表

| 知识点 | 代码示例 | 一句话解释 |
|--------|---------|-----------|
| useState | `const [count, setCount] = useState(0)` | 管理组件内部状态 |
| useContext | `const data = useContext(MyContext)` | 消费 Context 数据 |
| useEffect | `useEffect(() => {}, [])` | 组件渲染后执行副作用 |
| useReducer | `const [state, dispatch] = useReducer(reducer, init)` | 管理复杂状态 |
| useMemo | `const val = useMemo(() => expensive(), [dep])` | 缓存计算结果 |
| useRef | `const ref = useRef(null)` | 获取 DOM 引用 |
| memo | `const Comp = memo(({ prop }) => <div>{prop}</div>)` | 跳过不必要的渲染 |
| 自定义 Hook | `function useXxx() { return useContext(...) }` | 封装可复用的逻辑 |

---

### 9.10 两种实现方案对比

| 对比维度 | react-app (TS) | timesheet-app (JS) |
|---------|---------------|-------------------|
| 状态管理 | useState + Context | useReducer + Context |
| 数据持久化 | 无 (内存存储) | localStorage 持久化 |
| 筛选功能 | 无 | 有 (日期/项目/类型) |
| 编辑功能 | 无 | 完整新增 + 编辑 |
| 统计功能 | 基础统计 (4卡片) | 高级统计 (柱状图+4维) |
| 主题切换 | 无 | 有 (light/dark) |
| 路由方式 | React Router 页面路由 | 应用内视图切换 |
| 样式方案 | 内联样式 | CSS Modules |
| 性能优化 | 无特殊优化 | React.memo |
| 数据导出 | 无 | JSON 导出 |
| Hook 数量 | 4 种 (useState/useContext/useEffect/useRef) | 7 种 (上述 + useReducer/useMemo/memo) |

## 十、扩展建议

1. **react-app 增加持久化**：使用 `useEffect` + `localStorage` 持久化 records 数据
2. **react-app 增加筛选**：在 `TimesheetContext` 中添加 filters 状态，支持按日期/项目/状态筛选
3. **react-app 增加编辑**：在 `TimesheetContext` 中添加 editingId 状态，复用 `TimesheetForm` 组件
4. **react-app 增加统计优化**：使用 `useMemo` 缓存统计计算结果
5. **timesheet-app 类型安全**：迁移到 TypeScript，使用 `useReducer` 的类型注解
6. **timesheet-app 错误边界**：添加 `ErrorBoundary` 组件，捕获渲染错误
7. **性能监控**：使用 `React.Profiler` 或 `why-did-you-render` 分析渲染性能