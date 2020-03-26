import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/login.vue'
import Home from './../components/home.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
  {
    path: '/login', component: Login
  },
  {
    path: '/', redirect:'/login'
  },
  {
    path: '/home',component: Home
  }
]



const router = new VueRouter({
  routes
});


// 挂载路由守卫,to : 将要访问的路径，from：代表从哪个路径的来的 next：表示放行函数
router.beforeEach((to, from , next) => {
  // 登录页不拦截，直接放行
  if(to.path === '/login') return next();
  const token = window.sessionStorage.getItem("token");
  if(!token) return next('/login');
  next();
})

export default router
