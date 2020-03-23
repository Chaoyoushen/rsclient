import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/getWOList',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function initWOList() {
  return request({
    url: '/admin/initWOList',
    method: 'post'
  })
}

export function queryOrgs() {
  return request({
    url: '/admin/queryOrgs',
    method: 'post'
  })
}

export function queryMachines() {
  return request({
    url: '/admin/queryMachines',
    method: 'post'
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
