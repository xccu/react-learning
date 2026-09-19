import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { approveEntryThunk, rejectEntryThunk, fetchEntryById } from '../store/timesheetSlice'
import { message, Modal, Form, Input } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import styles from './TimeEntryDetailPage.module.css'

// 详情页：按路由标识经请求模块加载单条记录，处理加载中与记录不存在状态
function TimeEntryDetailPage() {
  const { id } = useParams()
  const [error, setError] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ open: boolean; reason: string }>({ open: false, reason: '' })
  const [rejectForm] = Form.useForm<{ reason: string }>()
  const dispatch = useDispatch<AppDispatch>()

  // 从 Redux Store 读取所有工时记录
  const entries = useSelector((state: RootState) => state.timesheet.entries)
  const loading = useSelector((state: RootState) => state.timesheet.loading)
  const entry = entries.find((e) => e.id === id) ?? null

  // 挂载时如果 Store 中没有该记录，则 dispatch fetchEntryById
  useEffect(() => {
    if (!id) return
    if (entry) return
    setError(null)
    dispatch(fetchEntryById(id))
      .unwrap()
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch])

  // 加载中状态
  if (loading && !entry) {
    return <p className={styles.status}>加载中...</p>
  }

  // 加载失败或记录不存在时显示提示 + 返回列表入口
  if (error || !entry) {
    return (
      <div className={styles.status}>
        <p className={styles.errorText}>{error === '记录不存在' ? '未找到该工时记录' : '加载失败'}</p>
        <Link to="/" className={styles.backLink}>
          返回列表
        </Link>
      </div>
    )
  }

  // 格式化时间
  const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 审批通过
  const handleApprove = async () => {
    try {
      await dispatch(approveEntryThunk(entry.id)).unwrap()
      message.success('审批通过')
    } catch (err) {
      message.error(err instanceof Error ? err.message : '审批失败')
    }
  }

  // 打开驳回 Modal
  const handleReject = () => {
    setRejectModal({ open: true, reason: '' })
    rejectForm.resetFields()
  }

  // 提交驳回
  const handleRejectSubmit = async () => {
    try {
      const values = await rejectForm.validateFields()
      await dispatch(rejectEntryThunk({ id: entry.id, reason: values.reason })).unwrap()
      message.success('已驳回')
      setRejectModal({ open: false, reason: '' })
    } catch {
      // 校验失败不处理
    }
  }

  // 关闭驳回 Modal
  const closeRejectModal = () => {
    setRejectModal({ open: false, reason: '' })
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>工时详情</h2>

      <div className={styles.field}>
        <label className={styles.label}>项目名称</label>
        <div className={styles.value}>{entry.projectName}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工作内容</label>
        <div className={styles.value}>{entry.description}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>工时（小时）</label>
        <div className={styles.value}>{entry.hours}</div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>审批状态</label>
        <div className={styles.value}>{entry.approvalStatus}</div>
      </div>

      {/* 已驳回时显示驳回原因 */}
      {entry.approvalStatus === '已驳回' && entry.rejectReason && (
        <div className={styles.field}>
          <label className={styles.label}>驳回原因</label>
          <div className={styles.value}>{entry.rejectReason}</div>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>创建时间</label>
        <div className={styles.value}>{formatDate(entry.createdAt)}</div>
      </div>

      <div className={styles.buttonGroup}>
        {/* 按状态显示审批操作按钮 */}
        {entry.approvalStatus === '待审批' && (
          <>
            <button type="button" onClick={handleApprove} className={styles.submitBtn}>
              审批通过
            </button>
            <button type="button" onClick={handleReject} className={styles.cancelBtn}>
              驳回
            </button>
          </>
        )}

        {/* 编辑按钮（所有状态都显示） */}
        <Link to="edit" className={styles.editBtn}>
          编辑
        </Link>

        <Link to="/" className={styles.backLink}>
          返回列表
        </Link>
      </div>

      {/* 驳回 Modal */}
      <Modal
        title="驳回"
        open={rejectModal.open}
        onOk={handleRejectSubmit}
        onCancel={closeRejectModal}
        destroyOnHidden
        okText="确定"
        cancelText="取消"
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="驳回原因"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea placeholder="请输入驳回原因" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TimeEntryDetailPage