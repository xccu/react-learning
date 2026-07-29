## Why

当前 App.tsx 直接内联了 TimeSheetPage 组件及其全部业务逻辑（状态管理、事件处理、数据计算），导致 App 层与具体业务页面强耦合。当后续需要添加更多页面（如设置页、关于页）时，App.tsx 会变得臃肿且难以维护。需要将 App.tsx 改造为纯布局壳，通过导航配置驱动右侧内容区的渲染。

**对初学者友好：** 解耦后的结构更清晰，初学者可以分别阅读 App.tsx（布局）和 TimeSheetPage.tsx（业务），降低理解门槛。

## What Changes

- 将 TimeSheetPage 的业务逻辑从 App.tsx 中提取为独立模块
- 创建页面路由配置，将导航项与页面组件映射
- App.tsx 仅保留布局壳和导航配置，根据导航选择渲染对应页面
- 右侧内容区根据导航点击动态切换渲染不同组件
- 保持所有原有 React 技术栈不变（useState、useEffect、useContext、useRef、Props、条件/列表渲染）
- 保持用户体验不变：表单创建、编辑、删除、统计功能与解耦前完全一致
- 保持对初学者友好：不引入新概念（如 react-router），仅将内联逻辑提取为独立文件

## Capabilities

### New Capabilities
- `decouple-timesheet-app`: 将 App.tsx 与 TimeSheet 解耦，通过导航配置驱动页面渲染

### Modified Capabilities
<!-- 无 -->

## Impact

- 修改 App.tsx：移除内联的 TimeSheetPage 逻辑，改为导航配置 + 动态渲染
- 新增 TimeSheetPage 独立文件：包含完整的工时填报业务逻辑
- 新增 pages 目录：存放各页面组件
- 新增 navConfig 配置：导航项与页面组件的映射关系