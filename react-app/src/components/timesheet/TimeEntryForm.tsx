// 【TypeScript 类型导入】FormEvent 是 React 表单事件类型
import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import type { TimeEntry, ApprovalStatus } from '../../types/timeEntry'
import ApprovalStatusSelector from './ApprovalStatusSelector'
import styles from './TimeEntryForm.module.css'

// 表单 Props：接收 onSubmit 回调和可选的 initialData（编辑模式）
interface TimeEntryFormProps {
  // 【TypeScript 函数类型】onSubmit 接收不含 id 和 createdAt 的工时数据，返回 Promise<void>
  onSubmit: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<void>;
  // 【TypeScript 可选类型】initialData 可选，存在时表示编辑模式
  initialData?: TimeEntry | null;
  // 【TypeScript 可选回调】onCancel 可选，编辑模式下显示取消按钮
  onCancel?: () => void;
}

function TimeEntryForm({ onSubmit, initialData, onCancel }: TimeEntryFormProps) {
  // 【TypeScript 联合类型】Record<string, string> 表示键值对都是字符串的对象
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(1);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('待审批');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // useRef 创建项目名称输入框的引用
  const nameRef = useRef<HTMLInputElement>(null);

  // 支持编辑模式：当传入 initialData 时预填充表单
  useEffect(() => {
    if (initialData) {
      setProjectName(initialData.projectName);
      setDescription(initialData.description);
      setHours(initialData.hours);
      setApprovalStatus(initialData.approvalStatus);
    } else {
      setProjectName('');
      setDescription('');
      setHours(1);
      setApprovalStatus('待审批');
    }
  }, [initialData]);

  // 表单验证：必填字段检查
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    // 【JavaScript String.prototype.trim()】去除首尾空格，空字符串 trim 后为 ''，布尔值为 false
    if (!projectName.trim()) {
      newErrors.projectName = '项目名称不能为空';
    }
    if (!description.trim()) {
      newErrors.description = '工作内容不能为空';
    }
    if (hours <= 0) {
      newErrors.hours = '工时必须大于 0';
    }
    setErrors(newErrors);
    // 【JavaScript Object.keys()】返回对象所有键名组成的数组，length === 0 表示没有错误
    return Object.keys(newErrors).length === 0;
  };

  // 【JavaScript Number 工具函数】parseFloat 将字符串转换为浮点数
  const validateHours = (val: string): boolean => {
    if (!val) return true;
    const num = parseFloat(val);
    // 【JavaScript Number 工具函数】isNaN 判断是否为非数字
    if (isNaN(num) || num <= 0) return false;
    // 只允许整数和 0.5 的倍数（如 0.5, 1, 1.5, 2, 2.5）
    // 乘以 2 后检查是否为整数，避免浮点精度问题
    return Math.round(num * 2) === num * 2;
  };

  // 事件处理：表单提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      projectName: projectName.trim(),
      description: description.trim(),
      hours,
      approvalStatus,
    });

    // 表单提交成功后重置表单
    setProjectName('');
    setDescription('');
    setHours(1);
    setApprovalStatus('待审批');
    setErrors({});

    // 用 ref.current.focus() 聚焦输入框
    if (nameRef.current) {
      nameRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.formTitle}>{initialData ? '编辑工时' : '新增工时'}</h2>

      <div className={styles.field}>
        <label className={styles.label}>项目名称</label>
        <input
          ref={nameRef}
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className={`${styles.input} ${errors.projectName ? styles.inputError : ''}`}
          placeholder="请输入项目名称"
        />
        {errors.projectName && <span className={styles.error}>{errors.projectName}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工作内容</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
          placeholder="请描述工作内容"
          rows={3}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工时（小时）</label>
        <input
          type="number"
          step="0.5"
          min="0.5"
          value={hours}
          onChange={(e) => {
            if (validateHours(e.target.value)) {
              setHours(parseFloat(e.target.value));
            }
          }}
          className={`${styles.input} ${errors.hours ? styles.inputError : ''}`}
        />
        {errors.hours && <span className={styles.error}>{errors.hours}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>审批状态</label>
        <ApprovalStatusSelector value={approvalStatus} onChange={setApprovalStatus} />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitBtn}>
          {initialData ? '保存修改' : '提交'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={styles.cancelBtn}>
            取消
          </button>
        )}
      </div>
    </form>
  );
}

export default TimeEntryForm