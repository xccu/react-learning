import { useContext } from 'react';
import { TimesheetContext } from '../context/Provider';
import ThemeContext from '../context/ThemeContext';
import { exportToJSON } from '../utils/helpers';
import styles from '../styles/Navbar.module.css';

export const Navbar = () => {
  const { state, setView } = useContext(TimesheetContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleExport = () => {
    exportToJSON(state.timesheets);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navBrand}>工时填报系统</div>
      <div className={styles.navActions}>
        <button
          className={`${styles.navBtn} ${state.currentView === 'form' ? styles.active : ''}`}
          onClick={() => setView('form')}
        >
          新增工时
        </button>
        <button
          className={`${styles.navBtn} ${state.currentView === 'list' ? styles.active : ''}`}
          onClick={() => setView('list')}
        >
          工时列表
        </button>
        <button
          className={`${styles.navBtn} ${state.currentView === 'summary' ? styles.active : ''}`}
          onClick={() => setView('summary')}
        >
          统计汇总
        </button>
        <button className={styles.exportBtn} onClick={handleExport}>
          导出数据
        </button>
        <button className={styles.themeBtn} onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};