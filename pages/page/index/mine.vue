<template>
  <view class="content" v-if="isLogin">
    <!-- 用户信息展示模块 -->
    <view class="top_header" @tap="toPerMegs(userInfo.id)">
      <!-- 详情箭头 -->
      <view class="arrows"></view>
      <!-- 用户头像 -->
      <image class="header" :src="userInfo.avatarUrl" @tap="toEdit" />
      <!-- 用户昵称、所在城市 -->
      <view class="name_box">
        <view class="box_top">
          <view class="name">{{userInfo.nickName}}</view>
        </view>
        <view class="userCity">City:{{userInfo.city}}</view>
        <!-- <view class="name">{{user.real_name?user.real_name:user.nick_name}}</view> -->
      </view>
    </view>
    <!-- 操作中心 -->
    <view class="header_title">操作中心</view>
    <view class="action">
      <!-- 我的收藏 -->
      <view class="action_line" @tap="toCollectList">
        <view class="number" v-if="listNum.CollectList==null">0</view>
        <view class="number" v-if="user_id!=null">{{listNum.CollectList}}</view>
        <view class="caption">我的收藏</view>
      </view>
      <!-- 是否未管理员 -->
      <view class="action_line" v-if="isAdmin" @tap="toAdmin">
        <view style="font-size:48rpx" class="number iconfont icon-houtaiguanli"></view>
        <view class="caption">后台管理</view>
      </view>
      <!-- 我的足迹 -->
      <view class="action_line" @tap="toMyFootprint">
        <view class="number" v-if="listNum.CollectList==null">0</view>
        <view class="number" v-if="user_id!=null">{{listNum.FooterList}}</view>
        <view class="caption">我的足迹</view>
      </view>
    </view>
    <!-- 客服中心 -->
    <view class="header_title">客服中心</view>
    <view class="service">
      <view class="service_line" @tap="show=!show">
        <view class="iconfont icon-lianxi"></view>
        <view class="caption">电话客服</view>
      </view>
      <view class="service_line">
        <button open-type="contact" hover-class="none">
          <view class="iconfont icon-weixin2"></view>
          <view class="caption">微信客服</view>
        </button>
      </view>
      <view class="service_line" @tap="toTravellog">
        <view class="iconfont icon-yijianfankui"></view>
        <view class="caption">旅游日志</view>
      </view>
    </view>
    <!-- 电话客服 -->
    <van-popup :show="show" position="bottom" @close="show=!show">
      <view class="contactWay" @tap="Call(sysInfo.phone)">手机号：{{sysInfo.phone}}</view>
      <view class="contactWay" @tap="Copy(sysInfo.wxNum)">微信：{{sysInfo.wxNum}}</view>
    </van-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: null,
      user_id: "", //用户id
      userInfo: "", //用户信息
      listNum: "", //用户已收藏、足迹列表数量
      show: false, //显示电话客服
      isLogin: false,
      sysInfo: ""
    };
  },
  onPullDownRefresh() {
    let t = this,
      userInfo = uni.getStorageSync("userInfo"),
      sysInfo = uni.getStorageSync("sysInfo"),
      user_id = uni.getStorageSync("UserId");
    t.user_id = user_id;
    let login = t.$utils.checkLogin();
    if (!login) {
      t.isLogin = false;
      return;
    } else {
      t.isLogin = true;
      t.userInfo = userInfo;
      t.sysInfo = sysInfo;
    }
    t.getListNum();
    uni.stopPullDownRefresh();
  },
  onShow() {
    let t = this;
    t.getListNum();
  },
  onLoad() {
    let t = this;
    let isLogin = uni.getStorageSync("UserId");
    t.isAdmin = uni.getStorageSync("isAdmin");
    if (!isLogin) {
      let login = t.$utils.checkLogin();
    } else {
      t.isLogin = true;
      (t.userInfo = uni.getStorageSync("userInfo")),
        (t.sysInfo = uni.getStorageSync("sysInfo")),
        (t.user_id = uni.getStorageSync("UserId"));
      // t.userInfo = userInfo;
      // t.sysInfo = sysInfo;
    }
  },
  methods: {
    /* 获取收藏和足迹列表长度 */
    getListNum() {
      let t = this;
      let data = {
        id: t.user_id
      };
      t.$utils.ajax(t.$api.userInfo, "get", data, res => {
        console.log(res, "11111");
        let listLength = {};
        listLength.CollectList = res.CollectList;
        listLength.FooterList = res.FooterList;
        uni.setStorageSync("listNum", listLength);
        t.listNum = uni.getStorageSync("listNum");
      });
    },
    /* 查看用户已收藏列表 */
    toCollectList() {
      uni.navigateTo({
        url: "./collectList"
      });
    },
    /* 获取用户足迹列表 */
    toMyFootprint() {
      uni.navigateTo({
        url: "./myFootprint"
      });
    },
    /* 拨打客服电话 */
    Call(phone) {
      console.log(phone);
      uni.makePhoneCall({
        phoneNumber: phone, //仅为示例
        success(res) {
          console.log(res, "拨打成功");
        },
        fail(fail) {
          console.log(fail, "拨打失败");
        }
      });
    },
    /* 一键复制 */
    Copy(str) {
      let t = this;
      t.$utils.setClipboardData(str);
    },
    /* 跳转到日志发布详情页面 */
    toTravellog() {
      uni.navigateTo({
        url: "./search?log=1"
      });
    },
    toAdmin(){
      uni.navigateTo({
         url: './admin'
      });
   }
  }
};
</script>

<style lang="less">
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: var(--contentBgc);
  .iconfont {
    font-size: 50rpx;
    color: var(--themeColor);
    padding: 10rpx;
    padding-top: 20rpx;
  }
  /* 头部区域 */
  .top_header {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    color: #fff;
    padding: 40upx;
    background-color: var(--themeColor);
    /* 详情箭头 */
    .arrows {
      position: absolute;
      top: 100rpx;
      right: 80rpx;
      width: 20rpx;
      height: 20rpx;
      border-top: 4rpx solid #ffffff;
      border-right: 4rpx solid #ffffff;
      transform: rotate(45deg);
    }
    /* 用户头像 */
    .header {
      /* margin: 40rpx 0; */
      width: 154upx;
      height: 154upx;
      border-radius: 50%;
      /* border: 5rpx solid yellow; */
    }
    .name_box {
      /* 用户名 */
      .box_top {
        display: flex;
        flex-direction: row;
        .name {
          font-size: 36upx;
          font-weight: 800;
          padding-left: 30upx;
        }
      }
      /* 用户所在城市 */
      .userCity {
        font-size: 26upx;
        padding-left: 30upx;
      }
    }
  }
  /* 用户操作区域 */
  .header_title {
    margin: 0 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* width: 100%; */
    height: 70rpx;
    line-height: 70rpx;
    padding: 0 20rpx;
    margin-top: 20rpx;
    font-size: 32upx;
    font-weight: 600;
    background-color: #fff;
    border-bottom: 2rpx solid #f6f6f6;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    /* box-sizing: border-box; */
  }
  /* 用户操作中心 */
  .action {
    margin: 0 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #fff;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    .action_line {
      padding-bottom: 30rpx;
      .number {
        color: var(--themeColor);
        font-size: 36upx;
        /* font-weight: bolder; */
        text-align: center;
        padding: 10rpx;
      }
      .caption {
        font-size: 26upx;
        color: #6c6c6c;
      }
    }
  }
  /* 客服中心 */
  .service {
    margin: 0 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: #fff;
    border-bottom-left-radius: 20rpx;
    border-bottom-right-radius: 20rpx;
    .service_line {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 30rpx;
      box-sizing: border-box;
      .caption {
        font-size: 26upx;
        color: #6c6c6c;
      }
      button {
        position: static;
        margin: 0;
        padding: 0;
        outline: none;
        border: 1px solid transparent;
        background-color: #fff;
        line-height: 50rpx;
      }
      button::after {
        width: 0 !important;
        height: 0 !important;
      }
    }
  }
  /* 电话客服 */
  .contactWay {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 32upx;
    text-align: center;
    margin: auto 0;
    border: 4rpx solid #f6f6f6;
  }
}
</style>