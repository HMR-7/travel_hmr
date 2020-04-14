<template>
  <view class="content">
    <!-- 轮播图 -->
    <swiper
      class="img-container"
      indicator-dots="true"
      indicator-color="var(--detailColor)"
      indicator-active-color="var(--themeColor)"
      circular
      autoplay
    >
      <block v-for="(item, index) in imgArr" :key="index">
        <swiper-item class="item">
          <!-- <view class="swiper_title">{{item.title}}</view> -->
          <image
            class="itemImg"
            :class="{active:currentIndex==index}"
            :src="item"
            @tap="previewImage(item)"
          />
        </swiper-item>
      </block>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      good_id: "", //景点id
      imgArr: "" //轮播图
    };
  },
  created() {},
  onLoad(options) {
    let t = this;
    console.log(options.id);
    t.good_id = options.id;
    let data = {
      good_id: options.id
    };
    t.$utils.ajax(t.$api.getSwiper, "get", data, res => {
      console.log(res);
      t.imgArr = res;
    });
  },
  methods: {}
};
</script>

<style lang="less">
.content {
  width: 100%;
  min-height: 100vh;
  background-color: var(--contentBgc);
  /* 轮播图 */
  .img-container {
    height: 400rpx;
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    .item {
      height: 100%;
      .itemImg {
        width: 100%;
        height: 100%;
        /* z-index: 5; */
      }
    }
  }
}
</style>