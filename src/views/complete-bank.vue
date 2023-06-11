<template>
  <div class="complete-bank content-area">
    <div class="cards">
      <div class="cards-list">
        <div v-for="card in cards" class="cards-item" :key="card.id" @click="chooseBank(card)">
          <div class="card-name">
            <div>
              <div class="name">{{ card.bank }}</div>
              <div class="number">{{ card.accountNumber | phoneHideFilter }}</div>
            </div>
          </div>
          <m-icon class="choose" :class="{active: chooseBankId == card.id}" :type="chooseBankId == card.id ? 'creditomax/多推选中' : 'creditomax/多推未选中'" :width="24" :height="24" />
          <span class="default-tips" v-if="chooseBankId == card.id">Tarjeta bancaria por defecto</span>
        </div>
      </div>
      <div class="add-card" @click="goAddCard">
        <m-icon class="icon" type="creditomax/add1" :width="14" :height="14" />
        Agregar un nuevo método
      </div>
    </div>

    <!-- <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div> -->
  </div>
</template>

<script>
import * as ALL_ATTRS from '@/config/typeConfig';
import CompleteStep from '@/components/complete-step.vue';

export default {
  components: {
    CompleteStep,
  },
  watch: {
    chooseBankId: {
      handler() {
        this.canSubmit = !!this.chooseBankId;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Tarjeta bancaria',
      backCallback: null,
    });
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      cards: [],
      from: this.$route.query.from,
      orderId: this.$route.query.orderId,
      chooseBankId: '',
      saving: false,
      editData: {
        friendName: '',
        friendPhone: '',
        familyName: '',
        familyPhone: '',
      },
    };
  },

  mounted() {
    this.getBanks();
    if (this.from != 'mine') {
      this.eventTracker('bank_access');
    }
  },

  methods: {
    goAddCard() {
      this.eventTracker('bank_add');
      this.innerJump('add-bank', this.$route.query);
    },
    async getBanks() {
      let data = await this.$http.post('/api/remittance/remittanceAccountList');
      this.cards = data.data.list;
      this.chooseBankId = this.cards[0].id;
    },
    async chooseBank(bank) {
      this.showLoading();
      try {
        // 从个人中心进来，则是修改默认卡
        await this.$http.post(`/api/remittance/modifyLoanCard`, {
          remittanceAccountId: bank.id,
        });
        this.chooseBankId = bank.id;
        this.hideLoading();
        this.eventTracker('bank_submit_success');
        this.$toast('Vinculación de la tarjeta bancaria con éxito');
      } catch (error) {
        this.$toast(error.message);
      } finally {
        this.hideLoading();
      }
    },
    async submit() {
      // this.showMessageBox({
      //   content: 'The name of the bank account you submitted is inconsistent with your name, please change it to your own account.',
      //   confirmBtnText: 'Submit',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/edit',
      //   showClose: false,
      // });
      // this.showMessageBox({
      //   content: 'Bank account verification failed, please change another bank account',
      //   confirmBtnText: 'Ok',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/error',
      //   showClose: false,
      // });
      // this.showMessageBox({
      //   content: 'Receive the money immediately after submitting the information. Do you really want to quit?',
      //   confirmBtnText: 'Yes',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/question',
      //   showClose: false,
      // });
      // this.showMessageBox({
      //   content: '<div><p style="color: #FF380C;font-weight: 500;margin-bottom: 20px;text-align: center">UTR has not been received</p>The order : 220624325998661663 hasn’t been repaid.</div>',
      //   confirmBtnText: 'Repay',
      //   confirmCallback: () => {
      //     console.log('confirmCallback');
      //     this.hideMessageBox();
      //   },
      //   cancelBtnText: 'Enter UTR',
      //   cancelCallback: () => {
      //     console.log('cancelCallback');
      //     this.hideMessageBox();
      //   },
      //   iconPath: 'message/error',
      //   showClose: true,
      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.complete-bank {
  padding: 20px 24px;
  background: #f6f6f6;
  box-sizing: border-box;

  .cards {
    background: #fff;
    margin-top: 24px;
    margin-bottom: 24px;
    padding: 16px 16px 24px;
    border-radius: 8px;
    .none {
      margin: 44px auto 40px;
    }
    .add-card {
      width: 255px;
      height: 40px;
      font-size: 16px;
      font-weight: 500;
      color: #ffffff;
      line-height: 22px;
      display: flex;
      align-items: center;
      margin: 0 auto;
      padding: 0 28px;
      justify-content: space-between;
      box-sizing: border-box;
      background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
      box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
      border-radius: 20px;
      white-space: nowrap;
      img {
        margin-right: 6px;
      }
    }
    .cards-list {
      padding-bottom: 40px;
    }

    &-item {
      height: 82px;
      box-sizing: border-box;
      border-radius: 14px 14px 0px 0px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      font-size: 15px;
      font-weight: 400;
      color: #3b3735;
      margin-bottom: 20px;
      line-height: 18px;
      justify-content: space-between;
      position: relative;
      background-size: cover;

      &:nth-child(4n + 1) {
        background-image: url('../assets/img/creditomax/卡1.png');
      }
      &:nth-child(4n + 2) {
        background-image: url('../assets/img/creditomax/卡2.png');
      }
      &:nth-child(4n + 3) {
        background-image: url('../assets/img/creditomax/卡3.png');
      }
      &:nth-child(4n + 4) {
        background-image: url('../assets/img/creditomax/卡4.png');
      }

      .choose {
        position: absolute;
        top: 16px;
        right: 16px;
        &.active {
          background: #fff;
          border-radius: 100%;
        }
      }
      .default-tips {
        font-size: 10px;
        font-family: Roboto-Black, Roboto;
        font-weight: 900;
        color: #333333;
        line-height: 1;
        background: #ffdc62;
        border-radius: 100px 0px 0px 100px;
        position: absolute;
        padding: 7px 8px;
        bottom: 8px;
        right: 0;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .bank {
        margin-right: 10px;
      }
      .card-name {
        display: flex;
        align-items: flex-start;
        > div {
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
          line-height: 1;
          .name {
            font-size: 16px;
            font-weight: 500;
            color: #ffffff;
            line-height: 1;
            margin-bottom: 10px;
            padding-right: 20px;
          }
        }
      }
      .bottom {
        position: absolute;
        width: 320px;
        height: 6px;
        border: 2px solid #000000;
        bottom: -6px;
        left: -10px;
        border-radius: 10px;
        z-index: -1;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f6f6f6;
  }
  .step {
    margin-top: 25px;
    margin-bottom: 30px;
    font-size: 10px;
    font-weight: 400;
    color: #87a0d1;
    line-height: 18px;
    display: flex;
    align-items: end;
    .icon {
      margin-right: 6px;
    }
    span {
      transform: scale(0.9);
    }
  }

  .head-top {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 26px;
    margin-bottom: 10px;
  }
}
</style>
