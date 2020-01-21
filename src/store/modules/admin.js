import { getList, initWOList } from '@/api/admin'

const actions = {
  getList({ commit }, orgId, person, orderSts) {
    return new Promise((resolve, reject) => {
      getList({ org: orgId, person: person, sts: orderSts }).then(response => {
        const { data } = response
        console.log(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  initWOList({ commit }) {
    return new Promise((resolve, reject) => {
      initWOList().then(response => {
        const { data } = response
        console.log(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  actions
}
