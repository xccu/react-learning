import styles from './AppLayout.module.css'

// 【TypeScript interface】定义导航项的数据结构
interface NavItem {
  key: string
  label: string
  icon: string
}

// 【TypeScript React.ComponentType】React.ComponentType 表示任意 React 组件类型
interface AppLayoutProps {
  activeNav: string
  setActiveNav: (key: string) => void
  // 【TypeScript Record 泛型】Record<string, React.ComponentType> 表示键为字符串、值为组件类型的映射
  navPages: Record<string, React.ComponentType>
  navItems: NavItem[]
}

function AppLayout({ activeNav, setActiveNav, navPages, navItems }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoIcon}>⚛️</span>
          <span className={styles.logoText}>React App</span>
        </div>
        <ul className={styles.navList}>
          {/* 【JavaScript Array.prototype.map()】遍历导航项，生成导航链接列表 */}
          {navItems.map((item) => (
            <li key={item.key}>
              <a
                href="#"
                onClick={(e) => {
                  // 【JavaScript Event.preventDefault()】阻止链接默认跳转行为
                  e.preventDefault()
                  setActiveNav(item.key)
                }}
                // 【JavaScript 模板字符串】拼接基础样式和激活状态的样式类名
                className={`${styles.navLink} ${activeNav === item.key ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.main}>
        {/* 【JavaScript 条件渲染】navPages[activeNav] 根据当前激活的导航项获取对应的页面组件 */}
        {/* 【JavaScript 立即执行函数 IIFE】(() => { ... })() 在渲染时执行并返回 JSX 元素 */}
        {navPages[activeNav] && (() => {
          const Page = navPages[activeNav]
          return <Page />
        })()}
      </main>
    </div>
  )
}

export default AppLayout