import request from '@/utils/request'

export function manageFault(data) {
  return request({
    url: '/fault/manageFault',
    method: 'post',
    data
  })
}

export function deleteFault(data) {
  return request({
    url: '/fault/deleteFault',
    method: 'post',
    data
  })
}

export function batchDelete(data) {
  return request({
    url: '/fault/batchDelete',
    method: 'post',
    data
  })
}

export function addFault(data) {
  return request({
    url: '/fault/addFault',
    method: 'post',
    data
  })
}
export function getFaultExcel() {
  return request({
    url: '/fault/getFaultExcel',
    method: 'post',
    responseType: 'blob'
  })
}
