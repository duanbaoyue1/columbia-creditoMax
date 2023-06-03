<template>
  <div class="order-list content-area">
    <div class="has-order" v-if="orders.length">
      <order-item-repayment class="order-item" v-for="item in orders" :key="item.id" :order="item"></order-item-repayment>
    </div>
    <div class="no-order" v-else-if="!loading">
      <m-icon class="icon" type="handy/订单空状态" :width="140" :height="107" />
      <button @click="goHome">Aplicar ahora</button>
    </div>
  </div>
</template>

<script>
import OrderItemRepayment from '@/components/order-item-repayment.vue';

export default {
  components: {
    OrderItemRepayment,
  },
  data() {
    return {
      loading: true,
      orders: [],
    };
  },
  created() {
    this.setTabBar({
      show: false,
      transparent: false,
      fixed: true,
      title: '',
    });
  },
  activated() {
    this.getAllOrders();
  },
  methods: {
    async getAllOrders() {
      this.showLoading();
      try {
        let res = await this.$http.post(`/api/order/unRepaymentOrderList`);
        this.orders = res.data.list || [];
        this.setRepaymentNum(this.orders.length);
      } catch (error) {
      } finally {
        this.hideLoading();
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.order-list {
  padding: 0 24px;
  padding-bottom: 100px;
  padding-top: 75px;

  .order-item {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.no-order {
  margin: 0 auto;
  .icon {
    margin: 80px auto 40px;
  }
  button {
    width: 327px;
    height: 50px;
    background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
    box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
    border-radius: 25px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-family: Roboto-Black, Roboto;
    font-weight: 900;
    color: #ffffff;
    line-height: 24px;
    border: none;
  }
}
</style>
