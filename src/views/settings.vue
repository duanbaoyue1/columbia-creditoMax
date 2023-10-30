<template>
  <div class="settings content-area">
    <div v-if="!hasPassword" class="btn" @click="$router.push({ name: 'create-password' })">Crear una contraseña</div>
    <div v-else class="btn" @click="$router.push({ name: 'retrieve-password' })">Cambiar contraseña</div>
    <div class="btn" @click="showLegal = true">Legal</div>

    <div class="legal-modal" v-if="showLegal">
      <div class="content">
        <div @click="goTerms">Condiciones del servicio</div>
        <div @click="goPrivacy">Política de privacidad</div>
        <m-icon class="close" type="message/close" :width="24" :height="24" @click="showLegal = false" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hasPassword: 0,
      showLegal: false,
    };
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Configuración',
    });
  },
  async mounted() {
    this.setEventTrackStartTime();

    try {
      let data = await this.$http.post(`/api/user/mine`);
      this.hasPassword = data.data.hasPassword;
    } catch (error) {}
  },
};
</script>

<style lang="scss" scoped>
.settings {
  .legal-modal {
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
    .content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px 0;
      font-size: 18px;
      font-weight: 400;
      color: #333333;
      background: #fff;
      line-height: 24px;
      width: 295px;
      box-sizing: border-box;
      border-radius: 8px;

      > div {
        text-align: center;
        &:first-child {
          border-bottom: 1px solid #cccccc;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
      }

      .close {
        position: absolute;
        bottom: -54px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .btn {
    border-radius: 14px;
    position: relative;
    margin: 24px;
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    display: flex;
    align-items: center;
    &::after {
      position: absolute;
      content: ' ';
      width: 8px;
      height: 12px;
      top: 50%;
      transform: translateY(-50%);
      right: 0px;
      background-image: url(../assets/img/right.png);
      background-size: contain;
      background-repeat: no-repeat;
    }
  }
}
</style>
