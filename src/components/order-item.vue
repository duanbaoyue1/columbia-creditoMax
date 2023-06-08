<template>
  <div class="order-item">
    <div class="status" :class="'status-' + order.orderStatus">{{ statusText }}</div>
    <div class="info">
      <img :src="order.productIconImageUrl" />
      <div class="name">
        <div>{{ order.productName }}</div>
        <div class="date">
          <span>{{ dateText }}</span>
          <span>{{ dateValue }}</span>
          <!-- <span class="repaid" v-if="order.orderStatus == 80 || order.orderStatus == 90" @click="goFillUtr">Repaid?</span> -->
        </div>
      </div>
    </div>
    <div class="action">
      <div>
        <span class="label">{{ amountText }}</span>
        <span class="label2">₹</span>
        <span class="number">{{ amountValue }}</span>
      </div>
      <button class="action-btn" :class="'action-btn-' + order.orderStatus" @click="goDetail">{{ order.orderStatusStr }}</button>
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
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90) {
        return `Repayable Amount`;
      } else {
        return `Application Amount`;
      }
    },
    dateText() {
      if (this.order.orderStatus == 80 || this.order.orderStatus == 90) {
        return `Due Date`;
      } else {
        return `Apply Date`;
      }
    },
    statusText() {
      switch (this.order.orderStatus) {
        case 10:
          return 'Pending to apply';
        case 20:
          return 'Reviewing';
        case 21:
          return 'Reviewing';
        case 30:
          return 'Disbursing';
        case 40:
          return 'Rejected';
        case 70:
          return 'Disbursing';
        case 80:
          return 'Pending Repayment';
        case 90:
          return 'Overdue';
        case 100:
          return 'Repayment Successful';
        case 101:
          return 'Repayment Successful';
        default:
          return 'Reviewing';
      }
    },
  },

  methods: {
    goDetail() {
      if (this.order.orderStatus == 10 || this.order.orderStatus == 100 || this.order.orderStatus == 101) {
        this.goHome();
      } else {
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
  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 11px;
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
      font-family: Roboto-Medium, Roboto;
      font-weight: 500;
      color: #ffffff;
      line-height: 18px;
      padding: 4px 8px;
      background: #ffbc41;
      border-radius: 16px;
      border: none;

      &-10 {
        background: #ffbc41;
      }
      &-20,
      &-21,
      &-30 {
        background: #f125a8;
      }
      &-40 {
        background: #ff1412;
      }
      &-70 {
        background: #3e56fe;
      }
      &-80,
      &-90 {
        background: #f15a25;
      }
      &-100,
      &-101 {
        background: #04ca1c;
      }
    }
  }
  .status {
    position: absolute;
    right: 14px;
    top: 14px;
    font-size: 10px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    color: #ffbc41;
    line-height: 12px;
    transform: scale(0.9);
    padding: 4px 12px;
    border-radius: 12px;
    border: 1px solid #ffbc41;
  }

  .info {
    display: flex;
    align-items: flex-start;
    padding-bottom: 16px;
    border-bottom: 1px solid #e9e9e9;
    img {
      width: 50px;
      height: 50px;
      display: block;
      margin-right: 16px;
    }
    .name {
      font-size: 14px;
      color: #333333;
      line-height: 18px;
      width: 100%;
      > div {
        &:first-child {
          margin-bottom: 18px;
        }
      }
      .date {
        position: relative;
        span {
          &:first-child {
            font-size: 10px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
            margin-right: 8px;
          }
        }
        .repaid {
          position: absolute;
          right: 0;
          top: 50%;
          font-size: 10px;
          font-weight: 500;
          color: #ff4b3f;
          line-height: 12px;
          transform: scale(0.9) translateY(-50%);
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
