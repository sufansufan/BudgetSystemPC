import request from '@/utils/request'

// 获取字典列表
export const getDictList = data =>
  request({
    url: '/a/systemManage/findDictListByType',
    data
  })
