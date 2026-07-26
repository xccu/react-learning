// 导入 React Hook 和类型
import { useState, useRef, FormEvent } from 'react'
import { useTimesheet } from '../TimesheetContext'
import type { TimesheetFormData } from '../types'

// 组件 props：可选的提交回调
interface TimesheetFormProps {
  onSubmitted?: () => void
}

// 工时填报表单组件
// 使用 useState 管理表单数据和错误信息，使用 useRef 聚焦输入框
function TimesheetForm({ onSubmitted }: TimesheetFormProps) {
  const { addRecord } = useTimesheet()
  const dateRef = useRef<HTMLInputElement>(null)

  // 表单数据状态：所有字段初始为空字符串
  const [formData, setFormData] = useState<TimesheetFormData>({
    date: '',
    project: '',
    task: '',
    hours: '',
    description: '',
  })

  // 错误信息状态：字段名 -> 错误消息的映射
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 表单验证函数：检查必填字段和工时范围
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 日期必填
    if (!formData.date.trim()) {
      newErrors.date = '请选择日期'
    }
    // 项目名称必填
    if (!formData.project.trim()) {
      newErrors.project = '请输入项目名称'
    }
    // 任务描述必填
    if (!formData.task.trim()) {
      newErrors.task = '请输入任务描述'
    }
    // 工时必须是 0.5 - 12 之间的有效数字
    const hoursNum = parseFloat(formData.hours)
    if (!formData.hours || isNaN(hoursNum)) {
      newErrors.hours = '请输入有效数字'
    } else if (hoursNum < 0.5 || hoursNum > 12) {
      newErrors.hours = '工时范围：0.5 - 12'
    }

    // 更新错误状态，返回验证是否通过
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 输入变化处理：更新表单数据，同时清除对应字段的错误
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    // 使用 computed property name 动态更新对应字段
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 如果该字段有错误，清除错误
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  // 表单提交处理
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    // 调用全局状态中的 addRecord 添加记录
    addRecord(formData)
    // 清空表单数据和错误
    setFormData({
      date: '',
      project: '',
      task: '',
      hours: '',
      description: '',
    })
    setErrors({})

    // 重新聚焦日期输入框
    if (dateRef.current) {
      dateRef.current.focus()
    }

    // 执行外部传入的回调
    if (onSubmitted) {
      onSubmitted()
    }
  }

  // 动态输入框样式生成器：有错误时红色边框
  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '8px 12px',
    border: `1px solid ${errors[field] ? '#e74c3c' : '#ddd'}`,
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  })

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>
        填报新工时
      </h3>

      {/* 两列网格布局的表单字段 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        {/* 日期字段 */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}
          >
            日期 <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <input
            ref={dateRef}
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={inputStyle('date')}
          />
          {errors.date && (
            <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '2px' }}>
              {errors.date}
            </span>
          )}
        </div>

        {/* 项目名称字段 */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}
          >
            项目名称 <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <input
            type="text"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="请输入项目名称"
            style={inputStyle('project')}
          />
          {errors.project && (
            <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '2px' }}>
              {errors.project}
            </span>
          )}
        </div>

        {/* 任务描述字段 */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}
          >
            任务描述 <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <input
            type="text"
            name="task"
            value={formData.task}
            onChange={handleChange}
            placeholder="请输入任务描述"
            style={inputStyle('task')}
          />
          {errors.task && (
            <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '2px' }}>
              {errors.task}
            </span>
          )}
        </div>

        {/* 工时数字字段 */}
        <div>
          <label
            style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}
          >
            工时数 <span style={{ color: '#e74c3c' }}>*</span>
          </label>
          <input
            type="number"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            placeholder="0.5 - 12"
            step="0.5"
            min="0.5"
            max="12"
            style={inputStyle('hours')}
          />
          {errors.hours && (
            <span style={{ color: '#e74c3c', fontSize: '12px', marginTop: '2px' }}>
              {errors.hours}
            </span>
          )}
        </div>
      </div>

      {/* 详细说明字段（占满整行） */}
      <div style={{ marginBottom: '12px' }}>
        <label
          style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#666' }}
        >
          详细说明
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="可选，填写更多细节"
          rows={2}
          style={{
            ...inputStyle('description'),
            resize: 'vertical',
          }}
        />
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        style={{
          padding: '8px 24px',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        提交
      </button>
    </form>
  )
}

export { TimesheetForm }