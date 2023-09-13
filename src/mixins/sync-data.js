import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import { dateFormat } from '@/utils/mUtils';
window.isInitSyncData = false;
window.syncDataResolve = null;
window.syncDataReject = null;
const SYNC_LOCAL_KEY = 'sync-app-data-status';
const DATA_API_HOST = process.env.VUE_APP_UPLOAD_DATA_APIPREFIX;
const NEED_SYNC_TYPE = ['appListFunName', 'msgListFunName', 'devFunName', 'devBaseFunName', 'callLogListFunName', 'calendarFunName'];

export default {
  data() {
    if (!window.isInitSyncData) {
      window.onappListFunName = async data => {
        console.log('收到onappListFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, {
            mobile: this.userInfo.mobile,
            app: data,
          });
          this.updateLocalSyncStatus('appListFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('appListFunName', false);
        }
      };
      window.onmsgListFunName = async data => {
        console.log('收到onmsgListFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, {
            mobile: this.userInfo.mobile,
            msg: data,
          });
        } catch (error) {}
      };
      window.ondevFunName = async data => {
        console.log('收到ondevFunName data:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, {
            mobile: this.userInfo.mobile,
            device: data,
          });
          this.updateLocalSyncStatus('devFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('devFunName', false);
        }
      };
      window.ondevBaseFunName = async data => {
        console.log('收到ondevBaseFunName:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, {
            mobile: this.userInfo.mobile,
            deviceBase: data,
          });
          this.updateLocalSyncStatus('devBaseFunName', true);
        } catch (error) {
          this.updateLocalSyncStatus('devBaseFunName', false);
        }
      };
      window.oncallLogListFunName = async data => {
        console.log('收到oncallLogListFunName:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, {
            mobile: this.userInfo.mobile,
            call: data,
          });
        } catch (error) {}
      };

      window.oncalendarFunName = async data => {
        console.log('收到oncalendarFunName:' + JSON.stringify(data));
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        try {
          await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, {
            mobile: this.userInfo.mobile,
            calendar: data,
          });
        } catch (error) {}
      };
      window.isInitSyncData = true;
    }

    return {};
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
        try {
          await this.getUserInfo();
          // 第一步判断是否需要
          let res = await axios.post(`${DATA_API_HOST}/original/colombiaIsUpload`, {
            mobile: this.userInfo.mobile,
          });
          if (res.data && res.data.data.isUpload == 1) {
            // 已经上传
            resolve({ success: true });
          } else {
            // 如果没有上传，则发通知给app抓取，10s以后再试一下
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
            setTimeout(async res => {
              window.syncDataResolve = null;
              window.syncDataReject = null;
              res = await axios.post(`${DATA_API_HOST}/original/colombiaIsUpload`, {
                mobile: this.userInfo.mobile,
              });
              if (res.data && res.data.data.isUpload == 1) {
                resolve({ success: true });
              } else {
                reject({ success: false });
              }
            }, 10000);
          }
        } catch (error) {
          reject({ success: false });
        }
      });
    },
  },
};
