// 【Ant Design Form】使用 Form.useForm 管理用户表单
import { useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd'
import type { User, UserRole } from '../../types/timeEntry'
import styles from './TimeEntryForm.module.css'

// 表单 Props：接收 onSubmit 回调和可选的 initialData（编辑模式）
interface UserFormProps {
  onSubmit: (values: { username: string; roles: UserRole[] }) => Promise<void>
  initialData?: User | null
  onCancel?: () => void
}

// 角色下拉选项
const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: '管理员', label: '管理员' },
  { value: '普通用户', label: '普通用户' },
]

function UserForm({ onSubmit, initialData, onCancel }: UserFormProps) {
  // Ant Design Form 实例
  const [form] = Form.useForm<{ username: string; roles: UserRole[] }>()

  // 编辑模式：initialData 变化时用 setFieldsValue 预填
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        username: initialData.username,
        roles: initialData.roles,
      })
    } else {
      form.setFieldsValue({
        username: '',
        roles: [],
      })
    }
  }, [initialData, form])

  // 表单提交：validateFields 校验通过后回调
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      await onSubmit(values)
      if (!initialData) {
        form.resetFields()
      }
    } catch {
      // 校验失败不处理
    }
  }

  return (
    <div className={styles.form}>
      <h2 className={styles.formTitle}>{initialData ? '编辑用户' : '新增用户'}</h2>

      <Form form={form} layout="vertical">
        {/* 用户名 */}
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" disabled={!!initialData} />
        </Form.Item>

        {/* 角色 */}
        <Form.Item
          name="roles"
          label="角色"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="请选择角色"
            options={ROLE_OPTIONS}
          />
        </Form.Item>

        {/* 按钮组 */}
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