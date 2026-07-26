export interface NavItem {
  path: string
  label: string
}

export interface NavSection {
  id: string
  title: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    id: 'components',
    title: '基础概念',
    items: [
      { path: 'components', label: '组件创建与嵌套' },
      { path: 'jsx', label: 'JSX 语法' },
      { path: 'styles', label: '添加样式' },
      { path: 'display-data', label: '显示数据' },
    ],
  },
  {
    id: 'interaction',
    title: '交互与数据',
    items: [
      { path: 'conditional', label: '条件渲染' },
      { path: 'lists', label: '渲染列表' },
      { path: 'events', label: '响应事件' },
      { path: 'state', label: 'State 管理' },
    ],
  },
  {
    id: 'advanced',
    title: '高级概念',
    items: [
      { path: 'hooks', label: '使用 Hook' },
      { path: 'hook-comparison', label: 'Hook 效果对比' },
      { path: 'sharing-data', label: '组件间数据共享' },
    ],
  },
]