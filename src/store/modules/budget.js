const budget = {
  state: {
    budgetList: [],
    attachmentData: {},
    fileIdList: []
  },
  mutations: {
    SET_BUDGET_LIST: (state, list) => {
      state.budgetList = list
    },
    SET_ATTACHMENT_DATA: (state, list) => {
      state.attachmentData = list
    },
    SET_FILEIDLIST: (state, list) => {
      state.fileIdList = list
    }
  },
  actions: {
    SetBudgetList({ commit }, list) {
      commit('SET_BUDGET_LIST', list)
    },
    SetAttachmentData({ commit }, list) {
      commit('SET_ATTACHMENT_DATA', list)
    },
    SetFileIdList({ commit }, list) {
      commit('SET_FILEIDLIST', list)
    }
  }
}
export default budget
