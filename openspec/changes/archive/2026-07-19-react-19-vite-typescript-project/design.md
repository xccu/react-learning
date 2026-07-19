## Context

当前需要一个现代化的前端项目基础，用于学习和开发 React 应用。选择 React 19 作为最新稳定版本，Vite 作为快速构建工具，TypeScript 提供类型安全。

## Goals / Non-Goals

**Goals:**
- 搭建可立即运行的 React 19 + Vite + TypeScript 开发环境
- 配置完整的代码规范和质量检查流程
- 提供清晰的项目结构和示例代码

**Non-Goals:**
- 不包含状态管理库（如 Redux、Zustand）
- 不包含路由配置
- 不包含测试框架配置
- 不包含 CI/CD 流水线配置

## Decisions

- **使用 Vite 而非 Webpack**: Vite 提供更快的开发服务器启动速度和热更新，配置更简洁
- **使用 TypeScript 而非 JavaScript**: 提供类型安全，减少运行时错误，提升开发体验
- **使用 ESLint + Prettier 组合**: ESLint 检查代码逻辑规范，Prettier 格式化代码风格
- **使用 @vitejs/plugin-react**: 官方推荐的 Vite React 插件，支持快速刷新和 SWC 编译

## Risks / Trade-offs

- **React 19 版本较新**: 部分第三方库可能存在兼容性问题 → 选择经过验证的依赖版本
- **TypeScript 配置复杂度**: 严格的类型检查可能增加初期开发成本 → 使用推荐的严格配置但保留灵活性

## Open Questions

- 是否需要配置路径别名（如 @/ 指向 src/）
- 是否需要集成单元测试框架（如 Vitest）