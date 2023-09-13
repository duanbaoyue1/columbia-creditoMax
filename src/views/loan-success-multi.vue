<template>
  <div class="loan multi content-area">
    <div class="loan-tips">
      <m-icon class="icon" type="creditomax/申请成功" :width="130" :height="130" />
      <div class="title" v-if="this.loans.length > 0">
        Enhorabuena
        <br />
        ha enviado correctamente su solicitud
      </div>
      <div v-if="!this.loans.length" class="apply" @click="check">Ver todos los pedidos</div>
      <div v-else class="apply" @click="applyMulti">Aumento $ {{ totalAmount }} Importe</div>
    </div>

    <div class="other-loans" v-if="loans.length > 0">
      <div class="tips">Usted está en nuestro canal exclusivo VIP en vista de su buena calificación.</div>
      <div class="checked-num">Ya Seleccionar {{ checkedNums }} productos</div>
      <div v-for="(loan, index) in loans" :key="loan.id" class="loan-item" :class="{ active: !loan.unChecked }" @click="checkLoan(index)">
        <img class="icon" :src="loan.icon" />
        <div class="info">
          <div class="name">{{ loan.productName }}</div>
          <div class="value">
            Importe de préstamo ($):
            <span>{{ loan.minAmount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 没有推荐结果时显示 -->
    <res-loans v-else class="res-loans" :systemTime="systemTime"></res-loans>
    <google-feedback v-show="showGoogleFeed" :show.sync="showGoogleFeed"></google-feedback>

    <div class="control-back" v-if="showBackControl">
      <div class="content">
        <m-icon class="close" type="creditomax/关闭白" :width="20" :height="20" @click="leave" />
        <div class="head">
          <img :src="require('@/assets/img/creditomax/倒计时10s弹窗.png')" />
        </div>
        <div class="content">
          Estás a un paso de un límite de crédito de $ {{ totalAmount }}, ¿estás seguro de que quieres renunciar a tu derecho?
          <div class="count">
            Terminación automática después de
            <span>{{ count }}S</span>
          </div>
        </div>
        <div class="action">
          <button class="btn-default" @click="showBackControl = false">Piénsalo otra vez</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ResLoans from '@/components/res-loans.vue';
import GoogleFeedback from '@/components/google-feedback.vue';
export default {
  components: {
    ResLoans,
    GoogleFeedback,
  },
  watch: {
    showGoogleFeed: {
      handler() {
        if (!this.showGoogleFeed && this.nextStep) {
          if (this.nextStep == 'goBack') {
            this.goAppBack();
          } else if (this.nextStep == 'goAllOrders') {
            this.innerJump('order-list', {}, true);
          }
        }
      },
      deep: true,
    },
  },
  data() {
    window.loanBtnCallback = () => {
      if (this.loans.length > 0) {
        this.showBackModal();
      } else if (this.isSysNeedGoogle) {
        this.nextStep = 'goBack';
        this.showGoogleFeed = true;
      } else {
        this.goAppBack();
      }
    };
    return {
      needRecommend: JSON.parse(this.$route.query.needRecommend || true), // 是否需要推荐 从活动过来的不用推荐
      systemTime: this.$route.query.systemTime || '', // 上次订单时间
      single: JSON.parse(this.$route.query.single || false), // 是否是单推
      loans: [],
      count: 10,
      totalAmount: 0,
      checkedNums: 0,
      nextStep: '',
      showBackControl: false,
      backInterval: null, // 回退倒计时
      showGoogleFeed: false,
      isSysNeedGoogle: false,
    };
  },
  mounted() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Solicitud de préstamo',
      backCallback: window.loanBtnCallback,
    });
    this.toAppMethod('isInterceptionReturn', { isInterception: true, fuName: 'loanBtnCallback' });
    // 从系统读取是否需要弹google窗
    this.getNeedGoogle();

    if (this.needRecommend) {
      this.getRecommendLoans();
    }
  },
  methods: {
    leave() {
      this.toAppMethod('isInterceptionReturn', { isInterception: false });
      this.goHome();
    },
    showBackModal() {
      this.count = 10;
      window.clearInterval(this.backInterval);
      this.backInterval = null;
      this.backInterval = setInterval(() => {
        if (this.count == 0) {
          window.clearInterval(this.backInterval);
          this.backInterval = null;
        } else {
          this.count--;
        }
      }, 1000);
      this.showBackControl = true;
    },

    async getNeedGoogle() {
      try {
        let res = await this.$http.post(`/api/product/favourableComment`);
        if (res.returnCode == 2000) {
          this.isSysNeedGoogle = res.data;
        }
      } catch (error) {}
    },

    async getRecommendLoans() {
      try {
        this.showLoading();
        let data;
        if (this.single) {
          data = await this.$http.post(`/api/product/maskRecommendList`);
          this.loans = data.data.list || [];
          this.loans = this.loans.map(t => {
            t.maxAmount = t.minAmount;
            return t;
          });
        } else {
          data = await this.$http.post(`/api/product/mergeProduct/list`);
          this.loans = data.data.mergPushProductList || [];
        }
        this.updateCheckedNum();
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    check() {
      // 没有贷款产品且需要google弹窗
      if (!this.loans.length && this.isSysNeedGoogle) {
        this.nextStep = 'goAllOrders';
        this.showGoogleFeed = true;
      } else {
        this.innerJump('order-list', {}, true);
      }
    },

    checkLoan(index) {
      if (this.checkedNums == 1 && !this.loans[index].unChecked) return;
      this.$set(this.loans, index, { ...this.loans[index], unChecked: !this.loans[index].unChecked });
      this.updateCheckedNum();
    },

    updateCheckedNum() {
      this.checkedNums = this.loans.filter(t => !t.unChecked).length;
      this.totalAmount = this.sumArr(this.loans.filter(t => !t.unChecked).map(t => t.minAmount));
    },

    async applyMulti() {
      let loanIds = this.loans.filter(t => !t.unChecked).map(t => t.id);
      this.showLoading();

      let syncRes;
      try {
        // 1. 先同步数据
        try {
          syncRes = await this.startSyncData();
        } catch (error) {
          this.hideLoading();
          this.$toast('Carga fallida, inténtelo más tarde');
          return;
        }
        if (syncRes.success) {
          // 2. 真正提交
          let res = await this.$http.post(`/api/order/mergePush/preApply`, {
            orderNo: this.$route.query.orderId,
            productList: loanIds,
          });
          if (res.returnCode == 2000) {
            await this.$http.post(`/api/order/mergePush/apply`, {
              orderIdList: res.data.orderIdList,
            });
            this.$toast('Solicitud enviada con éxito');
            setTimeout(res => {
              this.getRecommendLoans();
            }, 1000);
          }
        }
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loan {
  .control-back {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 222;

    > .content {
      width: 295px;
      padding: 24px;
      padding-top: 0;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 8px;
      position: absolute;
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: relative;
      .head {
        position: relative;
        height: 54px;
        img {
          position: absolute;
          top: -27px;
          left: 50%;
          transform: translateX(-50%);
          width: 295px;
          display: block;
          margin-bottom: 20px;
        }
      }

      .close {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 2;
      }
      .content {
        font-size: 16px;
        font-weight: 500;
        color: #000601;
        line-height: 24px;
        margin-top: 80px;

        .count {
          font-size: 14px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #434af9;
          line-height: 24px;
          text-align: center;
          margin-top: 16px;
          span {
            width: 68px;
            height: 40px;
            background: #ededff;
            border-radius: 20px;
            font-size: 20px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #434af9;
            line-height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 8px auto 16px;
          }
        }
      }

      .action {
        .btn-default {
          width: 247px;
          height: 40px;
          background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
          box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
          border-radius: 20px;
          border: none;
          color: #fff;
          font-size: 16px;
          font-family: Roboto-Bold, Roboto;
          font-weight: bold;
          color: #ffffff;
          line-height: 20px;
        }
      }
    }
  }

  .bottom-action {
    width: 360px;
    height: 100px;
    background: #ffffff;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.12);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px 10px;
    box-sizing: border-box;

    .btns {
      display: flex;
      justify-content: space-between;
      .btn-line {
        width: 120px;
      }
      .btn-default {
        width: 190px;
      }
    }
    .tips {
      font-size: 10px;
      font-weight: 400;
      line-height: 16px;
      margin-top: 10px;
      text-align: center;
    }
  }
  .other-loans {
    margin: 32px 0px;
    padding: 0 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: -20px;
    padding-bottom: 10px;

    .tips {
      width: 327px;
      background: #ededff;
      border-radius: 8px;
      font-size: 15px;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
      display: flex;
      align-items: center;
      padding: 16px;
    }

    .checked-num {
      margin: 24px 0 16px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      line-height: 24px;
    }

    .loan-item {
      width: 327px;
      height: 72px;
      background: #ffffff;
      border-radius: 8px;
      border: 2px solid #f3f3f3;
      padding: 16px;
      box-sizing: border-box;
      margin-bottom: 16px;
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
      &::after {
        position: absolute;
        content: ' ';
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
        background-image: url(../assets/img/creditomax/多推未选中.png);
        background-repeat: no-repeat;
        background-size: contain;
      }

      &.active {
        border: 2px solid #434af9;
        &::after {
          background-image: url(../assets/img/creditomax/多推选中.png);
        }
      }
    }
  }

  .loan-tips {
    padding-top: 100px;
    .icon {
      margin: 0 auto;
    }
    .title {
      margin-top: 16px;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      text-align: center;
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
      margin-top: 40px;
    }
  }

  &.multi {
    .loan-tips {
      padding-top: 32px;
    }
    .title {
      margin-bottom: 16px;
    }
  }
}
</style>
