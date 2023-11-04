<template>
  <div class="loan-confirm content-area">
    <div class="loan-money">
      <div>
        <div>Monto del préstamo ($)</div>
        <div>{{ orderInfo.estimatedRepaymentAmount }}</div>
      </div>
      <m-icon type="creditomax/确认申请页" :width="56" :height="56" />
    </div>

    <div class="loan-info">
      <div class="item">
        <span>Monto total de recibo</span>
        <span>{{ orderInfo.actualAmount }}</span>
      </div>

      <div class="item border">
        <span>Monto total de reembolso</span>
        <span class="color-000">{{ orderInfo.approvalAmount }}</span>
      </div>
      <div class="item">
        <span>Fecha de aplicación</span>
        <span>{{ orderInfo.applyTime }}</span>
      </div>
      <div class="item border">
        <span>Fecha de reembolso</span>
        <span>{{ orderInfo.expectedRepaymentTime }}</span>
      </div>
      <div class="item">
        <span>Forma de pago</span>
        <span>{{ orderInfo.bankCardName }}</span>
      </div>
      <div class="item bank">
        <span>Número de cuenta receptora</span>
        <span>{{ orderInfo.bankCardNo }}</span>
      </div>
    </div>

    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Confirme el préstamo</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      choosed: true,
      canSubmit: true,
      orderInfo: '',
      orderId: this.$route.query.orderId,
      saving: false,
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      black: false,
      title: 'Confirmación del préstamo',
    });
  },
  mounted() {
    this.setEventTrackStartTime();

    this.eventTracker('confirm_access');
    this.getOrderInfo();
  },
  watch: {
    choosed: {
      handler() {
        this.canSubmit = !!this.choosed;
      },
      deep: true,
    },
  },
  methods: {
    checkAgreement() {
      this.openWebview(`${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    togglePolicy() {
      this.choosed = !this.choosed;
    },
    async getOrderInfo() {
      try {
        this.showLoading();
        let data = await this.$http.post('/api/order/applyConfirmation', { orderId: this.orderId });
        this.orderInfo = data.data;
      } catch (error) {
      } finally {
        this.hideLoading();
      }
    },

    async submit() {
      this.eventTracker('confirm_submit');
      this.showLoading();
      let syncRes;
      try {
        // 1. 先同步数据
        try {
          syncRes = await this.judgeCanApply();
        } catch (error) {
          this.hideLoading();
          this.$toast('Carga fallida, inténtelo más tarde');
          return;
        }
        if (syncRes.success) {
          // 2. 真正的提交动作
          await this.$http.post(`/api/order/apply`, { orderId: this.orderId });

          this.sendEventTrackData({ leaveBy: 1 });

          // 成功或者失败的跳转
          this.innerJump('loan-success-multi', { orderId: this.orderId, single: true, systemTime: this.getLocalSystemTimeStamp() }, true);
        }
      } catch (error) {
        this.$toast(error.message || 'Carga fallida, inténtelo más tarde');
        setTimeout(() => {
          this.innerJump('loan-fail', { orderId: this.orderId }, true);
        }, 1000);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan-confirm {
  background: #f6f6f6;
  padding: 16px 24px;
  padding-bottom: 90px;
  background: linear-gradient(180deg, #434af9 0%, rgba(67, 74, 249, 0) 100%);
  background-size: 375px 280px;
  background-repeat: no-repeat;

  .loan-money {
    width: 100%;
    height: 88px;
    background: #ffffff;
    border-radius: 8px;
    margin-top: 14px;
    box-sizing: border-box;
    padding: 16px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    div {
      div {
        &:first-child {
          font-size: 18px;
          font-family: Roboto-Black, Roboto;
          font-weight: 900;
          color: #333333;
          line-height: 24px;
          margin-bottom: 8px;
        }
      }
    }
  }
  .loan-info {
    padding-top: 32px;
    border-radius: 8px;
    background: #fff;
    .item {
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.border {
        border-bottom: 2px solid #f6f6f6;
      }
      &.bank {
        flex-direction: column;
        align-items: baseline;
        span {
          margin-bottom: 8px;
        }
      }
      span {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:first-child {
          font-size: 14px;
          font-weight: 400;
          color: #000000;
          line-height: 18px;
          flex-shrink: 0;
          margin-right: 20px;
        }
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;
  }
}
</style>
