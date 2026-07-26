// 工时状态联合类型：待提交 | 已提交 | 已审批
export type TimesheetStatus = 'pending' | 'submitted' | 'approved'

// 工时状态流转顺序数组，用于状态循环切换
export const TIMESHEET_STATUS_ORDER: TimesheetStatus[] = ['pending', 'submitted', 'approved']

// 工时记录数据模型
export interface TimesheetItem {
  id: string                    // 唯一标识
  date: string                  // 日期
  project: string               // 项目名称
  task: string                  // 任务描述
  hours: number                 // 工时数
  status: TimesheetStatus       // 状态
  description: string           // 详细说明
}

// 表单输入数据模型（工时为字符串类型，提交时转换为数字）
export interface TimesheetFormData {
  date: string
  project: string
  task: string
  hours: string
  description: string
}

// Context 值类型定义，包含数据和操作方法
export interface TimesheetContextValue {
  records: TimesheetItem[]                              // 工时记录列表
  addRecord: (data: TimesheetFormData) => void          // 添加记录
  deleteRecord: (id: string) => void                    // 删除记录
  toggleStatus: (id: string) => void                    // 切换状态
}

// 生成唯一 ID：基于时间戳 + 随机数
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

// 初始示例数据
export const INITIAL_DATA: TimesheetFormData[] = [
  {
    date: '2026-07-17',
    project: 'React 学习项目',
    task: '学习 React Hooks',
    hours: '4',
    description: '学习了 useState、useEffect、useContext、useRef',
  },
  {
    date: '2026-07-18',
    project: 'React 学习项目',
    task: '学习组件通信',
    hours: '3.5',
    description: 'Props 传递和 Context API',
  },
  {
    date: '2026-07-19',
    project: '工时填报功能',
    task: '设计工时填报页面',
    hours: '5',
    description: '完成页面设计和组件拆分',
  },
]