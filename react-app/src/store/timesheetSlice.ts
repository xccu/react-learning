import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { TimeEntry } from '../types/timeEntry'
import {
  getEntries as getEntriesApi,
  getEntryById as getEntryByIdApi,
  addEntry as addEntryApi,
  updateEntry as updateEntryApi,
  deleteEntry as deleteEntryApi,
  approveEntry as approveEntryApi,
  rejectEntry as rejectEntryApi,
  submitEntry as submitEntryApi,
} from '../api/timeEntryApi'

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

// 异步 thunks：获取工时列表
export const fetchEntries = createAsyncThunk<TimeEntry[]>('timesheet/fetchEntries', async () => {
  return getEntriesApi()
})

// 异步 thunks：根据 ID 获取单条工时记录
export const fetchEntryById = createAsyncThunk<TimeEntry, string>('timesheet/fetchEntryById', async (id) => {
  return getEntryByIdApi(id)
})

// 异步 thunks：新增工时记录
export const createEntry = createAsyncThunk<TimeEntry, Omit<TimeEntry, 'id' | 'createdAt'>>('timesheet/createEntry', async (entryData) => {
  return addEntryApi(entryData)
})

// 异步 thunks：更新工时记录
export const updateEntryThunk = createAsyncThunk<TimeEntry, { id: string; updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>> }>(
  'timesheet/updateEntry',
  async ({ id, updates }) => {
    return updateEntryApi(id, updates)
  }
)

// 异步 thunks：删除工时记录
export const deleteEntryThunk = createAsyncThunk<void, string, { rejectValue: string }>('timesheet/deleteEntry', async (id, { rejectWithValue }) => {
  try {
    await deleteEntryApi(id)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : '删除失败')
  }
})

// 异步 thunks：审批通过
export const approveEntryThunk = createAsyncThunk<TimeEntry, string>('timesheet/approveEntry', async (id) => {
  return approveEntryApi(id)
})

// 异步 thunks：驳回
export const rejectEntryThunk = createAsyncThunk<TimeEntry, { id: string; reason: string }>('timesheet/rejectEntry', async ({ id, reason }) => {
  return rejectEntryApi(id, reason)
})

// 异步 thunks：重新提交审批
export const submitEntryThunk = createAsyncThunk<TimeEntry, string>('timesheet/submitEntry', async (id) => {
  return submitEntryApi(id)
})

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
    // 更新记录：按 id 查找并替换（同步）
    updateEntry(state, action: PayloadAction<TimeEntry>) {
      const index = state.entries.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.entries[index] = action.payload
      }
    },
    // 删除记录（同步）
    deleteEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload)
    },
    // 审批通过（同步）
    approveEntry(state, action: PayloadAction<string>) {
      const entry = state.entries.find((e) => e.id === action.payload)
      if (entry) {
        entry.approvalStatus = '已通过'
        entry.rejectReason = undefined
      }
    },
    // 驳回：记录原因（同步）
    rejectEntry(state, action: PayloadAction<{ id: string; reason: string }>) {
      const entry = state.entries.find((e) => e.id === action.payload.id)
      if (entry) {
        entry.approvalStatus = '已驳回'
        entry.rejectReason = action.payload.reason
      }
    },
    // 重新提交审批（同步）
    submitEntry(state, action: PayloadAction<string>) {
      const entry = state.entries.find((e) => e.id === action.payload)
      if (entry) {
        entry.approvalStatus = '待审批'
        entry.rejectReason = undefined
      }
    },
  },
  extraReducers: (builder) => {
    // fetchEntries
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false
        state.entries = action.payload
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '加载工时列表失败'
      })

    // fetchEntryById
    builder
      .addCase(fetchEntryById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEntryById.fulfilled, (state, action) => {
        state.loading = false
        // 如果该记录不在列表中，添加到最前面
        const exists = state.entries.find((e) => e.id === action.payload.id)
        if (!exists) {
          state.entries.unshift(action.payload)
        }
      })
      .addCase(fetchEntryById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '加载工时详情失败'
      })

    // createEntry
    builder
      .addCase(createEntry.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createEntry.fulfilled, (state, action) => {
        state.loading = false
        state.entries.unshift(action.payload)
      })
      .addCase(createEntry.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '创建工时记录失败'
      })

    // updateEntryThunk
    builder
      .addCase(updateEntryThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateEntryThunk.fulfilled, (state, action) => {
        state.loading = false
        const index = state.entries.findIndex((e) => e.id === action.payload.id)
        if (index !== -1) {
          state.entries[index] = action.payload
        }
      })
      .addCase(updateEntryThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '更新工时记录失败'
      })

    // deleteEntryThunk
    builder
      .addCase(deleteEntryThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteEntryThunk.fulfilled, (state, action) => {
        state.loading = false
        state.entries = state.entries.filter((e) => e.id !== action.meta.arg)
      })
      .addCase(deleteEntryThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? '删除工时记录失败'
      })

    // approveEntryThunk
    builder
      .addCase(approveEntryThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(approveEntryThunk.fulfilled, (state, action) => {
        state.loading = false
        const entry = state.entries.find((e) => e.id === action.payload.id)
        if (entry) {
          entry.approvalStatus = action.payload.approvalStatus
          entry.rejectReason = action.payload.rejectReason
        }
      })
      .addCase(approveEntryThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '审批通过失败'
      })

    // rejectEntryThunk
    builder
      .addCase(rejectEntryThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(rejectEntryThunk.fulfilled, (state, action) => {
        state.loading = false
        const entry = state.entries.find((e) => e.id === action.payload.id)
        if (entry) {
          entry.approvalStatus = action.payload.approvalStatus
          entry.rejectReason = action.payload.rejectReason
        }
      })
      .addCase(rejectEntryThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '驳回失败'
      })

    // submitEntryThunk
    builder
      .addCase(submitEntryThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitEntryThunk.fulfilled, (state, action) => {
        state.loading = false
        const entry = state.entries.find((e) => e.id === action.payload.id)
        if (entry) {
          entry.approvalStatus = action.payload.approvalStatus
          entry.rejectReason = action.payload.rejectReason
        }
      })
      .addCase(submitEntryThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '重新提交失败'
      })
  },
})

export const {
  setEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  approveEntry,
  rejectEntry,
  submitEntry,
} = timesheetSlice.actions

export default timesheetSlice.reducer