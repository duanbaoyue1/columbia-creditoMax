<template>
  <div class="password content-area">
    <div class="edit-area">
      <div class="line-item">
        <div class="label">Número de teléfono</div>
        <input v-model="userInfo.mobile" disabled />
      </div>
      <div class="line-item">
        <div class="label">Nueva contraseña</div>
        <input v-model="editData.passwd" placeholder="Introduzca una nueva contraseña" :type="passwordType" />
        <m-icon class="eye" :type="passwordType != 'text' ? 'password/eye-hide' : 'password/eye-show'" :width="32" :height="20" @click="togglePassword('passwordType')" />
      </div>

      <div class="line-item">
        <div class="label">Confirmar contraseña</div>
        <input v-model="editData.passwordAgain" placeholder="Introduzca de nuevo la contraseña" :type="passwordAgainType" />
        <m-icon class="eye" :type="passwordAgainType != 'text' ? 'password/eye-hide' : 'password/eye-show'" :width="32" :height="20" @click="togglePassword('passwordAgainType')" />
      </div>
    </div>
    <div class="submit">
      <button class="bottom-submit-btn" :disabled="!canSubmit" @click="submit">Enviar</button>
    </div>

    <div class="submit-success" v-show="submitSuccess">
      <span>
        Congratulations!
        <br />
        Your personal information has been verified
      </span>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
export default {
  watch: {
    editData: {
      handler() {
        this.canSubmit = Object.values(this.editData).filter(t => !!t).length === 2 && this.editData.passwd.length >= 6;
      },
      deep: true,
    },
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Crear una contraseña',
    });
  },
  data() {
    return {
      canSubmit: false, // 是否可以提交
      submitSuccess: false,
      passwordType: 'text',
      passwordAgainType: 'text',
      editData: {
        passwd: '',
        passwordAgain: '',
      },
    };
  },

  mounted() {
    setTimeout(() => {
      this.getUserInfo();
    }, 200);

    [...document.getElementsByClassName('eye')].forEach(t => {
      t.addEventListener('click', handler => {
        let $input = handler.target.previousSibling;
        let type = $input.getAttribute('type');
        if (type == 'password') {
          $input.setAttribute('type', 'text');
        } else {
          $input.setAttribute('type', 'password');
        }
      });
    });
  },

  methods: {
    togglePassword(field) {
      this.$set(this, field, this[field] == 'password' ? 'text' : 'password');
    },

    async submit() {
      this.showLoading();
      if (this.editData.passwd !== this.editData.passwordAgain) {
        this.$toast('The two passwords are inconsistent');
        return;
      }
      try {
        let res = await this.$http.post(`/api/user/createPassword`, { passwd: md5(this.editData.passwd) });
        if (res.returnCode == 2000) {
          this.submitSuccess = true;
          this.updateToken({ token: res.data.token });
          this.toAppMethod('updateUser', res.data);
          this.$toast('success');
          setTimeout(() => {
            this.goHome();
          }, 1000);
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
.password {
  padding: 24px;
  padding-top: 8px;
  padding-bottom: 110px;

  .submit-success {
    position: fixed;
    z-index: 222;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    display: none;
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
  }
  .edit-area {
    .line-item {
      margin-bottom: 20px;
      font-size: 14px;
      position: relative;
      border-bottom: 2px solid #e9e9e9;
      .label {
        font-size: 16px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #333333;
        line-height: 20px;
        margin-top: 23px;
        margin-bottom: 16px;
      }
      input {
        width: 100%;
        font-size: 14px;
        color: #333333;
        box-sizing: border-box;
        border: none;
        margin-bottom: 14px;
        background: transparent;
      }
      .eye {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
