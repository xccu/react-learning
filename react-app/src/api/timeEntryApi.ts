// 【数据请求模块】页面统一经 HTTP 请求实例访问工时数据，签名与 mockApi 保持一致
import httpClient from './httpClient'
import type { TimeEntry } from '../types/timeEntry'
import type { TimeEntryQuery } from './mockApi'

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
