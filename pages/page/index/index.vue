<template>
  <view class="content">
    <view style="position:fixed;top:0;width:100%;background-color: #ffffff;z-index:100;">
      <!-- 搜索 -->
      <view class="search">
        <view class="find" style="color:red">
          <view
            @tap="toSearch"
            class="iconfont icon-sousuo"
            style="color:var(--detailColor);float:lef;line-height:54rpx; text-algin:center; margin-left:20rpx; font-size:36upx;width: 100%;"
          >
            <text style="font-size:28rpx;padding-left:10rpx;">景区、美食、酒店</text>
          </view>
          <span
            @tap="photoSearch"
            class="iconfont icon-paizhao"
            style="color:var(--nodeColor);font-size:50rpx;margin-right:20rpx; float:right;z-index:100000"
            v-if="userId&&is_image_search"
          ></span>
        </view>
        <view class="allClass" style="color:#fff;text-align:center">
          <view style="font-size:24rpx;font-weight:bolder">搜索</view>
        </view>
      </view>
    </view>
    <view class="listContent" style="padding-top:100rpx">
      <view class="navList">
        <view class="nav" v-for="(item,index) in navList" :key="index">
          <view class="navImage">
            <img :src="item.src" alt />
          </view>
          <view class="navTitle">{{item.title}}</view>
        </view>
      </view>
      <!-- 商品列表 v-for-->
      <view class="list_head">- 热门推荐 -</view>
      <view class="list_shop">
        <view
          class="shop_details"
          v-for="(item,index) in goodsList"
          :key="index"
          @click="toDetail(item.id,item.good_name)"
        >
          <view class="goods_image">
            <image :src="item.src" mode="modeFix" />
          </view>
          <!-- </view> -->
          <view class="goods_meg">
            <view class="title" v-if="(item.good_name)!=null">{{item.good_name}}</view>
            <view class="title" v-if="(item.good_name)==null">暂无景点名称</view>
            <span selectable="true" class="goods_num">
              16:00前均可购买门票
              <!-- <text class="goods_num iconfont icon-fuzhi"></text> -->
            </span>
            <span selectable="true" class="goods_num" v-if="(item.good_price)==null">暂时商品货号</span>
            <view class="goods_meg_bottom">
              <view class="price">￥{{item.good_price}}元/起</view>
              <view class="goDetail">详情</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      navList: [
        { id: 1, title: "景点门票", src: "../../../static/images/jdmp.png" },
        { id: 2, title: "酒店住宿", src: "../../../static/images/jdzs.png" },
        { id: 3, title: "美食广场", src: "../../../static/images/msgc.png" },
        { id: 4, title: "旅游日志", src: "../../../static/images/lyrz.png" },
        { id: 5, title: "海滨浴场", src: "../../../static/images/hbyc.png" },
        { id: 6, title: "海洋馆", src: "../../../static/images/hyg.png" },
        { id: 7, title: "游乐园", src: "../../../static/images/yly.png" },
        { id: 8, title: "暑期推荐", src: "../../../static/images/sqtj.png" }
      ],
      goodsList: [], //列表推荐
      page: 1 //请求页数
    };
  },
  created() {
    let t = this;
  },
  onPullDownRefresh() {
    let t = this;
    t.page = 1;
    t.goodsList = [];
    t.getIndexGoodsList();
    uni.stopPullDownRefresh();
  },
  /* 触底判断加载下一页 */
  onReachBottom(options) {
    let t = this,
      goodsList = t.goodsList;
    /* 判断是否加载下一页 */
    if (goodsList.length < 5) {
      console.log(111);
      return;
    } else if (goodsList.length >= 5) {
      t.page++;
      t.getIndexGoodsList();
    }
  },

  onLoad() {
    let t = this;
    t.getIndexGoodsList();
    console.log(t.goodsList, "首页推荐列表");
    let time = t.test(t.getIndexGoodsList);
    console.log(time, "函数执行时间");
  },

  methods: {
    test(fn) {
      let start = new Date().getTime();
      console.log(start);
      fn();
      let end = new Date().getTime();
      console.log(end);
      return end - start + "ms";
    },
    /* 一键复制 */
    Copy(str) {
      let t = this;
      console.log(str);
      t.$utils.setClipboardData(str);
    },
    /* 热门推荐列表 */
    getIndexGoodsList() {
      let t = this,
        list = t.goodsList,
        page = t.page;
      let data = {
        page: page,
        limit: 5
      };
      // let data = {
      //   title: "景区"
      // };
      t.$utils.ajax(t.$api.detail, "get", data, res => {
        /* 数组拼接 */
        list = list.concat(res);
        console.log(list, "首页商品列表");
        if (list.length == 0 && page == 1) {
          console.log(111);
        }
        if (res.length == 0 && page > 1) {
          uni.showToast({
            title: "没有更多了",
            icon: "none",
            duration: 2000,

            success: () => {
              t.page--;
            }
          });
        } else {
        }
        t.goodsList = list;
      });
    },
    /* 查看景点详情 */
    toDetail(good_id, good_name) {
      console.log(good_id, "景点id");
      setTimeout(() => {
        uni.navigateTo({
          url: "../index/detail?id=" + good_id + "&&name=" + good_name
        });
      }, 150);
    },
    /* 前往搜索页面 */
    toSearch() {
      let t = this;
      uni.navigateTo({
        url: "./search"
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
  /* 搜索框 */
  .search {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 100rpx;
    box-sizing: border-box;
    background-color: var(--themeColor);
    .find {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      /* position: relative; */
      margin: auto 0;
      width: 86%;
      height: 60rpx;
      /* border: 3rpx solid #dd3333; */
      margin-left: 20rpx;
      background-color: #f5f5f9;
      clear: both;
    }
    /*  */
    .allClass {
      margin: auto 0;
      margin-right: 30rpx;
    }
  }

  /* 商品详情 */
  .listContent {
    /* 头部标签 */
    .navList {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      padding-top: 20rpx;
      background-color: #fff;
      box-sizing: border-box;
      .nav {
        flex: 25%;
        margin: 0 auto;
        margin-bottom: 2%;
        // border: 1px solid red;
        .navImage {
          margin: 0 auto;
          width: 80rpx;
          height: 80rpx;
          img {
            width: 100%;
            height: 100%;
            // border-radius: 100%;
          }
        }
        .navTitle {
          margin-top: 10rpx;
          text-align: center;
          color: #32312d;
          font-size: 18rpx;
        }
      }
    }
    /* 推荐头部 */
    .list_head {
      margin-top: 20rpx;
      width: 100%;
      text-align: center;
      color: #000;
      font-family: " FangSong";
      font-weight: bolder;
      box-sizing: border-box;
    }
    /* 推荐详情 */
    .list_shop {
      margin-top: 20rpx;
      margin-left: 15rpx;
      /* position: relative; */
      background-color: #f8f8f8;
      .shop_details {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        /* margin-bottom: 20rpx; */
        background-color: #fff;

        .goods_image {
          padding-top: 20rpx;
          width: 200rpx;
          height: 200rpx;
          image {
            width: 100%;
            height: 100%;
            border-radius: 10rpx;
          }
        }
        .goods_meg {
          margin-bottom: 20rpx;
          width: 70%;
          line-height: 70rpx;
          margin-left: 15rpx;
          border-bottom: 4rpx solid red;
          border-bottom-color: var(--lineColor);

          .title {
            width: 400rpx;
            /* margin: 10rpx; */
            /* margin-top: 10rpx; */
            font-size: var(--scenicTitleSize);
            font-weight: bolder;
            height: 60rpx;
            line-height: 60rpx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            /* color: #dd3333; */
            color: #000;
            /*兼容性*/
            /* -webkit-text-overflow: ellipsis; */
          }
          .goods_num {
            color: var(--detailColor);
            font-size: 22upx;
            /* width: 50rpx; */
            height: 50rpx;
            line-height: 50rpx;
            margin-top: 10rpx;
          }
          .goods_meg_bottom {
            display: flex;
            flex-direction: row;
            margin-top: 10rpx;
            justify-content: space-between;
            padding-bottom: 20rpx;

            .price {
              /* margin: 0 0 10rpx 10rpx; */
              color: var(--priceColor);
              /* color: gray; */
              font-size: var(--priceSize);
              font-weight: bolder;
            }
            .goDetail {
              font-size: 32upx;
              /* font-weight: bolder; */
              color: #ffffff;
              width: 120rpx;
              height: 60rpx;
              line-height: 60rpx;
              text-align: center;
              margin-right: 15rpx;
              /* background-color: #dd3333; */
              background-color: var(--themeColor);
            }
          }
        }
      }
    }
  }

  .goods {
    width: 44%;
    height: 100%;
    /* height: 350rpx; */
    /* margin: 0 auto; */
    font-size: 28upx;
    margin: 0 0% 4% 4%;
    background-color: #fff;
    /* border: 1rpx solid #ffffff; */
  }
  .goods .top {
    width: 100%;
    height: 300rpx;
  }
  .top image {
    width: 100%;
    height: 100%;
  }
  .goods .bottom {
    display: flex;
    flex-direction: column;
  }
}
</style>