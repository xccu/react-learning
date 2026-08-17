// 【React Hook Form】useForm 管理字段注册与校验，Controller 桥接受控组件
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import type { TimeEntry, ApprovalStatus } from '../../types/timeEntry'
import ApprovalStatusSelector from './ApprovalStatusSelector'
import styles from './TimeEntryForm.module.css'

// 表单 Props：接收 onSubmit 回调和可选的 initialData（编辑模式）
interface TimeEntryFormProps {
  // 【TypeScript 函数类型】onSubmit 接收不含 id 和 createdAt 的工时数据，返回 Promise<void>
  onSubmit: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>
  // 【TypeScript 可选类型】initialData 可选，存在时表示编辑模式
  initialData?: TimeEntry | null
  // 【TypeScript 可选回调】onCancel 可选，编辑模式下显示取消按钮
  onCancel?: () => void
}

// 表单字段结构：与提交数据一致，approvalStatus 受控于 ApprovalStatusSelector
interface TimeEntryFormValues {
  projectName: string
  description: string
  hours: number
  approvalStatus: ApprovalStatus
}

function TimeEntryForm({ onSubmit, initialData, onCancel }: TimeEntryFormProps) {
  // 【React Hook Form useForm】创建表单实例后按需解构，所有成员作用于同一个实例：字段绑定 / 提交包装 / 受控桥接 / 数据写入 / 状态
  const {
    register, // 【register】字段注册：把 ref、name、onChange、onBlur 展开到原生输入框，非受控绑定字段
    handleSubmit, // 【handleSubmit】提交包装：先跑全部校验，通过后才调用回调并传入校验后的字段值对象
    control, // 【control】表单控制器：交给 Controller 桥接受控组件 ApprovalStatusSelector
    reset, // 【reset】数据写入：编辑预填 reset(initialData)，提交后清空 reset()
    formState: { errors, isSubmitting }, // 【formState】表单状态：errors 逐字段错误，isSubmitting 提交中
  } = useForm<TimeEntryFormValues>({
    defaultValues: {
      projectName: '',
      description: '',
      hours: 1,
      approvalStatus: '待审批',
    },
  })

  // 支持编辑模式：initialData 变化时用 reset 预填；无 initialData 时恢复默认值
  useEffect(() => {
    if (initialData) {
      reset({
        projectName: initialData.projectName,
        description: initialData.description,
        hours: initialData.hours,
        approvalStatus: initialData.approvalStatus,
      })
    } else {
      reset({ projectName: '', description: '', hours: 1, approvalStatus: '待审批' })
    }
  }, [initialData, reset])

  // 表单提交：handleSubmit 通过校验后回调，新增模式提交成功后清空表单
  const handleFormSubmit = async (values: TimeEntryFormValues) => {
    await onSubmit({
      projectName: values.projectName.trim(),
      description: values.description.trim(),
      hours: values.hours,
      approvalStatus: values.approvalStatus,
    })
    if (!initialData) {
      reset({ projectName: '', description: '', hours: 1, approvalStatus: '待审批' })
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <h2 className={styles.formTitle}>{initialData ? '编辑工时' : '新增工时'}</h2>

      <div className={styles.field}>
        <label className={styles.label}>项目名称</label>
        <input
          type="text"
          // 【React Hook Form register】注册字段并绑定校验规则：必填
          {...register('projectName', { required: '项目名称不能为空' })}
          className={`${styles.input} ${errors.projectName ? styles.inputError : ''}`}
          placeholder="请输入项目名称"
        />
        {errors.projectName && <span className={styles.error}>{errors.projectName.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工作内容</label>
        <textarea
          // 必填校验：工作内容不能为空
          {...register('description', { required: '工作内容不能为空' })}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="请描述工作内容"
          rows={3}
        />
        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工时（小时）</label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          // valueAsNumber 将输入值转为数字；自定义 validate 校验大于 0 且为 0.5 的倍数
          {...register('hours', {
            required: '工时必须大于 0',
            valueAsNumber: true,
            validate: (value) => {
              // 【JavaScript Number 工具函数】isNaN 判断是否为非数字
              if (!value || Number.isNaN(value) || value <= 0) return '工时必须大于 0'
              // 只允许整数和 0.5 的倍数（如 0.5, 1, 1.5, 2, 2.5）
              // 乘以 2 后检查是否为整数，避免浮点精度问题
              return Math.round(value * 2) === value * 2 || '工时必须是 0.5 的倍数'
            },
          })}
          className={`${styles.input} ${errors.hours ? styles.inputError : ''}`}
        />
        {errors.hours && <span className={styles.error}>{errors.hours.message}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>审批状态</label>
        {/* 【Controller】桥接受控组件 ApprovalStatusSelector，避免 register 与手动 value/onChange 冲突 */}
        <Controller
          control={control}
          name="approvalStatus"
          render={({ field }) => <ApprovalStatusSelector value={field.value} onChange={field.onChange} />}
        />
      </div>

      <div className={styles.buttonGroup}>
        {/* formState.isSubmitting：提交中禁用按钮并切换文案，防止重复提交 */}
        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : initialData ? '保存修改' : '提交'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}

export default TimeEntryForm
