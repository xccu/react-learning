// 【Ant Design】用户查询表单：Form.useForm 管理查询条件字段
import { Form, Input, Select, Button, Space } from 'antd'
import type { UserQuery } from '../../types/timeEntry'
import type { UserRole } from '../../types/timeEntry'
import styles from './UserQueryForm.module.css'

interface UserQueryFormProps {
  onQuery: (query: UserQuery) => void
  onCreate: () => void
}

// 角色下拉选项
const ROLE_OPTIONS: { value: string | undefined; label: string }[] = [
  { value: undefined, label: '全部' },
  { value: 'Administrator', label: '管理员' },
  { value: 'ProjectManager', label: '项目经理' },
  { value: 'User', label: '普通用户' },
]

function UserQueryForm({ onQuery, onCreate }: UserQueryFormProps) {
  const [form] = Form.useForm<{ username?: string; role?: UserRole }>()

  const handleFormSubmit = (values: { username?: string; role?: UserRole }) => {
    onQuery({
      username: values.username?.trim() || undefined,
      role: values.role,
    })
  }

  const handleClear = () => {
    form.resetFields()
    onQuery({})
  }

  return (
    <Form form={form} layout="inline" onFinish={handleFormSubmit} className={styles.form}>
      <Form.Item
        label="用户名"
        name="username"
      >
        <Input allowClear placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        label="角色"
        name="role"
      >
        <Select allowClear placeholder="请选择角色" options={ROLE_OPTIONS} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button onClick={handleClear}>清空</Button>
          <Button type="dashed" onClick={onCreate}>新增用户</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default UserQueryForm