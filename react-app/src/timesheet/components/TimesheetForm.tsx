import { useState, useRef, FormEvent } from 'react'
import { useTimesheet } from '../TimesheetContext'
import type { TimesheetFormData } from '../types'

interface TimesheetFormProps {
  onSubmitted?: () => void
}

function TimesheetForm({ onSubmitted }: TimesheetFormProps) {
  const { addRecord } = useTimesheet()
  const dateRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<TimesheetFormData>({
    date: '',
    project: '',
    task: '',
    hours: '',
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.date.trim()) {
      newErrors.date = '请选择日期'
    }
    if (!formData.project.trim()) {
      newErrors.project = '请输入项目名称'
    }
    if (!formData.task.trim()) {
      newErrors.task = '请输入任务描述'
    }
    const hoursNum = parseFloat(formData.hours)
    if (!formData.hours || isNaN(hoursNum)) {
      newErrors.hours = '请输入有效数字'
    } else if (hoursNum < 0.5 || hoursNum > 12) {
      newErrors.hours = '工时范围：0.5 - 12'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    addRecord(formData)
    setFormData({
      date: '',
      project: '',
      task: '',
      hours: '',
      description: '',
    })
    setErrors({})

    if (dateRef.current) {
      dateRef.current.focus()
    }

    if (onSubmitted) {
      onSubmitted()
    }
  }

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
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