// 工时记录的数据类型
// 【TypeScript 类型定义】定义工时记录的字段结构
export type TimeEntry = {
  id: string
  projectName: string
  description: string
  hours: number
  approvalStatus: ApprovalStatus
  rejectReason?: string
  createdAt: string
}

// 审批状态枚举
// 【TypeScript 字面量类型联合】ApprovalStatus 只能是三个字符串之一
export type ApprovalStatus = '待审批' | '已通过' | '已驳回'

// 用户类型
// 【TypeScript 类型定义】定义用户的字段结构，roles 为一对多数组，为第6周多角色权限管理预留
export type User = {
  id: string
  username: string
  password: string          // mock 数据使用明文，不展示给前端用户
  roles: UserRole[]         // 一对多，为第6周多角色权限管理预留
  createdAt: string
}

// 用户角色枚举
export type UserRole = '管理员' | '普通用户'

// 用户查询条件
export interface UserQuery {
  username?: string
  role?: UserRole | ''
}