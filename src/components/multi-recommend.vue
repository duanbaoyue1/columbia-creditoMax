<template>
  <div class="multi-recommend">
    <div class="order-items">
      <div class="order-item" :class="{active: !order.unChecked}" v-for="(order, index) in list" :key="order.id" @click="checkLoan(index)">
        <div class="reloan" v-if="order.isReloan">reloan</div>
        <div class="status">
          <m-icon class="icon" :type="order.unChecked ? 'creditomax/多推未选中' : 'creditomax/多推选中'" :width="24" :height="24" />
          {{ order.productName }}
        </div>
        <div class="info">
          <img :src="order.productImgUrl" />
          <div class="name">
            <div>
              <span class="label">Compañía de préstamo:</span>
              {{ order.companyName }}
            </div>
            <div>
              <span class="label">Tasa de interés:</span>
              {{ order.interest }}% / Day
            </div>
          </div>
        </div>
        <div class="action">
          <span class="label">Monto del préstamo</span>
          <span class="number">
            <span class="fs-12">$</span>
            {{ order.minAmount }}
          </span>
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
      // if (this.checkedNums == 1 && !this.loans[index].unChecked) return;
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
  right: 0;
  bottom: 0;
  margin-bottom: 88px;

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
      background: linear-gradient(180deg, #696FFB 0%, #434AF9 100%);;
      box-shadow: 0px 4px 10px 0px rgba(67,74,249,0.4), inset 0px 1px 4px 0px #434AF9;;
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
        border: 2px solid #434AF9;
      }
      .action {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label {
          font-size: 16px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #999999;
          line-height: 24px;
        }
        .number {
          font-size: 24px;
          font-family: DINAlternate-Bold, DINAlternate;
          font-weight: bold;
          color: #333333;
          line-height: 24px;
        }
      }

      .reloan {
        position: absolute;
        width: 52px;
        height: 16px;
        border-radius: 8px;
        border: 1px solid #ffbd5c;
        top: 21px;
        right: 16px;
        font-size: 10px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #ffbd5c;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
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
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 16px;
        margin-bottom: 15px;
        img {
          display: block;
          width: 50px;
          height: 50px;
          margin-right: 16px;
        }
        .name {
          font-size: 14px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #333333;
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
