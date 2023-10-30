<template>
  <div class="defer-history content-area">
    <div class="items" v-for="(item, index) in lists" :key="index">
      <div class="head fs-18">Plazo de aplazamiento</div>

      <div class="flex-between">
        <span>Fecha de aplicación</span>
        <span>{{ item.approvalDate }}</span>
      </div>

      <div class="flex-between">
        <span>Importe del reembolso</span>
        <span>${{ item.amount }}</span>
      </div>

      <div class="flex-between">
        <span>Plazo de aplazamiento</span>
        <span>{{ item.extendedTerm }} días</span>
      </div>

      <div class="flex-between">
        <span>Fecha de vencimiento actualizada</span>
        <span>{{ item.updatedDueDate }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productId: this.$route.query.productId,
      orderStatus: this.$route.query.orderStatus,
      lists: [],
    };
  },
  mounted() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Historial de reembolso diferido',
      backCallback: () => {
        this.updateTrackerData({ key: 'productId', value: this.productId });
        this.updateTrackerData({ key: 'status', value: this.ORDER_STATUS_LIST[this.orderStatus] });
        this.sendEventTrackData({});
        this.goAppBack();
      },
    });
    this.setEventTrackStartTime();

    this.getDeferHistory();
  },

  methods: {
    async getDeferHistory() {
      let res = await this.$http.post('/api/extension/history', {
        id: this.$route.query.orderId,
      });
      this.lists = res.data.list;
    },
  },
};
</script>

<style lang="scss" scoped>
.defer-history {
  padding-top: 14px;
  .items {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    padding: 16px 12px;
    background: #ffffff;
    border-radius: 8px;
    margin-left: 24px;
    margin-right: 24px;
    margin-bottom: 16px;

    &:last-child {
      border-bottom: none;
    }
    .head {
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
    }
    > div {
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
