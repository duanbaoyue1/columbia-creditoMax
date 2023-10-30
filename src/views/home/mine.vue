<template>
  <div id="mine" class="content-area">
    <div class="user">
      <img :src="require('@/assets/img/creditomax/默认头像.png')" />
      <span class="name">{{ userInfo.mobile | phoneHideFilter }}</span>
    </div>

    <div class="menu">
      <div @click="innerJump('order-list')">
        <div>
          <m-icon class="icon" type="creditomax/All orders" :width="30" :height="30" />
          Pedido de préstamo
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('complete-bank', { from: 'mine' })" v-if="userInfo.remittanceAccountAuth">
        <div>
          <m-icon class="icon" type="creditomax/Receipt Account" :width="30" :height="30" />
          Tarjeta bancaria
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>

      <div @click="goHelpCenter">
        <div>
          <m-icon class="icon" type="creditomax/Help Center" :width="30" :height="30" />
          Centro de ayuda
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('about')">
        <div>
          <m-icon class="icon" type="creditomax/About Us" :width="30" :height="30" />
          Sobre nosotros
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>

      <div @click="innerJump('settings')">
        <div>
          <m-icon class="icon" type="creditomax/Set Up" :width="30" :height="30" />
          Configuración
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>

      <div @click="showDeleteConfirm" v-if="isTestAccount">
        <div>
          <m-icon class="icon" type="creditomax/Delete Account" :width="30" :height="30" />
          Eliminar cuenta
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>

      <div @click="logout">
        <div>
          <m-icon class="icon" type="creditomax/Log Out" :width="30" :height="30" />
          Cerrar sesión
        </div>
        <m-icon type="creditomax/进入" :width="8" :height="12" />
      </div>
    </div>

    <van-overlay :show="showLogOut" @click="showLogOut = false">
      <div class="logout" @click.stop>
        <img :src="require('@/assets/img/creditomax/个人中心推出弹窗.png')" />
        <div class="content">
          <div>¿Está seguro de cerrar sesión?</div>
          <button @click="logout">Cancelar</button>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
export default {
  created() {
    this.setTabBar({
      show: false,
    });
  },
  data() {
    return {
      isTestAccount: false, // 是否google测试账号
      showLogOut: false,
    };
  },
  async mounted() {
    let data = await this.$http.post(`/api/user/mine`);
    this.isTestAccount = data.data.isTestAccount;
  },
  activated() {
    this.setEventTrackStartTime();

    this.updateData();
  },
  methods: {
    showDeleteConfirm() {
      this.showMessageBox({
        content: 'Después de eliminar la cuenta, se borrará toda la información de la cuenta, ¿confirmar para eliminar?',
        confirmBtnText: 'Déjame pensar de nuevo',
        cancelBtnText: 'Confirmar eliminación',
        confirmCallback: () => {
          this.hideMessageBox();
        },
        cancelCallback: () => {
          this.sendEventTrackData({ leaveBy: 2, page: 'mine' });
          this.toAppMethod('toLoginPage');
        },
        iconPath: 'creditomax/删除账户',
      });
    },
    async updateData() {
      this.showLoading();
      try {
        await this.getUserInfo();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    goTestb() {
      this.innerJump('testb');
    },
    goDetail() {
      this.innerJump('order-detail');
    },
  },
};
</script>

<style lang="scss" scoped>
#mine {
  padding: 74px 24px 0;
  padding-bottom: 100px;

  .logout {
    width: 295px;
    height: 266px;
    background: #ffffff;
    border-radius: 8px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      margin-top: -25px;
    }
    .content {
      padding-top: 20px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 20px;
      text-align: center;
      button {
        width: 247px;
        height: 40px;
        background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
        box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
        border-radius: 20px;
        font-size: 16px;
        font-family: Roboto-Bold, Roboto;
        font-weight: bold;
        color: #ffffff;
        line-height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        border: none;
        margin-top: 30px;
      }
    }
  }

  .menu {
    width: 327px;
    background: #ffffff;
    border-radius: 8px;
    padding: 0 16px;
    box-sizing: border-box;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
      padding-bottom: 16px;
      padding-top: 16px;
      &:last-child {
        border-bottom: none;
      }

      > div {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        .icon {
          margin-right: 16px;
        }
      }
    }
  }

  .user {
    display: flex;
    font-size: 16px;
    font-family: Roboto-Bold, Roboto;
    font-weight: bold;
    color: #333333;
    line-height: 24px;
    margin-bottom: 24px;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
  }
}
</style>
