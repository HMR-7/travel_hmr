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
    <!-- 景点简介部分 -->
    <view class="megs_box mar_bottom">
      <view class="header">
        <view class="title mar_bottom">
          <view>{{goodDetail.good_name}}</view>
          <view class="tags" v-for="(item,index) in goodDetail.tags" :key="index">
            <view>{{item}}</view>
          </view>
        </view>
        <!-- 商品收藏 -->
        <view
          :class="isCollect ==1?' icon-guanzhu1 icon_select-color':'icon-guanzhu2'"
          class="iconfont"
          style="font-size:40rpx;"
          @tap="handleCollect"
        ></view>
      </view>
      <view class="middle">
        <view class="price mar_bottom">{{goodDetail.introduce}}</view>
      </view>
      <view class="bottom">
        <view
          class="place mar_bottom"
          v-if="goodDetail.address==null"
          style="
        color: #7a7e83;
        "
        >所在地：暂无所在地信息</view>
        <view
          class="place mar_bottom"
          v-if="goodDetail.address!=null"
          style="
        color: #7a7e83;
        "
        >所在地：{{goodDetail.address}}</view>
        <view class="place mar_bottom" v-if="isCost!==0">门票价：{{goodDetail.good_price}}元/起</view>
        <!-- <view>销量0米</view>
        <view>剩余库存：10000米</view>-->
      </view>
    </view>
    <!-- 门票信息 -->
    <view class="TicketMegs">
      <view class="title">门票信息</view>
      <!-- 门票价格 -->
      <view class="TicketPrice">
        <view class="PriceTitle">
          成人票
          <view
            style="font-size:24rpx;font-weight:bolder;color: var(--priceColor); "
          >￥{{goodDetail.good_price}}元/起</view>
        </view>
      </view>
      <view class="TicketPrice">
        <view class="PriceTitle">
          儿童票
          <view
            style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
          >￥{{goodDetail.childTicket}}元/起</view>
        </view>
      </view>
      <!-- 详情咨询提示 -->
      <view class="selMorePrice">详情可到景区售票处询问</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      good_name: "", //景点名称
      good_id: "", //景点id
      goodDetail: "", //商品详情
      imgArr: "", //轮播图
      isCollect: "" //是否收藏
    };
  },
  created() {},
  onLoad(options) {
    let t = this;
    console.log(options);
    t.$utils.setAppTitile(options.name);
    t.good_name = options.name;
    let data = {
      good_id: options.id
    };
    t.$utils.ajax(t.$api.getSwiper, "get", data, res => {
      console.log(res);
      t.goodDetail = res;
      t.imgArr = res.swipeArr;
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
  .mar_bottom {
    margin-bottom: 20rpx;
  }
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
  /* 景点简介 */
  .megs_box {
    width: 100%;
    background-color: #fff;
    /* 景点名称 */
    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20rpx 20rpx 0 20rpx;
      box-sizing: border-box;
      .title {
        display: flex;
        flex-direction: row;
        font-size: var(--navFontSize);
        font-weight: bolder;
        .tags {
          margin: auto 0;
          view {
            margin-left: 10rpx;
            padding: 5rpx 20rpx;
            height: 20rpx;
            line-height: 20rpx;
            color: var(--themeColor);
            font-size: var(--stateBtnSize);
            border: 2rpx solid #0ea391;
            border-radius: 20rpx;
          }
        }
      }
    }
    .middle {
      width: 100%;
      .price {
        width: 500rpx;
        color: #7a7e83;

        font-size: var(--smallFontSize);
        font-weight: bolder;
        padding-left: 20rpx;
        box-sizing: border-box;
      }
    }
    .bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-right: 20rpx;
      font-size: 24upx;
      box-sizing: border-box;
      .place {
        padding-left: 20rpx;
        box-sizing: border-box;
      }
    }
  }
  /* 门票信息 */
  .TicketMegs {
    margin: 0 20rpx;
    border-radius: 20rpx;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    .title {
      padding: 30rpx 0 20rpx 20rpx;
      color: var(--themeColor);
      font-size: var(--titleSize);
      font-weight: bolder;
      border-bottom: 2rpx solid #ededed;
    }
    /* 门票价格样式 */
    .TicketPrice {
      font-size: var(--navFontSize);    
      height: 100rpx;
      line-height: 100rpx;
      .PriceTitle {
        margin: 0 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2rpx solid #ededed;
      }
    }
    /* 详情咨询提示 */
    .selMorePrice {
      height: 80rpx;
      line-height: 80rpx;
      color: #00a2ff;
      font-size: 26rpx;
      text-align: center;
    }
  }
  /* 旅游日志 */
}
</style>