<template>
  <div class="order-detail content-area" :class="'order_' + detail.orderStatus">
    <div class="status-text">{{ orderStatusText }}</div>
    <div class="status-desc" v-if="detail.orderStatus == 30 || detail.orderStatus == 70 || detail.orderStatus == 110">
      <div v-if="detail.orderStatus == 30 || detail.orderStatus == 70">Por lo general, llegará el mismo día o al día siguiente. Sin embargo, puede deberse a la lentitud del procesamiento del banco, y la cuenta llegará a más tardar el tercer día. Espere pacientemente. La hora de desembolso está sujeta a la hora real de llegada.</div>
      <div v-else>Si el pago falla, cambie los datos de su tarjeta en el Centro Personal y vuelva a presentar su solicitud.</div>
    </div>

    <div class="order-info" v-if="detail.orderStatus >= 80">
      <div class="flex-between" v-if="detail.orderStatus >= 80">
        <span>Monto de reembolso</span>
        <span class="font-bold color-orange align-end" style="line-height: 26px">
          <span class="fs-18">$</span>
          <span class="fs-18">{{ detail.estimatedRepaymentAmount }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="showDate">
        <span>Fecha de vencimiento</span>
        <span class="fw-500">{{ detail.actualRepaymentTime || detail.expectedRepaymentTime }}</span>
      </div>
    </div>

    <div class="order-info">
      <div class="flex-between">
        <span>ID del préstamo</span>
        <span>{{ detail.orderNo }}</span>
      </div>
      <div class="flex-between">
        <span>Monto de prestamo</span>
        <span class="font-bold">
          <span class="money-label">$</span>
          <span>{{ detail.approvalAmount }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="detail.orderStatus >= 80">
        <span>Importe real recibido</span>
        <span class="font-bold">
          <span class="money-label">$</span>
          <span>{{ detail.actualAmount }}</span>
        </span>
      </div>
    </div>

    <div class="order-info" v-if="detail.orderStatus >= 80">
      <div class="flex-between">
        <span>Tarifa de servicio</span>
        <span class="font-bold">
          <span class="money-label">$</span>
          <span>{{ detail.incidentalAmount }}</span>
        </span>
      </div>
      <div class="flex-between" v-if="detail.penaltyInterest > 0">
        <span>Tarifa vencida</span>
        <span class="font-bold">
          <span class="money-label">$</span>
          <span>{{ detail.penaltyInterest }}</span>
        </span>
      </div>
    </div>

    <div class="order-info" v-if="deferTimes > 0 || (detail.orderStatus >= 80 && detail.showExtension == 1)">
      <div class="flex-between" @click="goDeferHis">
        <span>Historial de reembolso diferido</span>
        <div class="color-blue font-bold">
          {{ deferTimes }} veces&nbsp;
          <m-icon class="icon" type="blue-right" :width="8" :height="12" />
        </div>
      </div>
    </div>

    <div class="order-info">
      <div class="flex-between">
        <span>Forma de pago</span>
        <span>{{ detail.bankCardName }}</span>
      </div>
      <div class="flex-between bank-no">
        <span>Número de cuenta receptora</span>
        <span>{{ detail.bankCardNo }}</span>
      </div>
    </div>

    <div class="order-info">
      <!-- <div class="flex-between">
        <span>Product</span>
        <span>{{ detail.productName }}</span>
      </div>
      <div class="flex-between">
        <span>Lending Company</span>
        <span>{{ detail.companyName }}</span>
      </div> -->
      <div class="flex-between">
        <span>Fecha de aplicación</span>
        <span class="fw-500">{{ detail.applyTime }}</span>
      </div>

      <div class="flex-between" v-if="showDate">
        <span>Fecha de recibo</span>
        <span class="fw-500">{{ detail.arrivalTime }}</span>
      </div>
    </div>

    <!-- <div class="order-info">
      <div class="flex-between" v-if="detail.orderStatus >= 80">
        <span>Loan agreement</span>
        <div class="color-blue" @click="checkAgreement">
          check
          <m-icon class="icon" type="blue-right" :width="8" :height="12" />
        </div>
      </div>
    </div> -->

    <div class="actions">
      <div class="btns" v-if="detail.orderStatus == 110 || detail.orderStatus == 80 || detail.orderStatus == 90">
        <!-- <button class="btn-default" v-if="detail.orderStatus == 100 || detail.orderStatus == 101 || detail.orderStatus == 40" @click="goHome">Cambio de cuenta de cobro</button> -->
        <button class="btn-default" v-if="detail.orderStatus == 110" @click="goCompleteBank">Cambio de cuenta de cobro</button>
        <template v-else-if="detail.orderStatus == 80 || detail.orderStatus == 90">
          <button class="btn-line" v-if="detail.showExtension == 1" @click="applyDefer">Reembolso diferido</button>
          <button class="btn-default" @click="showPaymentTips = true">Ir a reembolsar</button>
        </template>
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
  computed: {
    showDate() {
      return this.detail.orderStatus == 80 || this.detail.orderStatus == 90 || this.detail.orderStatus == 100 || this.detail.orderStatus == 101;
    },
    orderStatusText() {
      switch (this.detail.orderStatus) {
        case 20:
          return 'Bajo revisión';
        case 21:
          return 'Bajo revisión';
        case 30:
          return 'Está pagando';
        case 40:
          return 'Rechazad';
        case 70:
          return 'Está pagando';
        case 80:
          return 'Pendiente de reembolso';
        case 90:
          return 'Atrasado';
        case 100:
          return 'Completado';
        case 101:
          return 'Completado';
        case 110:
          return 'Transferencia fallida';
        default:
          return 'Bajo revisión';
      }
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      fixed: true,
      black: false,
      title: 'Detalles del pedido',
      backCallback: () => {
        this.goAppBack();
      },
    });
  },
  data() {
    // /**
    //  * 创建
    //  */
    // public final static int CREATE = 10;

    // /**
    //  * 审核中
    //  */
    // public final static int EXAMINE_WAIT = 20;

    // /**
    //  * 审核中
    //  */
    // public final static int AUTO_REPEAT_EXAMINE_WAIT = 21;

    // /**
    //  * 审核通过
    //  */
    // public final static int EXAMINE_PASS = 30;

    // /**
    //  * 审核拒绝
    //  */
    // public final static int EXAMINE_FAIL = 40;

    // /**
    //  * 等待放款
    //  */
    // public final static int WAIT_PAY = 70;

    // /**
    //  * 在途
    //  */
    // public final static int WAY = 80;

    // /**
    //  * 逾期
    //  */
    // public final static int DUE = 90;

    // /**
    //  * 结清
    //  */
    // public final static int COMPLETE = 100;

    // /**
    //  * 结清-有逾期
    //  */
    // public final static int DUE_COMPLETE = 101;

    // /**
    //  * 废弃订单
    //  */
    // public final static int ABANDONED = 110;

    return {
      orderId: this.$route.query.orderId,
      choosed: false, // 是否勾选复贷
      showPaymentTips: false,
      detail: '',
      deferTimes: 0,
      orderUrl: '',
    };
  },

  mounted() {
    this.getDetail();
    this.getDeferTimes();
  },

  methods: {
    goCompleteBank() {
      this.innerJump('complete-bank', { orderId: this.orderId, from: 'mine' });
    },
    async selectBank(bank) {
      this.showPaymentTips = false;
      this.openWebview(`${this.appGlobal.apiHost}/api/repayment/prepay?id=${this.detail.orderBillId}&payType=${bank.payType}&bankCode=${bank.bankCode}`);
    },

    applyDefer() {
      this.innerJump('defer-detail', { orderId: this.orderId });
    },
    checkAgreement() {
      this.openWebview(`${this.appGlobal.apiHost}/api/h5/contract?orderNo=${this.orderId}`);
    },
    goDeferHis() {
      this.innerJump('defer-history', { orderId: this.orderId });
    },
    async getDeferTimes() {
      let data = await this.$http.post(`/api/extension/historyNum`, {
        id: this.orderId,
      });
      this.deferTimes = data.data.num;
    },

    async getDetail() {
      this.showLoading();
      try {
        let res = await this.$http.post(`/api/order/detail`, {
          orderId: this.orderId,
        });
        this.detail = res.data;
        if (this.orderStatusText == 'Rejected' || this.orderStatusText == 'Repayment Successful' || this.orderStatusText == 'Pending Repayment' || this.orderStatusText == 'Overdue') {
          this.orderUrl = await this.getOrderRelateUrl(this.orderId);
        }
      } catch (error) {
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-detail {
  padding-bottom: 120px;
  background-image: url(../assets/img/creditomax/放款中.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 206px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  background-attachment: local;
  &.order_40,
  &.order_90,
  &.order_110 {
    background-image: url(../assets/img/creditomax/订单失败.png);
  }
  &.order_100,
  &.order_101 {
    background-image: url(../assets/img/creditomax/订单成功.png);
  }

  &.order_30,
  &.order_70 {
    background-size: 375px 246px;
    .status-text {
      margin-top: 8px;
    }
  }

  .bank-no {
    flex-direction: column;
    align-items: baseline;
    span {
      margin-left: 0 !important;
      &:last-child {
        margin-top: 8px;
      }
    }
  }

  .status-text {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    line-height: 32px;
    margin-top: 24px;
    margin-bottom: 24px;
    padding-left: 24px;
    padding-right: 24px;
  }
  .status-desc {
    font-size: 10px;
    font-weight: 500;
    color: #ffffff;
    line-height: 16px;
    padding-left: 24px;
    padding-right: 24px;
    margin-bottom: 16px;
    margin-top: -16px;
  }

  .money-label {
    font-size: 12px;
    font-family: Helvetica;
    color: #333333;
    line-height: 14px;
  }
  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #f6f6f6;

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
        border: 1px solid #434af9;
        color: #ffffff;
        font-weight: bold;
        font-size: 16px;
      }
      .btn-line {
        border-radius: 25px;
        border: 1px solid #999999;
        font-weight: bold;
        font-size: 16px;
        color: #999;
      }
      button {
        // width: 100%;
        flex: 1;
        &:nth-child(2) {
          margin-left: 10px;
        }
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
  .order-more {
    background: #fff;
    padding: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    > div {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      > * {
        display: flex;
        align-items: center;
        .icon {
          margin-left: 2px;
        }
      }
    }
  }
  .order-info {
    padding: 20px;
    width: 327px;
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    margin: 0 auto;
    margin-bottom: 16px;

    > div {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      div {
        display: flex;
        align-items: center;
      }
      &:last-child {
        margin-bottom: 0;
      }
      > span {
        white-space: nowrap;
        &:last-child {
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left:10px;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
