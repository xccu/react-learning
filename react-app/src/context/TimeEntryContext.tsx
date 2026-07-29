import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { TimeEntry } from '../api/mockApi'
import { getEntries, addEntry as apiAdd, updateEntry as apiUpdate, deleteEntry as apiDelete } from '../api/mockApi'

// 定义上下文的数据结构
interface TimeEntryContextType {
  entries: TimeEntry[]
  loading: boolean
  addEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>
  updateEntry: (id: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

// 创建 Context
const TimeEntryContext = createContext<TimeEntryContextType | undefined>(undefined)

// 自定义 Hook：封装 useState、useEffect 和 mock API 调用
function useTimeEntriesProvider() {
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  // 组件挂载时调用 getEntries 获取初始数据
  useEffect(() => {
    getEntries()
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // 添加记录
  const addEntry = async (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    const newEntry = await apiAdd(entry)
    setEntries((prev) => [newEntry, ...prev])
  }

  // 更新记录
  const updateEntry = async (id: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>) => {
    const updated = await apiUpdate(id, updates)
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  // 删除记录
  const deleteEntry = async (id: string) => {
    await apiDelete(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry }
}

// Provider 组件
function TimeEntryProvider({ children }: { children: ReactNode }) {
  const value = useTimeEntriesProvider()
  return <TimeEntryContext.Provider value={value}>{children}</TimeEntryContext.Provider>
}

// 消费 Context 的 Hook
function useTimeEntries(): TimeEntryContextType {
  const context = useContext(TimeEntryContext)
  if (context === undefined) {
    throw new Error('useTimeEntries must be used within a TimeEntryProvider')
  }
  return context
}

export { TimeEntryProvider, useTimeEntries }