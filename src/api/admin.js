import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/getWOList',
    method: 'post',
    data
  })
}

export function getWOList(data) {
  return request({
    url: '/admin/getWODetailList',
    method: 'post',
    data
  })
}

export function getAcctWOList(data) {
  return request({
    url: '/admin/queryAcctTimeWOList',
    method: 'post',
    data
  })
}

export function getTakeWOList(data) {
  return request({
    url: '/admin/queryTakeTimeWOList',
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

export function queryBadWOList() {
  return request({
    url: '/admin/queryBadWOList',
    method: 'post'
  })
}

export function queryChangeWOList() {
  return request({
    url: '/admin/queryChangeWOList',
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

export function queryOPList(data) {
  return request({
    url: '/operation/queryOPList',
    method: 'post',
    data
  })
}

export function getWOExcel(data) {
  return request({
    url: '/admin/getWOExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function getAcctWOExcel(data) {
  return request({
    url: '/admin/getAcctWOExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}

export function getTakeWOExcel(data) {
  return request({
    url: '/admin/getTakeWOExcel',
    method: 'post',
    responseType: 'blob',
    data
  })
}
