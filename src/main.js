/*
 * @Description:
 * @Author: ll
 * @Date: 2021-08-19 01:16:38
 * @LastEditors: ll
 * @LastEditTime: 2021-08-24 00:55:32
 * @FilePath: /vue-h5-template/src/main.js
 */
// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn

import Signature from 'vue-fast-signature'
Vue.use(Signature)
// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
var vConsole = new VConsole();

// filters
import './filters'
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
