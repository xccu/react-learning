import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import type { User, Role, Permission } from '../types/timeEntry'
import { getUsers as getUsersApi, getUserById as getUserByIdApi, addUser as addUserApi, updateUser as updateUserApi, deleteUser as deleteUserApi, login as loginApi, getRoles as getRolesApi, createRole as createRoleApi, updateRole as updateRoleApi, deleteRole as deleteRoleApi } from '../api/timeEntryApi'

interface UserState {
  users: User[]
  currentUser: User | null    // 当前登录用户
  roles: Role[]
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  roles: [],
  loading: false,
  error: null,
}

// 异步 thunks：获取用户列表
export const fetchUsers = createAsyncThunk<User[]>('user/fetchUsers', async () => {
  return getUsersApi()
})

// 异步 thunks：根据 ID 获取单个用户
export const fetchUserById = createAsyncThunk<User, string>('user/fetchUserById', async (id) => {
  return getUserByIdApi(id)
})

// 异步 thunks：创建用户
export const createUser = createAsyncThunk<User, Omit<User, 'id' | 'createdAt'>>('user/createUser', async (userData) => {
  return addUserApi(userData)
})

// 异步 thunks：更新用户
export const updateUser = createAsyncThunk<User, { id: string; updates: Partial<Omit<User, 'id' | 'createdAt' | 'password'>> }>(
  'user/updateUser',
  async ({ id, updates }) => {
    return updateUserApi(id, updates)
  }
)

// 异步 thunks：删除用户
export const removeUser = createAsyncThunk<void, string, { rejectValue: string }>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await deleteUserApi(id)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : '删除失败')
  }
})

// 异步 thunks：用户登录
export const loginUser = createAsyncThunk<User, { username: string; password: string }>('user/loginUser', async (credentials) => {
  return loginApi(credentials.username, credentials.password)
})

// 异步 thunks：获取角色列表
export const fetchRoles = createAsyncThunk<Role[]>('user/fetchRoles', async () => {
  return getRolesApi()
})

// 异步 thunks：创建角色
export const createRole = createAsyncThunk<Role, Omit<Role, 'id'>>('user/createRole', async (roleData) => {
  return createRoleApi(roleData)
})

// 异步 thunks：更新角色
export const updateRole = createAsyncThunk<Role, { id: string; updates: Partial<Omit<Role, 'id'>> }>(
  'user/updateRole',
  async ({ id, updates }) => {
    return updateRoleApi(id, updates)
  }
)

// 异步 thunks：删除角色
export const removeRole = createAsyncThunk<void, string, { rejectValue: string }>('user/deleteRole', async (id, { rejectWithValue }) => {
  try {
    await deleteRoleApi(id)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : '删除失败')
  }
})

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
    // 设置角色列表
    setRoles(state, action: PayloadAction<Role[]>) {
      state.roles = action.payload
    },
    // 新增角色
    addRole(state, action: PayloadAction<Role>) {
      state.roles.push(action.payload)
    },
    // 更新角色
    updateRoleSync(state, action: PayloadAction<Role>) {
      const index = state.roles.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.roles[index] = action.payload
      }
    },
    // 删除角色
    deleteRoleSync(state, action: PayloadAction<string>) {
      state.roles = state.roles.filter((r) => r.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '加载用户列表失败'
      })

    // fetchUserById
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '加载用户详情失败'
      })

    // createUser
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.unshift(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '创建用户失败'
      })

    // updateUser (async thunk)
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex((u) => u.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = action.payload
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '更新用户失败'
      })

    // deleteUser (async thunk)
    builder
      .addCase(removeUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter((u) => u.id !== action.meta.arg)
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? '删除用户失败'
      })

    // loginUser
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.currentUser = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '登录失败'
      })

    // fetchRoles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false
        state.roles = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '加载角色列表失败'
      })

    // createRole
    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles.push(action.payload)
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '创建角色失败'
      })

    // updateRole
    builder
      .addCase(updateRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false
        const index = state.roles.findIndex((r) => r.id === action.payload.id)
        if (index !== -1) {
          state.roles[index] = action.payload
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message ?? '更新角色失败'
      })

    // deleteRole
    builder
      .addCase(removeRole.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeRole.fulfilled, (state, action) => {
        state.loading = false
        state.roles = state.roles.filter((r) => r.id !== action.meta.arg)
      })
      .addCase(removeRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? '删除角色失败'
      })
  },
})

export const {
  setUsers,
  addUser,
  updateUser: updateUserSync,
  deleteUser,
  setCurrentUser,
  clearCurrentUser,
  setRoles,
  addRole,
  updateRole: updateRoleSync,
  deleteRole: deleteRoleSync,
} = userSlice.actions as any

export default userSlice.reducer