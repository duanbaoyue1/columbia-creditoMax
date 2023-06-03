import Vue from 'vue';
import VueRouter from 'vue-router';
import layout from '../views/layout.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: layout,
    redirect: { path: '/home' },
    meta: {
      title: '',
      showTab: true, // 显示底部tabbar
    },
    children: [
      {
        path: 'permissions',
        name: 'Permissions',
        component: () => import(/* webpackChunkName: "permissions" */ '../views/permissions.vue'),
        meta: {
          title: 'Permissions',
        },
      },
      {
        path: 'information',
        name: 'information',
        component: () => import(/* webpackChunkName: "information" */ '../views/information.vue'),
        meta: {
          title: 'Información básica',
        },
      },
      {
        path: 'contacts',
        name: 'contacts',
        component: () => import(/* webpackChunkName: "contacts" */ '../views/contacts.vue'),
        meta: {
          title: 'Complete information',
        },
      },
      {
        path: 'complete-bank',
        name: 'complete-bank',
        component: () => import(/* webpackChunkName: "complete-bank" */ '../views/complete-bank.vue'),
        meta: {
          title: 'Complete information',
        },
      },
      {
        path: 'add-bank',
        name: 'add-bank',
        component: () => import(/* webpackChunkName: "add-bank" */ '../views/add-bank.vue'),
        meta: {
          title: 'Select Bank Account',
        },
      },
      {
        path: 'loan-success-multi',
        name: 'loan-success-multi',
        component: () => import(/* webpackChunkName: "loan-success-multi" */ '../views/loan-success-multi.vue'),
        meta: {
          title: 'Loan Application',
          backgroundFFF: true, // 页面白色
        },
      },
      {
        path: 'loan-fail',
        name: 'loan-fail',
        component: () => import(/* webpackChunkName: "loan-fail" */ '../views/loan-fail.vue'),
        meta: {
          title: 'Loan Application',
          backgroundFFF: true, // 页面白色
        },
      },
      {
        path: 'payment-fail',
        name: 'payment-fail',
        component: () => import(/* webpackChunkName: "loan-fail" */ '../views/payment-fail.vue'),
        meta: {
          title: 'Solicitud de préstam',
          backgroundFFF: true, // 页面白色
        },
      },
      {
        path: 'loan-confirm',
        name: 'loan-confirm',
        component: () => import(/* webpackChunkName: "loan-confirm" */ '../views/loan-confirm.vue'),
        meta: {
          title: 'Loan Application',
        },
      },
      {
        path: 'utr-help',
        name: 'utr-help',
        component: () => import(/* webpackChunkName: "utr-help" */ '../views/utr-help.vue'),
        meta: {
          title: 'Help',
        },
      },
      {
        path: 'about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/about.vue'),
        meta: {
          title: 'About us',
        },
      },
      {
        path: 'help-center',
        name: 'help-center',
        component: () => import(/* webpackChunkName: "help-center" */ '../views/help-center.vue'),
        meta: {
          title: 'Help Center',
        },
      },
      {
        path: 'order-detail',
        name: 'order-detail',
        component: () => import(/* webpackChunkName: "order-detail" */ '../views/order-detail.vue'),
        meta: {
          title: 'Order Detail',
        },
      },
      {
        path: 'defer-detail',
        name: 'defer-detail',
        component: () => import(/* webpackChunkName: "defer-detail" */ '../views/defer-detail.vue'),
        meta: {
          title: 'Deferment',
        },
      },
      {
        path: 'utr',
        name: 'utr',
        component: () => import(/* webpackChunkName: "utr" */ '../views/utr.vue'),
        meta: {
          title: 'UTR',
        },
      },
      {
        path: 'defer-history',
        name: 'defer-history',
        component: () => import(/* webpackChunkName: "defer-history" */ '../views/defer-history.vue'),
        meta: {
          title: 'Deferment',
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/settings.vue'),
        meta: {
          title: 'Set up',
        },
      },
      {
        path: 'create-password',
        name: 'create-password',
        component: () => import(/* webpackChunkName: "create-password" */ '../views/create-password.vue'),
        meta: {
          title: 'Create Password',
        },
      },
      {
        path: 'retrieve-password',
        name: 'retrieve-password',
        component: () => import(/* webpackChunkName: "retrieve-password" */ '../views/retrieve-password.vue'),
        meta: {
          title: 'Retrieve Password',
        },
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: () => import(/* webpackChunkName: "privacy" */ '../views/privacy.vue'),
        meta: {
          title: 'Privacy Policy',
        },
      },
      {
        path: 'terms',
        name: 'terms',
        component: () => import(/* webpackChunkName: "terms" */ '../views/terms.vue'),
        meta: {
          title: 'Terms of Services',
        },
      },
      {
        path: 'identity',
        name: 'identity',
        component: () => import(/* webpackChunkName: "identity" */ '../views/identity.vue'),
        meta: {
          title: 'Complete information',
        },
      },
      {
        path: 'complain-home',
        name: 'complain-home',
        component: () => import(/* webpackChunkName: "complain-home" */ '../views/complain-home.vue'),
        meta: {
          title: 'Complaints',
        },
      },
      {
        path: 'complain-list',
        name: 'complain-list',
        component: () => import(/* webpackChunkName: "complain-list" */ '../views/complain-list.vue'),
        meta: {
          title: 'Complaint record',
        },
      },
      {
        path: 'complain-edit',
        name: 'complain-edit',
        component: () => import(/* webpackChunkName: "complain-edit" */ '../views/complain-edit.vue'),
        meta: {
          title: 'Complaints',
        },
      },
      {
        path: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '../views/home/home.vue'),
        meta: {
          title: '',
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: 'repayment',
        name: 'repayment',
        component: () => import(/* webpackChunkName: "repayment" */ '../views/home/repayment.vue'),
        meta: {
          title: '',
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: 'mine',
        name: 'mine',
        component: () => import(/* webpackChunkName: "mine" */ '../views/home/mine.vue'),
        meta: {
          title: '',
          keepAlive: true,
          showTab: true, // 显示底部tabbar
        },
      },
      {
        path: 'order-list',
        name: 'order-list',
        component: () => import(/* webpackChunkName: "order-list" */ '../views/order-list.vue'),
        meta: {
          title: 'All orders',
        },
      },
      {
        path: 'testa',
        name: 'testa',
        component: () => import(/* webpackChunkName: "testa" */ '../views/testa.vue'),
        meta: {
          title: 'testa',
        },
      },
      {
        path: 'testb',
        name: 'testb',
        component: () => import(/* webpackChunkName: "testb" */ '../views/testb.vue'),
        meta: {
          title: 'testb',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/notFound.vue'),
  },
  {
    path: '*', // 此处需特别注意至于最底部
    redirect: '/404',
  },
];

const router = new VueRouter({
  mode: process.env.NODE_ENV != 'production' ? 'hash' : 'hash',
  base: process.env.NODE_ENV != 'production' ? '/' : '/', // 这个配置也很重要，否则会出现页面空白情况
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
});

export default router;
