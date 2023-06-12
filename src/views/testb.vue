<template>
  <div class="home_index content-area">
    <!-- <div class="home">
      <input ref="photoRef" type="file" accept="image/*" @change="photograph()" capture="camera" />
      <p>{{ fileName }}</p>
    </div> -->
    <button @click="getCommonParametersKey">获取APP原生公共参数</button>
    <button @click="openNewPage">打开一个新页面</button>
    <button @click="openNewPageFinishOld">开启新页面 销毁上一个</button>
    <button @click="logout">退出</button>

    <button @click="getCapture(3)">上传身份证+活体</button>
    <button @click="getCapture(4)">活体识别</button>
    <button @click="getCapture(5)">上传本地图片</button>
    <button @click="tracker">打点</button>
    <button @click="crawlData">开始抓取数据</button>
    <button @click="toLoginPage">到登陆页</button>
    <button @click="testWebViewMethod">测试Webview打开页面</button>
    <button @click="goGoogleStore">跳转google store</button>

    <button>
      <input ref="photoRef" type="file" accept="image/*" @change="photograph()" capture="camera" />
    </button>

    <p>上传结果图片：</p>
    <div class="preview">
      <img :src="base64ImgData" alt="" />
    </div>
    <p>上传结果base64：</p>
    <div>
      {{ base64 }}
    </div>

    <input placeholder="测试输入框软键盘" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'home',
  created() {
    window.btnCallBack = () => {
      this.showMessageBox({
        content: 'Receive the money immediately after submitting the information. Do you really want to quit?',
        confirmBtnText: 'No',
        cancelBtnText: 'Leave',
        confirmCallback: () => {
          this.hideMessageBox();
        },
        cancelCallback: () => {
          this.hideMessageBox();
          this.goAppBack();
        },
        iconPath: 'creditomax/个人中心推出弹窗',
      });
    };

    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Test',
      backCallback: window.btnCallBack,
    });
  },
  data() {
    window.onPhotoSelectCallback_3 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.pic}`;
        this.toAppMethod('getCapture', { type: 4, callbackMethodName: `onPhotoSelectCallback_4` });
      }
    };

    window.onPhotoSelectCallback_4 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.pic}`;
      }
    };

    window.onPhotoSelectCallback_5 = data => {
      console.log(data);
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.base64 = data.pic;
        this.base64ImgData = `data:image/png;base64,${data.pic}`;
      }
    };
    return {
      fileName: '点击Vue拍照',
      base64: '',
      base64ImgData: null,
    };
  },
  mounted() {
    this.toAppMethod('isInterceptionReturn', { isInterception: true, fuName: 'btnCallBack' });
  },

  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),
    testWebViewMethod() {
      this.openWebview('https://www.baidu.com');
    },
    toLoginPage() {
      this.toAppMethod('toLoginPage');
    },
    openNewPage() {
      let routeInfo = this.$router.resolve({ name: 'help-center', query: { type: 3 } });
      console.log(`${location.origin}${location.pathname}${routeInfo.href}`);
      this.toAppMethod('openNewPageFinishOld', { isShowLoading: true, pathUrl: `${location.origin}${location.pathname}${routeInfo.href}` });
    },
    async crawlData() {
      this.showLoading();
      try {
        await this.startSyncData();
        this.$toast('sync success');
      } catch (error) {
        this.$toast('sync error');
      } finally {
        this.hideLoading();
      }
    },
    goGoogleStore() {
      this.toAppMethod('goGoogleStore');
    },
    openNewPageFinishOld() {
      let routeInfo = this.$router.resolve({ name: 'help-center', query: { type: 3 } });
      this.toAppMethod('openNewPageFinishOld', { isShowLoading: true, pathUrl: `${location.origin}${location.pathname}${routeInfo.href}` });
    },
    getCommonParametersKey() {
      window.getCommonParametersKeyCallback = data => {
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        delete api.apiHost;
        data.appVersion = data.appVersionCode;
        data.appVersionV = data.appVersionName;
        this.setAppGlobal(data);
        alert('更新App信息:');
        alert(JSON.stringify(this.appGlobal));
      };
      this.toAppMethod('getCommonParameters', { fuName: 'getCommonParametersKeyCallback' });
    },

    tracker() {
      this.eventTracker('init');
    },

    getCapture(type) {
      this.toAppMethod('getCapture', { type: type, callbackMethodName: `onPhotoSelectCallback_${type}` });
    },
    /**
     * 获取用户拍照的图片信息
     */
    async photograph() {
      // 获取用户拍照的图片名字，显示到页面上
      this.fileName = this.$refs.photoRef.files[0].name;
      // 获取图片base64 代码，并存放到 base64ImgData 中
      this.base64ImgData = await this.FileReader(this.$refs.photoRef.files[0]);
      console.log(this.base64ImgData);

      this.showLoading();
      try {
        // const file = this.base64ToFile(this.base64ImgData, new Date().getTime());
        let formData = new FormData();
        // formData.append('channel', 'AccV2');
        formData.append('cardFrontBase64Src', this.base64ImgData);
        formData.append('mark', 1);

        let res = await this.$http.post(`/api/ocr/saveResult`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(res);
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },

    /**
     * 返回用户拍照图片的base64
     */
    FileReader(FileInfo) {
      // FileReader 方法参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
      let reader = new FileReader();
      // readAsDataURL 方法参考地址：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
      reader.readAsDataURL(FileInfo);
      // 监听读取操作结束
      /* eslint-disable */
      return new Promise(resolve => (reader.onloadend = () => resolve(reader.result)));
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.home {
  width: 200px;
  margin: 0 auto;
  position: relative;
}
.home input[type='file'] {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 200px;
  z-index: 9;
  opacity: 0;
}
.home p {
  font-size: 13px;
  color: #8d8d8d;
}
.preview img {
  width: 100%;
  transform: rotate(0deg);
  transform-origin: center center;
}
button {
  display: block;
  margin: 10px;
  height: 40px;
  padding: 0 20px;
  background: linear-gradient(180deg, #696FFB 0%, #434AF9 100%);;
  box-shadow: 0px 4px 10px 0px rgba(67,74,249,0.4), inset 0px 1px 4px 0px #434AF9;;
  border-radius: 20px;
  font-size: 16px;
  font-family: Roboto-Bold, Roboto;
  font-weight: bold;
  color: #ffffff;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: none;
  margin-top: 30px;
}
input {
  margin: 20px auto;
  display: block;
}
</style>
