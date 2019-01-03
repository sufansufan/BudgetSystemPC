import request from '@/utils/request'

// 获取用户管理信息
export const getUserManageList = data => request({
  url: '/a/systemManage/findUserManageList',
  data
})

// 添加编辑用户
export const addAndEditUser = data => request({
  url: '/a/systemManage/addAndEditUser',
  data
})

// 编辑用户的状态
export const editUserStatus = data => request({
  url: '/a/systemManage/editUserStatus',
  data
})

// 删除用户
export const deleteUser = data => request({
  url: '/a/systemManage/deleteUser',
  data
})

// 导出用户
export const exportUserManageList = data =>
  request({
    url: '/a/systemManage/exportUserManageList',
    data,
    responseType: 'arraybuffer'
  })

// 重置密码
export const resetPassword = data => request({
  url: '/a/systemManage/resetPassword',
  data
})
