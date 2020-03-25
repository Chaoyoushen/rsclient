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

export function queryMachines(data) {
  return request({
    url: '/admin/queryMachines',
    method: 'post',
    data
  })
}

export function queryFault(data) {
  return request({
    url: '/admin/queryFault',
    method: 'post',
    data
  })
}

export function queryDescription(data) {
  return request({
    url: '/admin/queryDescription',
    method: 'post',
    data
  })
}

export function manageWO(data) {
  return request({
    url: '/admin/manageWO',
    method: 'post',
    data
  })
}

export function getWOInfo(data) {
  return request({
    url: '/wo/getWOInfo',
    method: 'post',
    data
  })
}
