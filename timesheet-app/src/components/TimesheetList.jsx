import { memo } from 'react';
import { TASK_TYPES } from '../utils/helpers';
import styles from '../styles/List.module.css';

const taskTypeColors = {
  '开发': '#4CAF50',
  '设计': '#2196F3',
  '会议': '#FF9800',
  '学习': '#9C27B0',
  '其他': '#607D8B'
};

export const TimesheetItem = memo(({ timesheet, onEdit, onDelete }) => {
  const typeColor = taskTypeColors[timesheet.taskType] || '#607D8B';

  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <span className={styles.itemDate}>{timesheet.date}</span>
        <span className={styles.itemProject}>{timesheet.project}</span>
        <span className={styles.itemHours}>{timesheet.hours}h</span>
      </div>
      <div className={styles.itemBody}>
        <span
          className={styles.taskTypeBadge}
          style={{ backgroundColor: typeColor }}
        >
          {timesheet.taskType}
        </span>
        <p className={styles.itemDescription}>{timesheet.description}</p>
      </div>
      <div className={styles.itemActions}>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(timesheet)}
          title="编辑"
        >
          编辑
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => {
            if (window.confirm(`确定要删除 ${timesheet.date} 的工时记录吗？`)) {
              onDelete(timesheet.id);
            }
          }}
          title="删除"
        >
          删除
        </button>
      </div>
    </div>
  );
});

export const TimesheetList = ({ timesheets, onEdit, onDelete }) => {
  if (timesheets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>暂无工时记录</p>
        <p className={styles.emptyHint}>点击上方"新增工时"开始记录</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {timesheets.map(ts => (
        <TimesheetItem
          key={ts.id}
          timesheet={ts}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};