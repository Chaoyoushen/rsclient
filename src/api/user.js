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
export function queryUser() {
  return request({
    url: '/admin/queryUser',
    method: 'post'
  })
}
export function initUsermanage() {
  return request({
    url: '/user/initUsermanage',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}

export function manageUser(data) {
  return request({
    url: '/user/manageUser',
    method: 'post',
    data
  })
}

export function ChangePass(data) {
  return request({
    url: '/user/changeUserpassword',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data
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

export function batchImportUser(data) {
  return request({
    url: '/user/batchAdd',
    method: 'post',
    data
  })
}
