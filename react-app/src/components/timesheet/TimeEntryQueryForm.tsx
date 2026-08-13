// 【React Hook Form】查询表单：useForm 管理查询条件字段，查询 / 清空行为保持不变
import { useForm } from 'react-hook-form'
import type { TimeEntryQuery } from '../../api/mockApi'
import type { ApprovalStatus } from '../../types/timeEntry'
import styles from './TimeEntryQueryForm.module.css'

interface TimeEntryQueryFormProps {
  // 【TypeScript 回调类型】onQuery 接收查询条件；onCreate 通知父组件跳转新增页
  onQuery: (query: TimeEntryQuery) => void
  onCreate: () => void
}

// 查询表单字段结构：approvalStatus 空字符串表示「全部」
interface QueryFormValues {
  projectName: string
  description: string
  approvalStatus: ApprovalStatus | ''
}

// 【TypeScript 数组类型】审批状态下拉选项：空字符串表示「全部」
const STATUS_OPTIONS: (ApprovalStatus | '')[] = ['', '待审批', '已通过', '已驳回']
const STATUS_LABELS: Record<ApprovalStatus | '', string> = {
  '': '全部',
  待审批: '待审批',
  已通过: '已通过',
  已驳回: '已驳回',
}

// 查询表单：展示型组件，通过回调把查询条件 / 新增动作交给父组件处理
function TimeEntryQueryForm({ onQuery, onCreate }: TimeEntryQueryFormProps) {
  const { register, handleSubmit, reset } = useForm<QueryFormValues>({
    defaultValues: { projectName: '', description: '', approvalStatus: '' },
  })

  // 提交查询：去除首尾空格后把条件交给父组件
  const handleFormSubmit = (values: QueryFormValues) => {
    onQuery({
      projectName: values.projectName.trim(),
      description: values.description.trim(),
      approvalStatus: values.approvalStatus,
    })
  }

  // 清空条件：reset 重置表单并恢复显示全部记录
  const handleClear = () => {
    reset({ projectName: '', description: '', approvalStatus: '' })
    onQuery({})
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label}>项目名称</label>
          <input
            type="text"
            {...register('projectName')}
            className={styles.input}
            placeholder="请输入项目名称"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>工作内容</label>
          <input
            type="text"
            {...register('description')}
            className={styles.input}
            placeholder="请输入工作内容"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>审批状态</label>
          {/* 原生 select：查询条件用下拉选择，空值选项表示「全部」 */}
          <select {...register('approvalStatus')} className={styles.input}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitBtn}>
          查询
        </button>
        <button type="button" onClick={handleClear} className={styles.cancelBtn}>
          清空
        </button>
        {/* 新增工时：与查询按钮并列，跳转独立新增页 */}
        <button type="button" onClick={onCreate} className={styles.createBtn}>
          + 新增工时
        </button>
      </div>
    </form>
  )
}

export default TimeEntryQueryForm
