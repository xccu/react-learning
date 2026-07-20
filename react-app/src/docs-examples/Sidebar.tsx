import { NavLink } from 'react-router-dom'
import { navSections } from './nav/navData'
import './styles/Sidebar.css'

function NavItemLink({ item }: { item: { path: string; label: string } }) {
  const href = `/docs-examples/${item.path}`

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        isActive ? 'nav-link active' : 'nav-link'
      }
    >
      {item.label}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>React 学习示例</h2>
      </div>
      <ul className="sidebar-nav">
        {navSections.map((section) => (
          <li key={section.id} className="nav-section">
            <span className="nav-section-title">{section.title}</span>
            <ul className="nav-items">
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}