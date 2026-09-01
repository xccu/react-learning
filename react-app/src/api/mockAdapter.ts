// 【axios-mock-adapter】模拟后端 REST 接口，复用 mockApi 内存数据源
import MockAdapter from 'axios-mock-adapter'
import httpClient from './httpClient'
import { getEntries, queryEntries, getEntryById, addEntry, addEntries, updateEntry, deleteEntry, submitEntry, approveEntry, rejectEntry, getUsers, queryUsers, getUserById, addUser, updateUser, deleteUser, login } from './mockApi'
import type { TimeEntryQuery, UserQuery } from './mockApi'
import type { TimeEntry, User } from '../types/timeEntry'

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

  // 批量新增
  mock.onPost('/time-entries/batch').reply((config) => {
    const body = JSON.parse(config.data) as Omit<TimeEntry, 'id' | 'createdAt'>[]
    return addEntries(body).then((data) => [201, data])
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

  // 提交审批
  mock.onPut(/\/time-entries\/.+\/submit$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    return submitEntry(id).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '记录不存在' }]
    )
  })

  // 审批通过
  mock.onPut(/\/time-entries\/.+\/approve$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    return approveEntry(id).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '记录不存在' }]
    )
  })

  // 驳回
  mock.onPut(/\/time-entries\/.+\/reject$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    const body = JSON.parse(config.data ?? '{}') as { reason: string }
    return rejectEntry(id, body.reason).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '记录不存在' }]
    )
  })

  // ========== 用户模块 ==========

  // 用户列表 / 查询
  mock.onGet('/users').reply((config) => {
    const params = config.params as UserQuery | undefined
    const hasQuery = Boolean(params && (params.username || params.role))
    if (hasQuery) {
      return queryUsers(params as UserQuery).then((data) => [200, data])
    }
    return getUsers().then((data) => [200, data])
  })

  // 用户详情
  mock.onGet(/\/users\/.+$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    return getUserById(id).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '用户不存在' }]
    )
  })

  // 新增用户
  mock.onPost('/users').reply((config) => {
    const body = JSON.parse(config.data) as Omit<User, 'id' | 'createdAt'>
    return addUser(body).then((data) => [201, data])
  })

  // 编辑用户
  mock.onPut(/\/users\/.+$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    const body = JSON.parse(config.data) as Partial<Omit<User, 'id' | 'createdAt' | 'password'>>
    return updateUser(id, body).then(
      (data) => [200, data],
      (err) => [404, { message: err instanceof Error ? err.message : '用户不存在' }]
    )
  })

  // 删除用户
  mock.onDelete(/\/users\/.+$/).reply((config) => {
    const id = (config.url ?? '').split('/').pop() ?? ''
    return deleteUser(id).then(() => [200, { success: true }])
  })

  // 用户登录
  mock.onPost('/users/login').reply((config) => {
    const body = JSON.parse(config.data) as { username: string; password: string }
    return login(body.username, body.password).then(
      (data) => [200, data],
      (err) => [401, { message: err instanceof Error ? err.message : '登录失败' }]
    )
  })

  return mock
}

// 模块加载即注册 mock，使 /api/* 请求落入内存数据源处理
setupMockAdapter()
