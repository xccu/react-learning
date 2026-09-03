import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { fetchUsers, removeUser } from '../store/userSlice'
import { Table, Tag, Popconfirm, message, Space, Button, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import UserQueryForm from '../components/timesheet/UserQueryForm'
import type { User } from '../types/timeEntry'
import { queryUsers } from '../api/timeEntryApi'
import styles from './UserListPage.module.css'

// 角色颜色映射
const roleColor: Record<string, string> = {
  '管理员': 'blue',
  '普通用户': 'green',
}

// 格式化时间
const formatDate = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 用户列表页：使用 Ant Design Table 展示用户
function UserListPage() {
  const { users, loading, error } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  // 挂载时加载用户数据
  useEffect(() => {
    if (users.length === 0 && !loading) {
      dispatch(fetchUsers())
    }
  }, [dispatch, users.length, loading])

  // 查询结果保存在本地 state：null 表示未过滤，显示 Store 全量
  const [filtered, setFiltered] = useState<User[] | null>(null)
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 待展示记录：有查询结果用查询结果，否则用 Store 全量
  const visibleUsers = filtered ?? users

  // 计算当前页数据
  const startIndex = (currentPage - 1) * pageSize
  const currentUsers = visibleUsers.slice(startIndex, startIndex + pageSize)

  // 提交查询：条件全空时恢复全部；否则调用 queryUsers
  const handleQuery = useCallback(
    async (query: { username?: string; role?: string }) => {
      const { username, role } = query
      if (!username && !role) {
        setFiltered(null)
      } else {
        setFiltered(await queryUsers(query))
      }
      // 查询条件变化时重置 currentPage 为 1
      setCurrentPage(1)
    },
    []
  )

  // 新增用户：跳转到独立新增页
  const handleCreate = useCallback(() => {
    navigate('/users/create')
  }, [navigate])

  // 删除用户：二次确认后 dispatch removeUser thunk
  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(removeUser(id))
      message.success('删除成功')
      // 处于查询过滤状态时同步移除已删除记录
      setFiltered((prev) => {
        if (!prev) return prev
        const newFiltered = prev.filter((u) => u.id !== id)
        // 删除当前页最后一条记录时自动跳转到上一页
        if (newFiltered.length > 0) {
          const newTotalPages = Math.ceil(newFiltered.length / pageSize)
          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages)
          }
        }
        return newFiltered
      })
    },
    [dispatch, currentPage, pageSize]
  )

  // 定义 Table columns
  const columns: ColumnsType<User> = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space size="small">
          {roles.map((role) => (
            <Tag key={role} color={roleColor[role]}>{role}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => formatDate(v),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => navigate(`/users/${record.id}`)}>详情</Button>
          <Button size="small" onClick={() => navigate(`/users/${record.id}/edit`)}>编辑</Button>
          <Popconfirm
            title="确定删除该用户吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <UserQueryForm onQuery={handleQuery} onCreate={handleCreate} />

      {loading ? (
        <p className={styles.status}>加载中...</p>
      ) : error ? (
        <p className={styles.status}>加载失败：{error}</p>
      ) : (
        <>
          {/* 使用 Ant Design Table 渲染列表 */}
          <Table<User>
            rowKey="id"
            columns={columns}
            dataSource={currentUsers}
            loading={loading}
            pagination={false}
            locale={{ emptyText: '暂无用户数据' }}
          />
          {/* 分页控件 */}
          {visibleUsers.length > 0 && (
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={visibleUsers.length}
                onChange={(page) => setCurrentPage(page)}
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default UserListPage