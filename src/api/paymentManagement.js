import request from '@/utils/request'

// 查询付款申请列表
export const getPayApplyList = data =>
  request({
    url: '/a/payManage/findPayApplyList',
    data
  })

// 获取付款申请详情
export const getPayApplyInfo = data =>
  request({
    url: '/a/payManage/getPayApplyById',
    data
  })

// 查询账户列表
export const getAccountList = data =>
  request({
    url: '/a/payManage/findAccountList',
    data
  })

// 编辑新增付款申请
export const editPayApply = data =>
  request({
    url: '/a/payManage/editPayApply',
    data
  })

// 删除付款申请
export const deletePayApply = data =>
  request({
    url: '/a/payManage/deletePayApply',
    data
  })

// 打款操作
export const makeMoney = data =>
  request({
    url: '/a/payManage/makeMoney',
    data
  })

// 获取付款查询列表
export const getPayQueryList = data =>
  request({
    url: '/a/payManage/findPayQueryList',
    data
  })

// 获取户名列表
export const getAccountAllList = data =>
  request({
    url: '/a/payManage/findAccountAllList',
    data
  })

// 新增编辑保存账户接口
export const addOrEditAccount = data =>
  request({
    url: '/a/payManage/editAccount',
    data
  })

// 更新账户信息
export const updateAccount = data =>
  request({
    url: '/a/payManage/updateAccountsInfo',
    data
  })

// 账户停／启用接口
export const editAccountState = data =>
  request({
    url: '/a/payManage/editAccountState',
    data
  })

// 删除账户
export const deleteAccount = data =>
  request({
    url: '/a/payManage/deleteAccount',
    data
  })
