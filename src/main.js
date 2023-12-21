import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from '@/utils/request';
Vue.prototype.$http = request;
import 'amfe-flexible';

import mIcon from '@/components/m-icon.vue';
Vue.component('m-icon', mIcon);

import '@/assets/css/index.scss';
Vue.config.productionTip = false;

import toast from '@/components/toast';
Vue.use(toast);
import loading from '@/components/loading';
Vue.use(loading);

import NavBar from '@/components/nav-bar';
Vue.component('nav-bar', NavBar);

import MessageBox from '@/components/message-box';
Vue.component('message-box', MessageBox);

// 注册全局mixins
import global from '@/mixins/global';
import syncData from '@/mixins/sync-data';
Vue.mixin(global);
Vue.mixin(syncData);

// import Vconsole from 'vconsole';
// if (process.env.NODE_ENV == 'production') {
//   let vConsole = new Vconsole();
//   Vue.use(vConsole);
// }

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
