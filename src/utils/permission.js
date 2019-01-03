import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const menuIds = store.getters && store.getters.menuIds
    const permissionIds = value

    const hasPermission = menuIds.some(id => {
      return permissionIds.includes(id)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`权限错误，请联系管理员"`)
    return false
  }
}
