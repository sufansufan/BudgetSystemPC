import request from '@/utils/request'

// 获取部门管理结构数据
export const getOfficeTree = data =>
  request({
    url: '/a/systemManage/findOfficeTree',
    data
  })

// 添加编辑部门
export const addAndEditOffice = data =>
  request({
    url: '/a/systemManage/addAndEditOffice',
    data
  })

// 删除部门归属信息
export const deleteOffice = data =>
  request({
    url: '/a/systemManage/deleteOffice',
    data
  })
