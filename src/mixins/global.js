import { mapState, mapActions } from 'vuex';
import { ImagePreview } from 'vant';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState(['appGlobal', 'userInfo', 'tabBar', 'appMode']),
  },

  filters: {
    phoneHideFilter(item) {
      if (!item) return '';
      return `${item.slice(0, 3)}****${item.slice(-3)}`;
    },

    formatMonex(num) {
      var result = [],
        counter = 0;
      num = (num || 0).toString().split('');
      for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) {
          result.unshift(',');
        }
      }
      return result.join('');
    },
  },

  beforeRouteLeave(to, from, next) {
    this.hideLoading();
    this.toAppMethod('isInterceptionReturn', { isInterception: false });
    next();
  },

  methods: {
    ...mapActions(['showMessageBox', 'hideMessageBox', 'setTabBar', 'setAppMode', 'setRepaymentNum', 'updateToken']),
    async getUserInfo() {
      let data = await this.$http.post(`/api/user/info`);
      let userInfo = data.data;
      console.log('set user info', userInfo);
      this.$store.commit('setUserInfo', userInfo);
      return userInfo;
    },

    checkInApp() {
      return typeof wjs != 'undefined';
    },

    getLocalSystemTimeStamp() {
      return new Date().getTime();
    },

    initInfoBackControl() {
      window.infoBtnCallBack = () => {
        this.showMessageBox({
          content: '¡Espere, todavía queda un paso para obtener el dinero!',
          confirmBtnText: 'OK',
          cancelBtnText: 'Renunciar',
          class: 'back-control',
          confirmCallback: () => {
            this.hideMessageBox();
          },
          cancelCallback: () => {
            this.hideMessageBox();
            this.goAppBack();
          },
        });
      };
      this.setTabBar({
        backCallback: window.infoBtnCallBack,
      });
      this.toAppMethod('isInterceptionReturn', { isInterception: true, fuName: 'infoBtnCallBack' });
    },

    previewImg(imgs, startIndex) {
      if (!imgs || !imgs.length || startIndex < 0) return;
      ImagePreview({
        images: imgs,
        startPosition: startIndex,
      });
    },

    logout() {
      this.toAppMethod('outLogin');
    },

    /**
     *
     * @param {*} path
     * @param {*} query
     * @param {*} replace 是否替换当前路由
     */
    innerJump(path, query, replace = false) {
      query = query || {};
      query.appChecked = true;
      if (replace) {
        this.$router.replace({ name: path, query: query });
      } else {
        this.$router.push({ name: path, query: query });
      }
    },

    async getAppMode() {
      try {
        let data = await this.$http.post(`/api/product/appMaskModel`);
        let appMode = data.data;
        this.setAppMode(appMode);
        return appMode;
      } catch (error) {
        return {};
      }
    },

    openWebview(url, type = 0) {
      this.toAppMethod('openWebView', { path: url, type: type, title: ' ' });
    },

    async getOrderRelateUrl(orderId) {
      try {
        let data = await this.$http.post(`/api/order/getRepaymentUrl`, { orderId: orderId });
        return data.data;
      } catch (error) {
        console.error(error);
        return {};
      }
    },

    toAppMethod(name, params) {
      params = params || {};
      if (!this.checkInApp()) return;
      try {
        console.log('start method:', `${name}_${this.appGlobal.appName}`);
        console.log('params:', JSON.stringify(params));
        wjs[`${name}_${this.appGlobal.appName}`](JSON.stringify(params));
        return true;
      } catch (error) {
        console.log('no such method:', `${name}_${this.appGlobal.appName}`);
        return false;
      }
    },

    goPrivacy() {
      this.innerJump('privacy');
    },
    goTerms() {
      this.innerJump('terms');
    },
    goHelpCenter() {
      this.innerJump('help-center');
    },
    // app埋点
    eventTracker(key) {
      this.toAppMethod('afLogEvent', { key: key });
    },
    sumArr(arr) {
      return arr.reduce(function (prev, cur) {
        return parseInt(prev) + parseInt(cur);
      }, 0);
    },
    goHome() {
      this.innerJump('home', {}, true);
    },
    goAppBack() {
      let prevPage = window.location.href;
      window.history.go(-1);
      // 如果500ms没有跳转成功则去首页
      setTimeout(function () {
        if (window.location.href == prevPage) {
          console.log('on goAppBack not go prev');
          this.goHome();
        }
      }, 500);
    },
  },
};
