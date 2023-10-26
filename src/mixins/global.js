import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { dateFormat } from '@/utils/mUtils';
import { ImagePreview } from 'vant';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapState(['appGlobal', 'userInfo', 'tabBar', 'appMode']),
  },

  filters: {
    nullFilter(item) {
      return item || '';
    },

    phoneHideFilter(item) {
      if (!item) return '';
      return `${item.slice(0, 3)}****${item.slice(-3)}`;
    },

    dateFormate(date, format = 'yyyy/MM/dd') {
      return dateFormat(date, format);
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

    getAnyTimeString(date, timeZone) {
      let sameTimelocalTimeStamp = date - 0 + new Date(date).getTimezoneOffset() * 60 * 1000 + this.getOffsetMinute(timeZone) * 60 * 1000;
      let targetTime = new Date(sameTimelocalTimeStamp);
      let targetTimeString = String(targetTime.getFullYear()) + '-' + String(targetTime.getMonth() + 1).replace(/^(\d)$/, '0$1') + '-' + String(targetTime.getDate()).replace(/^(\d)$/, '0$1') + ' ' + String(targetTime.getHours()).replace(/^(\d)$/, '0$1') + ':' + String(targetTime.getMinutes()).replace(/^(\d)$/, '0$1') + ':' + String(targetTime.getSeconds()).replace(/^(\d)$/, '0$1');
      return targetTimeString;
    },
    
    // 计算以分钟为单位的时区gap，例如 '+04:00'被转换为240
    getOffsetMinute(timeZone) {
      if (!/^[+-][0-9]{2}:((0[0-9])|([1-5][0-9]))$/.test(timeZone)) {
        // 与产品沟通，暂时使用较为严格的格式验证限制，缺少首位0和正负号视为非法格式
        return 0;
      }
      let time = timeZone.split(':');

      if (timeZone[0] === '-') {
        return parseInt(time[0]) * 60 - parseInt(time[1].slice(0, 2)); //time[0]本身带正负号不需要加，time[1]不带需要加。
      } else {
        return parseInt(time[0]) * 60 + parseInt(time[1].slice(0, 2));
      }
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

    validateEmail(email) {
      // 邮箱验证正则
      var reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      return reg.test(email);
    },

    logout() {
      this.toAppMethod('outLogin');
    },

    mergeTwoArray(arr1, arr2) {
      let arr = [];
      arr1.forEach((item, index) => {
        arr.push({ ...item, ...arr2[index] });
      });
      return arr;
    },

    // 解压
    unzip(b64Data) {
      // const strData = atob(b64Data);
      const charData = b64Data.split('').map(function (x) {
        return x.charCodeAt(0);
      });
      const binData = new Uint8Array(charData);
      const data = pako.inflate(binData);
      const array = new Uint16Array(data);
      // 防止一次解压造成内存溢出，这里进行分段解压
      let result = '';
      let i = 0;
      const maxRange = 8 * 1024;
      for (i = 0; i < array.length / maxRange; i++) {
        result += String.fromCharCode.apply(null, array.slice(i * maxRange, (i + 1) * maxRange));
      }
      result += String.fromCharCode.apply(null, array.slice(i * maxRange));
      return decodeURIComponent(result);
    },

    // 压缩
    zip(str) {
      return pako.gzip(str, { to: 'string' });
    },

    // base64图片转file的方法（base64图片, 设置生成file的文件名）
    base64ToFile(base64, fileName) {
      // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
      let data = base64.split(',');
      // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
      let type = data[0].match(/:(.*?);/)[1];
      // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
      let suffix = type.split('/')[1];
      // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
      const bstr = window.atob(data[1]);
      // 获取解码结果字符串的长度
      let n = bstr.length;
      // 根据解码结果字符串的长度创建一个等长的整形数字数组
      // 但在创建时 所有元素初始值都为 0
      const u8arr = new Uint8Array(n);
      // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
      while (n--) {
        // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 利用构造函数创建File文件对象
      // new File(bits, name, options)
      const file = new File([u8arr], `${fileName}.${suffix}`, {
        type: type,
      });
      // 将File文件对象返回给方法的调用者
      return file;
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

    bindAppCallbackMethod(name, callback) {
      try {
        window[`${name}_${this.appGlobal.appName}`] = function (recieveData) {
          recieveData = recieveData || '';
          console.log('receive app method', name);
          console.log(recieveData);
          callback && callback.apply(this, [JSON.parse(recieveData)]);
        };
      } catch (error) {
        console.log('no such callback method', `${name}_${this.appGlobal.appName}`);
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
    todayHour() {
      var d = new Date();
      var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
      var hourTime = hour + ':' + minute + ':' + second;
      return hourTime;
    },
    getCookie(name) {
      var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      arr = document.cookie.match(reg);
      if (arr != null) return unescape(arr[2]);
      else return null;
    },
    delCookie(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    },
    // 获取两个两个日期转换成天
    daysDistance(date1, date2) {
      //parse() 是 Date 的一个静态方法 , 所以应该使用 Date.parse() 来调用，而不是作为 Date 的实例方法。返回该日期距离 1970/1/1 午夜时间的毫秒数
      date1 = Date.parse(date1);
      date2 = Date.parse(date2);
      //计算两个日期之间相差的毫秒数的绝对值
      var ms = Math.abs(date2 - date1);
      //毫秒数除以一天的毫秒数,就得到了天数
      var days = Math.floor(ms / (24 * 3600 * 1000));
      return days;
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
    parseQuery(query) {
      const arr1 = query.split('&');
      const arr = arr1.filter(item => {
        return item.indexOf('=') > -1;
      });
      const allOptions = {};
      for (const i in arr) {
        const val = arr[i];
        const arr2 = val.split('=');
        allOptions[arr2[0]] = arr2[1];
      }
      return allOptions;
    },

    // 版本号比较
    versionCompare(x1, x2) {
      if (!x1 || !x2) return 0;
      const x1Arr = x1.split('.');
      const x2Arr = x2.split('.');
      let re = 0;
      for (const i in x1Arr) {
        const intX1 = parseInt(x1Arr[i]);
        const intX2 = parseInt(x2Arr[i]);

        if (intX1 > intX2) {
          re = 1;
          break;
        } else if (intX1 === intX2) {
          re = 0;
        } else if (intX1 < intX2) {
          re = -1;
          break;
        }
      }
      if (re === 0 && x2Arr.length > x1Arr.length) {
        return -1;
      }
      return re;
    },
  },
};
