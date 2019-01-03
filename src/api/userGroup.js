import request from '@/utils/request'

// 获取用户组信息
export const getRoleList = data => request({
  url: '/a/systemManage/findRoleList',
  data
})

// 删除用户组
export const deleteRoleGroup = data => request({
  url: '/a/systemManage/deleteRoleGroup',
  data
})

// 新增编辑用户组
export const addAndEditRole = data => request({
  url: '/a/systemManage/addAndEditRole',
  data
})

// 获取全部菜单
export const getAllMenu = data => request({
  url: '/a/systemManage/findAllMenu',
  data
})

// 获取用户组对应的权限
export const getRoleMenuListById = data => request({
  url: '/a/systemManage/findRoleMenuListById',
  data
})
