import { useState } from 'react'
import type { FormEvent } from 'react'
import type { TimeEntryQuery } from '../../api/mockApi'
import type { ApprovalStatus } from '../../types/timeEntry'
import styles from './TimeEntryQueryForm.module.css'

interface TimeEntryQueryFormProps {
  // 【TypeScript 回调类型】onQuery 接收查询条件；onCreate 通知父组件跳转新增页
  onQuery: (query: TimeEntryQuery) => void
  onCreate: () => void
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
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | ''>('')

  // 提交查询：去除首尾空格后把条件交给父组件
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onQuery({ projectName: projectName.trim(), description: description.trim(), approvalStatus })
  }

  // 清空条件：重置表单并恢复显示全部记录
  const handleClear = () => {
    setProjectName('')
    setDescription('')
    setApprovalStatus('')
    onQuery({})
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label}>项目名称</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={styles.input}
            placeholder="请输入项目名称"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>工作内容</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            placeholder="请输入工作内容"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>审批状态</label>
          {/* 原生 select：查询条件用下拉选择，空值选项表示「全部」 */}
          <select
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value as ApprovalStatus | '')}
            className={styles.input}
          >
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
