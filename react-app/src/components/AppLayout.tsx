import { ReactNode } from 'react'

// 导航项接口
interface NavItem {
  key: string
  label: string
  icon: string
}

// 接收导航状态和页面配置作为 Props
interface AppLayoutProps {
  activeNav: string
  setActiveNav: (key: string) => void
  navPages: Record<string, React.ComponentType>
  navItems: NavItem[]
}

function AppLayout({ activeNav, setActiveNav, navPages, navItems }: AppLayoutProps) {
  return (
    <div style={styles.layout}>
      {/* 左侧导航栏使用深色背景（如 #1a1a2e），固定宽度 240px */}
      <nav style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <span style={styles.logoIcon}>⚛️</span>
          <span style={styles.logoText}>React App</span>
        </div>
        <ul style={styles.navList}>
          {navItems.map((item) => (
            <li key={item.key}>
              {/* 导航栏点击事件切换 activeNav 状态 */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setActiveNav(item.key)
                }}
                style={{
                  ...styles.navLink,
                  ...(activeNav === item.key ? styles.navLinkActive : {}),
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 右侧内容区使用 flex: 1 自适应剩余空间 */}
      <main style={styles.main}>
        {/* 使用条件渲染：根据 activeNav 显示对应的右侧页面 */}
        {navPages[activeNav] && (() => {
          const Page = navPages[activeNav]
          return <Page />
        })()}
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '240px',
    background: '#1a1a2e',
    color: '#fff',
    flexShrink: 0,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: 600,
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    color: '#a0a0b0',
    textDecoration: 'none',
    transition: 'background 0.2s, color 0.2s',
  },
  navLinkActive: {
    background: 'rgba(99, 102, 241, 0.3)',
    color: '#fff',
    borderLeft: '3px solid #6366f1',
  },
  navIcon: {
    fontSize: '16px',
  },
  main: {
    flex: 1,
    padding: '24px',
    background: '#f8f9fa',
    overflow: 'auto',
  },
}

export default AppLayout