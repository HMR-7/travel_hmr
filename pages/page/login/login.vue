<template>
  <view class="content">
    <view class="title iconfont icon-lvyou1"></view>
    <view class="userCenter">
      <view :class="isFoucs==1?'phone inputFoucs':'phone'">
        <view class="numberIcon">
          <view class="iconfont icon-shouji"></view>
          <view
            style="height:100rpx;line-height:100rpx;padding:0 20rpx;font-size:30rpx;
        "
          >+86</view>
        </view>
        <input
          class="write"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          v-model="phone"
          @focus="isFoucs=1"
          @blur="isFoucs=0"
          @input="getNumberLength(phone)"
        />
        <view
          :class="isCodeActive==1?'codeActive animated bounceIn':'code'"
          @click="toSend"
        >{{content}}</view>
      </view>

      <!-- 验证码 -->
      <view :class="isFoucs==3?'testCode inputFoucs':'testCode'">
        <view class="codeIcon">
          <view class="iconfont icon-yanzhengma-copy"></view>
        </view>
        <view>
          <input
            class="write"
            type="number"
            placeholder="请输入验证码"
            v-model="userCode"
            @focus="isFoucs=3"
            @blur="isFoucs=0"
          />
        </view>
      </view>
      <!-- 登录按钮 -->
      <button
        open-type="getUserInfo"
        @getuserinfo="getUserInfo"
        :class="isConfirmActive==1?'confirmActive animated bounceIn':'confirm'"
        @tap="toLogin(userPhone,userCode)"
        hover-start-time="5000"
      >登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      openid: "", //用户openId
      userPhone: "", //用户手机号
      userName: "", //用户名
      userCode: "", //验证码
      code: "", //登录code码
      PhoneCode: "",
      ischecked: true, //是否显示授权按钮
      userRes: "", //授权后获取的用户信息
      time: 20, //验证码倒计时时间
      timeStart: true, //防止发送重复点击
      content: "发送验证码",
      isFoucs: 0, //选择input框时，显示下划线样式
      isCodeActive: 0, //验证码按钮是否被启用
      isConfirmActive: 0, //登录按钮是否被启用
      ifEnd: "" //监听3个input框是否都含有值
    };
  },
  computed: {
    endVal: function() {
      let t = this;
      t.ifEnd =
        // Number(Boolean(t.userName)) +
        Number(Boolean(t.userPhone)) + Number(Boolean(t.userCode));
    }
  },
  watch: {
    ifEnd(newVal, oldVal) {
      let t = this;
      if (Number(newVal) === 2) {
        t.isConfirmActive = 1;
        console.log(t.isConfirmActive, "t.isConfirmActive");
      } else {
        t.isConfirmActive = 0;
      }
    }
  },
  onPullDownRefresh() {},
  created() {
    let t = this;
    let authSetting_userInfo = uni.getStorageSync("authSetting.userInfo");
    let userInfo = uni.getStorageSync("userInfo");
    t.userInfo = userInfo;
    let sysInfo = { phone: "17853558905", wxNum: "huangmaorui102117" };
    t.sysInfo = sysInfo;
    uni.setStorageSync("sysInfo", sysInfo);
    console.log(authSetting_userInfo, "------");
    console.log(userInfo);
  },
  onLoad() {
    let t = this;
    // t.getCode();
    // t.getUserChart();
  },
  methods: {
    /* 获取code码并且检查是否注册进表 */
    getCode() {
      let t = this;
      uni.login({
        provider: "weixin",
        success: res => {
          console.log(res, "res");
          if (res.code) {
            console.log(t.code, "t.code");

            t.code = res.code;
            t.getUserChart();
          } else {
            console.log("登录失败", res.errMsg);
          }
        }
      });
    },
    /* 获取用户表，检查是否存在、是否要向数据库插入数据 */
    getUserChart() {
      let t = this;
      let data = {
        appid: "wx4e740748bfb8fd79",
        secret: "b40ac022a8da6d7f562ae5c93f1871d8",
        js_code: t.code,
        grant_type: "authorization_code"
      };
      t.$utils.ajax(
        "https://api.weixin.qq.com/sns/jscode2session",
        "get",
        data,
        res => {
          console.log(res.openid, "获取openid");
          t.openid = res.openid;
          let data = {
            openid: res.openid
          };
          t.$utils.ajax(t.$api.userInfo, "get", data, res => {
            console.log(res, "用户表信息");
            uni.setStorageSync("UserId", res.id);
            let listLength = {};
            listLength.CollectList = res.CollectList;
            listLength.FooterList = res.FooterList;
            uni.setStorageSync("listNum", listLength);
            if (res.openid) {
              console.log("用户已经存在");
              t.$utils.showToast("验证通过", "/static/img/loginSuccess.png");
              setTimeout(() => {
                uni.hideToast();
                uni.switchTab({
                  url: "../index/index"
                });
              }, 1000);
              return;
            } else if (res.msg == false) {
              let data = {
                openid: t.openid,
                userName: t.userRes.nickName,
                userPhone: t.userPhone
              };
              t.$utils.ajax(t.$api.insertuserInfo, "post", data, res => {
                console.log(res, "999999999");
                uni.setStorageSync("UserId", res[0].id);

                uni.switchTab({
                  url: "../index/index"
                });
              });
              console.log(t.userRes);
            }
          });
        }
      );
    },
    /* 授权登录 */
    getUserInfo(e) {
      let t = this,
        authSetting_userInfo = uni.getStorageSync("authSetting.userInfo");
      console.log(e, "6666666666666666666");
      if (authSetting_userInfo == true) return;
      this.$utils.getSetting(() => {
        let t = this,
          authSetting_userInfo = uni.getStorageSync("authSetting.userInfo");
        console.log(authSetting_userInfo, "授权信息");
        if (authSetting_userInfo == false) {
          t.$utils.showToast("授权失败", "/static/img/settingFail.png");
          t.ischecked = true;
          return;
        } else {
          t.$utils.showToast("授权成功", "/static/img/settingSuccess.png");
          t.userRes = e.detail.userInfo;
          uni.setStorageSync("userInfo", t.userRes);
          t.ischecked = false;
          t.getNumberLength(t.userPhone);
        }
      });
    },
    /* 获取手机号长度 */
    getNumberLength(phone) {
      let t = this,
        authSetting_userInfo = uni.getStorageSync("authSetting.userInfo");
      t.userPhone = phone;
      console.log(t.userPhone, "用户手机号");
      if (phone.length == 11 && t.timeStart == true) {
        t.isCodeActive = 1;
        console.log("11111111111");
        return;
      }
      if (
        phone.length == 11 &&
        (!authSetting_userInfo || authSetting_userInfo == false) &&
        t.time == 0
      ) {
        console.log(2222222);

        t.isCodeActive = 1;
        // t.$utils.showToast("请先授权登录", "/static/img/toSetting.png");
        return;
      } else {
        t.isCodeActive = 0;
      }
    },
    /* 发送验证码 */
    toSend() {
      let t = this;
      if (t.isCodeActive == 0) {
        console.log(t.isCodeActive, "1111");
        return;
      }
      if (t.$utils.checkPhone(t.userPhone) == false) {
        console.log(11111);
        return;
      }
      for (var i = 0; i < 6; i++) {
        var radom = Math.floor(Math.random() * 10);
        console.log(radom);
        t.PhoneCode += radom;
      }
      console.log(t.PhoneCode, "PhoneCode");

      t.$utils.showToast("您的验证码:" + t.PhoneCode);
      if (!t.timeStart) return; //防止重复点击
      t.timeStart = false;
      let block = setTimeout(() => {
        t.isCodeActive = 0;
      }, 1000);
      let clock = setInterval(() => {
        t.time--;
        t.content = t.time + "s后再试";
        if (t.time < 0) {
          //当倒计时小于0时清除定时器
          clearInterval(clock);
          clearTimeout(block);
          t.content = "重发验证码";
          t.time = 20;
          t.timeStart = true;
          t.PhoneCode = "";
          t.isCodeActive = 1;
          t.getNumberLength(t.userPhone);
          console.log(t.isCodeActive);
        }
      }, 1000);
    },
    /* 验证登录 */
    toLogin(phone, code) {
      let t = this,
        authSetting_userInfo = uni.getStorageSync("authSetting.userInfo"),
        userInfo = uni.getStorageSync("userInfo");
      console.log(phone, "phonephonephone");
      console.log(code, "codecodecode");

      console.log(userInfo);
      if (!authSetting_userInfo || authSetting_userInfo == false) {
        t.$utils.showToast("请先授权登录", "/static/img/toSetting.png");
        return;
      }
      if (phone == "" || code == "") {
        t.$utils.showToast("登录信息不全", "/static/img/megsLose.png");
        return;
      }
      if (code != t.PhoneCode) {
        t.$utils.showToast("验证码错误");
        return;
      }
      if (t.$utils.checkPhone(phone) && t.$utils.checkCode(code)) {
        t.getCode();
      }
    }
  }
};
</script>

<style lang="less">
.content {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--contentBgc);
  /* 登录授权按钮样式 */
  button {
    position: static !important;
    &::after {
      width: 0;
      height: 0;
    }
  }
  .iconfont {
    color: var(--themeColor);
  }
  /* 登录页Login */
  .title {
    width: 100%;
    height: 340rpx;
    line-height: 200rpx;
    text-align: center;
    background-color: var(--themeColor);
    color: #fff;
    font-size: 100rpx;
  }
  /* 用户操作区域 */
  .userCenter {
    position: fixed;
    top: 200rpx;
    left: 4%;
    width: 92%;
    border-radius: 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2); /*阴影/
    /* 用户名 */
    .name {
      margin: 0rpx 40rpx 20rpx 40rpx;
      display: flex;
      justify-content: row;
      border-bottom: 2rpx solid #ebebeb;
      /* 用户名图标样式 */
      .nameIcon {
        display: flex;
        justify-content: row;
        margin: auto 0;
        text-align: center;
        .iconNameCard {
          padding: 0 20rpx;
          height: 100rpx;
          line-height: 100rpx;
          font-size: 50rpx;
        }
      }
    }
    /* 手机 */
    .phone {
      margin: 0 40rpx 20rpx 40rpx;
      display: flex;
      justify-content: row;
      border-bottom: 2rpx solid #ebebeb;
      .numberIcon {
        display: flex;
        justify-content: row;
        margin: auto 0;
        font-size: var(--titleSize);
        text-align: center;
      }
      .code {
        margin: auto 0;
        margin-right: 20rpx;
        width: 350rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 22rpx;
        text-align: center;
        color: var(--remarksFontColor);
        background-color: var(--remarksColor);
        border-radius: 10rpx;
      }
      .codeActive {
        margin: auto 0;
        margin-right: 20rpx;
        width: 350rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 22rpx;
        text-align: center;
        border-radius: 10rpx;
        color: #fff;
        background-color: var(--themeColor);
      }
      .icon-shouji {
        padding-left: 20rpx;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 50rpx;
      }
      .item {
        width: 50rpx;
        height: 50rpx;
      }
    }
    /* 验证码 */
    .testCode {
      margin: 0 40rpx 20rpx 40rpx;
      display: flex;
      justify-content: row;
      border-bottom: 2rpx solid #ebebeb;
      .codeIcon {
        display: flex;
        justify-content: row;
        margin: auto 0;
        text-align: center;
      }
      .icon-yanzhengma-copy {
        padding: 0 20rpx;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 50rpx;
      }
    }
    /* input框样式 */
    .write {
      width: 100%;
      height: 100rpx;
    }
    /* input聚焦后样式 */
    .inputFoucs {
      border-bottom: 2rpx solid #0ea391;
    }
    /* 按钮可用样式 */
    .confirmActive {
      margin: 40rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      color: #fff;
      font-size: var(--titleSize);
      font-weight: bold;
      background-color: var(--themeColor);
      border-radius: 10rpx;
    }
    /* 按钮禁用样式 */
    .confirm {
      margin: 40rpx 40rpx 20rpx 40rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      color: var(--remarksFontColor);
      font-size: var(--titleSize);
      // font-weight: bold;
      background-color: var(--remarksColor);
      border-radius: 10rpx;
    }
    /* 授权用户登录样式 */
    .authorization {
      margin: 0 40rpx;
      margin-bottom: 40rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      color: var(--themeColor);
      font-size: var(--titleSize);
      font-weight: bold;
      background-color: #fff;
      border: 2rpx solid;
      border-radius: 10rpx;
    }
  }
}
</style>