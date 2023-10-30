<template>
  <div id="app" @touchend="touchend">
    <div v-if="!isAppChecked" class="app-error">error!</div>
    <div v-else-if="showRedirect"></div>
    <div v-else class="app-inner" :class="{ 'has-tab': $route.meta.showTab, 'has-nav': tabBar.show, 'background-fff': $route.meta.backgroundFFF }">
      <nav-bar v-show="mounted && tabBar.show" />
      <transition name="fade">
        <keep-alive v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
          <router-view />
        </keep-alive>
        <!-- 这里是不被缓存的视图组件 -->
        <router-view v-else />
      </transition>

      <van-tabbar route name="fade" v-if="$route.meta.showTab">
        <van-tabbar-item replace to="/home">
          <span>Préstamos</span>
          <template #icon="props">
            <m-icon :type="props.active ? 'creditomax/Prstamos' : 'creditomax/no_order1'" class="nav-icon" :width="24" :height="24" />
          </template>
        </van-tabbar-item>

        <van-tabbar-item replace to="/repayment" :badge="repaymentNum > 0 ? repaymentNum : ''" v-if="showRepayment">
          <span>Reembolsando</span>
          <template #icon="props">
            <m-icon :type="props.active ? 'creditomax/Reembolsando选中' : 'creditomax/Reembolsando未点击'" class="nav-icon" :width="22" :height="24" />
          </template>
        </van-tabbar-item>

        <van-tabbar-item replace to="/mine">
          <span>Mi</span>
          <template #icon="props">
            <m-icon :type="props.active ? 'creditomax/Mi点击' : 'creditomax/Mi未点击'" class="nav-icon" :width="24" :height="24" />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
const NeedTabbarsPathNames = ['home', 'repayment', 'mine'];

export default {
  name: 'app',
  computed: {
    ...mapState(['isAppChecked', 'appMode', 'repaymentNum']),
  },
  created() {
    this.setTabBar({
      show: false,
    });
  },
  data() {
    return {
      showRepayment: !!localStorage.getItem('app-is-multi'),
      showRedirect: false,
      mounted: false,
    };
  },
  async mounted() {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
    setTimeout(res => {
      this.mounted = true;
    }, 500);
  },

  watch: {
    'appMode.maskModel': {
      handler(newVal, oldVal) {
        if (this.appMode && typeof this.appMode.maskModel != 'undefined') {
          if (this.appMode.maskModel == 1) {
            this.showRepayment = true;
          } else {
            this.showRepayment = false;
            localStorage.removeItem('app-is-multi');
          }
        }
      },
      deep: true,
      immediate: true,
    },

    $route(to, from) {
      console.log('route change', from, to, this.$route.meta.showTab);
      document.body.style.overflow = '';
      document.title = to.meta.title || '';
      this.toAppMethod('isInterceptionReturn', { isInterception: false });
      try {
        this.hideLoading();
      } catch (error) {
        console.log(error);
      }
      this.checkAndSetAppLocal();
      if (to.query.nextUrl && from && from.name) {
        // 为了解决进到还款页面以后退出到utr页面的问题
        // this.showRedirect = true;
        this.openWebview(to.query.nextUrl);
        // location.href = to.query.nextUrl;
      }
      if (to.query.token) {
        this.updateToken({ token: to.query.token });
      }
      if (to.query.appChecked || sessionStorage.getItem('app-checked')) {
        this.setAppChecked(true);
      }
    },
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    checkAndSetAppLocal() {
      let appLocal = localStorage.getItem('app-local');
      if (appLocal) {
        this.setAppGlobal(JSON.parse(appLocal));
      }
    },
  },
};
</script>

<style lang="scss">
.fade-enter {
  opacity: 0;
}
.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.5s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0s;
}
#app {
  > div {
    height: 100%;
  }
}
.app-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
</style>
