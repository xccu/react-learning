## Context

当前 App.tsx 直接内联了 TimeSheetPage 组件及其全部业务逻辑（useState 状态管理、事件处理、数据计算），导致 App 层与具体业务页面强耦合。当后续需要添加更多页面（如设置页、关于页）时，App.tsx 会变得臃肿且难以维护。

## Goals / Non-Goals

**Goals:**
- 将 TimeSheetPage 的业务逻辑从 App.tsx 中提取为独立组件
- 创建页面路由配置，将导航项与页面组件映射
- App.tsx 仅保留布局壳和导航配置，根据导航选择渲染对应页面
- 保持所有原有 React 技术栈不变

**Non-Goals:**
- 不引入 react-router 等路由库
- 不改变现有 UI 样式和交互
- 不修改 TimeSheetPage 内部的业务逻辑
- 不引入新概念：navPages 只是简单的对象映射 `{ key: Component }`，初学者已掌握对象和组件概念

## Decisions

1. **使用配置驱动的页面映射**：在 App.tsx 中定义 navPages 配置对象，将导航 key 映射到页面组件，避免 if/else 或 switch
   - **为什么对初学者友好**：navPages 只是 `{ timesheet: TimeSheetPage }` 这样简单的对象映射，初学者已掌握对象字面量和组件引用，无需学习新概念
   - **替代方案**：if/else 链也可行，但 navPages 更简洁，且后续添加页面只需加一行配置，无需改逻辑
2. **TimeSheetPage 独立文件**：将 TimeSheetPage 提取到 `src/pages/TimeSheetPage.tsx`，保持其原有功能不变
3. **保持 Context 全局状态**：TimeEntryProvider 仍在 App 层包裹，TimeSheetPage 通过 useContext 消费数据
4. **不引入路由库**：继续使用 useState 管理 activeNav 状态，条件渲染切换页面

## Risks / Trade-offs

- [Risk] 页面数量增加时 navPages 配置可能变大 → 可按需懒加载（当前阶段不需要）
- [Trade-off] 不使用路由库意味着刷新页面会丢失导航状态 → 当前学习项目可接受