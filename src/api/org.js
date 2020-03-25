import request from '@/utils/request'

export function queryOrg(data) {
  return request({
    url: '/admin/queryOrgs',
    method: 'post',
    data
  })
}

export function addOrg(data) {
  return request({
    url: '/org/addOrg',
    method: 'post',
    data
  })
}

export function manageOrg(data) {
  return request({
    url: '/org/manageOrg',
    method: 'post',
    data
  })
}

export function ChangePass(data) {
  return request({
    url: '/org/changeOrgPassword',
    method: 'post',
    data
  })
}

export function deleteOrg(data) {
  return request({
    url: '/org/deleteOrg',
    method: 'post',
    data
  })
}

export function batchDelete(data) {
  return request({
    url: '/org/batchDelete',
    method: 'post',
    data
  })
}
