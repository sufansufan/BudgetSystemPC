const budget = {
  state: {
    budgetList: [],
    attachmentData: {}
  },
  mutations: {
    SET_BUDGET_LIST: (state, list) => {
      state.budgetList = list
    },
    SET_ATTACHMENT_DATA: (state, list) => {
      state.attachmentData = list
    }
  },
  actions: {
    SetBudgetList({ commit }, list) {
      commit('SET_BUDGET_LIST', list)
    },
    SetAttachmentData({ commit }, list) {
      commit('SET_ATTACHMENT_DATA', list)
    }
  }
}
export default budget
