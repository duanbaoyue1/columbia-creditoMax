<template>
  <div class="scroll-area content-area order-list">
    <van-pull-refresh class=" " v-model="loading" success-text=" " loading-text="loading" loosing-text="loading" pulling-text="loading" @refresh="getAllOrders">
      <div>
        <div class="has-order" v-if="orders.length">
          <order-item class="order-item" v-for="item in orders" :key="item.id" :order="item"></order-item>
        </div>
        <div class="no-order" v-else-if="!loading">
          <m-icon class="icon" type="creditomax/no-order-all" :width="140" :height="107" />
          <div>Ningún pedido de préstamo</div>
          <button @click="goHome">Aplicar ahora</button>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import OrderItem from '@/components/order-item.vue';

export default {
  components: {
    OrderItem,
  },
  data() {
    return {
      loading: false,
      orders: [],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Pedido de préstamo',
    });
  },
  mounted() {
    this.getAllOrders();
  },
  methods: {
    async getAllOrders() {
      this.showLoading();
      this.loading = true;
      try {
        let res = await this.$http.post(`/api/order/listAll`);
        this.orders = res.data.list || [];
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
.scroll-area {
  height: calc(100vh - 80px);
  overflow: auto !important;
  padding: 0 24px;
}
.order-list {
  .order-item {
    margin: 16px auto;
  }
}

.no-order {
  margin: 0 auto;
  .icon {
    margin: 100px auto 40px;
    margin-bottom: 0;
  }
  div {
    font-size: 12px;
    font-family: Roboto-Regular, Roboto;
    text-align: center;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    margin-top: 9px;
    margin-bottom: 16px;
  }
  button {
    width: 327px;
    height: 50px;
    background: linear-gradient(180deg, #696FFB 0%, #434AF9 100%);;
    box-shadow: 0px 4px 10px 0px rgba(67,74,249,0.4), inset 0px 1px 4px 0px #434AF9;;
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
