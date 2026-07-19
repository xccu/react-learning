import { useState, useEffect, useRef } from 'react';
import { validateTimesheet, generateId, formatDate, TASK_TYPES } from '../utils/helpers';
import styles from '../styles/Form.module.css';

const emptyForm = {
  date: formatDate(new Date()),
  project: '',
  taskType: '',
  description: '',
  hours: ''
};

export const TimesheetForm = ({ editingTimesheet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const projectInputRef = useRef(null);

  useEffect(() => {
    if (editingTimesheet) {
      setFormData({
        date: editingTimesheet.date,
        project: editingTimesheet.project,
        taskType: editingTimesheet.taskType,
        description: editingTimesheet.description,
        hours: editingTimesheet.hours.toString()
      });
      if (projectInputRef.current) {
        projectInputRef.current.focus();
      }
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [editingTimesheet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTimesheet(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const submission = {
      ...formData,
      hours: parseFloat(formData.hours)
    };
    if (editingTimesheet) {
      onSubmit({ ...submission, id: editingTimesheet.id });
    } else {
      onSubmit({ ...submission, id: generateId(), createdAt: Date.now(), updatedAt: Date.now() });
    }
    if (!editingTimesheet) {
      setFormData(emptyForm);
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setErrors({});
    if (onCancel) onCancel();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.formTitle}>{editingTimesheet ? '编辑工时' : '新增工时'}</h3>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="date">日期</label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={errors.date ? styles.inputError : ''}
          />
          {errors.date && <span className={styles.errorText}>{errors.date}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="hours">工时</label>
          <input
            id="hours"
            name="hours"
            type="number"
            step="0.5"
            min="0.5"
            max="12"
            value={formData.hours}
            onChange={handleChange}
            placeholder="0.5-12"
            className={errors.hours ? styles.inputError : ''}
          />
          {errors.hours && <span className={styles.errorText}>{errors.hours}</span>}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="project">项目名称</label>
        <input
          id="project"
          name="project"
          type="text"
          value={formData.project}
          onChange={handleChange}
          ref={projectInputRef}
          placeholder="请输入项目名称"
          className={errors.project ? styles.inputError : ''}
        />
        {errors.project && <span className={styles.errorText}>{errors.project}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="taskType">任务类型</label>
        <select
          id="taskType"
          name="taskType"
          value={formData.taskType}
          onChange={handleChange}
          className={errors.taskType ? styles.inputError : ''}
        >
          <option value="">请选择任务类型</option>
          {TASK_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.taskType && <span className={styles.errorText}>{errors.taskType}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">任务描述</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="请描述今天的工作内容"
          className={errors.description ? styles.inputError : ''}
        />
        {errors.description && <span className={styles.errorText}>{errors.description}</span>}
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.submitBtn}>
          {editingTimesheet ? '保存修改' : '提交工时'}
        </button>
        {editingTimesheet && (
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            取消
          </button>
        )}
      </div>
    </form>
  );
};