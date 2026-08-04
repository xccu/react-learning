import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.headerIcon}>⚛️</span>
      <h1 className={styles.headerTitle}>React Learning App</h1>
    </header>
  )
}

export default Header