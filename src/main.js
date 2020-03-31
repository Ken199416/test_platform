import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 加载全局css样式
import './assets/css/global.css'
// 导入
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/autoTest/platform'
axios.interceptors.request.use(config => {
  /*判断token存在   登录拦截*/
  if(window.localStorage.getItem("token")){
    /*设置统一的header*/
    config.headers.Authorization  = window.localStorage.getItem("token");
  }
  return config;
});
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
 
