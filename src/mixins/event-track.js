import axios from 'axios';
const DATA_API_HOST = process.env.VUE_APP_UPLOAD_DATA_APIPREFIX;

const PAGE_MAP = {
  home: {
    page: 2,
    modular: 1,
  },
  information: {
    page: 31,
    modular: 1,
  },
  contacts: {
    page: 32,
    modular: 1,
  },
  identity: {
    page: 33,
    modular: 1,
  },
  'add-bank': {
    page: 34,
    modular: 1,
  },
  'complete-bank': {
    page: 10,
    modular: 3,
  },
  'loan-success-multi': {
    page: 5,
    modular: 1,
  },
  'loan-confirm': {
    page: 4,
    modular: 1,
  },
  'order-list': {
    page: 6,
    modular: 2,
  },
  repayment: {
    page: 6,
    modular: 2,
  },
  'order-detail': {
    page: 7,
    modular: 2,
  },
  'defer-history': {
    page: 11,
    modular: 2,
  },
  mine: {
    page: 9,
    modular: 3,
  },
  payment: {
    page: 8,
    modular: 2,
  },
};

// 订单状态枚举
const ORDER_STATUS_LIST = {
  20: '1', // 审核中
  21: '1', // 审核中
  30: '2', // 审核通过
  40: '3', // 审核拒绝
  70: '4', // 等待放款
  80: '5', // 在途
  90: '6', // 逾期
  100: '7', // 结清
  101: '8', // 结清-有逾期
  110: '9', // 废弃订单
};

export default {
  data() {
    return {
      ORDER_STATUS_LIST,
      pageStartTime: 0,
      touchMoved: false,
      dataSended: false,
      actionCnt: 0,
      leaveBy: 2,
      productId: null,
      status: null,
    };
  },
  methods: {
    updateTrackerData({ key, value }) {
      this[key] = value;
    },
    sendEventTrackData({ leaveBy, page }) {
      // 页面类型
      let pageModule = '';
      if (typeof page != 'undefined') {
        pageModule = PAGE_MAP[page];
      } else {
        pageModule = PAGE_MAP[this.$route.name];
        if (!pageModule) {
          console.error('page not found!!!');
        }
      }

      const pageEndTime = new Date().getTime();

      // 调用app方法
      let sendData = {
        userId: this.appGlobal.userId,
        phone: this.appGlobal.mobile,
        appName: this.appGlobal.appName,
        appVersion: this.appGlobal.appVersion + '',
        modular: pageModule?.modular,
        page: pageModule?.page,
        startTime: this.eventTrackStartTime,
        endTime: pageEndTime,
        duration: parseInt(pageEndTime - this.eventTrackStartTime),
        packageId: this.appGlobal.packageId,
        leaveBy: this.leaveBy,
        actionCnt: this.eventTrackerActionCnt,
      };
      // 1：申请/完成认证/确认借款/点击进入/还款/新增绑卡 2：退出
      if (typeof leaveBy != 'undefined') {
        sendData.leaveBy = leaveBy;
      }
      // 产品ID
      if (this.productId) {
        sendData.productId = this.productId;
      }
      // 订单详情页 订单状态
      if (this.status) {
        sendData.status = this.status;
      }

      if (typeof page != 'undefined' && page === 'payment') {
        delete sendData.endTime;
        delete sendData.duration;
        delete sendData.actionCnt;
      }
      try {
        console.log('send data:', sendData);
        axios.post(`https://hse.dmrrevg.fun/operate/risk`, sendData);
        // axios.post(`${DATA_API_HOST}/operate/risk`, sendData);
        this.setEventTrackerActionCnt(0);
      } catch (error) {
        console.error('event data send error!', error);
      }
    },
    touchend() {
      this.setEventTrackerActionCnt();
    },
  },
};
