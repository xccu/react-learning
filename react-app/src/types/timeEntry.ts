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