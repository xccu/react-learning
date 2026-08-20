import * as XLSX from 'xlsx'
import type { TimeEntry } from '../types/timeEntry'

// 表头映射：英文字段 → 中文列名
const headerMap: Record<keyof TimeEntry, string> = {
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
  // 将数据转换为带中文表头的对象数组
  const data = entries.map((entry) =>
    Object.fromEntries(
      Object.keys(headerMap).map((key) => [headerMap[key as keyof TimeEntry], entry[key as keyof TimeEntry]])
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

  // 创建临时下载链接触发浏览器下载
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // 下载后清理链接
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 导入结果类型
export interface ImportResult {
  validRows: Omit<TimeEntry, 'id' | 'createdAt'>[]
  invalidCount: number
}

// 从 Excel 文件导入工时记录
export function importFromExcel(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    // 检查文件扩展名
    if (!file.name.endsWith('.xlsx')) {
      reject(new Error('请选择 .xlsx 格式的文件'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0]
        if (!firstSheetName) {
          resolve({ validRows: [], invalidCount: 0 })
          return
        }

        const worksheet = workbook.Sheets[firstSheetName]

        // 将工作表转换为对象数组
        const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

        if (rawData.length === 0) {
          resolve({ validRows: [], invalidCount: 0 })
          return
        }

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

        resolve({ validRows, invalidCount })
      } catch {
        reject(new Error('文件解析失败，请检查文件格式'))
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    // 将文件读取为 ArrayBuffer
    reader.readAsArrayBuffer(file)
  })
}
