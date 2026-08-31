import styles from './Stats.module.css'

interface StatsProps {
  totalHours: number
}

function Stats({ totalHours }: StatsProps) {
  return (
    <div className={styles.stats}>
      <div className={styles.statsTitle}>总工时</div>
      <div className={styles.statsValue}>{totalHours} 小时</div>
    </div>
  )
}

export default Stats