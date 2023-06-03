<template>
  <div class="loan content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="creditomax/申请失败" :width="130" :height="130" />
      <div class="error">Error de transferencia</div>
      <div class="title">Error en la solicitud del servicio de transferencia, inténtelo de nuevo más tarde</div>
      <div class="apply" @click="goHome">Por favor, inténtelo de nuevo</div>
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
    .error {
      font-size: 16px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin-top: 40px;
      margin-bottom: 8px;
      text-align: center;
    }
    .title {
      text-align: center;
      margin: 10px 24px 40px;
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
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
