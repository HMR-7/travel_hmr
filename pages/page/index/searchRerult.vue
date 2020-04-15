<template>
  <view>搜索结果</view>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    let searchKey = uni.getStorageSync("searchKey");
    console.log(searchKey);
  },
  onload(options) {
    let t = this;
    console.log(options);
  }
};
</script>

<style lang='less'>
</style>