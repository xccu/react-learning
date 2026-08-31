## Why

工时填报应用已完成路由、数据请求、增删改查、导入导出与分页功能。当前审批状态（待审批/已通过/已驳回）仅作为静态字段展示，缺少完整的审批流程操作能力——用户无法提交审批、审批人无法通过或驳回、已驳回的记录无法进入重填流程。

根据学习计划，第4周引入 Redux Toolkit 和 Ant Design，这是整个学习过程中难度最高的阶段。通过审批流程这一真实业务场景，学习全局状态管理的核心思想，同时用组件库统一界面风格。

## What Changes

- **引入 Redux Toolkit**：创建全局 Store，将工时数据从 Context + useState 迁移到 Redux slice，支持同步更新与异步 thunk
- **引入 Ant Design**：安装 antd 并完成基础配置（ConfigProvider + 中文语言包），逐步替换现有 UI 组件
- **实现审批流程**：
  - 提交：将"待审批"记录提交为"待审批"状态
  - 审批通过：将"待审批"记录审批为"已通过"
  - 驳回：将"待审批"记录驳回为"已驳回"，需填写驳回原因
  - 重填：已驳回记录可重新编辑后再次提交
- **界面改造**：列表、表单、状态标签、确认弹窗等操作反馈组件替换为 Ant Design 实现

## Capabilities

### New Capabilities

- `approval-workflow`: 审批流程管理，包括提交审批、审批通过、驳回（含驳回原因记录）、重新填报，按状态控制可用操作按钮
- `global-state-management`: 全局状态管理，包括 Redux Store 配置、timesheet slice（状态与同步更新）、类型化 hooks（useSelector/useDispatch）
- `ant-design-ui`: UI 组件库集成，包括 ConfigProvider 中文配置、Table 表格、Form 表单、Modal 弹窗、Tag 状态标签、Popconfirm 确认气泡、message 消息提示

### Modified Capabilities

- `time-tracking-app`: 状态管理从 Context 迁移到 Redux，UI 组件替换为 Ant Design