import request from '@/utils/request'

export function manageMachines(data) {
  return request({
    url: '/machine/manageMachines',
    method: 'post',
    data
  })
}

export function deleteMachines(data) {
  return request({
    url: '/machine/deleteMachines',
    method: 'post',
    data
  })
}

export function batchDelete(data) {
  return request({
    url: '/machine/batchDelete',
    method: 'post',
    data
  })
}

export function addMachines(data) {
  return request({
    url: '/machine/addMachines',
    method: 'post',
    data
  })
}
