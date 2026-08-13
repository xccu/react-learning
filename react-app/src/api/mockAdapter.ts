// 【axios-mock-adapter】模拟后端 REST 接口，复用 mockApi 内存数据源
import MockAdapter from 'axios-mock-adapter'
import httpClient from './httpClient'
import { getEntries, queryEntries, getEntryById, addEntry, updateEntry, deleteEntry } from './mockApi'
import type { TimeEntryQuery } from './mockApi'
import type { TimeEntry } from '../types/timeEntry'

export function setupMockAdapter(): MockAdapter {
  const mock = new MockAdapter(httpClient, { delayResponse: 300 })

  // 列表 / 查询：带查询条件时走 queryEntries 过滤，否则返回全量
  mock.onGet('/time-entries').reply((config) => {
    const params = config.params as TimeEntryQuery | undefined
    const hasQuery = Boolean(params && (params.projectName || params.description || params.approvalStatus))
    if (hasQuery) {
      return queryEntries(params as TimeEntryQuery).then((data) => [200, data])
    }
    return getEntries().then((data) => [200, data])
  })

  // 详情
  mock.onGet(/\/time-entries\/.+$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    return getEntryById(id).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '记录不存在' }]
    )
  })

  // 新增
  mock.onPost('/time-entries').reply((config) => {
    const body = JSON.parse(config.data) as Omit<TimeEntry, 'id' | 'createdAt'>
    return addEntry(body).then((data) => [201, data])
  })

  // 编辑
  mock.onPut(/\/time-entries\/.+$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    const body = JSON.parse(config.data) as Partial<Omit<TimeEntry, 'id' | 'createdAt'>>
    return updateEntry(id, body).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '记录不存在' }]
    )
  })

  // 删除
  mock.onDelete(/\/time-entries\/.+$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    return deleteEntry(id).then(() => [200, { success: true }])
  })

  return mock
}

// 模块加载即注册 mock，使 /api/* 请求落入内存数据源处理
setupMockAdapter()
