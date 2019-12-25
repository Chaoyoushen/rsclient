import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getUserInfo'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function batchImportOrg(data) {
  return request({
    url: '/org/batchAdd',
    method: 'post',
    data
  })
}

export function batchImportMachine(data) {
  return request({
    url: '/machine/batchAdd',
    method: 'post',
    data
  })
}
