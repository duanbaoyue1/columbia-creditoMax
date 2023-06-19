<template>
  <div class="google-feedback">
    <div class="google-feedback-content">
      <div class="tips">
        <img :src="require('@/assets/img/loan/tips-1.png')" />
      </div>
      <div class="title">What do you think about CreditoMax?</div>
      <div class="stars">
        <div class="star" v-for="(item, index) in stars">
          <img :src="curStar >= index + 1 ? require('@/assets/img/loan/star-solid.png') : require('@/assets/img/loan/star-none.png')" @click="toggleStar(index + 1)" />
        </div>
      </div>
      <div class="input-area">
        <div v-if="curStar >= 4">Five-star reviews can improve the passing rate!</div>
        <div v-else>
          <textarea maxlength="100" v-model="comments" @keyup="changeContent" placeholder="Please leave your feedback, we will read and feedback carefully!"></textarea>
        </div>
      </div>
      <div class="submit">
        <button @click="submit">{{ curStar > 3 ? 'TO GP post comments' : 'Submit' }}</button>
      </div>

      <m-icon class="close" type="close-round" :width="24" :height="24" @click="hide" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'son',
  data() {
    return {
      stars: [1, 2, 3, 4, 5],
      curStar: 5,
      comments: '',
    };
  },
  methods: {
    toggleStar(star) {
      this.curStar = star;
    },
    hide() {
      this.$emit('update:show', false);
    },
    changeContent() {
      if (this.comments.trim() == '') {
        this.comments = '';
      }
    },
    async submit() {
      if (this.curStar <= 3 && !this.comments.length) {
        this.$toast('Please enter comments or suggestions');
        return;
      }

      try {
        this.showLoading();
        let res = await this.$http.post(`/api/product/saveFavourableComment`, {
          grade: this.curStar,
          content: this.comments,
        });
        if (res.returnCode == 2000) {
          this.$toast('submit success!');
          if (this.curStar >= 4) {
            this.toAppMethod('goGoogleStore');
          }
          setTimeout(res => {
            this.$emit('update:show', false);
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
.google-feedback {
  position: fixed;
  z-index: 222;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);

  &-content {
    width: 320px;
    background: #ffffff;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .submit {
      button {
        margin: 20px 20px 20px;
        width: 280px;
        height: 48px;
        border-radius: 14px;
        font-size: 18px;
        font-weight: 900;
        background: #1143a4;
        color: #fff;
        line-height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        box-sizing: border-box;
        padding: 0;
        &:disabled {
          background: #e9e9e9;
          color: #999999;
        }
      }
    }

    .title {
      margin-top: 100px;
      font-size: 16px;
      font-weight: bold;
      color: #000000;
      line-height: 19px;
      text-align: center;
      margin-bottom: 30px;
    }
    .tips {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      img {
        width: 192px;
      }
    }
    .stars {
      display: flex;
      justify-content: center;
      margin-right: -20px;
      img {
        width: 32px;
        margin-right: 20px;
      }
    }
    .input-area {
      margin: 30px 20px 40px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 18px;
      text-align: center;
      textarea {
        width: 280px;
        height: 76px;
        border-radius: 14px;
        border: 1px solid #cccccc;
        padding: 20px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        line-height: 18px;
        text-align: left;
        box-sizing: border-box;
        font-family: Roboto-Regular, Roboto;
        word-break: break-word;
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
</style>
