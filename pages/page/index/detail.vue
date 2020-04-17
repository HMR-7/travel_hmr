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
          :class="isCollect ==1?' icon-guanzhu1 icon_select_color':'icon-guanzhu2'"
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
        <view
          class="place mar_bottom"
          v-if="isCost!==0"
          style="color:var(--priceColor)"
        >门票价：{{goodDetail.good_price}}元/起</view>
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
    <!-- 用户日志发布区域 -->
    <view class="travellog" v-if="log==1">
      <view class="title">旅游日志</view>
      <textarea
        class="sugs"
        placeholder-style="padding-left:20rpx"
        placeholder="请输入内容"
        maxlength="-1"
        @input="onInput"
      ></textarea>
      <view class="sumbit" @tap="confirm">提交</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isCollect: "", //是否被用户收藏
      log: 0, //判断是否是日志发布
      user_id: "", //用户id
      good_id: "", //景点id
      good_name: "", //景点名称
      goodDetail: "", //商品详情
      imgArr: "", //轮播图
      isCollect: "", //是否收藏
      suggests: null //用户日志到发表内容
    };
  },
  created() {
    let t = this;
    t.user_id = uni.getStorageSync("UserId");
  },
  onLoad(options) {
    let t = this;
    console.log(options);
    if (!options.log) {
    } else if (options.log == 1) {
      t.log = options.log;
      t.$utils.setAppTitile(options.good_name);
    }
    if (options.log == 0) {
      t.$utils.setAppTitile(options.name);
    } else {
      t.$utils.setAppTitile(options.name);
    }
    // t.good_name = options.name;
    t.good_id = options.id;
    t.getGoodDetail();
  },
  methods: {
    /* 获取商品详情 */
    getGoodDetail() {
      let t = this;
      let data = {
        user_id: t.user_id,
        good_id: t.good_id
      };
      t.$utils.ajax(t.$api.getSwiper, "get", data, res => {
        console.log(res);
        t.goodDetail = res[0];
        t.imgArr = res[0].swipeArr;
        t.isCollect = res[1].iscollect;
      });
    },
    /* 用户点击收藏 */
    handleCollect() {
      let t = this,
        good_id = t.good_id,
        user_id = t.user_id;
      console.log(good_id, "good_id");
      console.log(user_id, "user_id");

      if (!user_id) {
        t.$utils.checkLogin();
        return;
      }
      let data = {
        good_id: good_id,
        user_id: user_id
      };
      if (!user_id) {
        t.$utils.checkLogin();
        return;
      }
      t.$utils.ajax(t.$api.userCollect, "post", data, res => {
        console.log(res);
        if (res.flag == "yes") {
          t.isCollect = !t.isCollect;
        }
        if(t.isCollect){
          setTimeout(() => {
            t.$utils.showToast('收藏成功');
          }, 300);
        } else if(!t.isCollect){
          setTimeout(() => {
            t.$utils.showToast('已取消收藏');
          }, 300);
        }
      });
    },
    /* 轮播图点击预览 */
    previewImage(item) {
      let t = this,
        imgSrc = t.imgArr;
      uni.previewImage({
        urls: imgSrc
      });
    },
    /* 用户对日志内容 */
    onInput(e) {
      let t = this,
        user_id = t.userid;
      t.suggests = e.detail.value;
    },
    /* 日志提交点击事件 */
    confirm() {
      let t = this,
        user_id = t.user_id,
        good_id = t.goodDetail.id,
        article = t.suggests;
      if (article == null) {
        t.$utils.showToast("请确认您是否已输入内容");
        return;
      }
      console.log(user_id, "useriduseriduserid");
      let userInfo = uni.getStorageSync("userInfo");
      let data = {
        good_id: good_id,
        user_id: user_id,
        user_head: userInfo.avatarUrl,
        user_name: userInfo.nickName,
        article: article
      };
      t.$utils.ajax(t.$page.submitFeedback, "post", data, res => {
        console.log(res);
        t.$utils.showToast("发布成功，即将跳转到首页");
        setTimeout(() => {
          console.log(1111);

          uni.switchTab({
            url: "./index"
          });
        }, 1000);
      });
    }
  }
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
      /* 用户已收藏的显示图标 */
      .icon_select_color {
        color: #000;
      }
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
  /* 日志发表区域 */
  .travellog {
    margin: 20rpx 20rpx 0 20rpx;
    .title {
      padding: 30rpx 0 20rpx 20rpx;
      color: var(--themeColor);
      font-size: var(--titleSize);
      font-weight: bolder;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      border-bottom: 2rpx solid #ededed;
      background-color: #fff;
    }
    .sugs {
      margin-bottom: 40rpx;
      width: 100%;
      background-color: #fff;
      border-bottom: 2rpx solid #ededed;
    }
    .imgUp {
      margin: 0 auto;
      padding-left: 20rpx;
      // border: 4rpx solid red;
    }
    .sumbit {
      margin: 0 20rpx;
      height: 100rpx;
      line-height: 100rpx;
      color: white;
      font-size: 32upx;
      font-weight: bolder;
      text-align: center;
      border-radius: 50rpx;
      background-color: var(--themeColor);
    }
  }
}
</style>