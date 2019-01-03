import request from '@/utils/request'

// 获取执行分析列表
export const getExecuteAnalyzeList = data => request({
  url: '/a/budgetAnalyze/findBudgetExecuteAnalyzeList',
  data
})

// 导出执行分析
export const exportExecuteAnalyzeList = data =>
  request({
    url: '/a/budgetAnalyze/exportBudgetExecuteAnalyzeList',
    data,
    responseType: 'arraybuffer'
  })
