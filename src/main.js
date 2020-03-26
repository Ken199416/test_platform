import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 加载全局css样式
import './assets/css/global.css'
// 导入
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/autoTest/platform'
Vue.prototype.$http = axios
// axios.defaults.withCredentials = true
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
