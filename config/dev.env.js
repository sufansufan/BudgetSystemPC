'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.1.111:9000/"' // 查江
  BASE_API: '"http://192.168.1.103:9000/"' // 朱
  // BASE_API: '"http://192.168.1.160/mock/23/"'
  // BASE_API: '"http://192.168.1.142:9000"' // 测试
})
