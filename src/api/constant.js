import request from '@/utils/request'

// 获取部门信息
export const getOfficeAllTree = data => request({
  url: '/a/systemManage/findOfficeAllTree',
  data
})
// 获取角色
export const getRoleList = data => request({
  url: '/a/systemManage/findRoleList',
  data
})

// 获取预算层次信息
export const getBudgetLevelList = data =>
  request({
    url: '/a/systemManage/findBudgetLevelList',
    data
  })
