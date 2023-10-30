<template>
  <div class="information content-area">
    <div class="step">
      <complete-step :actionIndex="0"></complete-step>
    </div>
    <div class="edit-area">
      <div class="line-item">
        <label>Estado civil</label>
        <select-item :items="ALL_ATTRS.MARITAL_STATUS" :defaultOpen="curOpenFields == 'marital'" title="Estado civil" itemAttrs="marital" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Formación académica</label>
        <select-item :items="ALL_ATTRS.EDUCATION" :defaultOpen="curOpenFields == 'education'" title="Formación académica" itemAttrs="education" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Ocupación</label>
        <select-item :items="ALL_ATTRS.OCCUPATION" :defaultOpen="curOpenFields == 'occupation'" title="Ocupación" itemAttrs="occupation" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Ingresos mensuales</label>
        <select-item :items="ALL_ATTRS.SALARY" :defaultOpen="curOpenFields == 'monthlyIncome'" title="Ingresos mensuales" itemAttrs="monthlyIncome" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Finalidad del préstamo</label>
        <select-item :items="ALL_ATTRS.LOAN_PURPOSE" :defaultOpen="curOpenFields == 'loanPurpose'" title="Finalidad del préstamo" itemAttrs="loanPurpose" @choose="chooseEditData" />
      </div>
      <div class="line-item">
        <label>Tipo de alojamiento</label>
        <select-item :items="ALL_ATTRS.ACCOMMODATION" :defaultOpen="curOpenFields == 'houseType'" title="Tipo de alojamiento" itemAttrs="houseType" @choose="chooseEditData" />
      </div>
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        ¡Enhorabuena!
        <br />
        Su información personal ha sido verificada
      </span>
    </div>
  </div>
</template>

<script>
import selectItem from '@/components/select-item';
import CompleteStep from '@/components/complete-step.vue';
import * as ALL_ATTRS from '@/config/typeConfig';
const ALL_FIELD = ['marital', 'education', 'occupation', 'monthlyIncome', 'loanPurpose', 'houseType'];
export default {
  components: {
    selectItem,
    CompleteStep,
  },
  data() {
    return {
      curOpenFields: '',
      ALL_ATTRS: ALL_ATTRS,
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      editData: {},
      saving: false,
      orderId: this.$route.query.orderId,
    };
  },

  created() {
    this.setTabBar({
      show: true,
      transparent: false,
      fixed: true,
      title: 'Información básica',
      backCallback: null,
    });
  },
  mounted() {
    this.setEventTrackStartTime();

    setTimeout(() => {
      this.curOpenFields = ALL_FIELD[0];
    }, 500);
    this.eventTracker('basic_access');
    this.initInfoBackControl();
  },
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).length == ALL_FIELD.length;
      },
      deep: true,
    },
  },
  methods: {
    chooseEditData(data) {
      this.$set(this.editData, data.attr, data.value);
      let index = ALL_FIELD.indexOf(data.attr);
      if (index == ALL_FIELD.length - 1) {
        this.curOpenFields = '';
      } else {
        this.curOpenFields = ALL_FIELD[index + 1];
      }
    },
    async submit() {
      if (this.saving) return;
      this.saving = true;
      try {
        this.eventTracker('basic_submit');
        let saveData = { ...this.editData };
        // if (!this.validateEmail(saveData.email)) {
        //   this.$toast('Please enter the correct email address.');
        //   return;
        // }
        let data = await this.$http.post(`/api/user/basicInfo/save`, saveData);
        if (data.returnCode == 2000) {
          this.eventTracker('basic_submit_success');
          this.submitSuccess = true;
          setTimeout(() => {
            this.submitSuccess = false;
            this.sendEventTrackData({ leaveBy: 1 });
            this.innerJump('contacts', { orderId: this.orderId }, true);
          }, 1000);
        }
      } catch (error) {
        this.eventTracker('basic_submit_error');
        this.$toast(error.message);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.information {
  padding: 20px 24px;
  padding-bottom: 110px;
  background: #f6f6f6;
  padding-top: 0;

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      width: 293px;
      height: 59px;
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
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
    padding-top: 10px;
    margin-bottom: 32px;
  }
  .edit-area {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 16px;
    .head {
      font-size: 14px;
      color: #000;
      line-height: 18px;
      margin-bottom: 10px;
    }

    .line-item {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #e3e3e3;
      height: 52px;
      &:last-child {
        border-bottom: none;
      }
      label {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 20px;
        flex-shrink: 0;
        margin-right: 10px;
      }
      input {
        width: 100%;
        height: 100%;
        border: none;
        text-align: right;
        padding: 0 0px;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
      }
    }
  }
}
</style>
