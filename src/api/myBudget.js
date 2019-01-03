import request from '@/utils/request'

// 获取我的预算列表
export const getBudgetList = data =>
  request({
    url: '/a/myBudget/findBudgetList',
    data
  })

// 获取预算层次信息
export const getBudgetLevelList = data =>
  request({
    url: '/a/systemManage/findBudgetLevelList',
    data
  })

// 获取预算汇总详情
export const getBudgetDetail = data =>
  request({
    url: '/a/myBudget/getBudgetById',
    data
  })

// 保存预算
export const saveBudget = data =>
  request({
    url: '/a/myBudget/editBudget',
    data
  })

// 删除预算
export const deleteBudget = data =>
  request({
    url: '/a/myBudget/deleteBudgetByIds',
    data
  })

// 获取预算外列表
export const getBudgetOutList = data =>
  request({
    url: '/a/myBudgetOut/findBudgetOutList',
    data
  })

// 删除预算
export const deleteBudgetOut = data =>
  request({
    url: '/a/myBudgetOut/deleteBudgetOut',
    data
  })

// 获取预算外详情
export const getBudgetOutDetails = data =>
  request({
    url: '/a/myBudgetOut/getBudgetOutById',
    data
  })

// 添加编辑预算外
export const addOrEditBudgetOut = data =>
  request({
    url: '/a/myBudgetOut/addAndEditBudgetOutInfo',
    data
  })

// 提交预算外
export const budgetOutSubmit = data =>
  request({
    url: '/a/myBudgetOut/editBudgetOutSubmit',
    data
  })

// 导出预算内
export const exportMyBudgetList = data =>
  request({
    url: '/a/myBudget/exportMyBudgetList',
    data,
    responseType: 'arraybuffer'
  })

// 导出预算外
export const exportFindBudgetOutList = data =>
  request({
    url: '/a/myBudgetOut/exportFindBudgetOutList',
    data,
    responseType: 'arraybuffer'
  })

// 导出预算内详情
export const exportMyBudgetInfo = data =>
  request({
    url: '/a/myBudget/exportMyBudgetInfo',
    data,
    responseType: 'arraybuffer'
  })
