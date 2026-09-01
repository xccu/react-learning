import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/timeEntry'

interface UserState {
  users: User[]
  currentUser: User | null    // 当前登录用户
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置所有用户（用于加载数据）
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload
    },
    // 新增用户：放到数组最前面
    addUser(state, action: PayloadAction<User>) {
      state.users.unshift(action.payload)
    },
    // 更新用户：按 id 查找并替换
    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    // 删除用户
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    // 设置当前登录用户
    setCurrentUser(state, action: PayloadAction<User | null>) {
      state.currentUser = action.payload
    },
    // 清除当前用户
    clearCurrentUser(state) {
      state.currentUser = null
    },
  },
  extraReducers: (_builder) => {
    // 处理异步操作的 pending/fulfilled/rejected
    // 示例：
    // builder
    //   .addCase(loginUser.pending, (state) => {
    //     state.loading = true
    //     state.error = null
    //   })
    //   .addCase(loginUser.fulfilled, (state, action) => {
    //     state.loading = false
    //     state.currentUser = action.payload
    //   })
    //   .addCase(loginUser.rejected, (state, action) => {
    //     state.loading = false
    //     state.error = action.error.message ?? '操作失败'
    //   })
  },
})

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  clearCurrentUser,
} = userSlice.actions

export default userSlice.reducer