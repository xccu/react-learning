import { useEffect, useState } from 'react'
import { Form, Input, Button, Select, message, Card, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { createRole, updateRole, addRole, updateRoleSync } from '../store/userSlice'
import { PERMISSION_LABELS, PERMISSIONS, type Role } from '../types/timeEntry'

function PermissionAssignPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { id } = useParams<{ id: string }>()
  const roles = useSelector((state: RootState) => state.user.roles)
  const [form] = Form.useForm<{ name: string; permissions: string[] }>()
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const isEditMode = Boolean(id)

  useEffect(() => {
    if (isEditMode) {
      const role = roles.find((r) => r.id === id)
      if (role) {
        form.setFieldsValue({ name: role.name, permissions: role.permissions })
        setSelectedPermissions(role.permissions)
      }
    } else {
      setSelectedPermissions([])
    }
  }, [id, isEditMode, roles, form])

  const handlePermissionChange = (value: string[]) => {
    setSelectedPermissions(value)
  }

  const handleSubmit = async () => {
    const values = form.getFieldsValue()
    if (!values.name?.trim()) {
      message.error('请输入角色名称')
      return
    }

    setLoading(true)
    try {
      if (isEditMode) {
        await dispatch(updateRole({
          id: id!,
          updates: { name: values.name.trim(), permissions: selectedPermissions },
        })).unwrap()
        dispatch(updateRoleSync({ id: id!, name: values.name.trim(), permissions: selectedPermissions } as Role))
        message.success('更新成功')
      } else {
        const newRole = await dispatch(createRole({
          name: values.name.trim(),
          permissions: selectedPermissions,
        })).unwrap()
        dispatch(addRole(newRole))
        message.success('创建成功')
      }
      navigate('/permissions')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  const selectOptions = PERMISSIONS.map((p) => ({
    label: PERMISSION_LABELS[p],
    value: p,
  }))

  return (
    <div>
      <Card title={isEditMode ? '编辑角色' : '新增角色'}>
        <Form form={form} layout="vertical" style={{ maxWidth: 600 }}>
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" disabled={isEditMode} />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="分配权限"
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择权限"
              options={selectOptions}
              value={selectedPermissions}
              onChange={handlePermissionChange}
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {isEditMode ? '保存' : '创建'}
              </Button>
              <Button onClick={() => navigate('/permissions')}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default PermissionAssignPage