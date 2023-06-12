<template>
  <div class="defer-detail content-area" v-show="loaded">
    <div class="defer-head">
      <p>Retraso de {{ detail.extendedTerm }} días</p>
      <p>Sólo necesita pagar xox pesos hoy y luego puedes aplazar el pago durante{{ detail.extendedTerm }} días</p>
    </div>
    <div class="step">
      <div class="step-item status">
        <div class="round"></div>
        <!-- <img :src="require('@/assets/img/creditomax/进度条点亮.png')" /> -->
        <div class="text">Fecha de aplicacion</div>
        <div class="date">{{ detail.startTime }}</div>
      </div>
      <div class="step-item">
        <div class="round"></div>
        <!-- <img :src="require('@/assets/img/creditomax/进度条未点亮.png')" /> -->
        <div class="text">Fecha de vencimiento</div>
        <div class="date">{{ detail.updatedDueDate }}</div>
      </div>
    </div>

    <div class="order-info">
      <div class="period">
        <span class="fs-14 font-bold">Costes para reembolso diferido</span>
        <div class="value">
          <span class="color-blue">$</span>
          <span class="value">{{ detail.amount }}</span>
          <!-- <m-icon class="icon" type="gray-down" :width="16" :height="12" /> -->
        </div>
      </div>
      <!-- <div class="flex-between">
        <span>Interest</span>
        <span>₹ {{ detail.interest }}</span>
      </div> -->
      <div class="flex-between">
        <span>Tarifa de servicio</span>
        <span>${{ detail.defermentFee }}</span>
      </div>
      <div class="flex-between">
        <span>Tarifa vencida</span>
        <span>${{ detail.overDueFee }}</span>
      </div>
    </div>

    <div class="desc">Nota: Después de pagar los costes para reembolso diferido, la fecha de pago del reembolso se prorrogará 7 días, tras lo cual tendrá que reembolsar el principal + la tasa de servicio</div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" @click="defer">Reembolso diferido</button>
      </div>
      <div class="help-center" @click="goHelpCenter">Centro de ayuda</div>
    </div>

    <choose-bank :show.sync="showPaymentTips" @update:show="showPaymentTips = $event" @select-bank="selectBank" />
  </div>
</template>

<script>
import chooseBank from '@/components/choose-bank.vue';

export default {
  components: {
    chooseBank,
  },
  computed: {},
  data() {
    return {
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: false,
      detail: '',
      orderUrl: '',
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      black: false,
      fixed: true,
      title: 'Detalles del pedido',
    });
  },
  async mounted() {
    this.getDetail();
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  methods: {
    async selectBank(bank) {
      this.showPaymentTips = false;
      this.openWebview(`${this.appGlobal.apiHost}/api/extension/prepay?id=${this.detail.orderBillId}&payType=${bank.payType}&bankCode=${bank.bankCode}`);
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    defer() {
      this.showPaymentTips = true;
    },
    async getDetail() {
      console.log('this.orderId', this.orderId);
      try {
        let data = await this.$http.post('/api/extension/detail', {
          id: this.orderId,
        });
        this.detail = data.data;
      } catch (error) {
      } finally {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.defer-detail {
  padding-bottom: 120px;
  background-image: url(../assets/img/creditomax/back21.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 206px;
  background-color: #f6f6f6;
  box-sizing: border-box;

  .defer-head {
    padding: 24px;
    color: #fff;
    p {
      margin-bottom: 0;
      font-size: 11px;
      font-weight: 400;
      line-height: 16px;
      word-break: break-word;
      margin-top: 0;
      width: 70%;
      &:first-child {
        margin-bottom: 7px;
        font-size: 16px;
        font-weight: 900;
        line-height: 20px;
      }
    }
  }

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;

    .btns {
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;

      .btn-default {
        background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
        box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
        border-radius: 25px;
        height: 46px;
        border: none;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
      }
      button {
        flex: 1;
      }
    }
    .help-center {
      font-size: 14px;
      font-weight: 500;
      color: #434af9;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .order-info {
    background: #fff;
    padding: 16px;
    background: #ffffff;
    border-radius: 8px;
    margin: 24px;
    margin-bottom: 16px;
    margin-top: 0;

    .period {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      div {
        display: flex;
        align-items: flex-end;
        .value {
          margin-right: 0px;
          font-size: 24px;
          font-weight: bold;
          color: #434af9;
          line-height: 24px;
        }
        .icon {
          margin-top: -4px;
        }
      }

      .value {
        font-size: 20px;
        font-weight: 900;
        color: #333333;
        line-height: 24px;
        margin-right: 5px;
      }
    }

    > div {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #000;
      line-height: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .desc {
    font-size: 12px;
    font-weight: 400;
    color: #999;
    line-height: 18px;
    margin: 0 24px;
    word-break: break-word;
  }
  .step {
    width: 327px;
    height: 93px;
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 30px 9px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-sizing: border-box;
    position: relative;

    &::after {
      position: absolute;
      content: ' ';
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 110px;
      height: 2px;
      background: #cccccc;
    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;

      .round {
        width: 5px;
        height: 5px;
        border-radius: 100%;
        border: 5px solid #cccccc;
      }

      &.status {
        .round {
          border-color: #434af9;
        }
        .text {
          color: #434af9;
        }
      }
      .text {
        font-size: 12px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        margin: 8px auto;
      }
      .date {
        font-size: 18px;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
      }
      .step-wrapper {
        flex-grow: 1;
      }
    }
  }
}
</style>
