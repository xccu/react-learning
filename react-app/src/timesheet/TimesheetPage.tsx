// 导入 React useEffect Hook
import { useEffect } from 'react'
// 自定义 Hook：用于访问全局工时状态
import { useTimesheet } from './TimesheetContext'
// 全局状态提供者组件
import { TimesheetProvider } from './TimesheetContext'
// 子组件：表单、列表、统计
import { TimesheetForm } from './components/TimesheetForm'
import { TimesheetList } from './components/TimesheetList'
import { TimesheetStats } from './components/TimesheetStats'
// 初始示例数据
import { INITIAL_DATA } from './types'

// 页面内容组件：使用 useTimesheet Hook 获取全局状态
// 通过 useEffect 在首次渲染时加载初始数据
function TimesheetPageContent() {
  const { addRecord } = useTimesheet()

  useEffect(() => {
    INITIAL_DATA.forEach((data) => addRecord(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        maxWidth: '960px',          // 最大宽度
        margin: '0 auto',           // 水平居中
        padding: '24px',            // 内边距
        fontFamily:                 // 系统字体栈
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* 页面标题 */}
      <h2
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#2c3e50',
          marginBottom: '24px',
          paddingBottom: '12px',
          borderBottom: '2px solid #eee',
        }}
      >
        工时填报
      </h2>

      {/* 工时填报表单区域 */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #eee',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <TimesheetForm />
      </div>

      {/* 统计面板区域 */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #eee',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <TimesheetStats />
      </div>

      {/* 工时记录列表区域 */}
      <div
        style={{
          backgroundColor: '#fff',
          border: '1px solid #eee',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>
          工时记录
        </h3>
        <TimesheetList />
      </div>
    </div>
  )
}

// 页面入口组件：用 TimesheetProvider 包裹所有内容
// 使得子组件可以通过 useTimesheet() 访问全局状态
function TimesheetPage() {
  return (
    <TimesheetProvider>
      <TimesheetPageContent />
    </TimesheetProvider>
  )
}

export default TimesheetPage