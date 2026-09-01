import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { deleteEntry, approveEntry, rejectEntry, setEntries } from '../store/timesheetSlice'
import { Table, Tag, Popconfirm, message, Space, Button, Pagination, Upload, Modal, Form, Input } from 'antd'
import { DownloadOutlined, UploadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import Header from '../components/timesheet/Header'
import Stats from '../components/timesheet/Stats'
import TimeEntryQueryForm from '../components/timesheet/TimeEntryQueryForm'
import type { TimeEntry } from '../types/timeEntry'
import type { TimeEntryQuery } from '../api/mockApi'
import { addEntries, queryEntries, getEntries } from '../api/timeEntryApi'
import { exportToExcel, importFromExcel } from '../utils/excel'
import styles from './TimeEntryListPage.module.css'

// 审批状态颜色映射
const statusColor: Record<string, string> = {
  '待审批': 'orange',
  '已通过': 'green',
  '已驳回': 'red',
}

// 审批状态文本映射
const statusText: Record<string, string> = {
  '待审批': '待审批',
  '已通过': '已通过',
  '已驳回': '已驳回',
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

// 列表页：使用 Ant Design Table 展示工时记录
function TimeEntryListPage() {
  // 从 Redux Store 读取状态
  const { entries, loading, error } = useSelector((state: RootState) => state.timesheet)
  const dispatch = useDispatch<AppDispatch>()

  // 挂载时加载数据
  useEffect(() => {
    if (entries.length === 0 && !loading) {
      getEntries().then((data) => {
        dispatch(setEntries(data))
      }).catch(() => {
        // 加载失败不影响使用
      })
    }
  }, [])

  // useNavigate：编程式导航，跳转路径由点击的记录动态决定
  const navigate = useNavigate()
  // 查询结果保存在本地 state：null 表示未过滤，显示 Store 全量
  const [filtered, setFiltered] = useState<TimeEntry[] | null>(null)
  // 导入状态
  const [importing, setImporting] = useState(false)
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 驳回 Modal 状态
  const [rejectModal, setRejectModal] = useState<{ open: boolean; entryId: string | null }>({
    open: false,
    entryId: null,
  })
  const [rejectForm] = Form.useForm<{ reason: string }>()

  // 待展示记录：有查询结果用查询结果，否则用 Store 全量
  const visibleEntries = filtered ?? entries

  // 计算当前页数据
  const startIndex = (currentPage - 1) * pageSize
  const currentEntries = visibleEntries.slice(startIndex, startIndex + pageSize)

  // 提交查询：条件全空时恢复全部；否则调用 queryEntries（内部经请求模块过滤）
  const handleQuery = useCallback(
    async (query: TimeEntryQuery) => {
      const { projectName, description, approvalStatus } = query
      if (!projectName && !description && !approvalStatus) {
        setFiltered(null)
      } else {
        setFiltered(await queryEntries(query))
      }
      // 查询条件变化时重置 currentPage 为 1
      setCurrentPage(1)
    },
    []
  )

  // 新增工时：跳转到独立新增页
  const handleCreate = useCallback(() => {
    navigate('/timesheet/create')
  }, [navigate])

  // 详情按钮：模板字符串拼接动态参数，跳转到对应记录的详情页
  const handleViewDetail = useCallback(
    (entry: TimeEntry) => {
      navigate(`/timesheet/${entry.id}`)
    },
    [navigate]
  )

  // 编辑按钮：跳转到对应记录的编辑页
  const handleEdit = useCallback(
    (entry: TimeEntry) => {
      navigate(`/timesheet/${entry.id}/edit`)
    },
    [navigate]
  )

  // 删除按钮：二次确认后 dispatch deleteEntry，并同步本地查询结果
  const handleDelete = useCallback(
    async (id: string) => {
      dispatch(deleteEntry(id))
      message.success('删除成功')
      // 处于查询过滤状态时同步移除已删除记录，保持可见列表一致
      setFiltered((prev) => {
        if (!prev) return prev
        const newFiltered = prev.filter((e) => e.id !== id)
        // 删除当前页最后一条记录时自动跳转到上一页
        if (newFiltered.length > 0) {
          const newTotalPages = Math.ceil(newFiltered.length / pageSize)
          if (currentPage > newTotalPages) {
            setCurrentPage(newTotalPages)
          }
        }
        return newFiltered
      })
    },
    [dispatch, currentPage, pageSize]
  )

  // 审批通过
  const handleApprove = useCallback(
    async (id: string) => {
      dispatch(approveEntry(id))
      message.success('审批通过')
    },
    [dispatch]
  )

  // 打开驳回 Modal
  const handleReject = useCallback((id: string) => {
    setRejectModal({ open: true, entryId: id })
    rejectForm.resetFields()
  }, [rejectForm])

  // 提交驳回
  const handleRejectSubmit = useCallback(async () => {
    try {
      const values = await rejectForm.validateFields()
      if (rejectModal.entryId) {
        dispatch(rejectEntry({ id: rejectModal.entryId, reason: values.reason }))
        message.success('已驳回')
        setRejectModal({ open: false, entryId: null })
      }
    } catch {
      // 校验失败不处理
    }
  }, [dispatch, rejectModal.entryId, rejectForm])

  // 关闭驳回 Modal
  const closeRejectModal = useCallback(() => {
    setRejectModal({ open: false, entryId: null })
  }, [])

  // 导出功能
  const handleExport = useCallback(() => {
    exportToExcel(visibleEntries)
    message.success('导出成功')
  }, [visibleEntries])

  // 导入功能
  const handleImport = useCallback(async (file: File) => {
    setImporting(true)
    try {
      const result = await importFromExcel(file)
      if (result.validRows.length === 0 && result.invalidCount === 0) {
        message.warning('文件中没有可导入的数据')
        return false
      }

      if (result.validRows.length > 0) {
        await addEntries(result.validRows)
        // 导入成功后从 Store 重新加载最新数据
        const { getEntries } = await import('../api/timeEntryApi')
        dispatch(setEntries(await getEntries()))
      }

      // 显示导入结果
      if (result.invalidCount > 0) {
        message.warning(`成功导入 ${result.validRows.length} 条，失败 ${result.invalidCount} 条`)
      } else {
        message.success(`成功导入 ${result.validRows.length} 条`)
      }

      // 刷新列表：重置 filtered 为 null 以获取最新数据
      setFiltered(null)
      return true
    } catch (err) {
      message.error(err instanceof Error ? err.message : '导入失败')
      return false
    } finally {
      setImporting(false)
    }
  }, [dispatch])

  // 使用 reduce 遍历可见记录数组，累加总工时
  const totalHours = visibleEntries.reduce((sum, entry) => sum + entry.hours, 0)

  // 定义 Table columns
  const columns: ColumnsType<TimeEntry> = [
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '工作内容',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '工时',
      dataIndex: 'hours',
      key: 'hours',
      render: (v: number) => `${v} 小时`,
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      render: (status: string) => (
        <Tag color={statusColor[status]}>{statusText[status]}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => formatDate(v),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" onClick={() => handleViewDetail(record)}>详情</Button>
          <Button size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确定删除该工时记录吗？"
            okText="删除"
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small">删除</Button>
          </Popconfirm>
          {/* 按状态条件渲染审批按钮 */}
          {record.approvalStatus === '待审批' && (
            <>
              <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>通过</Button>
              <Button size="small" icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>驳回</Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Header title="工时列表" />
      <TimeEntryQueryForm onQuery={handleQuery} onCreate={handleCreate} />

      {loading ? (
        /* 加载中状态 */
        <p className={styles.status}>加载中...</p>
      ) : error ? (
        /* 加载失败 + 重试入口 */
        <div className={styles.status}>
          <p className={styles.errorText}>加载失败：{error}</p>
          <button type="button" onClick={() => window.location.reload()} className={styles.retryBtn}>
            重试
          </button>
        </div>
      ) : (
        <>
          {/* 操作栏：左侧统计信息，右侧导入导出按钮 */}
          <div className={styles.toolbar}>
            <Stats totalHours={totalHours} />
            <div className={styles.toolbarActions}>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
                disabled={visibleEntries.length === 0}
              >
                导出
              </Button>
              <Upload
                accept=".xlsx"
                showUploadList={false}
                customRequest={(options) => {
                  if (options.file) {
                    handleImport(options.file as File)
                  }
                }}
              >
                <Button icon={<UploadOutlined />} loading={importing}>
                  导入
                </Button>
              </Upload>
            </div>
          </div>
          {/* 使用 Ant Design Table 渲染列表 */}
          <Table<TimeEntry>
            rowKey="id"
            columns={columns}
            dataSource={currentEntries}
            loading={loading}
            pagination={false}
            locale={{ emptyText: '暂无工时记录' }}
          />
          {/* 分页控件 */}
          {visibleEntries.length > 0 && (
            <div className={styles.pagination}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={visibleEntries.length}
                onChange={(page) => setCurrentPage(page)}
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          )}
        </>
      )}

      {/* 驳回 Modal */}
      <Modal
        title="驳回"
        open={rejectModal.open}
        onOk={handleRejectSubmit}
        onCancel={closeRejectModal}
        destroyOnHidden
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

export default TimeEntryListPage