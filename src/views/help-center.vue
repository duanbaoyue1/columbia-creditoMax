<template>
  <div class="help-center content-area">
    <div class="hour-email">
      <div>
        <div class="head">Horario de trabajo</div>
        <div class="item">De lunes a viernes (de 9.00 a 19.00 horas)</div>
      </div>
      <div>
        <div class="head">Correo electrónico</div>
        <div class="item">{{ feedEmail }}</div>
      </div>
    </div>

    <div class="questions">
      <div v-for="(item, index) in questions" :key="item.desc" class="item" @click="showAnswer(index)">
        <div class="desc">
          <span>{{ item.desc }}</span>
          <m-icon class="icon" :class="{ open: item.showAnswer }" type="right" :width="8" :height="12" />
        </div>
        <div class="answer" v-show="item.showAnswer" v-html="item.answer"></div>
      </div>
    </div>

    <!-- <div class="actions">
      <a @click="goComplain">I have a problem to complain</a>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      feedEmail: 'handycash01@outlook.com',
      questions: [
        {
          desc: 'How do I apply for a loan?',
          answer: "You can download HandyCash from the GooglePlay, register with your mobile number and sign in to apply for a loan.",
        },
        {
          desc: 'How can I improve my application approval rate?',
          answer: '1. Ensure that the information you submit is true and accurate 2. Complete the authorization item authentication according to the prompts 3. Repay the loan on time and without overdue',
        },
        {
          desc: 'Why was my loan application rejected?',
          answer: 'We are very sorry, it means that your credit score is not enough and you have not met our vetting requirements for the time being. If necessary, we suggest you try to apply again at an interval of about 7 days.',
        },
        {
          desc: 'How long will it take for me to receive a release of funds after my application is successful?',
          answer: 'Usually you will receive the money within 1 hour, however, sometimes, banks have problems with delayed arrival of funds, but usually you will receive the money within 24 hours. If it takes longer than 24 hours, please contact customer service by email, providing your borrowing information and bank documents.',
        },
        {
          desc: 'Can I cancel my loan?',
          answer: "Loan cancellation is not supported if the loan application has entered the review process. If you have already received your loan, please make your repayments on time to avoid incurring late penalties.",
        },
        {
          desc: 'Why is my order not updated even though I have made repayments?',
          answer: 'This situation is caused by a number of reasons, which may be as follows:<br/>1. You have not filled in the utr number back after repayment or you have filled in the wrong utr number, please go to the app and submit the correct utr number<br/>2. You have submitted the correct utr number, but as you have just paid the repayment, the bank needs processing time, you can wait for 30 minutes and try to submit the utr again.<br/>3. Each time you make a repayment, please click the repayment button to get the latest repayment upi address and pay to that address. Please do not save the upi address for the next repayment as there is a possibility that the upi address has been frozen and so the order cannot be updated.<br/><br/>If the correct utr number has been submitted and it has been more than 12 hours and the order has still not been updated, please contact customer service by email with your borrowing details and a screenshot of your utr payment voucher.',
        },
      ],
    };
  },
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      title: 'Centro de ayuda',
    });
  },
  mounted() {
    setTimeout(async () => {
      try {
        let user = await this.getUserInfo();
        if (parseInt(user.id) % 2 == 1) {
          this.feedEmail = 'handycash03@outlook.com';
        }
      } catch (error) {}
    }, 200);
  },

  methods: {
    showAnswer(index) {
      this.$set(this.questions, index, { ...this.questions[index], showAnswer: !this.questions[index].showAnswer });
    },
    goComplain() {
      this.innerJump('complain-home');
    },
  },
};
</script>

<style lang="scss" scoped>
.help-center {
  padding-bottom: 24px;

  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    background: #fff;
    align-items: center;
    a {
      font-size: 14px;
      font-weight: 500;
      color: #1143a4;
      line-height: 18px;
      text-decoration: underline;
    }
  }

  .questions {
    background: #fff;
    padding: 16px 24px;
    .item {
      width: 320px;
      border-radius: 14px;
      box-sizing: border-box;
      font-size: 12px;
      margin-bottom: 20px;
      font-weight: 400;
      color: #999999;
      line-height: 16px;
      .desc {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        color: #000000;

        .icon {
          transition: all 0.3s;
          margin-top: 6px;
          &.open {
            transform: rotate(90deg);
          }
        }
      }
      .answer {
        padding-top: 10px;
      }
    }
  }

  .hour-email {
    background: #fff;
    padding: 16px;
    margin: 24px;
    border-radius: 8px;

    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .head {
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      flex-shrink: 0;
    }

    .item {
      flex-grow: 1;
      margin-left: 20px;
      height: 20px;
      box-sizing: border-box;
      border: none;
      font-size: 12px;
      font-weight: 900;
      width: 100%;
      color: #000000;
      text-align: right;
      line-height: 20px;
    }
  }
}
</style>
