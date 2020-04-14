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
        focus
        :value="value"
        placeholder="请输入关键字"
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
    <view class="searchList" style="border-top:12rpx solid #f6f6f6">
      <view class="searchListTitle">
        <span>搜索历史</span>
        <span
          class="iconfont icon-delect1"
          style="float:right; color:#000000; font-size:32upx; font-weight:bolder;margin-right:20rpx;padding-left: 20rpx;"
          @tap="clearHistory"
        ></span>
      </view>
      <view class="list">
        <view v-for="(item,index) in history" :key="index" @tap="handleHistoryItem(item)">{{item}}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
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
  onLoad() {
    let t = this;
    t.history = uni.getStorageSync("history") || [];
  },
  onHide() {
    this.isThinkArea = false;
  },
  methods: {
    /* 获取输入框关键词 */
    getSearchKey(e) {
      this.searchKey = e.detail;
      console.log(e.detail);
    },
    /* 获取联想词,显示在搜索页面山 */
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
          keyword: e.detail
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
      // console.log(this.history, "show");
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
              //   uni.showToast({
              //     title: "您暂无搜索记录",
              //     image: "../../../static/img/noSearch.png",
              //     duration: 2000
              //   });
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
    }
  }
};
</script>

<style lang="less">
.content {
  position: relative;
  width: 100%;
  min-height: 100vh;
  /* background-color: #f8f8f8; */
  box-sizing: border-box;
  /* 搜索区域 */
  .search {
    display: flex;
    flex-direction: row;
    padding: 20rpx 0 20rpx 20rpx;
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
      font-size: var(--smallFontSize);
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
}
</style>