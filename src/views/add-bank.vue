<template>
  <div class="add-bank content-area" :class="{ 'from-order': from == 'order' }">
    <template v-if="from != 'mine'">
      <div class="step">
        <complete-step :actionIndex="3"></complete-step>
      </div>
    </template>
    <div class="edit-area">
      <div class="line-item select-bank" @click="openSelect = true">
        <div class="label">Forma de pago</div>
        <input v-model="selectBank.text" disabled placeholder="Por favor, elija" />
        <m-icon class="right" type="creditomax/黑下" :width="14" :height="12" />
      </div>
      <div class="line-item">
        <div class="label">Número de cuenta rec</div>
        <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="20" v-model="editData.accountNumber" placeholder="Por favor escribe" />
      </div>
      <div class="line-item">
        <div class="label">Nombre del beneficia</div>
        <input v-model="editData.userName" placeholder="Please enter your name" />
      </div>
    </div>
    <div class="tips">
      <header>Consejos:</header>
      <div>
        1. Recomendamos los siguientes cuatro bancos: Nequi, Bancolombia, Daviplata, que admiten préstamos en fin de semana y festivos y tienen un tiempo de llegada rápido.
        <br />
        2. Por lo general, los fondos tardan de 1 a 2 días hábiles en llegar, pero puede tardar hasta el tercer día hábil debido a la lentitud de procesamiento de los bancos, así que por favor sea paciente. Por favor, espere pacientemente. El tiempo de liberación está sujeto al tiempo real de llegada.
      </div>
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="showConfirmModal = true">Enviar</button>
    </div>

    <van-action-sheet class="bank-picker-sheet" v-model="openSelect" title="Elegir banco" close-on-click-action>
      <van-picker ref="bankPicker" class="bank-picker" :columns="banks" :item-height="75">
        <template #option="PickerOption">
          <div class="pick-value">
            <div>
              {{ PickerOption.text }}
              <span class="recommend" v-if="PickerOption.recommend">Recomendar</span>
            </div>
            <div>{{ PickerOption.desc || '1-2 días hábiles para llegar' }}</div>
          </div>
        </template>
      </van-picker>
      <div class="submit">
        <button class="bottom-submit-btn" @click="confirmSelect">Enviar</button>
      </div>
    </van-action-sheet>

    <van-popup v-model="showConfirmModal">
      <div class="confirm-data">
        <header>Confirmar la información de la cuenta receptora</header>
        <div class="content">
          <div class="label">Forma de pago</div>
          <div class="value">{{ selectBank.text }}</div>
          <div class="label">Número de cuenta receptora</div>
          <div class="value">{{ editData.accountNumber }}</div>
          <div class="label">Nombre del beneficiario</div>
          <div class="value">{{ editData.userName }}</div>
        </div>
        <div class="actions">
          <button class="cancel" @click="showConfirmModal = false">Cancelar</button>
          <button @click="submit">Ok</button>
        </div>
        <div class="tips">Asegúrese de que la información es correcta, No se puede cambiar después de la confirmación.</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ifscSelect from '@/components/ifsc-select.vue';
import CompleteStep from '@/components/complete-step.vue';
import * as ALL_ATTRS from '@/config/typeConfig';

export default {
  components: {
    ifscSelect,
    CompleteStep,
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = this.selectBank.value && this.editData.accountNumber && this.editData.userName;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Añadir método de pag',
    });
    setTimeout(() => {
      this.editData.userName = this.userInfo.panName;
    }, 1000);
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      openSelect: false,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      selectBank: {
        text: '',
        value: '',
      },
      editData: {
        userName: '',
      },
      from: this.$route.query.from,
      showConfirmModal: false,
      banks: ALL_ATTRS.BANKS,
      saving: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    confirmSelect() {
      this.selectBank = this.$refs.bankPicker.getValues()[0];
      this.openSelect = false;
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('bank_add_submit');
        let saveData = { ...this.editData };
        saveData.name = this.userInfo.panName;
        if (saveData.accountNumber.length < 7 || saveData.accountNumber.length > 22) {
          this.$toast('Please enter correct account number');
          return;
        }
        let data = await this.$http.post(`/api/remittance/addRemittanceAccount`, saveData);
        if (data.returnCode == 2000) {
          this.innerJump('complete-bank', this.$route.query, true);
        }
        this.eventTracker('bank_add_submit_success');
      } catch (error) {
        this.eventTracker('bank_add_submit_error');
        this.$toast(error.message);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.add-bank {
  padding: 10px 20px;
  padding-bottom: 110px;

  &.from-order {
    .edit-area {
      margin: 24px 0;
      background: #fff;
      border-radius: 8px;
      padding: 0px 16px;
      padding-bottom: 16px;
    }
  }

  .bank-picker-sheet {
    height: 560px;
  }
  .bank-picker {
    position: absolute;
    bottom: 88px;
    left: 0;
    right: 0;
    top: 0;
    .van-picker__columns {
      height: 420px !important;
    }
  }

  .confirm-data {
    width: 300px;
    height: 476px;
    background: #ffffff;
    border-radius: 8px;
    header {
      font-size: 16px;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
      height: 96px;
      display: flex;
      align-items: center;
      justify-items: center;
      border-bottom: 4px solid #f6f6f6;
      padding: 0 50px;
    }
    .content {
      padding: 24px;
      .label {
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 8px;
      }
      .value {
        width: 247px;
        height: 26px;
        box-sizing: border-box;
        background: #f6f6f6;
        border-radius: 4px;
        padding: 4px 16px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 16px;
      }
    }
    .actions {
      margin: 0 16px;
      display: flex;
      justify-content: space-between;
      button {
        width: 159px;
        height: 48px;
        background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
        box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
        border-radius: 25px;
        border: 1px solid #434af9;
        font-size: 18px;
        font-weight: 900;
        color: #ffffff;
        line-height: 24px;
        &.cancel {
          width: 96px;
          border: 1px solid #999999;
          color: #999;
          background: transparent;
          box-shadow: none;
        }
      }
    }
    .tips {
      font-size: 12px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 400;
      color: #ff4b3f;
      line-height: 18px;
      margin: 16px 12px 0;
    }
  }

  .submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

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
          right: -40%;
          bottom: 0;
          transform: scale(0.9);
          opacity: 0.6;
        }
      }
    }
  }

  .tips {
    margin-top: 24px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
    line-height: 18px;
    header {
      font-size: 14px;
      font-weight: 500;
      color: #999999;
      line-height: 16px;
      margin-bottom: 8px;
    }
  }

  .pop-content {
    .items {
      margin-top: 42px;
      .item {
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        margin-bottom: 36px;
        text-align: center;
        position: relative;
        span {
          position: relative;
        }

        &.active {
          font-weight: bold;
          color: #333333;
          span {
            &::after {
              position: absolute;
              content: ' ';
              width: 100%;
              height: 4px;
              background: #434af9;
              border-radius: 20px;
              bottom: -2px;
              left: 0;
            }
          }
        }
      }
    }
  }

  .edit-area {
    .head-top {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 26px;
      margin-bottom: 20px;
    }
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .line-item {
      font-size: 14px;
      padding-top: 23px;
      &.select-bank {
        position: relative;
        .right {
          position: absolute;
          right: 0px;
          bottom: 18px;
        }
      }
      .label {
        font-size: 16px;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        .color-red {
          color: #ff4b3f !important;
          font-size: 14px;
        }
      }
      input {
        width: 100%;
        height: 50px;
        border: none;
        border-bottom: 2px solid #e9e9e9;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        background: transparent;
      }
    }
  }
}
</style>
