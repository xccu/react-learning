import type { ReactNode } from 'react'
import styles from './Header.module.css'

function Header({ title = 'React Learning App', icon }: { title?: string; icon?: ReactNode }) {
  return (
    <header className={styles.header}>
      {icon ? <span className={styles.headerIcon}>{icon}</span> : <span className={styles.headerIcon}>⚛️</span>}
      <h1 className={styles.headerTitle}>{title}</h1>
    </header>
  )
}

export default Header