<template>
  <view class="content">
    <van-swipe-cell
      v-for="(item,index) in collectList"
      :key="index"
      async-close
      @close="cancelCollect($event,item.id)"
    >
      <van-cell-group>
        <van-cell class="a" title="单元格" value="内容">
          <view class="list_shop" @click="toBuy(item.id)">
            <view class="shop_details">
              <!-- <view class="goods_image" :style="{backgroundImage:'url(' + item.src + ')'}"> -->
              <view class="goods_image">
                <image :src="item.src" mode="modeFix" />
              </view>
              <!-- </view> -->
              <view class="goods_meg">
                <view class="title">{{item.good_name}}</view>
                <text
                  selectable="true"
                  class="goods_num"
                  v-if="item.address!=undefined"
                >景点地址:{{item.address}}</text>
                <text class="goods_num" v-if="item.address==undefined">暂无地址信息</text>
                <view class="goods_meg_bottom">
                  <view
                    class="prize"
                    style="color:var(--priceColor);font-size:var(--priceSize); font-weight:bolder;"
                  >￥{{item.good_price}}元/起</view>
                  <!-- <view class="goShop">详情</view> -->
                </view>
              </view>
            </view>
            <!-- <view class="line"></view> -->
            <!-- <view class="line_2"></view> -->

            <!-- <view class="line">111</view> -->
          </view>
        </van-cell>
      </van-cell-group>
    </van-swipe-cell>
  </view>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      collectList: [],
      user_id: ""
    };
  },
  /* 触底判断加载下一页 */
  onReachBottom(options) {
    let t = this,
      goodsList = t.goodsList;
    /* 判断是否加载下一页 */
    if (goodsList.length < 5) {
      t.$utils.showToast("没有更多了");
      console.log(111);
      return;
    } else if (goodsList.length >= 5) {
      t.page++;
      t.getCollectList();
    }
  },
  onShow() {},

  onLoad() {
    let t = this,
      user_id = uni.getStorageSync("UserId");
    if (!user_id) {
      t.$utils.checkLogin();
      return;
    } else {
      t.user_id = user_id;
      t.getCollectList();

      //   t.openid = us.openid;
      //   t.sign = us.sign;
    }
    console.log(t.user_id, "用户id");
  },

  methods: {
    getCollectList() {
      let t = this,
        list = t.collectList,
        page = t.page;
      list = t.collectList;
      let data = {
        user_id: t.user_id,
        page: page,
        limit: 5
      };
      t.$utils.ajax(t.$page.getCollectList, "get", data, res => {
        t.goodsList = res;
        list = list.concat(res);
        console.log(list, "收藏商品列表");
        if (list.length == 0 && page == 1) {
          console.log(111);
        }
        if (list.length == 0 && page > 1) {
          t.$utils.showToast("没有更多了");
        } else {
        }
        t.collectList = list;
      });
    },
   
    toBuy(good_id) {
      console.log(good_id, "商品id");
      uni.navigateTo({
        url: "../index/detail?id=" + good_id,
        success: function(res) {
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });
    }
  }
};
</script>

<style lang="less">
.content {
  padding-top: 20rpx;
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;

  .list_shop {
    margin-left: 20rpx;
    background-color: #f8f8f8;
    .shop_details {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 20rpx;
      background-color: #fff;
      .goods_image {
        width: 200rpx;
        height: 200rpx;
        image {
          width: 100%;
          height: 100%;
          border-radius: 10rpx;
        }
      }
      .goods_meg {
        width: 70%;
        line-height: 67rpx;
        margin-left: 15rpx;
        margin-bottom: 20rpx;
        border-bottom: 4rpx solid red;
        border-bottom-color: var(--lineColor);
        .title {
          width: 400rpx;
          font-size: var(--titleSize);
          font-weight: bolder;
          height: 60rpx;
          line-height: 60rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: var(--themeColor);
          /*兼容性*/
          /* -webkit-text-overflow: ellipsis; */
        }
        .goods_num {
          color: #7a7e83;
          font-size: 22upx;
          height: 50rpx;
          line-height: 50rpx;
          margin-top: 10rpx;
        }
        .goods_meg_bottom {
          padding-bottom: 20rpx;
          display: flex;
          flex-direction: row;
          margin-top: 10rpx;
          justify-content: space-between;
          .goShop {
            font-size: 32upx;
            /* font-weight: bold; */
            color: #ffffff;
            width: 160rpx;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            margin-right: 15rpx;
            background-color: var(--themeColor);
          }
        }
      }
    }
  }
}
</style>