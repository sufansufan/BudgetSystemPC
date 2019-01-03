const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  drawer: state => state.app.drawer,
  theme: state => state.app.theme,
  fastNav: state => state.app.fastNav,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  menuIds: state => state.user.menuIds,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs,
  budgetList: state => state.budget.budgetList,
  attachmentData: state => state.budget.attachmentData,
  constant: state => state.constant.constant
}
export default getters
