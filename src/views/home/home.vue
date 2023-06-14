<template>
  <van-pull-refresh class="home" :disabled="disabledPullRefresh" v-model="loading" success-text=" " loading-text=" " loosing-text=" " pulling-text=" " @refresh="onRefresh">
    <div class="home-content">
      <div class="loan-wrapper" :class="'multiple_' + isMultiple">
        <div class="inner">
          <div class="available-text">Préstamo máximo($)</div>
          <div class="number">
            {{ (isMultiple ? multipleCredit.remaining : curAvailableAmount) | formatMonex }}
            <m-icon v-if="multipleCredit.locked || appMode.locked" class="lock" type="creditomax/锁" :width="17" :height="20" />
          </div>
          <div class="total-used">
            <div>
              <div class="label">Crédito total($)</div>
              <div class="number">{{ (isMultiple ? multipleCredit.sumQuota : appMode.totalCredit) | formatMonex }}</div>
            </div>
            <div>
              <div class="label">Crédito usado ($)</div>
              <div class="number">{{ (isMultiple ? multipleCredit.usedQuota : appMode.usedCredit) | formatMonex }}</div>
            </div>
          </div>
          <div class="action-btn" @click="clickApply">
            <div class="status-tips" v-if="btnTips">
              <span v-html="btnTips"></span>
            </div>
            {{ isMultiple ? multipleCredit.button : actionText }}
          </div>
        </div>

        <div class="multi-select" v-if="isMultiple" @click="clickShowRecommend">
          <span>Soluciones personalizadas</span>
          <div>
            <span :class="{ 'has-num': selectItems.length > 0 }">{{ selectItems.length }} productos</span>
            <m-icon type="creditomax/蓝右@2x" :width="12" :height="14" />
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet v-model="showRecommend" :safe-area-inset-bottom="false" close-on-click-action class="home-recommend">
      <div class="pop-content">
        <m-icon class="close" type="creditomax/关闭弹窗" :width="20" :height="20" @click="showRecommend = false" />
        <multi-recommend @update="updateMultiSelect" :list="multiRecommendList"></multi-recommend>
      </div>
    </van-action-sheet>
  </van-pull-refresh>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MultiRecommend from '@/components/multi-recommend.vue';

export default {
  components: {
    MultiRecommend,
  },
  data() {
    window.getHtmlCode = () => {
      this.toAppMethod('getHtmlCodeCallback', {
        src: document.documentElement.outerHTML,
        documentElementWidth: document.documentElement.clientWidth,
        clientWidth: document.body.clientWidth,
        offsetWidth: document.body.offsetWidth,
        scrollWidth: document.body.scrollWidth,
        screenWidth: window.screen.width,
        availWidth: window.screen.availWidth,
        deviceXDPI: window.screen.deviceXDPI,
        devicePixelRatio: window.devicePixelRatio,
      });
    };

    return {
      showLock: false,
      disabledPullRefresh: false,
      created: false,
      query: this.$route.query,
      from: this.$route.query.from,
      loading: false,
      selectItems: [], // 多推选中的产品
      multiRecommendList: [], // 多推的产品
      isMultiple: !!localStorage.getItem('app-is-multi'), // 是否多推首页
      showRecommend: false,
      actionText: 'Apply',
      btnTips: '',
      actionCallback: null, // 按纽回调
      multipleCredit: {},
    };
  },
  computed: {
    curAvailableAmount() {
      if (typeof this.appMode.availableCredit != 'undefined') {
        return this.appMode.availableCredit;
      } else if (typeof this.appMode.amount != 'undefined') {
        return this.appMode.amount;
      } else {
        return 2000000;
      }
    },
  },

  watch: {
    'appMode.maskModel': {
      async handler(newVal, oldVal) {
        if (newVal != oldVal && this.appMode && typeof this.appMode.maskModel != 'undefined') {
          if (this.appMode.maskModel == 1) {
            // 多推
            localStorage.setItem('app-is-multi', true);
            this.isMultiple = true;
            await this.getMultiRecommendItems();
          } else {
            // 现金贷
            this.isMultiple = false;
            localStorage.removeItem('app-is-multi');
          }
          this.updateTextAndAction();
          this.startSyncData();
        }
      },
      deep: true,
      immediate: true,
    },
    showRecommend: {
      async handler(newVal, oldVal) {
        this.disabledPullRefresh = !!this.showRecommend;
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    this.setTabBar({
      show: false,
    });
    if (this.from == 'bridge' && !this.query.reload) {
      location.replace(location.href + '&reload=true');
    }
    this.setGlobalData();
    this.getCommonParametersKey();
  },

  mounted() {
    this.eventTracker('home_access');
    if (!this.checkInApp()) {
      window.getCommonParametersCallback();
    }
    console.log(this.getLocalSystemTimeStamp());
  },
  activated() {
    if (this.checkInApp() && !this.created) {
      return;
    }
    console.log('home activated and refresh data!');
    this.updateData();
  },
  methods: {
    ...mapActions(['setAppGlobal', 'setAppChecked', 'updateToken']),

    // 调用app方法获取所有参数
    getCommonParametersKey() {
      window.getCommonParametersCallback = async data => {
        console.log('app 回调 getCommonParametersKeyCallback', data);
        if (typeof data == 'string') {
          data = JSON.parse(data);
        }
        data = data || {};
        delete data.apiHost;
        if (data.appVersionCode) {
          data.appVersion = data.appVersionCode;
        }
        if (data.appVersionName) {
          data.appVersionV = data.appVersionName;
        }
        this.setAppGlobal(data);
        this.updateData();
        this.created = true;
      };
      this.toAppMethod('getCommonParameters', { fuName: 'getCommonParametersCallback' });
    },

    clickShowRecommend() {
      if (!this.selectItems || this.selectItems.length == 0) {
        return;
      }
      this.showRecommend = true;
    },

    async updateData() {
      try {
        this.showLoading();
        await this.getUserInfo();
        await this.getAppMode();
        if (this.appMode.maskModel == 1) {
          await this.getMultiRecommendItems();
        }
        this.updateTextAndAction();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },

    updateTextAndAction() {
      // 清除数据
      this.btnTips = '';
      this.showLock = false;
      this.actionText = 'Apply';
      this.actionCallback = () => {
        this.$toast('Por favor, inténtelo de nuevo！');
      };

      if (this.appMode.maskModel == 1) {
        this.actionText = this.multipleCredit.button || 'Aplicar ahora';
        if (this.actionText == 'Aplicar ahora') {
          // 有可借
          this.actionCallback = async () => {
            // 多推
            if (this.selectItems.length > 0) {
              this.showLoading();
              let syncRes;
              try {
                // 1. 先同步数据
                try {
                  syncRes = await this.startSyncData();
                } catch (error) {
                  this.hideLoading();
                  this.$toast('Carga fallida, inténtelo más tarde');
                  return;
                }
                // 2. 真正提交
                if (syncRes.success) {
                  let res = await this.$http.post(`/api/order/mergePush/preApply`, {
                    productList: this.selectItems.map(t => t.id),
                  });
                  if (res.returnCode == 2000) {
                    await this.$http.post(`/api/order/mergePush/apply`, {
                      orderIdList: res.data.orderIdList,
                    });
                    this.$toast('Solicitud enviada con éxito');
                    setTimeout(res => {
                      this.innerJump('loan-success-multi', { systemTime: this.getLocalSystemTimeStamp() });
                    }, 1000);
                  }
                }
              } catch (error) {
                this.$toast(error.message);
              } finally {
                this.hideLoading();
              }
            }
          };
        } else if (this.actionText == 'Ir a reembolsar') {
          this.showLock = true;
          this.btnTips = 'Demasiados préstamos ahora. Por favor, pagar primero y desbloquear una mayor cantidad del préstamo.';
          // 有待还款或逾期，无可借
          this.actionCallback = () => {
            this.innerJump('repayment');
          };
        } else if (this.actionText == 'En revisión' || this.actionText == 'Desembolsando') {
          this.showLock = true;
          // 无可借，订单全部放款中或者审核中
          this.actionCallback = () => {
            this.innerJump('order-list');
          };
        } else if (this.actionText == 'Rechazo') {
          // 无可借，订单全被拒绝
          this.showLock = true;
          this.actionCallback = () => {
            this.$toast('Por favor, inténtelo de nuevo después de 0:00');
          };
        }
      } else if (this.appMode.maskModel == 3 || this.appMode.maskModel == 0) {
        this.actionText = 'Aplicar ahora';
        //未认证跳转
        if (this.appMode.basicInfoAuth == 0) {
          this.btnTips = 'Casi:95%';
          this.actionCallback = () => {
            this.innerJump('information', { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.addInfoAuth == 0) {
          this.btnTips = 'Casi:96%';
          this.actionCallback = () => {
            this.innerJump('contacts', { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.identityAuth == 0) {
          this.btnTips = 'Casi:97%';
          this.actionCallback = () => {
            this.innerJump('identity', { orderId: this.appMode.orderId });
          };
        } else if (this.appMode.remittanceAccountAuth == 0) {
          this.btnTips = 'Casi:98%';
          this.actionCallback = () => {
            this.innerJump('add-bank', { orderId: this.appMode.orderId, from: 'order' });
          };
        } else if (this.appMode.orderId && typeof this.appMode.orderStatus != 'undefined') {
          // 默认都跳订单详情页
          this.actionCallback = () => {
            this.innerJump('order-detail', { orderId: this.appMode.orderId });
          };

          if (this.appMode.orderStatus == 20 || this.appMode.orderStatus == 21) {
            // 订单审核中
            this.showLock = true;
            this.actionText = 'Evaluando';
          } else if (this.appMode.orderStatus == 80 || this.appMode.orderStatus == 90) {
            // 待还款 | 逾期
            this.showLock = true;
            this.actionText = 'Ir a reembolsar';
            this.btnTips = 'Devuelve el dinero a tiempo y desbloquea un préstamo de mayor cuantía';
          } else if (this.appMode.orderStatus == 40) {
            // 拒绝
            this.actionText = 'Rechazo';
            this.actionCallback = () => {
              this.$toast('Por favor, inténtelo de nuevo después de 0:00!');
            };
          } else if (this.appMode.orderStatus == 30 || this.appMode.orderStatus == 70) {
            // 放款中
            this.actionText = 'Desembolsando';
          } else {
            this.btnTips = 'Casi:99%';
            this.actionCallback = () => {
              this.innerJump('loan-confirm', { orderId: this.appMode.orderId });
            };
          }
        }
      } else if (this.appMode.maskModel == 2) {
        this.actionText = 'Rechazo';
        this.actionCallback = () => {
          this.$toast('Por favor, inténtelo de nuevo después de 0:00!');
        };
      }
    },

    setGlobalData() {
      if (this.from == 'bridge') {
        this.setAppGlobal(this.query);
      }
      this.setAppChecked(true);
    },

    async getMultiRecommendItems() {
      try {
        let res = await this.$http.post(`/api/product/mergeProduct/list`);
        this.updateMultiSelect(res.data.mergPushProductList || []);
        this.multiRecommendList = res.data.mergPushProductList || [];
        this.setRepaymentNum(res.data.repaymentNum);
        this.multipleCredit = {
          usedQuota: res.data.usedQuota,
          sumQuota: res.data.sumQuota,
          remaining: res.data.remaining,
          repaymentNum: res.data.repaymentNum,
          button: res.data.button,
          locked: res.data.locked,
        };
      } catch (error) {}
    },

    async onRefresh() {
      try {
        await this.getAppMode();
        this.updateTextAndAction();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    updateMultiSelect(selectItems) {
      this.selectItems = selectItems;
      let totalValue = selectItems.reduce((prev, cur, index, arr) => {
        return prev + parseInt(cur.minAmount);
      }, 0);
      this.$set(this.multipleCredit, 'remaining', totalValue);
    },

    async clickApply() {
      this.eventTracker('home_apply');
      if (this.actionCallback) {
        this.actionCallback();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.home-recommend {
  height: 80%;
  background: #f6f6f6;
  .pop-content {
    position: relative;
    height: 100%;
    overflow: hidden;
    .close {
      position: absolute;
      top: 16px;
      right: 24px;
    }
  }
}

.home {
  height: 100%;
  box-sizing: border-box;
  background-image: url(../../assets/img/creditomax/首页背景图.png);
  background-attachment: local;
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 420px;

  &-content {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 160px 0 0;
    padding-bottom: 24px;

    .loan-wrapper {
      width: 343px;
      height: 392px;
      margin: 0 auto;

      &.multiple_false {
        background-image: url(../../assets/img/creditomax/Money.png);
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: 343px 94px;
      }

      &.multiple_true {
        background-color: #fff;
        border-radius: 16px;

        .multi-select {
          margin-top: 30px;
          padding-left: 24px;
          padding-right: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 15px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #333333;
          line-height: 24px;
          > div {
            display: flex;
            align-items: center;

            span {
              background: #e9e9e9;
              font-size: 10px;
              font-family: Roboto-Regular, Roboto;
              font-weight: 400;
              color: #999999;
              line-height: 12px;
              transform: scale(0.9);
              padding: 6px 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 20px;
              margin-right: 10px;
              &.has-num {
                background: #ff4b3f;
                color: #fff;
              }
            }
          }
        }
      }

      .inner {
        width: 100%;
        height: 308px;
        background: linear-gradient(180deg, #efccc1 0%, #f9f0ea 16%, #ffffff 41%, #ffffff 100%);
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16), inset 0px 2px 3px 0px rgba(255, 255, 255, 0.8);
        border-radius: 16px;
        padding: 24px 24px 20px;
        box-sizing: border-box;
        position: relative;

        .available-text {
          font-size: 18px;
          font-weight: 900;
          color: #333333;
          line-height: 24px;
          text-align: center;
        }
        .number {
          margin-top: 8px;
          font-size: 48px;
          font-family: -apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif;
          font-weight: bold;
          color: #333333;
          line-height: 54px;
          text-align: center;
          height: 54px;
          display: flex;
          align-items: baseline;
          justify-content: center;
          .lock {
            margin-left: 8px;
          }
        }

        .action-btn {
          width: 295px;
          height: 44px;
          background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
          box-shadow: 0px 8px 20px 0px rgba(67, 74, 249, 0.4), inset 0px 2px 8px 0px #434af9;
          border-radius: 23px;
          font-size: 20px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #ffffff;
          line-height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 20px;
          left: 24px;

          .status-tips {
            position: absolute;
            background: #fbe396;
            padding: 8px;
            border-radius: 10px 10px 10px 0;
            font-weight: 400;
            color: #333333;
            line-height: 12px;
            font-size: 10px;
            font-weight: 400;
            color: #333333;
            line-height: 12px;
            right: 0px;
            bottom: 32px;
            span {
              font-size: 10px;
              transform: scale(0.9);
            }
          }
        }
        .total-used {
          margin: 32px auto 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 32px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 36px;
          > div {
            text-align: center;
            &:first-child {
              margin-right: 56px;
            }
          }
          .label {
            font-size: 14px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #333333;
            line-height: 18px;
            margin-bottom: 8px;
            white-space: nowrap;
          }
          .number {
            font-size: 32px;
            font-family: DINAlternate-Bold, DINAlternate;
            font-weight: bold;
            color: #333333;
            line-height: 36px;
            white-space: nowrap;
            font-family: -apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC',miui,'Hiragino Sans GB','Microsoft Yahei',sans-serif;
          }
        }
      }
    }
  }
}
</style>
