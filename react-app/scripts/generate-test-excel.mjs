import * as XLSX from 'xlsx'

// 测试数据：包含合法数据和一条非法数据（缺少 projectName）
const testData = [
  { '项目名称': 'React 学习', '工作内容': '学习 Hooks', '工时数': 3, '审批状态': '已通过', '创建时间': '2026-08-15 10:00' },
  { '项目名称': '项目 A', '工作内容': '开发功能', '工时数': 5, '审批状态': '待审批', '创建时间': '2026-08-16 14:00' },
  { '项目名称': '代码审查', '工作内容': '审查 PR', '工时数': 2, '审批状态': '已驳回', '创建时间': '2026-08-17 09:00' },
  { '项目名称': '', '工作内容': '测试非法数据', '工时数': 1, '审批状态': '待审批', '创建时间': '2026-08-18 11:00' },  // 非法：projectName 为空
  { '项目名称': '测试项目', '工作内容': '测试零工时', '工时数': 0, '审批状态': '待审批', '创建时间': '2026-08-18 12:00' },  // 非法：hours 为 0
]

// 创建工作表
const worksheet = XLSX.utils.json_to_sheet(testData)

// 创建工作簿
const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, '工时记录')

// 保存文件
XLSX.writeFile(workbook, 'test-import.xlsx')

console.log('✓ 已生成 test-import.xlsx')
console.log('  - 3 条合法数据')
console.log('  - 2 条非法数据（projectName 为空、hours 为 0）')
