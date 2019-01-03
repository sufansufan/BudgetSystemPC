import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/utils/initTheme' // init theme
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import * as filters from './filters' // global filters
import plugins from './plugins' // global plugins
import print from './plugins/print' // print plugins

import '@/directive/permission' // global directive
import '@/icons' // icon
import '@/errorLog' // error log
import '@/permission' // permission control
// import './mock' // simulation data

Vue.use(ElementUI, { size: 'small' })

// register global plugins.
Vue.use(plugins)

// register global print.
Vue.use(print)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
