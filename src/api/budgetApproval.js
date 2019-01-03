import request from '@/utils/request'

// 获取预算审批主管视图列表
export const getBudgetExamineList = data =>
  request({
    url: '/a/budgetExamine/findBudgetExamineList',
    data
  })

// 预算审批操作
export const editBudgetApproval = data =>
  request({
    url: '/a/budgetExamine/editBudgetApproval',
    data
  })

// 后勤视图审批查看和批量审批查看接口
export const getLogisticsAuditInfo = data =>
  request({
    url: '/a/budgetExamine/findPurchaseApplyListByBudgetSummaryIds',
    data
  })

// 编辑采购申请
export const editPurchaseApply = data =>
  request({
    url: '/a/budgetExamine/editPurchaseApply',
    data
  })

// 删除采购申请
export const delPurchaseApply = data =>
  request({
    url: '/a/budgetExamine/deletePurchaseApplyByIds',
    data
  })

// 预算汇总合并接口
export const addBudgetSummaryMerge = data =>
  request({
    url: '/a/budgetExamine/addBudgetSummaryMerge',
    data
  })

// 校长审批
export const principalApproval = data =>
  request({
    url: '/a/budgetExamine/principalApproval',
    data
  })

// 预算外审批
export const editBudgetOutByAudit = data =>
  request({
    url: '/a/myBudgetOut/editBudgetOutByAudit',
    data
  })

// 打印备用金申请单
export const printingReserveFund = data =>
  request({
    url: '/a/budgetExamine/printingReserveFund',
    data
  })

// 打印付款申请单
export const printingPaymentForm = data =>
  request({
    url: '/a/myBudgetOut/getBudgetOutByIds',
    data
  })

// 校长统计视图
export const getBudgetByIdChart = data =>
  request({
    url: '/a/myBudget/getBudgetByIdChart',
    data
  })
