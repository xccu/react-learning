import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

// 404 页面：提示页面不存在并提供返回入口
function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>页面不存在</p>
      {/* Link 声明式导航：跳回根路径，页面不刷新 */}
      <Link to="/" className={styles.homeLink}>返回首页</Link>
    </div>
  )
}

export default NotFoundPage
