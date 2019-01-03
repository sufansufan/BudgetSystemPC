import { getDictList } from '@/api'
import {
  getOfficeAllTree,
  getRoleList,
  getBudgetLevelList
} from '@/api/constant'
import { strFirstUpper, handleLastEmpty } from '@/utils'

const constant = {
  state: {
    noConstant: ['office', 'role', 'project'], // 不是常量集合，还需在constant里声明
    constant: {
      office: [], // 部门
      role: [], // 角色
      budget_summary_analyze_show_type: [],
      project: [],
      budget_summary_state: [],
      pay_apply_state: [],
      account_state: [],
      revenue_expenditure_identification: []
    }
  },
  mutations: {
    SET_DICT(state, { type, list }) {
      state.constant[type] = list
    },
    SET_OFFICE(state, list) {
      state.constant.office = list
    },
    SET_ROLE(state, list) {
      state.constant.role = list
    },
    SET_PROJECT(state, list) {
      state.constant.project = list
    }
  },
  actions: {
    GetConstant({ dispatch, state }, name) {
      const events = []
      const isConstant = name => {
        if (state.noConstant.includes(name)) {
          events.push(dispatch('Get' + strFirstUpper(name)))
        } else {
          events.push(dispatch('GetDict', name))
        }
      }
      if (Array.isArray(name)) {
        for (const item of name) {
          if (state.constant[item].length) continue
          isConstant(item)
        }
      } else {
        if (state.constant[name].length) return
        isConstant(name)
      }
      return Promise.all(events)
    },
    GetDict({ commit }, type) {
      return new Promise((resolve, reject) => {
        getDictList({ dictType: type })
          .then(response => {
            const list = response.data.list
            commit('SET_DICT', { type, list })
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetOffice({ commit }) {
      return new Promise((resolve, reject) => {
        getOfficeAllTree()
          .then(response => {
            const list = handleLastEmpty(response.data.list, 'children')
            commit('SET_OFFICE', list)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetRole({ commit }) {
      return new Promise((resolve, reject) => {
        getRoleList({})
          .then(response => {
            commit('SET_ROLE', response.data.list)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetProject({ commit }) {
      return new Promise((resolve, reject) => {
        getBudgetLevelList({})
          .then(response => {
            commit('SET_PROJECT', response.data.budgetLevel[0].budgetLevels)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default constant
