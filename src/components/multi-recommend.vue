<template>
  <div class="multi-recommend">
    <div class="order-items">
      <div class="order-item" :class="{ active: !order.unChecked }" v-for="(order, index) in list" :key="order.id" @click="checkLoan(index)">
        <div class="reloan" v-if="order.isReloan">Volver a prestar</div>
        <div class="status">
          <m-icon class="icon" :type="order.unChecked ? 'creditomax/多推未选中' : 'creditomax/多推选中'" :width="24" :height="24" />
          {{ order.productName }}
        </div>
        <div class="info">
          <img :src="order.productImgUrl" />
          <div class="name">
            <div>
              <span class="label">Monto del préstamo:</span>
              <span class="fs-18 color-money">
                <span class="fs-12">$&nbsp;</span>
                <strong>{{ order.minAmount | formatMonex }}</strong>
              </span>
            </div>
            <div>
              <span class="label">Tasa de interés:</span>
              {{ order.interest }}% / Day
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="select-all" @click="selectAll">
      <button>Seleccionar todo</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    checkLoan(index) {
      let checkedNums = this.list.filter(t => !t.unChecked).length;
      if (checkedNums == 1 && !this.list[index].unChecked) return;
      this.$set(this.list, index, { ...this.list[index], unChecked: !this.list[index].unChecked });
      this.updateHome();
    },

    selectAll() {
      for (let index = 0; index < this.list.length; index++) {
        this.$set(this.list, index, { ...this.list[index], unChecked: false });
      }
      this.updateHome();
    },

    updateHome() {
      this.$emit(
        'update',
        this.list.filter(t => !t.unChecked)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-recommend {
  width: 375px;
  background: #f6f6f6;
  box-sizing: border-box;
  position: absolute;
  top: 52px;
  left: 0;
  font-family: Helvetica-Bold, Helvetica;
  right: 0;
  bottom: 0;
  margin-bottom: 88px;

  .color-money {
    color: #434af9;
    font-family: DINAlternate-Bold, DINAlternate;
  }
  .select-all {
    width: 375px;
    height: 88px;
    background: #ffffff;
    box-shadow: 0px -2px 16px 0px rgba(0, 0, 0, 0.08);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 327px;
      height: 48px;
      background: linear-gradient(180deg, #696ffb 0%, #434af9 100%);
      box-shadow: 0px 4px 10px 0px rgba(67, 74, 249, 0.4), inset 0px 1px 4px 0px #434af9;
      border-radius: 24px;
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
    }
  }

  .order-items {
    height: 100%;
    overflow-y: scroll;
    .order-item {
      position: relative;
      padding: 16px;
      margin: 16px 24px;
      background: #fff;
      border-radius: 14px;
      border: 2px solid #fff;
      &.active {
        border: 2px solid #434af9;
      }

      .reloan {
        position: absolute;
        height: 16px;
        border-radius: 8px;
        border: 1px solid #ffbd5c;
        top: 21px;
        right: 16px;
        font-size: 10px;
        font-weight: 500;
        color: #ffbd5c;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 4px;
        padding-right: 4px;
      }
      .status {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 16px;
        .icon {
          margin-right: 16px;
        }
      }

      .info {
        display: flex;
        img {
          display: block;
          width: 50px;
          height: 50px;
          margin-right: 16px;
        }
        .name {
          font-size: 14px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 500;
          color: #000;
          line-height: 20px;

          .label {
            font-size: 10px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
            margin-right: 8px;
          }
          > div {
            &:first-child {
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
