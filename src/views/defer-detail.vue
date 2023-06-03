<template>
  <div class="defer-detail content-area" v-show="loaded">
    <div class="defer-head">
      <p>Retraso de {{ detail.extendedTerm }} días</p>
      <p>Sólo necesita pagar xox pesos hoy y luego puedes aplazar el pago durante{{ detail.extendedTerm }} días</p>
    </div>
    <div class="step">
      <div class="step-item status">
        <img :src="require('@/assets/img/creditomax/进度条点亮.png')" />
        <div class="text">Fecha de aplicacion</div>
        <div class="date">{{ detail.startTime }}</div>
      </div>
      <div class="step-item">
        <img :src="require('@/assets/img/creditomax/进度条未点亮.png')" />
        <div class="text">Fecha de vencimiento</div>
        <div class="date">{{ detail.updatedDueDate }}</div>
      </div>
    </div>

    <div class="order-info">
      <div class="period">
        <span class="fs-14 font-bold">Costes para reembolso diferido</span>
        <div>
          <span class="color-blue">$</span>
          <span class="value">{{ detail.amount }}</span>
          <!-- <m-icon class="icon" type="gray-down" :width="16" :height="12" /> -->
        </div>
      </div>
      <!-- <div class="flex-between">
        <span>Interest</span>
        <span>₹ {{ detail.interest }}</span>
      </div> -->
      <div class="flex-between">
        <span>Tarifa de servicio</span>
        <span>${{ detail.defermentFee }}</span>
      </div>
      <div class="flex-between">
        <span>Tarifa vencida</span>
        <span>${{ detail.overDueFee }}</span>
      </div>
    </div>

    <div class="desc">Nota: Después de pagar los costes para reembolso diferido, la fecha de pago del reembolso se prorrogará 7 días, tras lo cual tendrá que reembolsar el principal + la tasa de servicio</div>

    <div class="actions">
      <div class="btns">
        <button class="btn-default" @click="defer">Reembolso diferido</button>
      </div>
      <div class="help-center" @click="goHelpCenter">Centro de ayuda</div>
    </div>

    <div class="modal" v-if="showPaymentTips">
      <div class="modal-content payment-success-container">
        <m-icon class="close" type="handy/路径" :width="20" :height="20" @click="showPaymentTips = false" />

        <div class="content">
          <header>Seleccione la forma de pago</header>
          <ul>
            <li @click="chooseBankA">Nequi</li>
            <li @click="chooseBankA">PSE(Pagos Seguros en Línea)</li>
          </ul>
          <div class="tips">
            <div>Consejos:</div>
            <div>Una vez realizado el pago, el banco suele procesarlo en el plazo de una hora y el pedido se actualiza automáticamente.</div>
          </div>
        </div>
      </div>
    </div>

    <van-action-sheet class="bank-picker-sheet" v-model="openSelect" title="Forma de pago" close-on-click-action>
      <van-picker ref="bankPicker" class="bank-picker" :columns="banks" :item-height="67">
        <template #option="PickerOption">
          <div class="pick-value">
            <div>
              {{ PickerOption.text }}
              <span class="recommend" v-if="PickerOption.recommend">Recomendar</span>
            </div>
          </div>
        </template>
      </van-picker>
      <div class="submit">
        <button class="bottom-submit-btn" @click="confirmSelect">Enviar</button>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import * as ALL_ATTRS from '@/config/typeConfig';

export default {
  computed: {},
  data() {
    return {
      orderId: this.$route.query.orderId,
      loaded: false,
      showPaymentTips: true,
      detail: '',
      orderUrl: '',
      banks: ALL_ATTRS.BANKS,
      openSelect: false,
    };
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: true,
      black: false,
      fixed: true,
      title: 'Detalles del pedido',
    });
  },
  async mounted() {
    this.getDetail();
    this.orderUrl = await this.getOrderRelateUrl(this.orderId);
  },
  methods: {
    chooseBankA() {
      this.showPaymentTips = false;
      this.openSelect = true;
    },
    goFillUtr() {
      this.innerJump('utr', { orderId: this.orderId, type: 'defer' });
    },
    goTutorial() {
      location.href = this.orderUrl.utrVideoUrl;
    },
    defer() {
      this.showPaymentTips = true;
    },
    async repay() {
      this.innerJump('utr', { nextUrl: this.orderUrl.extensionUrl, orderId: this.orderId, type: 'defer' });
    },
    async getDetail() {
      console.log('this.orderId', this.orderId);
      try {
        let data = await this.$http.post('/api/extension/detail', {
          id: this.orderId,
        });
        this.detail = data.data;
      } catch (error) {
      } finally {
        this.loaded = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pick-value {
  > div {
    font-size: 10px;
    font-family: Roboto-Regular, Roboto;
    font-weight: 400;
    color: #a1a5fc;
    line-height: 16px;
    text-align: center;
    transform: scale(0.9);
    transition: all 0.3s;
    &:first-child {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #9a9a9a;
      line-height: 20px;
      position: relative;

      .recommend {
        width: 74px;
        height: 28px;
        background: #ffdc62;
        border-radius: 8px 8px 8px 0px;
        font-size: 10px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: -200%;
        bottom: 0;
        transform: scale(0.9);
        opacity: 0.6;
      }
    }
  }
}

.payment-success-container {
  width: 295px;
  box-sizing: border-box;
  border-radius: 8px;
  .policy {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    font-weight: 400;
    margin: 50px 0px 0;
    color: #000601;
    position: relative;
    .tips {
      position: absolute;
      top: -30px;
      left: -8px;
      width: 130px;
      height: 20px;
      background: #fbe396;
      border-radius: 24px 24px 24px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
      color: #333333;
      line-height: 12px;
      transform: scale(0.9);
    }
    .m-icon {
      margin-top: -2px;
    }
    span {
      margin-left: 0px;
      transform: scale(0.9);
      margin-top: -10px;
    }
  }

  .close {
    position: absolute;
    bottom: -32px;
    left: 50%;
    z-index: 2;
    transform: translateX(-50%);
  }
  .content {
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    color: #000601;
    text-align: left;
    header {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      border-bottom: 4px solid #f6f6f6;
      color: #333333;
      line-height: 24px;
    }
    ul {
      li {
        height: 72px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 24px;
        border-bottom: 1px solid #cccccc;
      }
    }
    .tips {
      padding: 24px;
      > div {
        &:first-child {
          font-size: 14px;
          font-weight: 500;
          color: #999999;
          line-height: 16px;
          margin-bottom: 8px;
        }
      }
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
    }
    a {
      color: #1143a4;
      text-decoration: underline;
    }
  }
  .action {
    margin: 0 24px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 24px;
    > div {
      width: 143px;
      height: 40px;
      background: linear-gradient(180deg, #fe816f 0%, #fc2214 100%);
      box-shadow: 0px 4px 10px 0px #f7b5ae, inset 0px 1px 4px 0px #ffc7c0;
      border-radius: 20px;
      font-size: 16px;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;

      &.cancel {
        border: 1px solid #999999;
        color: #999;
        position: relative;
        width: 88px;
        background: transparent;
        box-shadow: none;
        margin-right: 16px;
        flex-grow: 1;
      }
    }
  }
}
.defer-detail {
  padding-bottom: 120px;
  background-image: url(../assets/img/creditomax/back3@2x.png);
  background-position: top;
  background-repeat: no-repeat;
  background-size: 375px 206px;
  background-color: #f6f6f6;
  box-sizing: border-box;

  .defer-head {
    padding: 24px;
    color: #fff;
    p {
      margin-bottom: 0;
      font-size: 11px;
      font-weight: 400;
      line-height: 16px;
      word-break: break-word;
      margin-top: 0;
      &:first-child {
        margin-bottom: 7px;
        font-size: 16px;
        font-weight: 900;
        line-height: 20px;
      }
    }
  }

  .actions {
    position: fixed;
    padding-bottom: 20px;
    bottom: 0;
    left: 0;
    right: 0;
    background: transparent;

    .btns {
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;

      .btn-default {
        background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
        box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
        border-radius: 25px;
        height: 46px;
        border: none;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
      }
      button {
        flex: 1;
      }
    }
    .help-center {
      font-size: 14px;
      font-weight: 500;
      color: #434af9;
      line-height: 18px;
      text-align: center;
      text-decoration: underline;
    }
  }

  .order-info {
    background: #fff;
    padding: 16px;
    background: #ffffff;
    border-radius: 8px;
    margin: 24px;
    margin-bottom: 16px;
    margin-top: 0;

    .period {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      div {
        display: flex;
        align-items: flex-end;
        .value {
          margin-left: 4px;
          margin-right: 0px;
          font-size: 24px;
          font-weight: bold;
          color: #434af9;
          line-height: 24px;
        }
        .icon {
          margin-top: -4px;
        }
      }

      .value {
        font-size: 20px;
        font-weight: 900;
        color: #333333;
        line-height: 24px;
        margin-right: 5px;
      }
    }

    > div {
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 400;
      color: #000;
      line-height: 18px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .desc {
    font-size: 12px;
    font-weight: 400;
    color: #333;
    line-height: 18px;
    margin: 0 24px;
    word-break: break-word;
  }
  .step {
    width: 327px;
    height: 93px;
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 30px 9px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    box-sizing: border-box;
    position: relative;

    &::after {
      position: absolute;
      content: ' ';
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 2px;
      background: #cccccc;
    }

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      img {
        width: 10px;
        height: 10px;
      }
      &.status {
        .text {
          color: #434af9;
        }
      }
      .text {
        font-size: 12px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        margin: 8px auto;
      }
      .date {
        font-size: 18px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        line-height: 24px;
      }
      .step-wrapper {
        flex-grow: 1;
      }
    }
  }
}
</style>
