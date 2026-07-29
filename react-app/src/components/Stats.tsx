// 接收总工时数作为 Props
interface StatsProps {
  totalHours: number
}

function Stats({ totalHours }: StatsProps) {
  // 使用条件渲染显示总工时统计
  return (
    <div style={styles.stats}>
      <h3 style={styles.statsTitle}>总工时</h3>
      <p style={styles.statsValue}>{totalHours} 小时</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  stats: {
    background: '#6366f1',
    color: '#fff',
    borderRadius: '8px',
    padding: '16px 24px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  statsTitle: {
    margin: 0,
    fontSize: '14px',
    opacity: 0.9,
  },
  statsValue: {
    margin: '4px 0 0',
    fontSize: '28px',
    fontWeight: 700,
  },
}

export default Stats