import { logout, getInfo, batchImportOrg, batchImportMachine, batchImportUser, batchImportFault, batchImportDescription } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
    setToken(token)
  },
  batchAddOrg({ commit }, list) {
    return new Promise((resolve, reject) => {
      batchImportOrg({ list: list }).then(response => {
        const { data } = response
        console.log(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  batchAddMachine({ commit }, list) {
    return new Promise((resolve, reject) => {
      batchImportMachine({ list: list }).then(response => {
        const { data } = response
        console.log(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  batchAddUser({ commit }, list) {
    return new Promise((resolve, reject) => {
      batchImportUser({ list: list }).then(response => {
        const { data } = response
        console.log(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  batchAddFault({ commit }, list) {
    return new Promise((resolve, reject) => {
      batchImportFault({ list: list }).then(response => {
        const { data } = response
        console.log(data)
      }).catch(error => {
        reject(error)
        resolve()
      })
    })
  },
  batchAddDescription({ commit }, list) {
    return new Promise((resolve, reject) => {
      batchImportDescription({ list: list }).then(response => {
        const { data } = response
        console.log(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

