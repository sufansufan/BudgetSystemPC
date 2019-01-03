import request from '@/utils/request'

// 获取预算分析列表
export const getBudgetAnalyzeList = data =>
  request({
    url: '/a/budgetAnalyze/findBudgetAnalyzeList',
    data
  })

// 导出预算分析
export const exportBudgetAnalyzeList = data =>
  request({
    url: '/a/budgetAnalyze/exportBudgetAnalyzeList',
    data,
    responseType: 'arraybuffer'
  })
