// 导入全局状态 Hook 和子组件
import { useTimesheet } from '../TimesheetContext'
import { StatusBadge } from './StatusBadge'
import type { TimesheetItem, TimesheetStatus } from '../types'

// 状态流转顺序数组
const STATUS_ORDER: TimesheetStatus[] = ['pending', 'submitted', 'approved']

// 工时记录列表组件
// 使用 useTimesheet Hook 获取全局 records 数据，展示表格
function TimesheetList() {
  const { records, deleteRecord, toggleStatus } = useTimesheet()

  // 删除记录处理
  const handleDelete = (id: string) => {
    deleteRecord(id)
  }

  // 切换状态处理
  const handleToggleStatus = (id: string) => {
    toggleStatus(id)
  }

  // 空状态：无记录时显示提示
  if (records.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#999',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          marginTop: '16px',
        }}
      >
        <p style={{ margin: 0, fontSize: '15px' }}>暂无工时记录，请填报</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* 表格展示所有工时记录 */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                borderBottom: '2px solid #eee',
                fontWeight: 600,
                color: '#555',
              }}
            >
              日期
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                borderBottom: '2px solid #eee',
                fontWeight: 600,
                color: '#555',
              }}
            >
              项目名称
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                borderBottom: '2px solid #eee',
                fontWeight: 600,
                color: '#555',
              }}
            >
              任务
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'center',
                borderBottom: '2px solid #eee',
                fontWeight: 600,
                color: '#555',
              }}
            >
              工时
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'center',
                borderBottom: '2px solid #eee',
                fontWeight: 600,
                color: '#555',
              }}
            >
              状态
            </th>
            <th
              style={{
                padding: '10px 12px',
                textAlign: 'center',
                borderBottom: '2px solid #eee',
                fontWeight: 600,
                color: '#555',
              }}
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {/* 使用 map 遍历 records 渲染每一行 */}
          {records.map((record) => (
            <TimesheetRow
              key={record.id}
              record={record}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 行组件的 props
interface TimesheetRowProps {
  record: TimesheetItem
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

// 工时记录行组件：内嵌在 TimesheetList 中，处理行级交互
function TimesheetRow({ record, onDelete, onToggleStatus }: TimesheetRowProps) {
  // 计算下一个状态标签，用于按钮 tooltip 提示
  const currentStatusIndex = STATUS_ORDER.indexOf(record.status)
  const nextStatusIndex = (currentStatusIndex + 1) % STATUS_ORDER.length
  const nextStatusLabel = STATUS_ORDER[nextStatusIndex]

  return (
    <tr
      style={{
        borderBottom: '1px solid #f0f0f0',
        transition: 'background-color 0.15s',
      }}
      // 鼠标悬停高亮效果
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <td style={{ padding: '10px 12px', color: '#333' }}>{record.date}</td>
      <td style={{ padding: '10px 12px', color: '#333' }}>{record.project}</td>
      <td style={{ padding: '10px 12px', color: '#333' }}>{record.task}</td>
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'center',
          fontWeight: 600,
          color: '#2c3e50',
        }}
      >
        {record.hours}h
      </td>
      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
        <StatusBadge status={record.status} />
      </td>
      <td
        style={{
          padding: '10px 12px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {/* 切换状态按钮：点击后循环切换 pending -> submitted -> approved */}
        <button
          onClick={() => onToggleStatus(record.id)}
          style={{
            padding: '4px 10px',
            marginRight: '6px',
            fontSize: '12px',
            backgroundColor: '#ecf0f1',
            border: '1px solid #bdc3c7',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#555',
          }}
          title={`切换到：${nextStatusLabel}`}
        >
          切换状态
        </button>
        {/* 删除按钮 */}
        <button
          onClick={() => onDelete(record.id)}
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            backgroundColor: '#fff',
            border: '1px solid #e74c3c',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#e74c3c',
          }}
        >
          删除
        </button>
      </td>
    </tr>
  )
}

export { TimesheetList }