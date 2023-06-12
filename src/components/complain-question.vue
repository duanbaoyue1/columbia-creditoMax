<template>
  <div class="complain-question" @click="clickArea">
    <div class="complain-question-content">
      <m-icon class="close" type="close" :width="15" :height="15" @click="hide" />
      <div class="head">Please select the type of question</div>
      <div class="select">
        <div v-for="question in questions" :key="question" @click="choose(question)">{{ question }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: ['Borrowing problems', 'Repayment problems', 'Reminder of repayment problems', 'Other questions'],
    };
  },
  methods: {
    hide() {
      this.$emit('update:show', false);
    },
    clickArea(e) {
      if (!e.target.closest('.complain-question-content')) {
        this.hide();
      }
    },
    choose(question) {
      this.hide();
      this.$emit('choose', question);
    },
  },
};
</script>

<style lang="scss" scoped>
.complain-question {
  position: fixed;
  z-index: 222;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);

  &-content {
    width: 360px;
    height: 336px;
    background: #ffffff;
    border-radius: 30px 30px 0px 0px;
    background: #ffffff;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 20px;
    box-sizing: border-box;
    .close {
      position: absolute;
      right: 20px;
      top: 20px;
    }
    .head {
      margin-top: 56px;
      font-size: 19px;
      font-weight: 500;
      color: #000000;
      line-height: 30px;
      margin-bottom: 40px;
    }
    .select {
      div {
        font-size: 16px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        margin-bottom: 30px;
        text-align: center;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
