import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { JSEncrypt } from 'jsencrypt'
import { KEY } from '@/utils/auth'
const encryptor = new JSEncrypt()
encryptor.setPublicKey(KEY)

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    menuIds: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_MENUIDS: (state, ids) => {
      state.menuIds = ids
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const { authSignature } = response.data
            const token = encryptor.decrypt(authSignature)
            setToken(token)
            commit('SET_TOKEN', token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(response => {
            const { menu, userInfo } = response.data
            if (menu && menu.length) {
              // 验证返回的menu是否是一个非空数组
              commit('SET_MENUIDS', menu)
            } else {
              reject('getInfo: menu must be a non-null array !')
            }
            commit('SET_USERINFO', userInfo)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
