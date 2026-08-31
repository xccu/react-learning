// 【React Hook Form】查询表单：useForm 管理查询条件字段
// 【Ant Design】UI 组件替换为 Form、Input、Select、Button、Space
import { useForm } from 'react-hook-form'
import { Form, Input, Select, Button, Space } from 'antd'
import type { TimeEntryQuery } from '../../api/mockApi'
import styles from './TimeEntryQueryForm.module.css'

interface TimeEntryQueryFormProps {
  onQuery: (query: TimeEntryQuery) => void
  onCreate: () => void
}

// 审批状态下拉选项
const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '全部' },
  { value: '待审批', label: '待审批' },
  { value: '已通过', label: '已通过' },
  { value: '已驳回', label: '已驳回' },
]

function TimeEntryQueryForm({ onQuery, onCreate }: TimeEntryQueryFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { projectName: '', description: '', approvalStatus: '' },
  })

  const handleFormSubmit = (values: Record<string, string>) => {
    onQuery({
      projectName: values.projectName?.trim(),
      description: values.description?.trim(),
      approvalStatus: values.approvalStatus as any,
    })
  }

  const handleClear = () => {
    reset({ projectName: '', description: '', approvalStatus: '' })
    onQuery({})
  }

  return (
    <Form layout="inline" onFinish={handleSubmit(handleFormSubmit)} className={styles.form}>
      <Form.Item
        label="项目名称"
        {...register('projectName')}
      >
        <Input allowClear placeholder="请输入项目名称" />
      </Form.Item>
      <Form.Item
        label="工作内容"
        {...register('description')}
      >
        <Input allowClear placeholder="请输入工作内容" />
      </Form.Item>
      <Form.Item
        label="审批状态"
        {...register('approvalStatus')}
      >
        <Select allowClear placeholder="请选择状态" options={STATUS_OPTIONS} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button onClick={handleClear}>清空</Button>
          <Button type="dashed" icon={<span>+</span>} onClick={onCreate}>新增工时</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default TimeEntryQueryForm