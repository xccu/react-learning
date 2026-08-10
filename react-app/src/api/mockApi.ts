// 工时记录的数据类型
// 【TypeScript 类型导出】仅从 types/timeEntry.ts 导入并重新导出供外部使用
import type { TimeEntry, ApprovalStatus } from '../types/timeEntry'
export type { TimeEntry, ApprovalStatus }

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