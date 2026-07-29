// Header 组件：显示 React 图标和标题
function Header() {
  return (
    <header style={styles.header}>
      {/* 在 Header 中显示 React 图标（使用 emoji）和"React Learning App"标题 */}
      <span style={styles.headerIcon}>⚛️</span>
      <h1 style={styles.headerTitle}>React Learning App</h1>
    </header>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#fff',
    padding: '16px 24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  headerIcon: {
    fontSize: '28px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
  },
}

export default Header