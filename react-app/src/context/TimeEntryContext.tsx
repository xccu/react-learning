// 【TypeScript ReactNode 类型】ReactNode 表示任何可以渲染的内容（JSX、字符串、数字等）
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { TimeEntry } from '../api/mockApi'
import { getEntries, addEntry as apiAdd, updateEntry as apiUpdate, deleteEntry as apiDelete } from '../api/mockApi'

// 定义上下文的数据结构
// 【TypeScript interface】描述 Context 中传递的数据类型
interface TimeEntryContextType {
  entries: TimeEntry[]
  loading: boolean
  // 【TypeScript 函数类型】定义回调函数的参数和返回值类型
  addEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>
  updateEntry: (id: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

// 创建 Context
// 【TypeScript 泛型】createContext<TimeEntryContextType> 指定 Context 的数据类型
// undefined 是初始值，实际值由 TimeEntryProvider 提供
const TimeEntryContext = createContext<TimeEntryContextType | undefined>(undefined)

// 自定义 Hook：封装 useState、useEffect 和 mock API 调用
function useTimeEntriesProvider() {
  // 【TypeScript 泛型】useState<TimeEntry[]> 指定 entries 的类型为 TimeEntry 数组
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  // 组件挂载时调用 getEntries 获取初始数据
  useEffect(() => {
    // 【JavaScript Promise API】.then() 处理异步成功，.catch() 处理异步失败
    getEntries()
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, []) // 【React useEffect 依赖数组】空数组 [] 表示仅在组件首次挂载时执行一次（初始化），后续重新渲染不会重复触发

  // 添加记录
  const addEntry = async (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    const newEntry = await apiAdd(entry)
    // 【JavaScript 展开运算符】[newEntry, ...prev] 将新记录放到数组最前面
    setEntries((prev) => [newEntry, ...prev])
  }

  // 更新记录
  const updateEntry = async (id: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>) => {
    const updated = await apiUpdate(id, updates)
    // 【JavaScript Array.prototype.map()】遍历数组，匹配 ID 的记录返回更新后的值，其余保持不变
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  // 删除记录
  const deleteEntry = async (id: string) => {
    await apiDelete(id)
    // 【JavaScript Array.prototype.filter()】返回不包含指定 ID 的新数组
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}

// Provider 组件
// 【TypeScript 解构 + children 类型】{ children }: { children: ReactNode } 解构 children prop
function TimeEntryProvider({ children }: { children: ReactNode }) {
  const value = useTimeEntriesProvider()
  // 【JSX Context.Provider】将 value 作为 Context 的值向下传递
  return <TimeEntryContext.Provider value={value}>{children}</TimeEntryContext.Provider>
}

// 消费 Context 的 Hook
function useTimeEntries(): TimeEntryContextType {
  // 【React Hook useContext】从 Context 中获取当前值
  const context = useContext(TimeEntryContext)
  if (context === undefined) {
    // 【JavaScript Error 对象】在 Context 未提供时抛出错误，帮助开发者快速定位问题
    throw new Error('useTimeEntries must be used within a TimeEntryProvider')
  }
  return context
}

export { TimeEntryProvider, useTimeEntries }