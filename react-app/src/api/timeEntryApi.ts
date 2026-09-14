// 【数据请求模块】页面统一经 HTTP 请求实例访问工时数据，签名与 mockApi 保持一致
import httpClient from './httpClient'
import type { TimeEntry, Role } from '../types/timeEntry'
import type { TimeEntryQuery, User, UserQuery } from './mockApi'

// 获取所有工时记录
export async function getEntries(): Promise<TimeEntry[]> {
  const { data } = await httpClient.get<TimeEntry[]>('/time-entries')
  return data
}

// 按查询条件过滤工时记录
export async function queryEntries(query: TimeEntryQuery): Promise<TimeEntry[]> {
  const { data } = await httpClient.get<TimeEntry[]>('/time-entries', { params: query })
  return data
}

// 获取单条工时记录
export async function getEntryById(id: string): Promise<TimeEntry> {
  const { data } = await httpClient.get<TimeEntry>(`/time-entries/${id}`)
  return data
}

// 新增工时记录
export async function addEntry(entry: Omit<TimeEntry, 'id' | 'createdAt'>): Promise<TimeEntry> {
  const { data } = await httpClient.post<TimeEntry>('/time-entries', entry)
  return data
}

// 更新指定 ID 的工时记录
export async function updateEntry(
  id: string,
  updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>
): Promise<TimeEntry> {
  const { data } = await httpClient.put<TimeEntry>(`/time-entries/${id}`, updates)
  return data
}

// 删除指定 ID 的工时记录
export async function deleteEntry(id: string): Promise<void> {
  await httpClient.delete(`/time-entries/${id}`)
}

// 批量添加工时记录
export async function addEntries(entries: Omit<TimeEntry, 'id' | 'createdAt'>[]): Promise<TimeEntry[]> {
  const { data } = await httpClient.post<TimeEntry[]>('/time-entries/batch', entries)
  return data
}

// 提交审批
export async function submitEntry(id: string): Promise<TimeEntry> {
  const { data } = await httpClient.put<TimeEntry>(`/time-entries/${id}/submit`)
  return data
}

// 审批通过
export async function approveEntry(id: string): Promise<TimeEntry> {
  const { data } = await httpClient.put<TimeEntry>(`/time-entries/${id}/approve`)
  return data
}

// 驳回
export async function rejectEntry(id: string, reason: string): Promise<TimeEntry> {
  const { data } = await httpClient.put<TimeEntry>(`/time-entries/${id}/reject`, { reason })
  return data
}

// ========== 用户模块 ==========

// 获取所有用户
export async function getUsers(): Promise<User[]> {
  const { data } = await httpClient.get<User[]>('/users')
  return data
}

// 按查询条件过滤用户
export async function queryUsers(query: UserQuery): Promise<User[]> {
  const { data } = await httpClient.get<User[]>('/users', { params: query })
  return data
}

// 获取单个用户
export async function getUserById(id: string): Promise<User> {
  const { data } = await httpClient.get<User>(`/users/${id}`)
  return data
}

// 新增用户
export async function addUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const { data } = await httpClient.post<User>('/users', user)
  return data
}

// 更新用户
export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'password'>>): Promise<User> {
  const { data } = await httpClient.put<User>(`/users/${id}`, updates)
  return data
}

// 删除用户
export async function deleteUser(id: string): Promise<void> {
  await httpClient.delete(`/users/${id}`)
}

// 用户登录
export async function login(username: string, password: string): Promise<User> {
  const { data } = await httpClient.post<User>('/users/login', { username, password })
  return data
}

// ========== 角色模块 ==========

// 获取所有角色
export async function getRoles(): Promise<Role[]> {
  const { data } = await httpClient.get<Role[]>('/roles')
  return data
}

// 获取单个角色
export async function getRoleById(id: string): Promise<Role> {
  const { data } = await httpClient.get<Role>(`/roles/${id}`)
  return data
}

// 创建角色
export async function createRole(role: Omit<Role, 'id'>): Promise<Role> {
  const { data } = await httpClient.post<Role>('/roles', role)
  return data
}

// 更新角色
export async function updateRole(id: string, updates: Partial<Omit<Role, 'id'>>): Promise<Role> {
  const { data } = await httpClient.put<Role>(`/roles/${id}`, updates)
  return data
}

// 删除角色
export async function deleteRole(id: string): Promise<void> {
  await httpClient.delete(`/roles/${id}`)
}
