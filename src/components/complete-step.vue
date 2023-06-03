<template>
  <div class="complete-step">
    <div class="step" v-for="(step, index) in steps" :class="{ active: actionIndex >= index, last: index == steps.length - 1 }">
      <div class="stat-img-wrapper">
        <img class="stat-img" :src="actionIndex >= index ? step.activeImg : step.noActiveImg" />
      </div>
      <div class="red-bot" :class="actionIndex >= index ? 'active' : ''">
        <!-- <img :src="actionIndex >= index ? require('@/assets/img/handy/进度条点亮.png') : require('@/assets/img/handy/进度条未点亮.png')" /> -->
      </div>
      <div class="text">{{ step.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['actionIndex'],
  data() {
    return {
      steps: [
        {
          text: '$500,000',
          activeImg: require('@/assets/img/creditomax/金币1点亮.png'),
          noActiveImg: require('@/assets/img/creditomax/金币1点亮.png'),
        },
        {
          text: '$1,000,000',
          activeImg: require('@/assets/img/creditomax/金币2点亮.png'),
          noActiveImg: require('@/assets/img/creditomax/金币2未点亮.png'),
        },
        {
          text: '$1,500,000',
          activeImg: require('@/assets/img/creditomax/金币3点亮.png'),
          noActiveImg: require('@/assets/img/creditomax/金币3未点亮.png'),
        },
        {
          text: '$2,000,000',
          activeImg: require('@/assets/img/creditomax/金币4未点亮.png'),
          noActiveImg: require('@/assets/img/creditomax/金币4未点亮.png'),
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.complete-step {
  display: flex;
  justify-content: center;
  width: 100%;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
    font-size: 12px;
    font-family: Roboto-Medium, Roboto;
    font-weight: 500;
    line-height: 16px;
    position: relative;
    &::before {
      position: absolute;
      width: 72px;
      height: 4px;
      background: #e3e3e3;
      content: ' ';
      top: 53px;
      left: -36px;
      z-index: 0;
    }

    &:first-child {
      &::before {
        content: '';
        display: none;
      }
    }

    &.active {
      &::before {
        background: #434af9 !important;
      }
      .red-bot {
        background: #434af9;
        outline: 3px solid #b3b6fc;
      }
    }

    &.last {
      .red-bot {
        background: #e3e3e3 !important;
        outline: none !important;
      }
      .text {
        color: #999999 !important;
      }
    }

    .stat-img-wrapper {
      height: 50px;
      display: flex;
      align-items: center;
    }

    .red-bot {
      margin-bottom: 13px;
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background: #e3e3e3;
      z-index: 1;
      img {
        width: 10px;
        display: block;
      }
    }
    .text {
      color: #999999;
    }
    &.active {
      .text {
        color: #434af9;
      }
      &::before {
        background: #434af9;
      }
    }
  }
}
</style>
