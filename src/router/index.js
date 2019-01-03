import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard'),
        name: 'Dashboard',
        meta: { title: '', icon: 'home', noCache: true, noTag: true }
      }
    ]
  },
  { path: '/403', component: () => import('@/views/403'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/500', component: () => import('@/views/500'), hidden: true }
]

export const asyncRouterMap = [
  {
    path: '/mybudget',
    component: Layout,
    redirect: '/mybudget/list',
    meta: { title: '我的预算', icon: 'mybudget', id: 1 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/myBudget/index'),
        name: 'MyBudget',
        meta: {
          title: '我的预算',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/myBudget/create'),
        name: 'MyBudgetCreate',
        meta: {
          title: '新增预算',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/myBudget/detail'),
        name: 'MyBudgetDetail',
        meta: { title: '查看预算', icon: 'none', noCache: true },
        hidden: true
      },
      {
        path: 'budgetoutcreate',
        component: () => import('@/views/myBudget/budgetout/create'),
        name: 'BudgetOutCreate',
        meta: {
          title: '预算外新增',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      },
      {
        path: 'budgetoutdetail/:id',
        component: () => import('@/views/myBudget/budgetout/detail'),
        name: 'BudgetOutDetail',
        meta: {
          title: '预算外详情',
          icon: 'none',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'budgetoutedit',
        component: () => import('@/views/myBudget/Budgetout/edit'),
        name: 'BudgetOutEdit',
        meta: {
          title: '预算外编辑',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      },
      {
        path: 'edit',
        component: () => import('@/views/myBudget/edit'),
        name: 'MyBudgetEdit',
        meta: {
          title: '编辑预算',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/budgetapproval',
    component: Layout,
    redirect: '/budgetapproval/list',
    meta: { title: '预算审批', icon: 'budgetapproval', id: 4 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/budgetApproval/index'),
        name: 'BudgetApproval',
        meta: {
          title: '预算审批',
          multistage: true,
          noCache: true
        }
      },
      {
        path: 'audit',
        component: () => import('@/views/budgetApproval/audit'),
        name: 'MybudgetAudit',
        meta: { title: '审批', icon: 'none', noCache: true, noTag: true },
        hidden: true
      },
      {
        path: 'logisticsaudit',
        component: () => import('@/views/budgetApproval/logisticsAudit'),
        name: 'LogisticsAudit',
        meta: {
          title: '后勤审批',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      },
      {
        path: 'externaviewaudit',
        component: () => import('@/views/budgetApproval/externaViewAudit'),
        name: 'ExternaViewAudit',
        meta: {
          title: '预算外审批',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      },
      {
        path: 'headmasteraudit',
        component: () => import('@/views/budgetApproval/headmasterAudit'),
        name: 'HeadmasterAudit',
        meta: {
          title: '校长审批',
          icon: 'none',
          noCache: true,
          noTag: true
        },
        hidden: true
      },
      {
        path: 'budgetsummarymerge',
        component: () => import('@/views/budgetApproval/budgetSummaryMerge'),
        name: 'BudgetSummaryMerge',
        meta: {
          title: '生成汇总预算',
          icon: '',
          noCache: true,
          noTag: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/budgetanalysis',
    component: Layout,
    redirect: '/budgetanalysis/list',
    meta: { id: 15 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/budgetAnalysis/index'),
        name: 'BudgetAnalysis',
        meta: { title: '预算分析', icon: 'budgetanalysis', noCache: true }
      }
    ]
  },
  {
    path: '/executiveeditor',
    component: Layout,
    redirect: '/executiveeditor/list',
    meta: {
      title: '执行编辑',
      icon: 'executiveeditor',
      id: 16
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/executiveEditor/index'),
        name: 'ExecutiveEditor',
        meta: {
          title: '执行编辑',
          icon: '',
          multistage: true,
          noCache: true
        }
      },
      {
        path: 'detail',
        component: () => import('@/views/executiveEditor/detail'),
        name: 'ExecutiveEditorDetail',
        meta: {
          title: '执行编辑详情',
          icon: '',
          noCache: true,
          noTag: true
        },
        hidden: true
      }
    ]
  },
  {
    path: '/executiveanalysis',
    component: Layout,
    redirect: '/executiveanalysis/list',
    meta: { id: 17 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/executiveAnalysis/index'),
        name: 'ExecutiveAnalysis',
        meta: { title: '执行分析', icon: 'executiveanalysis', noCache: true }
      }
    ]
  },
  {
    path: '/procurementofficeanalysis',
    component: Layout,
    redirect: '/procurementofficeanalysis/list',
    meta: { id: 18 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/procurementOfficeAnalysis/index'),
        name: 'ProcurementOfficeAnalysis',
        meta: {
          title: '采购及办公分析',
          icon: 'procurementofficeanalysis',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/paymentmanagement',
    component: Layout,
    redirect: '/paymentmanagement/list',
    meta: { id: 104 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/paymentManagement/index'),
        name: 'PaymentManagement',
        meta: {
          title: '付款管理',
          icon: 'paymentmanagement',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/paymentManagement/create'),
        name: 'PaymentManagementCreate',
        hidden: true,
        meta: {
          title: '付款管理-新增',
          noCache: true
        }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/paymentManagement/detail'),
        name: 'PaymentManagementDetail',
        hidden: true,
        meta: {
          title: '付款管理-详情',
          noCache: true
        }
      },
      {
        path: 'audit',
        component: () => import('@/views/paymentManagement/audit'),
        name: 'PaymentManagementAudit',
        hidden: true,
        meta: {
          title: '付款管理-打款',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/approvalsettings',
    component: Layout,
    redirect: '/approvalSettings/list',
    meta: { id: 19 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/approvalSettings/index'),
        name: 'ApprovalSettings',
        meta: { title: '审批设置', icon: 'approvalsettings', noCache: true }
      }
    ]
  },
  {
    path: '/departmentManagement',
    component: Layout,
    redirect: '/departmentManagement/list',
    meta: { id: 20 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/departmentManagement/index'),
        name: 'DepartmentManagement',
        meta: { title: '部门管理', icon: 'departmentManagement', noCache: true }
      }
    ]
  },
  {
    path: '/usermanagement',
    component: Layout,
    redirect: '/userManagement/list',
    meta: { id: 21 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/userManagement/index'),
        name: 'UserManagement',
        meta: { title: '用户管理', icon: 'usermanagement', noCache: true }
      }
    ]
  },
  {
    path: '/usergroupmanagement',
    component: Layout,
    redirect: '/userGroupManagement/list',
    meta: { id: 22 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/userGroupManagement/index'),
        name: 'UserGroupManagement',
        meta: {
          title: '用户组管理',
          icon: 'usergroupmanagement',
          noCache: true
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
