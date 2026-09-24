// 【角色 API 模块】页面统一经 HTTP 请求实例访问角色数据
import httpClient from './httpClient'
import type { Role } from '../types/timeEntry'

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