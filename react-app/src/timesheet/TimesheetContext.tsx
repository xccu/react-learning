import { createContext, useContext, useState, ReactNode } from 'react'
import type { TimesheetItem, TimesheetFormData, TimesheetContextValue } from './types'
import { TIMESHEET_STATUS_ORDER, generateId } from './types'

const TimesheetContext = createContext<TimesheetContextValue | null>(null)

function useTimesheet(): TimesheetContextValue {
  const context = useContext(TimesheetContext)
  if (!context) {
    throw new Error('useTimesheet must be used within a TimesheetProvider')
  }
  return context
}

interface TimesheetProviderProps {
  children: ReactNode
}

function TimesheetProvider({ children }: TimesheetProviderProps) {
  const [records, setRecords] = useState<TimesheetItem[]>([])

  const addRecord = (data: TimesheetFormData) => {
    const newRecord: TimesheetItem = {
      id: generateId(),
      date: data.date,
      project: data.project,
      task: data.task,
      hours: parseFloat(data.hours),
      status: 'pending',
      description: data.description,
    }
    setRecords((prev) => [...prev, newRecord])
  }

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const toggleStatus = (id: string) => {
    setRecords((prev) =>
      prev.map((record) => {
        if (record.id !== id) return record
        const currentIndex = TIMESHEET_STATUS_ORDER.indexOf(record.status)
        const nextIndex = (currentIndex + 1) % TIMESHEET_STATUS_ORDER.length
        return { ...record, status: TIMESHEET_STATUS_ORDER[nextIndex] }
      }),
    )
  }

  return (
    <TimesheetContext.Provider value={{ records, addRecord, deleteRecord, toggleStatus }}>
      {children}
    </TimesheetContext.Provider>
  )
}

export { TimesheetContext, TimesheetProvider, useTimesheet }