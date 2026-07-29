import { useState, useEffect, useRef, FormEvent } from 'react'
import type { TimeEntry, ApprovalStatus } from '../api/mockApi'
import ApprovalStatusSelector from './ApprovalStatusSelector'

// 表单 Props：接收 onSubmit 回调和可选的 initialData（编辑模式）
interface TimeEntryFormProps {
  onSubmit: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>
  initialData?: TimeEntry | null
  onCancel?: () => void
}



function TimeEntryForm({ onSubmit, initialData, onCancel }: TimeEntryFormProps) {
  // 使用 useState 管理表单输入状态
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState(1)
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('待审批')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // useRef 创建项目名称输入框的引用
  const nameRef = useRef<HTMLInputElement>(null)

  // 支持编辑模式：当传入 initialData 时预填充表单
  useEffect(() => {
    if (initialData) {
      setProjectName(initialData.projectName)
      setDescription(initialData.description)
      setHours(initialData.hours)
      setApprovalStatus(initialData.approvalStatus)
    } else {
      setProjectName('')
      setDescription('')
      setHours(1)
      setApprovalStatus('待审批')
    }
  }, [initialData])

  // 表单验证：必填字段检查
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!projectName.trim()) {
      newErrors.projectName = '项目名称不能为空'
    }
    if (!description.trim()) {
      newErrors.description = '工作内容不能为空'
    }
    if (hours <= 0) {
      newErrors.hours = '工时必须大于 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateHours = (val: string): boolean => {
    if (!val) return true
    const num = parseFloat(val)
    if (isNaN(num) || num <= 0) return false
    // 只允许整数和 0.5 的倍数（如 0.5, 1, 1.5, 2, 2.5）
    // 乘以 2 后检查是否为整数，避免浮点精度问题
    return Math.round(num * 2) === num * 2
  }

  // 事件处理：表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    await onSubmit({
      projectName: projectName.trim(),
      description: description.trim(),
      hours,
      approvalStatus,
    })

    // 表单提交成功后重置表单
    setProjectName('')
    setDescription('')
    setHours(1)
    setApprovalStatus('待审批')
    setErrors({})

    // 用 ref.current.focus() 聚焦输入框
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.formTitle}>{initialData ? '编辑工时' : '新增工时'}</h2>

      <div style={styles.field}>
        <label style={styles.label}>项目名称</label>
        <input
          ref={nameRef}
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{ ...styles.input, ...(errors.projectName ? styles.inputError : {}) }}
          placeholder="请输入项目名称"
        />
        {errors.projectName && <span style={styles.error}>{errors.projectName}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>工作内容</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
          placeholder="请描述工作内容"
          rows={3}
        />
        {errors.description && <span style={styles.error}>{errors.description}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>工时（小时）</label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          value={hours}
          onChange={(e) => {
            if (validateHours(e.target.value)) {
              setHours(parseFloat(e.target.value))
            }
          }}
          style={{ ...styles.input, ...(errors.hours ? styles.inputError : {}) }}
        />
        {errors.hours && <span style={styles.error}>{errors.hours}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>审批状态</label>
        <ApprovalStatusSelector value={approvalStatus} onChange={setApprovalStatus} />
      </div>

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.submitBtn}>
          {initialData ? '保存修改' : '提交'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.cancelBtn}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    background: '#fff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  formTitle: {
    margin: '0 0 16px',
    fontSize: '18px',
    color: '#333',
  },
  field: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  error: {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '2px',
    display: 'block',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  submitBtn: {
    padding: '8px 20px',
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  cancelBtn: {
    padding: '8px 20px',
    background: '#e5e7eb',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
}

export default TimeEntryForm