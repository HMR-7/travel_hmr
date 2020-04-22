<template>
  <view class="content">
    <view class="cates_container">
      <scroll-view class="left_menu" scroll-y="true" show-scrollbar="false">
        <view
          class="menu_item"
          :class="index === currentIndex ? 'active' : ''"
          v-for="(item,index) in leftMenuList"
          :key="index"
          @tap="handleItemTap($event,item)"
          :data-index="index"
        >{{item}}</view>
        <view
          style="position: absolute;top: 500rpx;left: 15rpx;color:#007aff;text-align:center;font-size: 20rpx;"
        >搜索数据共：{{showList.length}}条</view>
      </scroll-view>

      <scroll-view class="right_menu" scroll-y="true" :show-scrollbar="true">
        <view v-if="currentIndex==0">
          <view class="menuTitle">
            <text>用户id</text>
            <text>手机号</text>
            <text>管理员</text>
            <text>操作</text>
          </view>
          <view class="goods_list" v-for="(item,index) in showList" :key="index">
            <view>{{item.id}}</view>
            <scroll-view scroll-x="true" style="max-width:25%">{{item.userPhone}}</scroll-view>
            <view v-text="item.isAdmin==1?'Yes':'No'"></view>
            <view>
              <view style="color:#fff;width:90%;background-color:#dd524d;border-radius:10rpx;">删除</view>
            </view>
          </view>
        </view>
        <view v-if="currentIndex==1">
          <view class="menuTitle">
            <text>用户id</text>
            <text>日志内容</text>
            <text>发布时间</text>
            <text>操作</text>
          </view>
          <view class="goods_list" v-for="(item,index) in showList" :key="index">
            <view>{{item.user_id}}</view>
            <view>详情</view>
            <view style="max-width:25%;font-size: 24rpx;">{{item.time}}</view>
            <view>
              <view
                style="color:#fff;width:90%;background-color:#dd524d;border-radius:10rpx; margin-left:10rpx"
              >删除</view>
            </view>
          </view>
        </view>
        <view v-if="currentIndex==2">
          <view
            class="list_show"
            v-for="(item,index) in showList"
            :key="index"
            @tap="toDetail(item.id,item.good_name)"
          >
            <view class="delBtn" style="background-color:#007aff;right:130rpx;">更改</view>
            <view class="delBtn">删除</view>
            <!-- 信息展示模块 -->
            <view class="goods">
              <view class="top">
                <view class="img-container">
                  <image class="itemImg" :src="item.src" />
                </view>
                <view class="bottom">
                  <view class="title">{{item.good_name}}</view>
                  <view class="price">{{item.introduce}}</view>
                  <view class="price" style="margin-top:10rpx;color:#a2a2a2">地址：{{item.address}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="currentIndex==3">
          <view
            class="list_show"
            v-for="(item,index) in showList"
            :key="index"
            @tap="toDetail(item.id,item.good_name)"
          >
            <view class="delBtn" style="background-color:#007aff;right:130rpx;">更改</view>
            <view class="delBtn">删除</view>
            <!-- 信息展示模块 -->
            <view class="goods">
              <view class="top">
                <view class="img-container">
                  <image class="itemImg" :src="item.src" />
                </view>
                <view class="bottom">
                  <view class="title">{{item.hotel_name}}</view>
                  <view class="price">价格：{{item.hotel_price}}元起/晚</view>
                  <view
                    class="price"
                    style="margin-top:10rpx;color:#a2a2a2"
                  >地址：{{item.hotel_address}}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view v-if="currentIndex==4">
          <view class="menuTitle">
            <text>美食名称</text>
            <text>操作</text>
          </view>
          <view class="goods_list list_food" v-for="(item,index) in showList" :key="index">
            <view>{{item.food_name}}</view>
            <view style="color:#fff;background-color:#dd524d;border-radius:10rpx;">删除</view>
          </view>
          <view
            @tap="isToaddFoodVal=true"
            class="iconfont icon-tianjia"
            style=" margin-top:50rpx; font-size:80rpx;text-align:center;color:#4cd964;"
          ></view>
        </view>
      </scroll-view>
      <van-popup
        :show="isToaddFoodVal"
        position="bottom"
        custom-style="height: 20%"
        @close="isToaddFoodVal=false"
      >
        <view>
          <view style="margin: 20rpx 0;display:flex;flex-direction:row">
            <view style="margin:0 auto;display:flex;">
              名称：
              <input
                v-model="foodName"
                style="'display:"
                class="addValue"
                type="text"
                placeholder="请输入食品名称"
              />
            </view>
          </view>
          <view style="display:flex;flex-direction:row">
            <view style="margin:0 auto;display:flex;">
              地址：
              <input v-model="foodAddress" class="addValue" type="text" placeholder="请输入食品推荐地址" />
            </view>
          </view>
        </view>
        <view
          @tap="toInsertFood"
          class="sumBtm"
          style="background-color:var(--themeColor);color:#fff;"
        >提交</view>
      </van-popup>
    </view>
  </view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
export default {
  data() {
    return {
      isToaddFoodVal: false, //向数据库添加美食信息
      foodName: "",
      foodAddress: "",
      child: [],
      leftMenuList: [
        "用户管理",
        "日志管理",
        "景点管理",
        "酒店管理",
        "美食管理"
      ],
      rightContent: [],
      showList: [],
      timeList: [],
      currentIndex: 0,
      Cates: ""
    };
  },
  created() {
    this.getDataBase();
  },
  onLoad(options) {
    let t = this;
    t.rightContent = uni.getStorageSync("rightContent");
    console.log(t.rightContent, "rightContentrightContentrightContent");
    t.rightContent[1].map((v, i, arr) => {
      v.time = moment(v.time).format("YYYY-M-DD");
      t.timeList = arr;
      return arr;
    });

    // const Cates = uni.getStorageSync("cates");
  },
  methods: {
    /* 分类页商品分类 */
    getAllGoodCateList() {
      let t = this;
    },

    /* 左侧菜单点击事件 */
    handleItemTap(e, child) {
      let t = this;
      const { index } = e.currentTarget.dataset;
      t.currentIndex = index;
      console.log(index, "6666");

      if (index == 1) {
        t.showList = t.timeList;
      } else {
        t.showList = t.rightContent[index];
        console.log(t.showList, "6666666");
      }
    },
    /* 获取数据库内容 */
    getDataBase() {
      let t = this,
        isAdmin = uni.getStorageSync("isAdmin");
      console.log(111);
      let data = {
        isAdmin: isAdmin
      };
      t.$utils.ajax(t.$api.isAdminCheck, "get", data, res => {
        console.log(res, "管理员查询");
        t.showList = res[0];
        uni.setStorageSync("rightContent", res);
      });
    },
    /* 管理员添加食物信息事件 */
    toInsertFood() {
      let t = this;
      let isHave = t.showList.some(v => {
        if (v.food_name == t.foodName) {
          return true;
        }
      });
      if(isHave){
          t.$utils.showToast("该食物已存在")
          return
      }
      let data = {
        food_name: t.foodName,
        food_address: t.foodAddress
      };
      t.$utils.ajax(t.$api.addFoodMegs, "post", data, res => {
        console.log(res, "插入信息");
        if(res.flag=='yes'){
          t.$utils.showToast("添加成功")
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  min-height: 100vh;
  .cates_container {
    position: relative;
    /* less中使用calc的时候要注意 */
    display: flex;
    height: calc(100vh - 1rpx);
    .left_menu {
      flex: 2;
      background-color: #f6f6f6;
      .menu_item {
        display: flex;
        height: 80rpx;
        justify-content: center;
        align-items: center;
        font-size: var(--DetailTitleSize);
      }
      .active {
        color: var(--themeColor);
        font-weight: bolder;
        background-color: #fff;
        border-left: 5rpx solid #0ea391;
      }
    }
    .right_menu {
      flex: 6;
      .menuTitle {
        padding-top: 20rpx;
        padding-bottom: 20rpx;
        display: flex;
        flex-direction: row;
        color: var(--themeColor);
        border-bottom: 2rpx solid #999;
        text {
          flex: 1;
          text-align: center;
        }
      }
      /* .goods_title {
          display: flex;
          font-size: var(--titleSize);
          justify-content: center;
          align-items: center;
          height: 80rpx;
          .delimiter {
            color: #ccc;
            padding: 0 10rpx;
          }
        } */
      .goods_list {
        margin-top: 20rpx;
        display: flex;
        flex-direction: row;
        view {
          width: 25%;
          text-align: center;
        }
      }
      .list_food {
        view {
          width: 50%;
          text-align: center;
        }
      }
      .list_show {
        position: relative;
        margin: 0 auto;
        margin-top: 20rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 500rpx;
        border-radius: 20rpx;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
        .delBtn {
          z-index: 100;
          position: absolute;
          top: 230rpx;
          right: 20rpx;
          width: 100rpx;
          height: 40rpx;
          line-height: 40rpx;
          text-align: center;
          color: #fff;
          background-color: #dd524d;
          border-radius: 10rpx;
        }
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
              transform: translateY(0); //解决轮播图转化border-radius复位问题
              height: 200rpx;
              width: 100%;
              background-color: #fff;
              display: flex;
              justify-content: center;
              .itemImg {
                width: 100%;
                height: 100%;
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
              overflow: hidden; /*超出部分隐藏*/
              white-space: nowrap; /*不换行*/
              text-overflow: ellipsis; /*超出部分文字以...显示*/
            }
          }
        }
      }
    }
    .addValue {
      border: 2rpx solid #a2a2a2;
      width: 70%;
      height: 60rpx;
      border-radius: 10rpx;
      text-align: center;
    }
    .sumBtm {
      margin: 0 auto;
      margin-top: 20rpx;
      background-color: var(--themeColor);
      color: #fff;
      width: 100%;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
    }
  }
}
</style>