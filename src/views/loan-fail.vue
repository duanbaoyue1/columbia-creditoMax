<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="creditomax/申请失败" :width="130" :height="130" />
      <div class="title">Lo sentimos, el envío de la solicitud ha fallado, ¡esta solicitud está llena</div>
      <div class="apply" @click="goHome">Volver a la página de inicio</div>
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
      title: 'Solicitud de préstamo',
    });
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .loan-tips {
    padding-top: 40px;
    .icon {
      margin: 0 auto;
    }
    .title {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
      margin: 10px 24px 40px;
    }
    .apply {
      width: 327px;
      height: 48px;
      background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
      box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
      border-radius: 24px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
    }
  }
}
</style>
