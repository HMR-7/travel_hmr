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
              <view
                @tap="toDelUserMegs(item.id,showList)"
                style="color:#fff;width:90%;background-color:#dd524d;border-radius:10rpx;"
              >删除</view>
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
            <view @tap="showLogMegs(item.article)" style="color:#a2a2a2">详情</view>
            <view style="max-width:25%;font-size: 24rpx;">{{item.time}}</view>
            <view>
              <view
                @tap="toDelLogMegs(item.id,showList)"
                style="color:#fff;width:90%;background-color:#dd524d;border-radius:10rpx; margin-left:10rpx"
              >删除</view>
            </view>
          </view>
        </view>
        <view v-if="currentIndex==2">
          <view class="list_show" v-for="(item,index) in showList" :key="index">
            <view
              @tap="toUpdeGoodDetal(item.id,item,showList)"
              class="delBtn"
              style="background-color:#007aff;right:130rpx;"
            >更改</view>
            <view @tap="toDelGoodDetail(item.id,showList)" class="delBtn">删除</view>
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
          <view class="list_show" v-for="(item,index) in showList" :key="index">
            <view
              @tap="toUpdateHotelMegs(item.id,item,showList)"
              class="delBtn"
              style="background-color:#007aff;right:20rpx;top:280rpx"
            >更改</view>
            <view @tap="toDelHotelDetail(item.id,showList)" class="delBtn">删除</view>
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
            <view
              @tap="toDelFoodMegs(item.id,showList)"
              style="color:#fff;background-color:#dd524d;border-radius:10rpx;"
            >删除</view>
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
      <van-popup
        :show="isShowLog"
        custom-style="width:90%;padding:10rpx"
        @close="isShowLog=false"
      >{{article}}</van-popup>
      <van-popup
        :show="isUpdataHotelMegs"
        position="top"
        custom-style="height: 20%"
        @close="isUpdataHotelMegs=false"
      >
        <view>
          <view style="margin: 20rpx 0;display:flex;flex-direction:row">
            <view style="margin:0 auto;display:flex;">
              店名：
              <input
                v-model="newHotelName"
                style="'display:"
                class="addValue"
                type="text"
                placeholder="请输入酒店名称"
              />
            </view>
          </view>
          <view style="display:flex;flex-direction:row">
            <view style="margin:0 auto;display:flex;">
              价格：
              <input v-model="newHotelPrice" class="addValue" type="text" placeholder="请输入价格" />
            </view>
          </view>
        </view>
        <view
          @tap="toUpdateHotelCofirm"
          class="sumBtm"
          style="background-color:var(--themeColor);color:#fff;"
        >提交</view>
      </van-popup>
      <van-popup
        :show="isUpdataGoodMegs"
        position="top"
        custom-style="height: 20%"
        @close="isUpdataGoodMegs=false"
      >
        <view>
          <view style="margin: 20rpx 0;display:flex;flex-direction:row">
            <view style="margin:0 auto;display:flex;">
              景点名：
              <input
                v-model="newGoodName"
                style="'display:"
                class="addValue"
                type="text"
                placeholder="请输入景点名称"
              />
            </view>
          </view>
          <view style="display:flex;flex-direction:row">
            <view style="margin:0 auto;display:flex;">
              新简介：
              <input
                v-model="newGoodIntroduce"
                class="addValue"
                type="text"
                placeholder="请输入新的简介"
              />
            </view>
          </view>
        </view>
        <view
          @tap="toUpdateGoodCofirm"
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
      article: "", //查看用户日志详情
      isUpdataGoodMegs: false, //显示更改景点信息弹窗
      isUpdataHotelMegs: false, //显示更改酒店信息弹窗
      newGoodName: "", //新的景点名称
      newGoodIntroduce: "", //新的景点简介
      newHotelName: "", //新的酒店名称
      newHotelPrice: "", //新的酒店价格
      isShowLog: false, //显示用户日志信息弹窗
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
    let t = this;
    t.rightContent = uni.getStorageSync("rightContent");
    // t.getDataBase();
    t.showList = t.rightContent[0];

    t.rightContent[1].map((v, i, arr) => {
      v.time = moment(v.time).format("YYYY-M-DD");
      t.timeList = arr;
      return arr;
    });
  },
  onLoad(options) {
    let t = this;
    // t.rightContent = uni.getStorageSync("rightContent");
    // console.log(t.rightContent, "rightContentrightContentrightContent");
    // if (t.rightContent.length > 0) {
    //   t.rightContent[1].map((v, i, arr) => {
    //     v.time = moment(v.time).format("YYYY-M-DD");
    //     t.timeList = arr;
    //     return arr;
    //   });
    // }
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
        uni.setStorageSync("rightContent", res);
      });
    },
    showLogMegs(article) {
      let t = this;
      t.isShowLog = true;
      console.log(article, "日志信息");
      t.article = article;
    },
    /* 管理员删除食品信息事件 */
    toDelFoodMegs(id,Arr) {
      let t = this;
      console.log(Arr, "获取指定数组");
      console.log(id, "tiemtime");
      let data = {
        foodId: id
      };
      t.$utils.ajax(t.$api.delFoodMegs, "post", data, res => {
        console.log(res);
        Arr.map((v, i, arr) => {
          if (v.id == id) {
            arr.splice(i, 1);
            return arr;
          }
        });
        console.log(Arr, "删除之后的指定数组");
        t.$utils.showToast(res.msg);
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
      if (isHave) {
        t.$utils.showToast("该食物已存在");
        return;
      }
      let data = {
        food_name: t.foodName,
        food_address: t.foodAddress
      };
      t.$utils.ajax(t.$api.addFoodMegs, "post", data, res => {
        console.log(res, "插入信息");
        if (res.flag == "yes") {
          t.$utils.showToast("添加成功");
        }
      });
    },
    /* 管理员删除用户日志事件 */
    toDelLogMegs(id, Arr) {
      let t = this;
      console.log(Arr, "获取指定数组");
      console.log(id, "tiemtime");
      let data = {
        logId: id
      };
      t.$utils.ajax(t.$api.toDelLogMegs, "post", data, res => {
        console.log(res);
        Arr.map((v, i, arr) => {
          if (v.id == id) {
            arr.splice(i, 1);
            return arr;
          }
        });
        console.log(Arr, "删除之后的指定数组");
        t.$utils.showToast(res.msg);
      });
    },
    /* 管理员删除用户信息 */
    toDelUserMegs(id, Arr) {
      let t = this,
        admin = uni.getStorageSync("isAdmin");
      console.log(Arr, "获取指定数组");
      console.log(id, "tiemtime");
      let data = {
        isAdmin: admin,
        userId: id
      };
      t.$utils.ajax(t.$api.toDelUserMegs, "post", data, res => {
        console.log(res);
        if (admin == 0) {
          Arr.map((v, i, arr) => {
            if (v.id == id) {
              arr.splice(i, 1);
              return arr;
            }
          });
        }
        console.log(Arr, "删除之后的指定数组");
        t.$utils.showToast(res.msg);
      });
    },
    /* 管理员删除景区信息 */
    toDelGoodDetail(id, Arr) {
      let t = this;
      console.log(Arr, "获取指定数组");
      console.log(id, "tiemtime");
      let data = {
        goodId: id
      };
      t.$utils.ajax(t.$api.toDelGoodDetail, "post", data, res => {
        console.log(res);
        Arr.map((v, i, arr) => {
          if (v.id == id) {
            arr.splice(i, 1);
            return arr;
          }
        });
        console.log(Arr, "删除之后的指定数组");
        t.$utils.showToast(res.msg);
      });
    },
    /* 管理员删除酒店信息 */
    toDelHotelDetail(id, Arr) {
      let t = this;
      console.log(Arr, "获取指定数组");
      console.log(id, "tiemtime");
      let data = {
        hotelId: id
      };
      t.$utils.ajax(t.$api.toDelHotelDetail, "post", data, res => {
        console.log(res);
        Arr.map((v, i, arr) => {
          if (v.id == id) {
            arr.splice(i, 1);
            return arr;
          }
        });
        console.log(Arr, "删除之后的指定数组");
        t.$utils.showToast(res.msg);
      });
    },
    /* 管理员修改酒店信息 */
    toUpdateHotelMegs(id, item, Arr) {
      let t = this;
      t.isUpdataHotelMegs = true;
      uni.setStorageSync("hotelId", id);
      uni.setStorageSync("hotelArr", Arr);
      console.log(Arr, "获取指定数组");
      console.log(item, "更改的酒店itemitem");
      console.log(id, "更改的酒店ididid");
    },
    /* 管理员确定修改酒店信息 */
    toUpdateHotelCofirm() {
      let t = this,
        id = uni.getStorageSync("hotelId"),
        Arr = uni.getStorageSync("hotelArr");
      let data = {
        hotelId: id,
        hotelName: t.newHotelName,
        hotelPrice: t.newHotelPrice
      };
      t.$utils.ajax(t.$api.toUpdateHotelMegs, "post", data, res => {
        console.log(res);

        // Arr.map((v, i, arr) => {
        //   if (v.id == id) {
        //     arr.splice(i, 1);
        //     return arr;
        //   }
        // });
        // console.log(Arr, "删除之后的指定数组");
        t.$utils.showToast(res.msg);

        Arr.map((v, i, arr) => {
          console.log(2222);

          if (v.id == id) {
            console.log(11111);

            if (data.hotelName) {
              v.hotel_name = t.newHotelName;
            }
            if (data.hotelPrice) {
              v.hotel_price = t.newHotelPrice;
            }
            console.log(arr, "arrarr");
            t.showList = arr;
            return arr;
          }
        });
        uni.removeStorageSync("hotelId");
        uni.removeStorageSync("hotelArr");
      });
    },
    /* 管理员修改景点信息 */
    toUpdeGoodDetal(id, item, Arr) {
      let t = this;
      t.isUpdataGoodMegs = true;
      uni.setStorageSync("goodId", id);
      uni.setStorageSync("goodArr", Arr);
      console.log(Arr, "获取指定数组");
      console.log(item, "更改的景点itemitem");
      console.log(id, "更改的景点ididid");
    },
    /* 管理员确定更改景点信息 */
    toUpdateGoodCofirm() {
      let t = this,
        id = uni.getStorageSync("goodId"),
        Arr = uni.getStorageSync("goodArr");
      let data = {
        goodId: id,
        goodName: t.newGoodName,
        goodIntroduce: t.newGoodIntroduce
      };
      t.$utils.ajax(t.$api.toUpdateGoodMegs, "post", data, res => {
        console.log(res);
        t.$utils.showToast(res.msg);

        Arr.map((v, i, arr) => {
          console.log(2222);

          if (v.id == id) {
            console.log(11111);
            if (data.goodName) {
              v.good_name = t.newGoodName;
            }
            if (data.goodIntroduce) {
              v.introduce = t.newGoodIntroduce;
            }
            console.log(arr, "arrarr");
            t.showList = arr;
            return arr;
          }
        });
        uni.removeStorageSync("goodId");
        uni.removeStorageSync("goodArr");
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