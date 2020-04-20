<template>
  <view class="content">
    <!-- 搜索成功到商品展示列表 -->
    <view :class="imgShow==0?'list':'list listImg'" v-if="isShow == 1">
      <view class="list_show">
        <!-- 信息展示模块 -->
        <view class="goods" v-for="(item,index) in goodsList" :key="index">
          <view class="top" @tap="toDetail(item.id)">
            <image :src="item.src" />
          </view>
          <view class="bottom">
            <view class="title">{{item.good_name}}</view>
            <view class="introduce">{{item.introduce}}</view>
            <view class="price">
              <text>成人：{{item.good_price}}/元起</text>
              <text>儿童：{{item.childTicket}}/元起</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 搜索成功但是数据库无内容时到现实内容 -->
    <view class="nolist" v-if="isShow==0">
      <view class="iconfont icon-aidongman"></view>
      <span style="font-size:40rpx;font-weight:bolder">非常抱歉，暂无您需要的信息</span>
      <navigator url="./index" redirect hover-class="className">再去看看</navigator>
      <!-- <view class="goOut"></view> -->
    </view>
    <!-- 搜索过渡现实页面 -->
    <view class="loading" v-if="isShow==-1">
      <van-loading color="#0ea391" size="50" vertical>正在为您查询...</van-loading>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      queryData: "", //搜索关键词
      isShow: -1, //是否处于过渡状态
      imgShow: 0,
      goodsList: [], //搜索结果
      page: 1 //查询列表页数
    };
  },
  onPullDownRefresh() {
    uni.hideLoading();
    let t = this;
    t.page = 1;
    t.imgResTag = [];
    t.goodsList = [];
    // t.tagsList();
    t.getCateGoodList();
    uni.stopPullDownRefresh();
  },
  /* 触底判断加载下一页 */
  onReachBottom(options) {
    let t = this,
      goodsList = t.goodsList;
    /* 判断是否加载下一页 */
    if (goodsList.length < 8) {
      console.log(111);
      return;
    } else if (goodsList.length >= 8) {
      t.page++;
      t.getCateGoodList();
    }
  },
  created() {},
  onLoad(options) {
    let t = this;
    console.log(options, "oprions");
    t.queryData = options;
    console.log(options);
    t.getCateGoodList();
  },
  methods: {
    /* 获取关键词搜索列表 */
    getCateGoodList() {
      let t = this,
        list = t.goodsList,
        page = t.page,
        queryData = t.queryData;
      if (queryData.keyword) {
        t.imgShow = 0;
        let data = {
          page: page,
          limit: 8,
          keyword: queryData.keyword
        };
        t.$utils.ajax(t.$api.getKeyWordSearchList, "get", data, res => {
          /* 数组拼接 */
          list = list.concat(res);
          console.log(list, "关键字搜索商品列表");
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
          if (list.length > 0) {
            t.isShow = 1;
            t.goodsList = list;
          } else {
            t.isShow = 0;

            t.goodsList = list;
          }
        });
        return;
      }
    },
    /* 查看景点详情 */
    toDetail(good_id, good_name) {
      console.log(good_id, "景点id");
      setTimeout(() => {
        uni.navigateTo({
          url: "../index/detail?id=" + good_id + "&&name=" + good_name
        });
      }, 150);
    }
  }
};
</script>

<style lang='less'>
.content {
  display: flex;
  flex-direction: column;
  flex-direction: space-betwwen;
  flex-wrap: wrap;
  width: 100%;
  min-height: 100vh;

  .list {
    width: 100%;
    margin-top: 20rpx;
    .list_show {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .goods {
        width: 44%;
        height: 100%;
        font-size: 28upx;
        margin: 10rpx 0 0 30rpx;
        background-color: #fff;
        .top {
          width: 100%;
          height: 300rpx;
          height: calc(100vh / 5);
          image {
            width: 100%;
            height: 100%;
            border-radius: 20rpx;
          }
        }
        .bottom {
          display: flex;
          flex-direction: column;
          height: 130rpx;
          padding-bottom: 20rpx;
          .tags {
            border: 2rpx solid #0ea391;
          }
          .title {
            display: -webkit-box;
            width: 95%;
            margin: 10rpx;
            overflow: hidden;
            white-space: pre-wrap;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            font-size: 30rpx;
            font-weight: bolder;
            -webkit-box-orient: vertical;
          }
          .introduce {
            padding-left: 10rpx;
            padding-bottom: 10rpx;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
            width: 95%;
            color: var(--remarksFontColor);
            font-size: 20rpx;
          }
          .price {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin-left: 10rpx;
            color: var(--priceColor);
            font-size: var(--smallFontSize);
            font-weight: bolder;
          }
        }
      }
    }

    /* background-color: #f8f8f8; */
  }
  .listImg {
    width: 100%;
    margin-top: 350rpx;
  }
  /* 查无结果 */
  .noList {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    .iconfont {
      color: var(--themeColor);
      font-size: 200rpx;
    }
    .goOut {
      margin-top: 20rpx;
      margin-bottom: 500rpx;
      width: 240rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #636773;
      font-size: 32upx;
      font-weight: bolder;
      border: 3rpx solid #c7c7d5;
      background-color: #fff;
    }
  }
  .loading {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 500rpx);
    font-weight: bolder;
  }
}

.check_img {
  position: fixed;
  margin: 0 auto;
  width: 100%;
  height: 300rpx;
  top: 49rpx;
  background: rgba(0, 0, 0, 0.2);
}
.check_img image {
  width: 240rpx;
  height: 240rpx;
  padding-left: calc(50% - 100rpx);
  padding-top: 30rpx;
}
</style>