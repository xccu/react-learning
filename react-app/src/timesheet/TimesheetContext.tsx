// 导入 React 核心 API 和类型定义
import { createContext, useContext, useState, ReactNode } from 'react'
import type { TimesheetItem, TimesheetFormData, TimesheetContextValue } from './types'
import { TIMESHEET_STATUS_ORDER, generateId } from './types'

// 创建 Context，初始值为 null，通过 Provider 传入实际值
const TimesheetContext = createContext<TimesheetContextValue | null>(null)

// 自定义 Hook：封装 useContext 并添加空值校验
// 确保该 Hook 只能在 TimesheetProvider 内部使用
function useTimesheet(): TimesheetContextValue {
  const context = useContext(TimesheetContext)
  if (!context) {
    throw new Error('useTimesheet must be used within a TimesheetProvider')
  }
  return context
}

// Provider 组件的 props 类型
interface TimesheetProviderProps {
  children: ReactNode
}

// 工时数据全局状态提供者
// 使用 useState 管理 records 数组，提供增删改状态操作方法
function TimesheetProvider({ children }: TimesheetProviderProps) {
  const [records, setRecords] = useState<TimesheetItem[]>([])

  // 添加工时记录：生成唯一 ID，状态默认为 pending
  const addRecord = (data: TimesheetFormData) => {
    const newRecord: TimesheetItem = {
      id: generateId(),
      date: data.date,
      project: data.project,
      task: data.task,
      hours: parseFloat(data.hours),    // 将字符串转换为数字
      status: 'pending',
      description: data.description,
    }
    // 使用函数式更新，基于上一状态追加新记录
    setRecords((prev) => [...prev, newRecord])
  }

  // 删除工时记录：按 ID 过滤
  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  // 切换工时状态：pending -> submitted -> approved -> pending 循环
  const toggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== id) return record
        // 找到当前状态在顺序数组中的索引，+1 取模得到下一个状态
        const currentIndex = TIMESHEET_STATUS_ORDER.indexOf(record.status)
        const nextIndex = (currentIndex + 1) % TIMESHEET_STATUS_ORDER.length
        return { ...record, status: TIMESHEET_STATUS_ORDER[nextIndex] }
      }),
    )
  }

  // 将状态和操作方法通过 Provider 传递给所有子组件
  return (
    <TimesheetContext.Provider value={{ records, addRecord, deleteRecord, toggleStatus }}>
      {children}
    </TimesheetContext.Provider>
  )
}

export { TimesheetContext, TimesheetProvider, useTimesheet }