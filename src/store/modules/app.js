import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    drawer: false,
    theme: Cookies.get('theme') || 'blackgold',
    fastNav: Cookies.get('fastNav') ? JSON.parse(Cookies.get('fastNav')) : true
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    TOGGLE_DRAWER: (state, opened = true) => {
      state.drawer = opened
    },
    CHANGE_THEME: (state, theme = state.theme) => {
      Cookies.set('theme', theme)
      state.theme = theme
    },
    TOGGLE_FAST_NAV: state => {
      state.fastNav = !state.fastNav
      Cookies.set('fastNav', state.fastNav)
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    ToggleDrawer({ commit }, opened) {
      commit('TOGGLE_DRAWER', opened)
    },
    ChangeTheme({ commit }, theme) {
      commit('CHANGE_THEME', theme)
    },
    ToggleFastNav: ({ commit }) => {
      commit('TOGGLE_FAST_NAV')
    }
  }
}

export default app
