// 【用户 API 模块】页面统一经 HTTP 请求实例访问用户数据
import httpClient from './httpClient'
import type { User, UserQuery } from '../types/timeEntry'

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