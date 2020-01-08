import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: '/table/list',
    method: 'post',
    data
  })
}
