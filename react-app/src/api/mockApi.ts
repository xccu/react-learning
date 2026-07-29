// 工时记录的数据类型
export type TimeEntry = {
  id: string
  projectName: string
  description: string
  hours: number
  approvalStatus: ApprovalStatus
  createdAt: string
}

// 审批状态枚举
export type ApprovalStatus = '待审批' | '已通过' | '已驳回'

// 内存中初始化模拟数据数组（包含 3 条示例记录）
let entries: TimeEntry[] = [
  {
    id: '1',
    projectName: 'React 学习',
    description: '学习函数组件和 Hooks',
    hours: 3,
    approvalStatus: '已通过',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    projectName: '项目 A',
    description: '开发用户登录功能',
    hours: 5,
    approvalStatus: '待审批',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    projectName: '代码审查',
    description: '审查 Pull Request #42',
    hours: 1.5,
    approvalStatus: '已驳回',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
]

// 获取所有工时记录
export async function getEntries(): Promise<TimeEntry[]> {
  return Promise.resolve([...entries])
}

// 添加新记录
export async function addEntry(entry: Omit<TimeEntry, 'id' | 'createdAt'>): Promise<TimeEntry> {
  const newEntry: TimeEntry = {
    ...entry,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  entries = [newEntry, ...entries]
  return Promise.resolve(newEntry)
}

// 更新指定 ID 的记录
export async function updateEntry(id: string, updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>): Promise<TimeEntry> {
  const index = entries.findIndex((e) => e.id === id)
  if (index === -1) {
    return Promise.reject(new Error('记录不存在'))
  }
  entries[index] = { ...entries[index], ...updates }
  return Promise.resolve(entries[index])
}

// 删除指定 ID 的记录
export async function deleteEntry(id: string): Promise<void> {
  entries = entries.filter((e) => e.id !== id)
  return Promise.resolve()
}