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
import AddSQLSelectComponent from './../components/caseConfig/components/dbComponent.vue'
import SingleCaseAction from './../components/case/caseAction/singleCaseAction.vue'
import SWorks from './../components/sworks.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/login', component: Login
  },
  {
    path: '/', redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      {
        path: '/case/single',
        component: CaseSingle,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/sworks',
        component: SWorks,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/case/single/action/:cid',
        component: SingleCaseAction,
        props: true,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/case/group',
        component: CaseGroup,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/case/database',
        component: CaseDatabase,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/case/executeRecoding/:cid',
        component: ExecuteRecoding,
        props: true,
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/project/single',
        component: ProjectSingle,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/project/group',
        component: ProjectGroup,
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/caseConfig/params',
        component: CaseConfigParams,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/caseConfig/component',
        component: CaseConfigComponent,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/caseConfig/component/sqlSelectComponent',
        component: AddSQLSelectComponent,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/caseConfig/dataSource',
        component: CaseConfigDateSource,
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/task/job',
        component: TaskJob,
        meta: {
          keepAlive: true
        }

      },
      {
        path: '/task/report',
        component: TaskReport,
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/utils/first',
        component: UtilsFirst,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/utils/second',
        component: UtilsSecond,
        meta: {
          keepAlive: true
        }
      },

      {
        path: '/config/user',
        component: ConfigUser,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/config/permission',
        component: ConfigPermission,
        meta: {
          keepAlive: true
        }
      },
      { path: '/config/user/userInfo/:uid', component: ConfigUserInfo, props: true }

    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫,to : 将要访问的路径，from：代表从哪个路径的来的 next：表示放行函数
router.beforeEach((to, from, next) => {
  // 登录页不拦截，直接放行
  if (to.path === '/login') return next()
  const token = window.localStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
