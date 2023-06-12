<template>
  <div class="res-loans-model" v-if="this.loans.length">
    <!-- <img class="cc" :src="require('@/assets/img/loan/congratinations.png')" /> -->
    <div class="res-total">
      <div class="head">Enhorabuena</div>
      <div>Ha solicitado {{ this.loans.length }} productos con éxito.</div>
      <div class="tips">Revise los resultados en 5 minutos</div>
    </div>

    <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item">
      <img class="icon" :src="loan.productIconImageUrl" />
      <div class="info">
        <div class="name">{{ loan.productName }}</div>
        <div class="value">
          Monto del préstamo($):
          <span>{{ loan.approvalAmount }}</span>
        </div>

        <div class="action" :class="'order_' + loan.orderStatus" @click="goDetail(loan.orderNo)">{{ loan.orderStatusStr }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['systemTime'],

  computed: {
    orderStatusText() {
      return status => {
        switch (status) {
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
      };
    },
  },

  data() {
    return {
      loans: [],
    };
  },

  created() {
    this.getRes();
  },

  methods: {
    async getRes() {
      try {
        let res = await this.$http.post(`/api/order/applyResultOrderList`, {
          startApplyTime: this.systemTime,
        });
        this.loans = res.data.list || [];
      } catch (e) {}
    },

    goDetail(orderNo) {
      this.innerJump('order-detail', { orderId: orderNo });
    },
  },
};
</script>

<style lang="scss" scoped>
.res-loans-model {
  margin-top: 30px;
  padding-bottom: 20px;
  .cc {
    width: 280px;
    margin: 0 auto;
    display: block;
    margin-bottom: 20px;
  }
  .res-total {
    width: 327px;
    height: 102px;
    background: #ededff;
    border-radius: 8px;
    margin: 0 auto;
    font-size: 14px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 18px;
    text-align: center;
    .head {
      padding-top: 16px;
      margin-bottom: 8px;
      font-size: 20px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #434af9;
      line-height: 24px;
      position: relative;
      &::after {
        content: ' ';
        position: absolute;
        width: 24px;
        height: 2px;
        background: #434af9;
        top: 26px;
        right: 57px;
      }
      &::before {
        content: ' ';
        position: absolute;
        width: 24px;
        height: 2px;
        background: #434af9;
        top: 26px;
        left: 57px;
      }
    }

    .tips {
      font-size: 10px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 12px;
      transform: scale(0.9);
      margin-top: 8px;
    }
  }

  .loan-item {
    width: 320px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 14px;
    border: 2px solid #cccccc;
    padding: 16px;
    height: 72px;
    box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 20px;
    position: relative;
    display: flex;
    align-items: center;
    .info {
      .name {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        margin-bottom: 8px;
      }
      .value {
        font-size: 10px;
        font-weight: 400;
        color: #999999;
        line-height: 12px;
        span {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          line-height: 20px;
        }
      }
    }
    .icon {
      width: 40px;
      height: 40px;
      display: block;
      margin-right: 10px;
    }

    .action {
      position: absolute;
      right: 8px;
      top: 22px;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 900;
      color: #ffffff;
      min-width: 80px;
      box-sizing: border-box;
      padding: 0 10px;
      height: 22px;
      background: #f125a8;
      border-radius: 14px;

      &.order_10 {
        background: #ffbc41;
      }
      &.order_20,
      &.order_21,
      &.order_30 {
        background: #f125a8;
      }
      &.order_40 {
        background: #ff1412;
      }
      &.order_70 {
        background: #3e56fe;
      }
      &.order_80,
      &.order_90 {
        background: #f15a25;
      }
      &.order_100,
      &.order_101 {
        background: #04ca1c;
      }
    }
  }
}
</style>
