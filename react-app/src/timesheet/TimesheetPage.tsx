import { useEffect } from 'react'
import { useTimesheet } from './TimesheetContext'
import { TimesheetProvider } from './TimesheetContext'
import { TimesheetForm } from './components/TimesheetForm'
import { TimesheetList } from './components/TimesheetList'
import { TimesheetStats } from './components/TimesheetStats'
import { INITIAL_DATA } from './types'

function TimesheetPageContent() {
  const { addRecord } = useTimesheet()

  useEffect(() => {
    INITIAL_DATA.forEach((data) => addRecord(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
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

function TimesheetPage() {
  return (
    <TimesheetProvider>
      <TimesheetPageContent />
    </TimesheetProvider>
  )
}

export default TimesheetPage