import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.id判断是否与当前用户权限匹配
 * @param id
 * @param route
 */
function hasPermission(menuIds, route) {
  if (route.meta && route.meta.id) {
    return menuIds.some(id => +id === route.meta.id)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param menuIds
 */
function filterAsyncRouter(routes, menuIds) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(menuIds, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, menuIds)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, { routers, newConstantRouterMap }) => {
      state.addRouters = routers
      state.routers = newConstantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menuIds } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menuIds)
        const newConstantRouterMap = constantRouterMap.map(item => {
          if (!item.path) {
            item.children[0].redirect = accessedRouters[1].redirect
          }
          return item
        })
        commit('SET_ROUTERS', {
          routers: accessedRouters,
          newConstantRouterMap
        })
        resolve()
      })
    }
  }
}

export default permission
