import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './../components/login.vue'
import Home from './../components/home.vue'
import Welcome from './../components/welcome.vue'
import CaseSingle from './../components/case/single.vue'
import CaseGroup from './../components/case/group.vue'
import CaseDatabase from './../components/case/database.vue'
import ProjectSingle from './../components/project/single.vue'
import ProjectGroup from './../components/project/group.vue'
import CaseConfigParams from './../components/caseConfig/params.vue'
import CaseConfigComponent from './../components/caseConfig/component.vue'
import CaseConfigDateSource from './../components/caseConfig/dataSource.vue'
import TaskJob from './../components/task/job.vue'
import TaskReport from './../components/task/report.vue'
import UtilsFirst from './../components/utils/first.vue'
import UtilsSecond from './../components/utils/second.vue'
import ConfigUser from './../components/config/user.vue'
import ConfigPermission from './../components/config/permission.vue'
import ConfigUserInfo from './../components/config/user/userInfo.vue'
import ExecuteRecoding from './../components/case/executeRecoding.vue'




Vue.use(VueRouter)

const routes = [

  {
    path: '/login', component: Login
  },
  {
    path: '/', redirect:'/home'
  },
  {
    path: '/home',component: Home,redirect :'/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path: '/case/single',component:CaseSingle},
        {path: '/case/group',component:CaseGroup},
        {path: '/case/database',component:CaseDatabase},
        {path: '/case/executeRecoding/:cid',component:ExecuteRecoding,props: true},

        {path: '/project/single',component:ProjectSingle},
        {path: '/project/group',component:ProjectGroup},

        {path: '/caseConfig/params',component:CaseConfigParams},
        {path: '/caseConfig/component',component:CaseConfigComponent},
        {path: '/caseConfig/dataSource',component:CaseConfigDateSource},

        {path: '/task/job',component:TaskJob},
        {path: '/task/report',component:TaskReport},

        {path: '/utils/first',component:UtilsFirst},
        {path: '/utils/second',component:UtilsSecond},

        {path: '/config/user',component:ConfigUser},
        {path: '/config/permission',component:ConfigPermission},
        {path: '/config/user/userInfo/:uid',component:ConfigUserInfo,props: true}

      ]
  }
]



const router = new VueRouter({
  routes
});


// 挂载路由守卫,to : 将要访问的路径，from：代表从哪个路径的来的 next：表示放行函数
router.beforeEach((to, from , next) => {
  // 登录页不拦截，直接放行
  if(to.path === '/login') return next();
  const token = window.localStorage.getItem("token");
  if(!token) return next('/login');
  next(); 
})

export default router
