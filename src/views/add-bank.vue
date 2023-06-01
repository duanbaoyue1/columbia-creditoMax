<template>
  <div class="add-bank content-area">
    <template v-if="from != 'mine'">
      <div class="step">
        <complete-step :actionIndex="3"></complete-step>
      </div>
    </template>
    <div class="edit-area">
      <div class="line-item select-bank" @click="openSelect = true">
        <div class="label">Forma de pago</div>
        <input v-model="editData.accountNumberConfirm" disabled placeholder="Por favor, elija" />
        <m-icon class="right" type="creditomax/黑下" :width="14" :height="12" />
      </div>
      <!-- <div class="line-item">
        <div class="label">
          <span>IFSC Code</span>
          <span class="color-red" @click="showIfsc = true">Dont't remember your IFSC?</span>
        </div>
        <input v-model="editData.ifsc" autocomplete="off" maxlength="11" onKeyUp="value=value.replace(/[\W]/g,'')" placeholder="Please enter IFSC code" />
      </div> -->
      <div class="line-item">
        <div class="label">Número de cuenta rec</div>
        <input oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" type="number" maxlength="20" v-model="editData.accountNumber" placeholder="Por favor escribe" />
      </div>
      <div class="line-item">
        <div class="label">Nombre del beneficia</div>
        <input v-model="userInfo.panName" disabled placeholder="Please enter your name" />
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
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>
    <!-- <van-action-sheet v-model="showIfsc" title="Select Your IFSC" close-on-click-action>
      <div class="pop-content">
        <ifsc-select @complete="completeIfsc" />
      </div>
    </van-action-sheet> -->

    <van-action-sheet v-model="openSelect" title="Forma de pago" close-on-click-action>
      <van-picker :columns="banks" @confirm="onConfirm" @cancel="onCancel" :item-height="75" @change="onChange">
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
    </van-action-sheet>

    <!-- <van-action-sheet v-model="openSelect" title="Forma de pago" close-on-click-action>
      <div class="pop-content">
        <div class="items">
          <div class="item" v-for="item in ALL_ATTRS.MARITAL_STATUS" :class="{ active: item.value == value }" @click="chooseValue(item)">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </van-action-sheet> -->
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
        this.canSubmit = Object.values(this.editData).length >= 3;
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
  },
  data() {
    return {
      ALL_ATTRS: ALL_ATTRS,
      openSelect: false,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {
        ifsc: '',
      },
      banks: [
        { text: 'Nequi', value: '18', recommend: true, desc: 'Llegada en 24 horas' },
        { text: 'Bancolombia', value: '0', desc: 'Llegada en 24 horas' },
        { text: 'Daviplata', value: '19' },
        { text: 'Davivienda', value: '2' },
        { text: 'Banco de Bogota', value: '1' },
        { text: 'BBVA', value: '3' },
        { text: 'Banco de Occidente', value: '4' },
        { text: 'Colpatria', value: '5' },
        { text: 'Banco popular', value: '6' },
        { text: 'Banco Agrario', value: '8' },
        { text: 'Citibank', value: '11' },
        { text: 'Banco AV Villas', value: '12' },
        { text: 'Banco Pichincha', value: '14' },
        { text: 'Bancoomeva', value: '15' },
        { text: 'Banco Santander de Negocios Colombia S.A.', value: '16' },
        { text: 'Banco Falabella', value: '17' },
        { text: 'Banco Itaú', value: '21' },
        { text: 'BANCO GNB SUDAMERIS', value: '1012' },
        { text: 'BANCOLDEX S.A.s', value: '1031' },
        { text: 'BANCO CAJA SOCIAL', value: '1032' },
        { text: 'BANCO MUNDO MUJER', value: '1047' },
        { text: 'BANCO W S.A.', value: '1053' },
        { text: 'BANCAMIA S.A.', value: '1059' },
        { text: 'BANCO FINANDINA S.A.', value: '1063' },
        { text: 'BANCO COOPERATIVO COOPCENTRAL', value: '1066' },
        { text: 'MIBANCO S.A.', value: '1067' },
        { text: 'BANCO SERFINANZA', value: '1069' },
        { text: 'LULO BANK', value: '1070' },
        { text: 'BANCO J.P. MORGAN COLOMBIA S.A.', value: '1071' },
        { text: 'ASOPAGOS S.A.S', value: '1086' },
        { text: 'DALE', value: '1097' },
        { text: 'FINANCIERA JURISCOOP S.A. COMPAÑIA DEFINANCIAMIENTO', value: '1121' },
        { text: 'RAPPIPAY DAVIPLATA', value: '1151' },
        { text: 'CFA COOPERATIVA FINANCIERA', value: '1283' },
        { text: 'JFK COOPERATIVA FINANCIERA', value: '1286' },
        { text: 'COTRAFA', value: '1289' },
        { text: 'COOFINEP COOPERATIVA FINANCIERA', value: '1291' },
        { text: 'CONFIAR COOPERATIVA FINANCIERA', value: '1292' },
        { text: 'BANCO UNION S.A', value: '1303' },
        { text: 'COLTEFINANCIERA', value: '1370' },
        { text: 'BANCO CREDIFINANCIERA SA.', value: '1558' },
        { text: 'IRIS', value: '1637' },
        { text: 'MOVII S.A.', value: '1801' },
        { text: 'DING TECNIPAGOS SA', value: '1802' },
        { text: 'UALA', value: '1804' },
        { text: 'BANCO BTG PACTUAL', value: '1805' },
        { text: 'RAPPIPAY', value: '1811' },
        { text: 'ITAU antes Corpbanca', value: '5600065' },
      ],
      saving: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);
  },

  methods: {
    onConfirm() {},
    onChange(picker, value, index) {
      console.log(value, index);
    },
    onCancel() {},
    chooseValue() {},
    completeIfsc(data) {
      this.editData.ifsc = data.choosedIfsc;
      this.showIfsc = false;
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('bank_add_submit');
        if (this.editData.accountNumber != this.editData.accountNumberConfirm) {
          this.$toast('Account number is not consistent');
          return;
        }
        let saveData = { ...this.editData };
        saveData.name = this.userInfo.panName;
        delete saveData.accountNumberConfirm;

        if (saveData.ifsc.length != 11) {
          this.$toast('Please enter correct IFSC');
          return;
        }
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
      transition: all .3s;
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
      margin-top: 23px;
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
