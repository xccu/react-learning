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

// 权限标识类型
export type Permission = string

// 角色名称类型（预定义角色）
export type RoleName = 'Administrator' | 'ProjectManager' | 'User'

// 用户角色（支持自定义角色名称）
export type UserRole = string

// 角色类型
export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

// 预定义角色名称列表
export const PREDEFINED_ROLE_NAMES: RoleName[] = ['Administrator', 'ProjectManager', 'User']

// 用户类型
// 【TypeScript 类型定义】定义用户的字段结构，roles 为一对多数组，支持多角色权限管理
export type User = {
  id: string
  username: string
  password: string          // mock 数据使用明文，不展示给前端用户
  roles: UserRole[]         // 一对多，支持多角色
  createdAt: string
}

// 权限映射：权限标识 → 中文显示标签
export const PERMISSION_LABELS: Record<Permission, string> = {
  'TimeSheet.Read': '工时查询',
  'TimeSheet.Write': '工时增删改',
  'TimeSheet.Export': '工时导出',
  'TimeSheet.Import': '工时导入',
  'TimeSheet.approval': '工时审批',
  'User.Read': '用户查询',
  'User.Write': '用户增删改',
  'Role.Read': '角色读取',
  'Role.Write': '角色管理',
}

// 所有权限标识常量
export const PERMISSIONS: Permission[] = [
  'TimeSheet.Read',
  'TimeSheet.Write',
  'TimeSheet.Export',
  'TimeSheet.Import',
  'TimeSheet.approval',
  'User.Read',
  'User.Write',
  'Role.Read',
  'Role.Write',
]

// 默认角色权限映射
export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  User: ['TimeSheet.Read', 'TimeSheet.Write'],
  ProjectManager: ['TimeSheet.Read', 'TimeSheet.Write', 'TimeSheet.Export', 'TimeSheet.Import', 'TimeSheet.approval', 'User.Read', 'User.Write'],
  Administrator: ['TimeSheet.Read', 'User.Read', 'User.Write', 'Role.Read', 'Role.Write'],
}

// 用户查询条件
export interface UserQuery {
  username?: string
  role?: UserRole | ''
}