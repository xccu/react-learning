import { useMemo } from 'react';
import { calculateSummary, TASK_TYPES } from '../utils/helpers';
import styles from '../styles/Summary.module.css';

const typeColors = {
  '开发': '#4CAF50',
  '设计': '#2196F3',
  '会议': '#FF9800',
  '学习': '#9C27B0',
  '其他': '#607D8B'
};

const maxBarWidth = 300;

const BarChart = ({ data, colorMap }) => {
  const values = Object.values(data);
  const maxVal = Math.max(...values, 1);

  return (
    <div className={styles.chart}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className={styles.barRow}>
          <span className={styles.barLabel}>{key}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${(value / maxVal) * maxBarWidth}px`,
                backgroundColor: colorMap?.[key] || '#4CAF50'
              }}
            />
          </div>
          <span className={styles.barValue}>{value.toFixed(1)}h</span>
        </div>
      ))}
    </div>
  );
};

export const TimesheetSummary = ({ timesheets }) => {
  const summary = useMemo(() => calculateSummary(timesheets), [timesheets]);

  const totalHours = useMemo(() => {
    return timesheets.reduce((sum, ts) => sum + parseFloat(ts.hours), 0);
  }, [timesheets]);

  if (timesheets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>暂无统计数据</p>
        <p className={styles.emptyHint}>添加工时记录后查看统计</p>
      </div>
    );
  }

  const dailyEntries = Object.entries(summary.daily).sort((a, b) => b[0].localeCompare(a[0]));
  const weeklyEntries = Object.entries(summary.weekly).sort((a, b) => b[0].localeCompare(a[0]));
  const projectEntries = Object.entries(summary.byProject);
  const typeEntries = TASK_TYPES.filter(t => summary.byType[t]).map(t => [t, summary.byType[t]]);

  return (
    <div className={styles.summary}>
      <div className={styles.totalCard}>
        <h3>总工时</h3>
        <div className={styles.totalValue}>{totalHours.toFixed(1)} 小时</div>
        <div className={styles.totalSub}>共 {timesheets.length} 条记录</div>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h3>每日统计</h3>
          <BarChart data={Object.fromEntries(dailyEntries)} colorMap={typeColors} />
        </div>

        <div className={styles.section}>
          <h3>每周统计</h3>
          <BarChart data={Object.fromEntries(weeklyEntries)} />
        </div>

        <div className={styles.section}>
          <h3>按项目统计</h3>
          <BarChart data={Object.fromEntries(projectEntries)} />
        </div>

        <div className={styles.section}>
          <h3>按类型统计</h3>
          <BarChart data={Object.fromEntries(typeEntries)} colorMap={typeColors} />
        </div>
      </div>
    </div>
  );
};