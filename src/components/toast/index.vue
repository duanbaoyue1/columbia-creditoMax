<template>
  <div class="toast" v-if="show">
    <div class="toast-center">
      {{ msg }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  color: #fff;
  font-size: 14px;
  opacity: 0.9;
  text-align: justify;
  word-break: break-all;
  word-wrap: break-word;
  z-index: 10000;
  &-center {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    max-width: 200px;
    padding: 10px;
    background: #333;
    word-break: break-word;
  }
}
</style>
