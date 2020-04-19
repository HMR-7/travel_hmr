<template>
  <view class="content">
    <!-- 搜索区域 -->
    <view class="search">
      <i
        class="iconfont icon-sousuo"
        style="line-height:60rpx;color:#8e8e92;padding-left:20rpx;font-size:40rpx; border-right:none;background-color: #f5f5f9;box-sizing:border-box;"
      ></i>
      <!-- <input class="toSee" type="text" placeholder="请输入关键字" /> -->
      <van-field
        v-if="log==0"
        focus
        :value="value"
        placeholder="请输入关键字"
        custom-style="margin-right:10rpx;width:560rpx;height:60rpx;background-color: #f5f5f9;padding:0;border-left:none;box-sizing:border-box;"
        @input="getSearchKey"
        @change="getThinkKey"
        @blur="isThinkArea = false"
      />
      <van-field
        v-if="log==1"
        focus
        :value="value"
        placeholder="请输入景区名称后撰写文章"
        custom-style="margin-right:10rpx;width:560rpx;height:60rpx;background-color: #f5f5f9;padding:0;border-left:none;box-sizing:border-box;"
        @input="getSearchKey"
        @change="getThinkKey"
        @blur="isThinkArea = false"
      />
      <view class="search_btn" @click="search" @tap="toStart(searchKey)">搜索</view>
    </view>
    <!-- 搜索联想词 -->
    <view class="searchList thinkArea" v-if="isThinkArea">
      <view class="list">
        <view
          v-for="(item,index) in thinkDetail"
          :key="index"
          @tap="handleThink(item.good_name)"
        >{{item.good_name}}</view>
      </view>
    </view>
    <!-- 历史记录 -->
    <view v-if="log==0" class="searchList" style="border-top:12rpx solid #f6f6f6">
      <view class="searchListTitle">
        <span>搜索历史</span>
        <span
          class="iconfont icon-delect1"
          style="float:right; color:#000000; font-size:32upx; font-weight:bolder;margin-right:20rpx;padding-left: 20rpx;"
          @tap="clearHistory"
        ></span>
      </view>
      <view class="list" v-if="log==0">
        <view v-for="(item,index) in history" :key="index" @tap="handleHistoryItem(item)">{{item}}</view>
      </view>
    </view>
    <!-- 商品列表 -->
    <view class="list_log" v-if="log==1">
      <view
        class="list_show"
        v-for="(item,index) in result_log"
        :key="index"
        @tap="toDetail(item.id,item.good_name)"
      >
        <!-- 信息展示模块 -->
        <view class="goods">
          <view class="top">
            <swiper
              class="img-container"
              indicator-dots="true"
              indicator-color="var(--detailColor)"
              indicator-active-color="var(--themeColor)"
              circular
              autoplay
            >
              <block v-for="(item1, index1) in item.swipeArr" :key="index1">
                <swiper-item class="item">
                  <!-- <view class="swiper_title">{{item.title}}</view> -->
                  <image class="itemImg" :class="{active:currentIndex==index}" :src="item1" />
                </swiper-item>
              </block>
            </swiper>
            <view class="bottom">
              <view class="title">{{item.good_name}}</view>
              <view class="price">{{item.introduce}}</view>
              <view class="price" style="margin-top:10rpx;color:#a2a2a2">地址：{{item.address}}</view>
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
      log: 0,
      result_log: "", //用户写文章时候的搜索结果
      timeId: -1, //输入框定时器
      isThinkArea: false, //联想区域是否显示
      searchKey: "", //点击确定的搜索关键词
      tagId: "",
      hot_tags: [],
      history: [],
      thinkDetail: [], //联想区域列表
      value: ""
    };
  },
  onLoad(options) {
    let t = this;
    console.log(options);
    if (options.log == undefined) {
      t.log = 0;
    } else {
      t.log = options.log;
      console.log(222);
    }
    t.history = uni.getStorageSync("history") || [];
  },
  onHide() {
    this.isThinkArea = false;
  },
  methods: {
    /* 搜索点击事件 */
    /* 搜素按钮 */
    toStart(searchKey) {
      let t = this;
      console.log(typeof searchKey);

      console.log(t.timeId, "timeId");

      if (t.log == 1) {
        console.log("不用跳转页面");
        if (searchKey == "") {
          t.$utils.showToast("请输入景点名");
          return;
        }
        let data = {
          good_name: searchKey
        };
        console.log(data);
        t.$utils.ajax(t.$api.getSearchResult, "get", data, res => {
          console.log(res, "用户写文章时候的搜索结果");
          t.result_log = res;

          console.log(t.result_log, "t.result_log");
        });
      } else if (t.log == 0) {
        if (searchKey == "") {
          t.$utils.showToast("请输入景点名");
          return;
        } else {
          console.log(searchKey,'searchKey');
          
          uni.navigateTo({
            url: "./searchRerult?keyword=" + searchKey
          });
        }
      }
      /* if (searchKey) {
        uni.setStorageSync("searchKey", searchKey);
        uni.navigateTo({
          url: "./searchRerult?keyword=" + searchKey
        });
        return;
      } */
    },
    /* 选择联想区域对输入框赋值 */
    handleHistoryItem(item) {
      let t = this;
      console.log(item);
      t.value = item;
      t.searchKey = item;
    },
    /* 获取输入框关键词 */
    getSearchKey(e) {
      this.searchKey = e.detail;
      console.log(e.detail);
    },
    /* 获取联想词,显示在搜索页面 */
    getThinkKey(e) {
      let t = this,
        length = t.thinkDetail.lenght;
      clearTimeout(t.timeId);
      if (e.detail === "") {
        console.log("字符为空");
        t.thinkDetail = [];
        t.isThinkArea = false;
        return;
      }
      t.timeId = setTimeout(() => {
        let data = {
          keyword: e.detail,
          class: t.log
        };
        t.$utils.ajax(t.$api.getKeywords, "get", data, res => {
          console.log(res);
          console.log(res.length);
          t.thinkDetail = res;
          if (res.length > 0) {
            t.isThinkArea = true;
            console.log(t.isThinkArea, "++++++");
            return;
          } else {
            t.isThinkArea = false;
          }
          console.log(e.detail, "e.detaile.detaile.detail");
        });
      }, 500);
    },
    /* 添加历史搜索记录 */
    search() {
      //对历史记录的点击事件
      let t = this;
      let _searchKey = t.searchKey;
      let isExist = false;
      if (t.log == 1) {
        return;
      }
      if (!t.searchKey) {
        return;
      }
      for (var i = 0; i <= t.history.length; i++) {
        if (t.history[i] === t.searchKey) {
          isExist = true;
          console.log(isExist, "有相同元素");
          return;
        }
      }
      let history = uni.getStorageSync("history") || [];
      !isExist && history.push(_searchKey);
      uni.setStorageSync("history", history);
      this.history = uni.getStorageSync("history") || [];
      
    },
    /* 清除历史记录 */
    clearHistory() {
      let t = this,
        history = t.history;
      uni.showModal({
        title: "温馨提示",
        content: "确定清空搜索历史吗？",
        success: function(res) {
          if (res.confirm) {
            if (history.length <= 0) {
              t.$utils.showToast("您暂无搜索记录", "/static/img/noSearch.png");

              return;
            } else {
              t.history = [];
              uni.setStorageSync("history", []);
              t.$utils.showToast("清空成功", "/static/img/isOn.png");
            }
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    /* on/off联想词区域 */
    handleThink(item) {
      let t = this;
      console.log(item, "+++++++");
      t.value = item;
      t.searchKey = item;
      t.isThinkArea = false;
    },
    /* 用户写日志时前往对商品详情表 */
    toDetail(good_id,good_name) {
      let t = this;
      uni.navigateTo({
        url: "./detail?log=" + t.log + "&&id=" + good_id +"&&good_name=" +good_name
      });
    }
  }
};
</script>

<style lang="less">
.content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  /* 搜索区域 */
  .search {
    display: flex;
    flex-direction: row;
    padding: 20rpx 0 20rpx 20rpx;
    background-color: #fff;
    /* 搜索输入框 */
    .van-field__input {
      height: 60rpx !important;
      line-height: 60rpx !important;
    }
    /* 搜索按钮 */
    .search_btn {
      width: 90rpx;
      color: #fff;
      font-size: 28upx;
      font-weight: bolder;
      line-height: 60rpx;
      text-align: center;
      background-color: var(--themeColor);
    }
  }
  /* 历史搜索区域、 联想区域 */
  .searchList {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    box-sizing: border-box;

    /* 联想区域 */

    .searchListTitle {
      margin: 10rpx 0 10rpx 20rpx;
      color: #969799;
      //   font-weight: bolder;
    }
    .list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      view {
        margin: 0rpx 0 10rpx 20rpx;
        padding: 0 10rpx;
        color: #5c606c;
        font-size: 24upx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        display: flex;
        flex: row;
        background-color: #f5f5f9;
      }
    }
  }
  .thinkArea {
    position: fixed;
    padding-top: 10rpx;
    top: 80rpx;
    left: 20rpx;
    width: 620rpx;
    border: 2rpx solid #ededed;
    z-index: 10000;
  }
  /* 商品搜索列表 */
  .list_log {
    // width: 100%;
    margin: 20rpx 20rpx 0 20rpx;
    margin-top: 20rpx;
    height: 500rpx;
    .list_show {
      margin-top: 20rpx;
      padding: 20rpx;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      border-radius: 20rpx;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

      .goods {
        width: 100%;
        height: 100%;
        font-size: 28upx;

        .top {
          width: 100%;
          border-radius: 15rpx;
          overflow: hidden;
          transform: translateY(0);
          /* 轮播图 */
          .img-container {
            overflow: hidden;
            transform: translateY(0);
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
              }
            }
          }
        }
        .bottom {
          display: flex;
          flex-direction: column;
          height: 130rpx;
          .title {
            width: 95%;
            padding: 10rpx;
            overflow: hidden;
            white-space: pre-wrap;
            text-overflow: ellipsis;
            font-size: var(--scenicTitleSize);
            font-weight: bolder;
          }
          .price {
            margin-left: 10rpx;
            color: var(--priceColor);
            font-size: var(--normalTitleSize);
            font-weight: bolder;
          }
        }
      }
    }
  }
}
</style>