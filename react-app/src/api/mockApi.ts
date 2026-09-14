// 工时记录的数据类型
// 【TypeScript 类型导出】仅从 types/timeEntry.ts 导入并重新导出供外部使用
import type { TimeEntry, ApprovalStatus, User, UserRole, Role, Permission, RoleName, UserQuery } from '../types/timeEntry'
export type { TimeEntry, ApprovalStatus, User, UserRole, Role, Permission, RoleName, UserQuery }

// 内存中初始化模拟数据数组（包含 3 条示例记录）
let entries: TimeEntry[] = [
  {
    id: '1',
    projectName: 'React 学习',
    description: '学习函数组件和 Hooks',
    hours: 3,
    approvalStatus: '已通过',
    // 【JavaScript Date API】Date.now() 返回当前时间戳（毫秒），减去 86400000 得到昨天的时间
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    projectName: '项目 A',
    description: '开发用户登录功能',
    hours: 5,
    approvalStatus: '待审批',
    // 【JavaScript Date API】减去 43200000 得到前天的时间
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    projectName: '代码审查',
    description: '审查 Pull Request #42',
    hours: 1.5,
    approvalStatus: '已驳回',
    // 【JavaScript Date API】减去 21600000 得到大前天的时间
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
]

// 查询条件类型：字段均可选，空字符串表示不限
// 【TypeScript 可选属性】projectName / description / approvalStatus 均可选；approvalStatus 为空串表示不按状态过滤
export interface TimeEntryQuery {
  projectName?: string
  description?: string
  approvalStatus?: ApprovalStatus | ''
}

// 获取所有工时记录
// 【TypeScript Promise 类型】返回 Promise<TimeEntry[]>，模拟异步 API 调用
export async function getEntries(): Promise<TimeEntry[]> {
  // 【JavaScript Promise API】Promise.resolve() 将同步值包装为 Promise，模拟异步返回
  return Promise.resolve([...entries])
}

// 获取单条工时记录
export async function getEntryById(id: string): Promise<TimeEntry> {
  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    // 【JavaScript Promise API】Promise.reject() 模拟异步错误返回
    return Promise.reject(new Error('记录不存在'))
  }
  return Promise.resolve(entry)
}

// 按查询条件过滤工时记录
// 【TypeScript 可选链】?? 将 undefined/空串归一为空串，避免对空条件误过滤
export async function queryEntries(query: TimeEntryQuery): Promise<TimeEntry[]> {
  const projectName = query.projectName?.trim() ?? ''
  const description = query.description?.trim() ?? ''
  const approvalStatus = query.approvalStatus ?? ''

  // 【JavaScript Array.prototype.filter()】逐个条件判断，全部命中才保留
  const filtered = entries.filter((e) => {
    if (projectName && !e.projectName.toLowerCase().includes(projectName.toLowerCase())) return false
    if (description && !e.description.toLowerCase().includes(description.toLowerCase())) return false
    if (approvalStatus && e.approvalStatus !== approvalStatus) return false
    return true
  })
  return Promise.resolve([...filtered])
}

// 添加新记录
// 【TypeScript Omit 工具类型】Omit<TimeEntry, 'id' | 'createdAt'> 表示传入的数据不包含 id 和 createdAt
export async function addEntry(entry: Omit<TimeEntry, 'id' | 'createdAt'>): Promise<TimeEntry> {
  const newEntry: TimeEntry = {
    ...entry,
    // 【JavaScript Date API】Date.now().toString() 生成唯一 ID
    id: Date.now().toString(),
    // 【JavaScript Date API】new Date().toISOString() 生成 ISO 格式时间字符串
    createdAt: new Date().toISOString(),
  }
  // 【JavaScript 展开运算符】将新记录放到数组最前面
  entries = [newEntry, ...entries]
  return Promise.resolve(newEntry)
}

// 更新指定 ID 的记录
// 【TypeScript Partial 工具类型】Partial<...> 表示 updates 中的字段都是可选的
export async function updateEntry(id: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>): Promise<TimeEntry> {
  // 【JavaScript Array.prototype.findIndex()】查找指定 ID 的记录索引
  const index = entries.findIndex((e) => e.id === id)
  if (index === -1) {
    // 【JavaScript Promise API】Promise.reject() 模拟异步错误返回
    return Promise.reject(new Error('记录不存在'))
  }
  // 【JavaScript 展开运算符】浅拷贝原记录并合并更新字段
  entries[index] = { ...entries[index], ...updates }
  return Promise.resolve(entries[index])
}

// 删除指定 ID 的记录
// 【JavaScript Array.prototype.filter()】返回不包含指定 ID 的新数组
export async function deleteEntry(id: string): Promise<void> {
  entries = entries.filter((e) => e.id !== id)
  return Promise.resolve()
}

// 批量添加工时记录
export async function addEntries(newEntries: Omit<TimeEntry, 'id' | 'createdAt'>[]): Promise<TimeEntry[]> {
  const addedEntries: TimeEntry[] = []
  for (const entry of newEntries) {
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    }
    entries = [newEntry, ...entries]
    addedEntries.push(newEntry)
  }
  return Promise.resolve(addedEntries)
}

// 提交审批：将状态改为"待审批"
export async function submitEntry(id: string): Promise<TimeEntry> {
  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    return Promise.reject(new Error('记录不存在'))
  }
  entry.approvalStatus = '待审批'
  entry.rejectReason = undefined
  return Promise.resolve(entry)
}

// 审批通过
export async function approveEntry(id: string): Promise<TimeEntry> {
  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    return Promise.reject(new Error('记录不存在'))
  }
  entry.approvalStatus = '已通过'
  entry.rejectReason = undefined
  return Promise.resolve(entry)
}

// 驳回：记录原因
export async function rejectEntry(id: string, reason: string): Promise<TimeEntry> {
  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    return Promise.reject(new Error('记录不存在'))
  }
  entry.approvalStatus = '已驳回'
  entry.rejectReason = reason
  return Promise.resolve(entry)
}

// ========== 角色和权限模块 ==========

// 默认角色数据
let roles: Role[] = [
  {
    id: '1',
    name: 'Administrator',
    permissions: ['TimeSheet.Read', 'User.Read', 'User.Write', 'Role.Read', 'Role.Write'],
  },
  {
    id: '2',
    name: 'ProjectManager',
    permissions: ['TimeSheet.Read', 'TimeSheet.Write', 'TimeSheet.Export', 'TimeSheet.Import', 'TimeSheet.approval', 'User.Read', 'User.Write'],
  },
  {
    id: '3',
    name: 'User',
    permissions: ['TimeSheet.Read', 'TimeSheet.Write'],
  },
]

// 获取所有角色
export async function getRoles(): Promise<Role[]> {
  return Promise.resolve([...roles])
}

// 获取单个角色
export async function getRoleById(id: string): Promise<Role> {
  const role = roles.find((r) => r.id === id)
  if (!role) {
    return Promise.reject(new Error('角色不存在'))
  }
  return Promise.resolve({ ...role })
}

// 根据角色名获取角色
export async function getRoleByName(name: RoleName): Promise<Role | undefined> {
  return roles.find((r) => r.name === name)
}

// 创建角色
export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const newRole: Role = {
    ...role,
    id: Date.now().toString(),
  }
  roles = [...roles, newRole]
  return Promise.resolve(newRole)
}

// 更新角色
export async function updateRole(id: string, updates: Partial<Omit<Role, 'id'>>): Promise<Role> {
  const index = roles.findIndex((r) => r.id === id)
  if (index === -1) {
    return Promise.reject(new Error('角色不存在'))
  }
  roles[index] = { ...roles[index], ...updates }
  return Promise.resolve({ ...roles[index] })
}

// 删除角色
export async function deleteRole(id: string): Promise<void> {
  const role = roles.find((r) => r.id === id)
  if (!role) {
    return Promise.reject(new Error('角色不存在'))
  }
  if (role.name === 'Administrator') {
    return Promise.reject(new Error('不能删除 Administrator 角色'))
  }
  roles = roles.filter((r) => r.id !== id)
  return Promise.resolve()
}

// 检查用户是否有指定权限
export function hasPermission(userRoles: UserRole[], permission: Permission): boolean {
  for (const roleName of userRoles) {
    const role = roles.find((r) => r.name === roleName)
    if (role && role.permissions.includes(permission)) {
      return true
    }
  }
  return false
}

// 获取用户的所有权限
export function getUserPermissions(userRoles: UserRole[]): Permission[] {
  const permissions: Permission[] = []
  for (const roleName of userRoles) {
    const role = roles.find((r) => r.name === roleName)
    if (role) {
      permissions.push(...role.permissions)
    }
  }
  return [...new Set(permissions)]
}

// ========== 用户模块 ==========

// 内存中初始化用户模拟数据（包含 3 个默认用户）
let users: User[] = [
  {
    id: '1',
    username: 'Administrator',
    password: 'Pass@word0',
    roles: ['Administrator'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    username: 'ProjectManager',
    password: 'Pass@word0',
    roles: ['ProjectManager'],
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    username: 'User',
    password: 'Pass@word0',
    roles: ['User'],
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
]

// 获取所有用户
export async function getUsers(): Promise<User[]> {
  return Promise.resolve([...users])
}

// 按查询条件过滤用户
export async function queryUsers(query: UserQuery): Promise<User[]> {
  const username = query.username?.trim() ?? ''
  const role = query.role ?? ''

  const filtered = users.filter((u) => {
    if (username && !u.username.toLowerCase().includes(username.toLowerCase())) return false
    if (role && !u.roles.includes(role)) return false
    return true
  })
  return Promise.resolve([...filtered])
}

// 获取单个用户
export async function getUserById(id: string): Promise<User> {
  const user = users.find((u) => u.id === id)
  if (!user) {
    return Promise.reject(new Error('用户不存在'))
  }
  return Promise.resolve({ ...user })
}

// 新增用户
export async function addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  users = [newUser, ...users]
  return Promise.resolve(newUser)
}

// 更新用户
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>): Promise<User> {
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    return Promise.reject(new Error('用户不存在'))
  }
  users[index] = { ...users[index], ...updates }
  return Promise.resolve(users[index])
}

// 删除用户
export async function deleteUser(id: string): Promise<void> {
  users = users.filter((u) => u.id !== id)
  return Promise.resolve()
}

// 用户登录：验证用户名+密码
export async function login(username: string, password: string): Promise<User> {
  const user = users.find((u) => u.username === username && u.password === password)
  if (!user) {
    return Promise.reject(new Error('用户名或密码错误'))
  }
  return Promise.resolve({ ...user })
}