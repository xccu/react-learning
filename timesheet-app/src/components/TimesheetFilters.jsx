import { useState, useEffect, useMemo } from 'react';
import { TASK_TYPES } from '../utils/helpers';
import styles from '../styles/Filters.module.css';

export const TimesheetFilters = ({ filters, onFilterChange, onReset, timesheets, resultCount }) => {
  const [localFilters, setLocalFilters] = useState({
    dateRange: { start: filters.dateRange.start, end: filters.dateRange.end },
    project: filters.project,
    taskType: filters.taskType
  });

  useEffect(() => {
    setLocalFilters({
      dateRange: { start: filters.dateRange.start, end: filters.dateRange.end },
      project: filters.project,
      taskType: filters.taskType
    });
  }, [filters]);

  const uniqueProjects = useMemo(() => {
    const projects = [...new Set(timesheets.map(ts => ts.project))];
    return projects.sort();
  }, [timesheets]);

  const handleDateChange = (field, value) => {
    const updated = { ...localFilters, dateRange: { ...localFilters.dateRange, [field]: value } };
    setLocalFilters(updated);
    onFilterChange({ dateRange: updated.dateRange });
  };

  const handleProjectChange = (value) => {
    const updated = { ...localFilters, project: value };
    setLocalFilters(updated);
    onFilterChange({ project: value });
  };

  const handleTypeChange = (value) => {
    const updated = { ...localFilters, taskType: value };
    setLocalFilters(updated);
    onFilterChange({ taskType: value });
  };

  const hasActiveFilters = localFilters.dateRange.start || localFilters.dateRange.end || localFilters.project || localFilters.taskType;

  const handleReset = () => {
    setLocalFilters({ dateRange: { start: '', end: '' }, project: '', taskType: '' });
    onReset();
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filtersHeader}>
        <h3>筛选条件</h3>
        {hasActiveFilters && (
          <button className={styles.resetBtn} onClick={handleReset}>
            重置筛选
          </button>
        )}
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label>开始日期</label>
          <input
            type="date"
            value={localFilters.dateRange.start}
            onChange={(e) => handleDateChange('start', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>结束日期</label>
          <input
            type="date"
            value={localFilters.dateRange.end}
            onChange={(e) => handleDateChange('end', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <label>项目</label>
          <select
            value={localFilters.project}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            <option value="">全部项目</option>
            {uniqueProjects.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>任务类型</label>
          <select
            value={localFilters.taskType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">全部类型</option>
            {TASK_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.resultCount}>
        显示 {resultCount} 条记录
      </div>
    </div>
  );
};