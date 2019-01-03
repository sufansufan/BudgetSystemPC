import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const menuIds = store.getters && store.getters.menuIds

    if (value && value instanceof Array && value.length > 0) {
      const permissionIds = value

      const hasPermission = menuIds.some(id => {
        return permissionIds.includes(id)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`权限错误，请联系管理员"`)
    }
  }
}
