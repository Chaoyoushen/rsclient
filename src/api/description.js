import request from '@/utils/request'

export function manageDescription(data) {
  return request({
    url: '/description/manageDescription',
    method: 'post',
    data
  })
}

export function deleteDescription(data) {
  return request({
    url: '/description/deleteDescription',
    method: 'post',
    data
  })
}

export function batchDelete(data) {
  return request({
    url: '/description/batchDelete',
    method: 'post',
    data
  })
}

export function addDescription(data) {
  return request({
    url: '/description/addDescription',
    method: 'post',
    data
  })
}

export function getDescriptionExcel() {
  return request({
    url: '/description/getDescriptionExcel',
    method: 'post',
    responseType: 'blob'
  })
}
