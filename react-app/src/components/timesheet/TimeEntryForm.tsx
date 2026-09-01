// 【Ant Design Form】使用 Form.useForm 管理表单，替代 React Hook Form
import { useEffect } from 'react'
import { Form, Input, Button, Select } from 'antd'
import type { TimeEntry, ApprovalStatus } from '../../types/timeEntry'
import styles from './TimeEntryForm.module.css'

// 表单 Props：接收 onSubmit 回调和可选的 initialData（编辑模式）
interface TimeEntryFormProps {
  onSubmit: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>
  initialData?: TimeEntry | null
  onCancel?: () => void
  showApprovalStatus?: boolean
}

// 审批状态下拉选项
const STATUS_OPTIONS: { value: ApprovalStatus; label: string }[] = [
  { value: '待审批', label: '待审批' },
  { value: '已通过', label: '已通过' },
  { value: '已驳回', label: '已驳回' },
]

function TimeEntryForm({ onSubmit, initialData, onCancel, showApprovalStatus }: TimeEntryFormProps) {
  // Ant Design Form 实例
  const [form] = Form.useForm<Omit<TimeEntry, 'id' | 'createdAt'>>()

  // 编辑模式：initialData 变化时用 setFieldsValue 预填
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        projectName: initialData.projectName,
        description: initialData.description,
        hours: initialData.hours,
        approvalStatus: initialData.approvalStatus,
      })
    } else {
      form.setFieldsValue({
        projectName: '',
        description: '',
        hours: 1,
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
      <h2 className={styles.formTitle}>{initialData ? '编辑工时' : '新增工时'}</h2>

      <Form form={form} layout="vertical">
        {/* 项目名称 */}
        <Form.Item
          name="projectName"
          label="项目名称"
          rules={[{ required: true, message: '项目名称不能为空' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>

        {/* 工作内容 */}
        <Form.Item
          name="description"
          label="工作内容"
          rules={[{ required: true, message: '工作内容不能为空' }]}
        >
          <Input.TextArea placeholder="请描述工作内容" rows={3} />
        </Form.Item>

        {/* 工时 */}
        <Form.Item
          name="hours"
          label="工时（小时）"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value === '') {
                  return Promise.reject('工时必须大于 0')
                }
                const num = Number(value)
                if (num < 0.5) {
                  return Promise.reject('工时必须大于 0 且为 0.5 的倍数')
                }
                if (Math.round(num * 2) !== num * 2) {
                  return Promise.reject('工时必须是 0.5 的倍数')
                }
                return Promise.resolve()
              },
            },
          ]}
        >
          <Input type="number" step="0.5" min="0.5" placeholder="请输入工时" />
        </Form.Item>

        {/* 审批状态：仅编辑模式显示 */}
        {showApprovalStatus && (
          <Form.Item
            name="approvalStatus"
            label="审批状态"
          >
            <Select
              options={STATUS_OPTIONS}
              disabled
              placeholder="审批状态"
            />
          </Form.Item>
        )}

        {/* 按钮组 */}
        <Form.Item>
          <div className={styles.buttonGroup}>
            <Button
              type="primary"
              onClick={handleFormSubmit}
              loading={false}
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

export default TimeEntryForm