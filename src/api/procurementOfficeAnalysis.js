import request from '@/utils/request'

// 获取采购及办公分析信息
export const getPurchaseAnalyzeList = data => request({
  url: '/a/budgetAnalyze/findPurchaseAnalyzeList',
  data
})

// 导出采购及办公分析信息
export const exportPurchaseAnalyze = data =>
  request({
    url: '/a/budgetAnalyze/exportFindPurchaseAnalyzeList',
    data,
    responseType: 'arraybuffer'
  })
