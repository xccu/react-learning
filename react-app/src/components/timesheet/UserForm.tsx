import { useEffect } from 'react'
import { Form, Input, Select, Button } from 'antd'
import type { User } from '../../types/timeEntry'
import styles from './UserForm.module.css'

interface UserFormProps {
  onSubmit: (values: { username: string; password?: string; roles: string[] }) => Promise<void>
  initialData?: User | null
  onCancel?: () => void
  roles: { value: string; label: string }[]
}

function UserForm({ onSubmit, initialData, onCancel, roles }: UserFormProps) {
  const [form] = Form.useForm<{ username: string; password?: string; roles: string[] }>()

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        username: initialData.username,
        password: '',
        roles: initialData.roles,
      })
    } else {
      form.setFieldsValue({
        username: '',
        password: 'Pass@word0',
        roles: [],
      })
    }
  }, [initialData, form])

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
      if (!initialData) {
        form.resetFields()
      }
    } catch (err) {
      console.error('Form validation failed:', err)
    }
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>{initialData ? '编辑用户' : '新增用户'}</h2>

      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" disabled={!!initialData} />
        </Form.Item>

        {!initialData && (
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="请选择角色"
            options={roles}
          />
        </Form.Item>

        <Form.Item>
          <div className={styles.buttonGroup}>
            <Button
              type="primary"
              onClick={handleFormSubmit}
            >
              {initialData ? '保存修改' : '提交'}
            </Button>
            {onCancel && (
              <Button onClick={onCancel}>取消</Button>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserForm