import styles from './Stats.module.css'

interface StatsProps {
  totalHours: number
}

function Stats({ totalHours }: StatsProps) {
  return (
    <div className={styles.stats}>
      <h3 className={styles.statsTitle}>总工时</h3>
      <p className={styles.statsValue}>{totalHours} 小时</p>
    </div>
  )
}

export default Stats