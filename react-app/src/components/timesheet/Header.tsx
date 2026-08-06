import styles from './Header.module.css'

function Header({ title = 'React Learning App' }: { title?: string }) {
  return (
    <header className={styles.header}>
      <span className={styles.headerIcon}>⚛️</span>
      <h1 className={styles.headerTitle}>{title}</h1>
    </header>
  )
}

export default Header