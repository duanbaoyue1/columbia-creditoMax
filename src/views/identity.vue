<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="2"></complete-step>
    </div>
    <div class="edit-area">
      <div class="head-top">Subir C.C.ID</div>
      <div class="pan-img-wrapper">
        <div class="pan-img" @click="getCapture(1)">
          <template v-if="cardFrontOcrStatus">
            <img class="back user-pic" :src="cardFrontBase64Src" />
            <img class="btn" :src="require('@/assets/img/creditomax/完成.png')" />
          </template>
          <template v-else>
            <img class="back" :src="require('@/assets/img/creditomax/C.C.ID正.png')" />
            <img class="btn" :src="require('@/assets/img/creditomax/相机.png')" />
          </template>
        </div>
        <div class="pan-text">Frente de C.C.ID</div>
      </div>

      <div class="pan-img-wrapper">
        <div class="pan-img" @click="getCapture(2)">
          <template v-if="cardBackOcrStatus">
            <img class="back user-pic" :src="cardBackBase64Src" />
            <img class="btn" :src="require('@/assets/img/creditomax/完成.png')" />
          </template>
          <template v-else>
            <img class="back" :src="require('@/assets/img/creditomax/C.C.ID反.png')" />
            <img class="btn" :src="require('@/assets/img/creditomax/相机.png')" />
          </template>
        </div>
        <div class="pan-text">Reverso de C.C.ID</div>
      </div>

      <div class="pan-tips">
        1. Asegúrate de que el C.C.ID que subes es auténtico y válido
        <br />
        2. Asegúrese de que la foto C.C.ID cargada es clara y completa, de lo contrario no pasará la verificación.
      </div>
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <div class="submit-success-content">
        <div class="percent">
          <div class="cur-percent" :style="{ width: curPercent + '%' }"></div>
          <div class="tips" :style="{ left: curPercent + '%' }">{{ curPercent }}%</div>
        </div>
        <div class="tips">Por favor, sea paciente y espere a la carga para desbloquear el crédito</div>
        <m-icon class="close" type="creditomax/编组 5" :width="30" :height="30" @click="submitSuccess = false" />
      </div>
    </div>
  </div>
</template>

<script>
import CompleteStep from '@/components/complete-step.vue';

export default {
  components: {
    CompleteStep,
  },

  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Verificación de identidad',
      backCallback: null,
    });
  },
  data() {
    window.onPhotoSelectCallback_1 = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('id_card_front_submit');
        this.cardFrontBase64Src = `data:image/png;base64,${data.pic}`;
        this.uploadImg(1, 'cardFrontBase64Src', this.cardFrontBase64Src);
      }
    };

    window.onPhotoSelectCallback_2 = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('id_card_back_submit');
        this.cardBackBase64Src = `data:image/png;base64,${data.pic}`;
        this.uploadImg(2, 'cardBackBase64Src', this.cardBackBase64Src);
      }
    };

    window.onPhotoSelectCallback_3 = data => {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }
      if (data.success) {
        this.eventTracker('id_liveness_photo_submit');
        this.uploadImg(3, 'livingBase64Src', `data:image/png;base64,${data.pic}`);
      }
    };

    return {
      canSubmit: false,
      submitSuccess: false,
      cardFrontBase64Src: '',
      cardBackBase64Src: '',
      editData: {},
      curPercent: 0,
      saving: false,
      curInterval: null,
      cardFrontOcrStatus: 0,
      cardBackOcrStatus: 0,
      orderId: this.$route.query.orderId,
    };
  },

  mounted() {
    this.eventTracker('id_access');
    this.initInfoBackControl();
  },

  methods: {
    getCapture(type) {
      if (type == 1) {
        this.eventTracker('id_card_front');
      } else if (type == 2) {
        this.eventTracker('id_card_back');
      }
      this.toAppMethod('getCapture', { type: type, callbackMethodName: `onPhotoSelectCallback_${type}` });
    },

    startPercent() {
      this.curPercent = 1;
      this.submitSuccess = true;
      if (this.curInterval) {
        window.clearInterval(this.curInterval);
        this.curInterval = null;
      }
      this.curInterval = setInterval(() => {
        if (this.curPercent < 99) {
          this.curPercent += 1;
        } else {
          this.stopPercent();
        }
      }, 100);
    },

    stopPercent() {
      window.clearInterval(this.curInterval);
    },

    async goAddCard() {
      try {
        // 创建订单
        let res = await this.$http.post(`/api/product/appMaskModel`);
        console.log('订单创建结果:', res);
        this.eventTracker('id_submit_create_order_success');
        this.submitSuccess = false;
        this.innerJump('add-bank', { orderId: res.data.orderId, from: 'order' }, true);
      } catch (error) {
        this.submitSuccess = false;
        this.$toast(error.message);
      }
    },

    async uploadImg(type, fileName, base64) {
      // 上传活动后显示进度条
      this.startPercent();
      try {
        let saveData = {
          mark: type,
        };
        saveData[fileName] = base64;
        let res = await this.$http.post(`/api/ocr/saveResult`, saveData);

        if (res.returnCode == 2000) {
          if (type == 1) {
            this.cardFrontOcrStatus = res.data.cardFrontOcrStatus;
          } else if (type == 2) {
            this.cardBackOcrStatus = res.data.cardBackOcrStatus;
          }
          if (type == 1 && res.data.cardFrontOcrStatus) {
            this.curPercent = 100;
            setTimeout(() => {
              this.stopPercent();
              this.submitSuccess = false;
            }, 1000);
            this.eventTracker('id_card_front_submit_success');
          } else if (type == 2 && res.data.cardBackOcrStatus) {
            this.curPercent = 100;
            setTimeout(() => {
              this.stopPercent();
              this.submitSuccess = false;
            }, 1000);
            this.eventTracker('id_card_back_submit_success');
          } else if (type == 3 && res.data.livingStatus) {
            // 提交人脸对比请求
            res = await this.$http.post(`/api/ocr/saveResult`, { mark: 4 });
            if (res.data.faceComparisonStatus) {
              this.curPercent = 100;
              this.eventTracker('id_liveness_success');
              this.goAddCard();
            } else {
              this.logError(type);
            }
          } else {
            this.logError(type);
          }
        } else {
          this.logError(type);
        }
      } catch (error) {
        this.logError(type, error);
      } finally {
        this.checkCanSubmit();
      }
    },

    checkCanSubmit() {
      if (this.cardBackOcrStatus && this.cardFrontOcrStatus) {
        this.canSubmit = true;
      } else {
        this.canSubmit = false;
      }
    },

    logError(type, error) {
      this.stopPercent();
      this.submitSuccess = false;
      this.eventTracker('id_submit_error');
      let toastMessage = 'Por favor, inténtelo de nuevo！';

      if (error) {
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          toastMessage = 'Compruebe la red y vuelva a intentarlo';
        } else {
          toastMessage = error.message || toastMessage;
        }
      }
      this.$toast(toastMessage);
    },

    async submit() {
      this.eventTracker('id_submit');
      this.getCapture(3);
    },
  },
};
</script>
<style lang="scss" scoped>
.information {
  padding: 20px 24px;
  padding-bottom: 110px;
  background: #f6f6f6;

  .pan-text {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    margin: 10px auto 0px;
    text-align: center;
    span {
      color: #fd973f;
    }
  }

  .pan-tips {
    margin-top: 20px;
    font-size: 10px;
    font-weight: 400;
    color: #c6c6c6;
    line-height: 14px;
  }

  .pan-demo {
    display: flex;
    align-items: center;
    font-size: 10px;
    font-weight: 400;
    color: #999999;
    line-height: 14px;
    > div {
      white-space: nowrap;
      text-align: center;
      flex: 1;
      img {
        width: 70px;
        height: 58px;
        margin: 0 auto;
        margin-bottom: 4px;
        display: block;
      }
    }
  }

  .pan-img-wrapper {
    background: #fff;
    padding: 16px 44px;
    border-radius: 8px;

    .pan-img {
      position: relative;

      .back {
        width: 240px;
        height: 151px;
        margin: 0 auto;
        display: block;
        &.user-pic {
          // height: 120px;
          // width: 120px;
          // transform: rotate(270deg);
          // transform-origin: center center;
        }
      }
      .btn {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 48px;
        height: 48px;
      }
    }
  }

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    .close {
      position: absolute;
      bottom: -62px;
      left: 50%;
      z-index: 2;
      transform: translateX(-50%);
    }

    &-content {
      width: 320px;
      height: 144px;
      background: #ffffff;
      border-radius: 8px;
      background: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
      font-weight: 400;
      color: #000601;
      line-height: 20px;
      .percent {
        width: 280px;
        height: 10px;
        background: #e6ebf5;
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 54px;
        margin-bottom: 20px;
        position: relative;
        .cur-percent {
          height: 10px;
          background: linear-gradient(270deg, #434af9 0%, #696ffb 100%);
          border-radius: 5px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .tips {
          position: absolute;
          top: -30px;
          width: 36px;
          margin-left: 0px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
          font-weight: 400;
          color: #ffffff;
          line-height: 14px;
          border-radius: 3px;
          background: #333333;
          transform: translateX(-50%);
          &::after {
            position: absolute;
            content: ' ';
            border-style: solid;
            border-width: 6px;
            border-color: #333333 transparent transparent transparent;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
      .tips {
        text-align: center;
        margin: 0 24px;
        word-break: break-word;
      }
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .step {
    padding-top: 10px;
    margin-bottom: 32px;
  }
  .edit-area {
    .head-top {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
  }
}
</style>
