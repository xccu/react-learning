import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, message, Modal, Form, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { fetchRoles, removeRole } from '../store/userSlice'
import type { Role } from '../types/timeEntry'
import Header from '../components/timesheet/Header'
import styles from './PermissionListPage.module.css'

function PermissionListPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const roles = useSelector((state: RootState) => state.user.roles)
  const [filtered, setFiltered] = useState<Role[] | null>(null)
  const [form] = Form.useForm<{ name?: string }>()

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  const handleQuery = useCallback((values: { name?: string }) => {
    if (!values.name?.trim()) {
      setFiltered(null)
    } else {
      setFiltered(roles.filter((r) => r.name.toLowerCase().includes(values.name!.toLowerCase().trim())))
    }
  }, [roles])

  const handleClear = () => {
    form.resetFields()
    setFiltered(null)
  }

  const handleDelete = (role: Role) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 "${role.name}" 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await dispatch(removeRole(role.id)).unwrap()
          message.success('删除成功')
        } catch (err) {
          message.error(err instanceof Error ? err.message : '删除失败')
        }
      },
    })
  }

  const handleAddRole = () => {
    navigate('/permissions/assign')
  }

  const handleEditRole = (role: Role) => {
    navigate(`/permissions/assign/${role.id}`)
  }

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限数量',
      key: 'permissionCount',
      render: (_: unknown, record: Role) => record.permissions.length,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: unknown, record: Role) => (
        <Space>
          <Button type="link" onClick={() => handleEditRole(record)}>
            分配权限
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            disabled={record.name === 'Administrator'}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Header title="权限管理" icon={<SettingOutlined />} />
      <Form form={form} layout="inline" onFinish={handleQuery} className={styles.form}>
        <Form.Item label="角色名称" name="name">
          <Input allowClear placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={handleClear}>清空</Button>
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddRole}>新增角色</Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={filtered ?? roles}
        rowKey="id"
        pagination={false}
      />
    </div>
  )
}

export default PermissionListPage