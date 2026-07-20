export type TimesheetStatus = 'pending' | 'submitted' | 'approved'

export const TIMESHEET_STATUS_ORDER: TimesheetStatus[] = ['pending', 'submitted', 'approved']

export interface TimesheetItem {
  id: string
  date: string
  project: string
  task: string
  hours: number
  status: TimesheetStatus
  description: string
}

export interface TimesheetFormData {
  date: string
  project: string
  task: string
  hours: string
  description: string
}

export interface TimesheetContextValue {
  records: TimesheetItem[]
  addRecord: (data: TimesheetFormData) => void
  deleteRecord: (id: string) => void
  toggleStatus: (id: string) => void
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

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