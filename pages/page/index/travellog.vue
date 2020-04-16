<template>
  <view class="content">
    <textarea class="sugs" placeholder="请输入内容" maxlength="-1" @input="onInput"></textarea>
    <view class="sumbit" @tap="confirm">提交</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: "",
      suggests: null,
      userid: null
    };
  },
  onLoad() {
    let t = this,
      us = uni.getStorageSync("UserId"),
      userInfo = uni.getStorageSync("userInfo");
    // 检查是否完成登录
    userInfo.id = us;
    t.$utils.checkLogin();
    t.userid = us;
    t.userInfo = userInfo;
    console.log(userInfo);

    console.log(t.userid, "用户id");
    console.log(t.userInfo, "用户信息");
  },
  methods: {
    onInput(e) {
      let t = this,
        userid = t.userid;
      t.suggests = e.detail.value;
    },
    confirm() {
      let t = this,
        userid = t.userid,
        article = t.suggests;
      if (article == null) {
        t.$utils.showToast("请确认您是否已输入内容");
        return;
      }
      console.log(userid, "useriduseriduserid");
      let userInfo = uni.getStorageSync("userInfo");
      let data = {
        user_id: userInfo.id,
        user_head: userInfo.avatarUrl,
        user_name: userInfo.nickName,
        article: article
      };
      t.$utils.ajax(t.$page.submitFeedback, "post", data, res => {
        console.log(res);
        t.$utils.showToast("提交成功，即将跳转到个人中心");
        setTimeout(() => {
          console.log(1111);

          uni.redirectTo({
            url: "./mine"
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
  box-sizing: border-box;
  .sugs {
    margin-bottom: 40rpx;
    width: 100%;
    background-color: #fff;
    border-bottom: 3rpx solid #a2a2a2;
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
</style>