import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { TimeEntry } from '../types/timeEntry'

interface TimesheetState {
  entries: TimeEntry[]
  loading: boolean
  error: string | null
}

const initialState: TimesheetState = {
  entries: [],
  loading: false,
  error: null,
}

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    // 设置所有工时记录（用于加载数据）
    setEntries(state, action: PayloadAction<TimeEntry[]>) {
      state.entries = action.payload
    },
    // 新增记录：放到数组最前面
    addEntry(state, action: PayloadAction<TimeEntry>) {
      state.entries.unshift(action.payload)
    },
    // 更新记录：按 id 查找并替换
    updateEntry(state, action: PayloadAction<TimeEntry>) {
      const index = state.entries.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.entries[index] = action.payload
      }
    },
    // 删除记录
    deleteEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload)
    },
    // 审批通过
    approveEntry(state, action: PayloadAction<string>) {
      const entry = state.entries.find((e) => e.id === action.payload)
      if (entry) {
        entry.approvalStatus = '已通过'
        entry.rejectReason = undefined
      }
    },
    // 驳回：记录原因
    rejectEntry(state, action: PayloadAction<{ id: string; reason: string }>) {
      const entry = state.entries.find((e) => e.id === action.payload.id)
      if (entry) {
        entry.approvalStatus = '已驳回'
        entry.rejectReason = action.payload.reason
      }
    },
  },
})

export const {
  setEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  approveEntry,
  rejectEntry,
} = timesheetSlice.actions

export default timesheetSlice.reducer