<template>
  <van-nav-bar :class="{ transparent: tabBar.transparent, 'title-trans': !tabBar.black }" :fixed="tabBar.fixed" :title="tabBar.title" @click-left="onBack">
    <template #left>
      <m-icon class="left" v-if="!tabBar.black" type="creditomax/返回白" :width="16" :height="16" />
      <m-icon class="left" v-else type="creditomax/返回" :width="16" :height="16" />
    </template>
  </van-nav-bar>
</template>

<script>
export default {
  methods: {
    onBack() {
      if (this.tabBar.backCallback) {
        this.tabBar.backCallback();
        return;
      } else {
        if (['loan-confirm', 'loan-success-multi', 'order-list', 'complete-bank'].includes(this.$route.name)) {
          this.sendEventTrackData({});
        }
        if (['help-center', 'about', 'settings'].includes(this.$route.name)) {
          this.sendEventTrackData({ page: 'mine' });
        }
        this.goAppBack();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.left {
  margin-left: 5px;
}
</style>
