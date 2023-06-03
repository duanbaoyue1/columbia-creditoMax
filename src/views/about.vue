<template>
  <div class="about content-area">
    <div class="app-info">
      <img src="../assets/img/creditomax/logo/512_512.png" />
      <div class="name">{{ appGlobal.appName }}</div>
      <div id="version">Version: {{ appGlobal.appVersionV }}</div>
      <div class="desc">CreditoMax es una plataforma digital de crédito personal segura y conveniente que ofrece préstamos personales a usuarios en Colombia que necesitan fondos con urgencia. Sin necesidad de aval, con aprobación instantánea y un funcionamiento sencillo, ¡todo el proceso es tan fácil como ir de compras!</div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Sobre nosotros',
    });
  },
  mounted() {
    // this.innerJump('identity', { orderId: this.$route.query.orderId, systemTime: this.$route.query.systemTime, needRecommend: false }, true);
  },
};
</script>

<style lang="scss" scoped>
.app-info {
  text-align: center;
  margin: 16px 24px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  img {
    width: 60px;
    display: block;
    margin: 0 auto 16px;
  }
  .name {
    font-size: 18px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
  }
  #version {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
  }

  .desc {
    margin-top: 24px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 400;
    color: #000000;
    line-height: 18px;
    text-align: left;
  }
}
</style>
