export const TASK_TYPES = ['开发', '设计', '会议', '学习', '其他'];

export const generateId = () => {
  return 'ts_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr) => {
  return dateStr;
};

export const validateTimesheet = (data) => {
  const errors = {};

  if (!data.date) {
    errors.date = '请选择日期';
  }

  if (!data.project || data.project.trim() === '') {
    errors.project = '请输入项目名称';
  }

  if (!data.taskType) {
    errors.taskType = '请选择任务类型';
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = '请输入任务描述';
  }

  if (!data.hours || isNaN(data.hours)) {
    errors.hours = '请输入有效的工时数';
  } else if (data.hours < 0.5) {
    errors.hours = '工时数不能小于 0.5';
  } else if (data.hours > 12) {
    errors.hours = '工时数不能大于 12';
  }

  return errors;
};

export const calculateSummary = (timesheets) => {
  const daily = {};
  const weekly = {};
  const byProject = {};
  const byType = {};

  timesheets.forEach(ts => {
    const date = ts.date;
    const project = ts.project;
    const type = ts.taskType;
    const hours = parseFloat(ts.hours);

    daily[date] = (daily[date] || 0) + hours;

    const weekKey = getWeekKey(date);
    weekly[weekKey] = (weekly[weekKey] || 0) + hours;

    byProject[project] = (byProject[project] || 0) + hours;
    byType[type] = (byType[type] || 0) + hours;
  });

  return { daily, weekly, byProject, byType };
};

const getWeekKey = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

export const filterTimesheets = (timesheets, filters) => {
  return timesheets.filter(ts => {
    if (filters.dateRange.start && ts.date < filters.dateRange.start) return false;
    if (filters.dateRange.end && ts.date > filters.dateRange.end) return false;
    if (filters.project && ts.project !== filters.project) return false;
    if (filters.taskType && ts.taskType !== filters.taskType) return false;
    return true;
  });
};

export const exportToJSON = (timesheets) => {
  const dataStr = JSON.stringify(timesheets, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `timesheet_export_${formatDate(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(url);
};