<template>
  <div class="order-item">
    <div class="head">
      <img :src="order.productIconImageUrl" />
      <div>{{ order.productName }}</div>
    </div>
    <div class="info">
      <div>
        <div>{{ dateValue }}</div>
        <div>{{ dateText }}</div>
      </div>
      <div>
        <div>
          <span class="money">$</span>
          <span>{{ amountValue }}</span>
        </div>
        <div>{{ amountText }}</div>
      </div>
    </div>
    <div class="action" :class="'action-' + order.orderStatus">
      <div class="status">{{ statusText }}</div>
      <button class="action-btn" @click="goDetail">{{ order.orderStatusStr }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['order'],

  computed: {
    dateValue() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90) {
        return this.order.repaymentTime;
      } else {
        return this.order.applyTime;
      }
    },
    amountValue() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90) {
        return this.order.repaymentAmount;
      } else {
        return this.order.approvalAmount;
      }
    },

    amountText() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90 || this.order.orderStatus == 100 || this.order.orderStatus == 101) {
        return `Monto de reembolso`;
      } else {
        return `Importe de préstamo`;
      }
    },
    dateText() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90 || this.order.orderStatus == 100 || this.order.orderStatus == 101) {
        return `Fecha de vencimiento`;
      } else {
        return `Fecha de aplicación`;
      }
    },
    statusText() {
      switch (this.order.orderStatus) {
        case 10:
          return 'Pendiente de aplicar';
        case 20:
          return 'Evaluando';
        case 21:
          return 'Evaluando';
        case 30:
          return 'Desembolsando';
        case 40:
          return 'Incapaz';
        case 70:
          return 'Desembolsando';
        case 80:
          return 'Reembolsando';
        case 90:
          return 'Atrasado';
        case 100:
          return 'Completado';
        case 101:
          return 'Completado';
        default:
          return 'Evaluando';
      }
    },
  },

  methods: {
    goDetail() {
      if (this.order.orderStatus == 10 || this.order.orderStatus == 100 || this.order.orderStatus == 101) {
        this.sendEventTrackData({});
        this.goHome();
      } else {
        this.sendEventTrackData({ leaveBy: 1 });
        this.innerJump('order-detail', { orderId: this.order.orderNo });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-item {
  width: 327px;
  background: #ffffff;
  border-radius: 16px;
  margin: 0 auto;
  padding: 16px 16px 14px;
  box-sizing: border-box;
  position: relative;
  .head {
    display: flex;
    font-size: 14px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    align-items: center;
    margin-bottom: 26px;
    img {
      height: 24px;
      width: 24px;
      margin-right: 8px;
    }
  }
  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    .status {
      font-size: 10px;
      font-weight: 500;
      color: #ffbc41;
      line-height: 12px;
      transform: scale(0.9);
      padding: 4px 12px;
      border-radius: 12px;
      border: 1px solid #ffbc41;
    }

    &-10 {
      .status {
        border-color: #ffbc41;
        color: #ffbc41;
      }
      .action-btn {
        background: #ffbc41;
      }
    }
    &-20,
    &-21,
    &-30 {
      .status {
        border-color: #f125a8;
        color: #f125a8;
      }
      .action-btn {
        background: #f125a8;
      }
    }
    &-40 {
      .status {
        border-color: #ff1412;
        color: #ff1412;
      }
      .action-btn {
        background: #ff1412;
      }
    }
    &-70 {
      .status {
        border-color: #3e56fe;
        color: #3e56fe;
      }
      .action-btn {
        background: #3e56fe;
      }
    }
    &-80,
    &-90 {
      .status {
        border-color: #f15a25;
        color: #f15a25;
      }
      .action-btn {
        background: #f15a25;
      }
    }
    &-100,
    &-101 {
      .status {
        border-color: #04ca1c;
        color: #04ca1c;
      }
      .action-btn {
        background: #04ca1c;
      }
    }

    .number {
      font-size: 24px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
    }
    .label {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      margin-right: 8px;
    }
    .label2 {
      font-size: 12px;
      font-family: Helvetica-Bold, Helvetica;
      font-weight: bold;
      color: #333333;
      line-height: 12px;
    }
    &-btn {
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 18px;
      padding: 4px 8px;
      background: #ffbc41;
      border-radius: 16px;
      border: none;
    }
  }

  .info {
    display: flex;
    align-items: flex-start;
    padding-bottom: 16px;
    border-bottom: 1px solid #e9e9e9;
    > div {
      width: 50%;

      > div {
        text-align: center;
        font-size: 12px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        transform: scale(0.9);
        .money {
          font-size: 12px;
        }
        &:first-child {
          font-size: 18px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 20px;
          transform: scale(1);
          margin-bottom: 4px;
        }
      }
    }
  }
}
</style>
