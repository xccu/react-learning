import * as XLSX from 'xlsx'
import type { TimeEntry } from '../types/timeEntry'

// 表头映射：英文字段 → 中文列名
const headerMap: Record<Exclude<keyof TimeEntry, 'rejectReason'>, string> = {
  id: 'ID',
  projectName: '项目名称',
  description: '工作内容',
  hours: '工时数',
  approvalStatus: '审批状态',
  createdAt: '创建时间',
}

// 中文列名 → 英文字段（反向映射，用于导入）
const reverseHeaderMap: Record<string, keyof TimeEntry> = Object.fromEntries(
  Object.entries(headerMap).map(([key, value]) => [value, key as keyof TimeEntry])
)

// 导出工时记录为 Excel 文件
export function exportToExcel(entries: TimeEntry[], filename: string = '工时记录.xlsx') {
  console.group(`[excel] 导出: ${filename}`)
  console.log(`记录数: ${entries.length}`)

  // 将数据转换为带中文表头的对象数组
  const data = entries.map((entry) =>
    Object.fromEntries(
      (Object.keys(headerMap) as Array<Exclude<keyof TimeEntry, 'rejectReason'>>).map((key) => [headerMap[key], entry[key]])
    )
  )

  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(data)

  // 创建工作簿并添加工作表
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '工时记录')

  // 生成 Excel 文件并转为 Blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  console.log(`文件大小: ${(blob.size / 1024).toFixed(1)} KB`)
  console.log(`MIME 类型: ${blob.type}`)

  // 创建临时下载链接触发浏览器下载
  const url = URL.createObjectURL(blob)
  console.log(`下载链接: ${url}`)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // 下载后清理链接
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  console.log('链接已清理')
  console.groupEnd()
}

// 导入结果类型
export interface ImportResult {
  validRows: Omit<TimeEntry, 'id' | 'createdAt'>[]
  invalidCount: number
}

// 从 Excel 文件导入工时记录
export function importFromExcel(file: File): Promise<ImportResult> {
  console.group(`[excel] 导入: ${file.name}`)
  console.log(`文件大小: ${(file.size / 1024).toFixed(1)} KB`)
  console.log(`MIME 类型: ${file.type || '(未指定)'}`)

  return new Promise((resolve, reject) => {
    // 检查文件扩展名
    if (!file.name.endsWith('.xlsx')) {
      console.error('格式校验失败: 非 .xlsx 文件')
      console.groupEnd()
      reject(new Error('请选择 .xlsx 格式的文件'))
      return
    }
    console.log('格式校验通过')

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        console.log(`ArrayBuffer 大小: ${data.byteLength} bytes`)

        const workbook = XLSX.read(data, { type: 'array' })
        console.log(`工作簿包含 ${workbook.SheetNames.length} 个工作表: [${workbook.SheetNames.join(', ')}]`)

        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          console.warn('工作簿为空，无工作表')
          console.groupEnd()
          resolve({ validRows: [], invalidCount: 0 })
          return
        }

        const worksheet = workbook.Sheets[firstSheetName]
        console.log(`当前工作表: "${firstSheetName}"`)

        // 将工作表转换为对象数组
        const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
        console.log(`解析到 ${rawData.length} 行数据`)

        if (rawData.length === 0) {
          console.warn('无数据行')
          console.groupEnd()
          resolve({ validRows: [], invalidCount: 0 })
          return
        }

        // 打印表头（第一行的键）
        const headers = Object.keys(rawData[0])
        console.log(`列名: [${headers.join(', ')}]`)

        const validRows: Omit<TimeEntry, 'id' | 'createdAt'>[] = []
        let invalidCount = 0

        // 逐条校验数据
        for (const row of rawData) {
          // 使用反向映射将中文列名转换为英文字段
          const mapped: Record<string, unknown> = {}
          for (const [chineseKey, value] of Object.entries(row)) {
            const englishKey = reverseHeaderMap[chineseKey]
            if (englishKey && englishKey !== 'id' && englishKey !== 'createdAt') {
              mapped[englishKey] = value
            }
          }

          // 校验必填字段
          const projectName = mapped.projectName
          const hours = mapped.hours

          if (
            typeof projectName === 'string' &&
            projectName.trim() !== '' &&
            typeof hours === 'number' &&
            hours > 0
          ) {
            validRows.push({
              projectName: projectName.trim(),
              description: typeof mapped.description === 'string' ? mapped.description.trim() : '',
              hours: hours,
              approvalStatus: ['待审批', '已通过', '已驳回'].includes(mapped.approvalStatus as string)
                ? (mapped.approvalStatus as TimeEntry['approvalStatus'])
                : '待审批',
            })
          } else {
            invalidCount++
          }
        }

        console.log(`校验完成: 合法 ${validRows.length} 条, 非法 ${invalidCount} 条`)
        if (validRows.length > 0) {
          console.table(validRows.map((r) => ({ 项目名称: r.projectName, 工时数: r.hours, 审批状态: r.approvalStatus })))
        }
        console.groupEnd()
        resolve({ validRows, invalidCount })
      } catch {
        console.error('xlsx 解析异常')
        console.groupEnd()
        reject(new Error('文件解析失败，请检查文件格式'))
      }
    }

    reader.onerror = () => {
      console.error('FileReader 读取失败')
      console.groupEnd()
      reject(new Error('文件读取失败'))
    }

    // 将文件读取为 ArrayBuffer
    reader.readAsArrayBuffer(file)
  })
}
