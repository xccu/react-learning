import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTimeEntries } from '../context/TimeEntryContext'
import Header from '../components/timesheet/Header'
import Stats from '../components/timesheet/Stats'
import TimeEntryList from '../components/timesheet/TimeEntryList'
import TimeEntryQueryForm from '../components/timesheet/TimeEntryQueryForm'
import type { TimeEntry } from '../types/timeEntry'
import type { TimeEntryQuery } from '../api/mockApi'
import { addEntries } from '../api/timeEntryApi'
import { exportToExcel, importFromExcel } from '../utils/excel'
import styles from './TimeEntryListPage.module.css'

// 列表页：复用 Stats 与 TimeEntryList，作为主布局的默认子页面
function TimeEntryListPage() {
  const { entries, loading, error, retry, deleteEntry, queryEntries } = useTimeEntries()
  // useNavigate：编程式导航，跳转路径由点击的记录动态决定，Link 在模板里不好表达
  const navigate = useNavigate()
  // 查询结果保存在本地 state：null 表示未过滤，显示 Context 全量
  const [filtered, setFiltered] = useState<TimeEntry[] | null>(null)
  // 导入状态
  const [importing, setImporting] = useState(false)
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // 待展示记录：有查询结果用查询结果，否则用 Context 全量
  const visibleEntries = filtered ?? entries

  // 计算总页数
  const totalPages = Math.ceil(visibleEntries.length / pageSize)

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
    [queryEntries]
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

  // 删除按钮：二次确认后调用 deleteEntry，并同步本地查询结果
  const handleDelete = useCallback(
    async (id: string) => {
      // 【JavaScript window.confirm】原生确认框：取消返回 false 不删除
      if (!window.confirm('确定删除该工时记录吗？')) return
      await deleteEntry(id)
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
    [deleteEntry, currentPage, pageSize]
  )

  // 导出功能
  const handleExport = useCallback(() => {
    exportToExcel(visibleEntries)
  }, [visibleEntries])

  // 导入功能
  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
      const result = await importFromExcel(file)
      if (result.validRows.length === 0 && result.invalidCount === 0) {
        alert('文件中没有可导入的数据')
        return
      }

      if (result.validRows.length > 0) {
        await addEntries(result.validRows)
        // 导入成功后刷新 Context 中的数据
        retry()
      }

      // 显示导入结果
      const message =
        result.invalidCount > 0
          ? `成功导入 ${result.validRows.length} 条，失败 ${result.invalidCount} 条`
          : `成功导入 ${result.validRows.length} 条`
      alert(message)

      // 刷新列表：重置 filtered 为 null 以获取最新数据
      setFiltered(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : '导入失败')
    } finally {
      setImporting(false)
      // 清空 input 值，允许重复选择同一文件
      event.target.value = ''
    }
  }, [retry])

  // 使用 reduce 遍历可见记录数组，累加总工时
  const totalHours = visibleEntries.reduce((sum, entry) => sum + entry.hours, 0)

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
          <button type="button" onClick={retry} className={styles.retryBtn}>
            重试
          </button>
        </div>
      ) : (
        <>
          {/* 操作栏：左侧统计信息，右侧导入导出按钮 */}
          <div className={styles.toolbar}>
            <Stats totalHours={totalHours} />
            <div className={styles.toolbarActions}>
              <button
                type="button"
                onClick={handleExport}
                className={styles.toolbarBtn}
                disabled={visibleEntries.length === 0}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                导出
              </button>
              <label className={styles.toolbarBtn}>
                {importing ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinning}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    导入中...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    导入
                  </>
                )}
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleImport}
                  className={styles.hiddenInput}
                  disabled={importing}
                />
              </label>
            </div>
          </div>
          {/* 空数据时 TimeEntryList 内部渲染「暂无工时记录」 */}
          <TimeEntryList
            entries={currentEntries}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {/* 分页控件 */}
          {visibleEntries.length > 0 && (
            <div className={styles.pagination}>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                上一页
              </button>
              <span className={styles.paginationInfo}>
                第 {currentPage}/{totalPages} 页，共 {visibleEntries.length} 条
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TimeEntryListPage
