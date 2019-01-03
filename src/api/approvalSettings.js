import request from '@/utils/request'

// 获取审批流设置信息
export const getExamineList = data => request({
  url: '/a/systemManage/findExamineList',
  data
})
// 获取审批设置title列表
export const getExamineTitleList = data => request({
  url: '/a/systemManage/findExamineTitleList',
  data
})
// 获取采购基本信息
export const getPurchaseInfoList = data =>
  request({
    url: '/a/systemManage/findPurchaseInfoList',
    data
  })

// 编辑审批流设置信息
export const editExamineSetting = data => request({
  url: '/a/systemManage/editExamineSetting',
  data
})

// 获取角色对应用户列表
export const getUserManageList = data => request({
  url: '/a/systemManage/findUserManageList',
  data
})

// 添加编辑预算类别设置
export const addAndEditBudgetClass = data => request({
  url: '/a/systemManage/addAndEditBudgetClass',
  data
})

// 修改采购信息表状态
export const editPurchaseInfoStatus = data => request({
  url: '/a/systemManage/editPurchaseInfoStatus',
  data
})

// 删除采购基本信息
export const deletePurchaseInfo = data => request({
  url: '/a/systemManage/deletePurchaseInfo',
  data
})

// 查询供应商列表
export const getSupplierList = data => request({
  url: '/a/systemManage/findSupplierList',
  data
})

// 新增编辑供应商
export const editSupplier = data => request({
  url: '/a/systemManage/editSupplier',
  data
})

// 删除供应商
export const deleteSupplier = data => request({
  url: '/a/systemManage/deleteSupplier',
  data
})

// 修改供应商状态
export const editSupplierState = data => request({
  url: '/a/systemManage/editSupplierState',
  data
})
