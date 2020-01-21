import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/getWOList',
    method: 'post',
    data
  })
}

export function initWOList() {
  return request({
    url: '/admin/initWOList',
    method: 'post'
  })
}
