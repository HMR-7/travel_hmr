<template>
  <view class="content" v-if="goodDetail">
    <van-popup
      :show="closeCanvas"
      @close="toCloseCanvas"
      custom-style="margin:0;background-color:rgba(0,0,0,0);"
    >
      <view id="canvas-container" v-if="closeCanvas">
        <canvas canvas-id="myCanvas" style="width:700rpx; height:450rpx"></canvas>
      </view>
      <button
        v-show="posterPath"
        style="margin-top:20rpx;background-color: var(--themeColor);color: #fff;"
        @tap="saveImg"
      >保存</button>
    </van-popup>
    <!-- 轮播图 -->
    <view style="position :relative">
      <swiper
        class="img-container"
        indicator-dots="true"
        indicator-color="var(--detailColor)"
        indicator-active-color="var(--themeColor)"
        circular
        autoplay
      >
        <block v-for="(item, index) in imgArr" :key="index">
          <swiper-item class="item">
            <!-- <view class="swiper_title">{{item.title}}</view> -->
            <image
              class="itemImg"
              :class="{active:currentIndex==index}"
              :src="item"
              @tap="previewImage(imgArr,item,index)"
            />
          </swiper-item>
        </block>
      </swiper>
    </view>
    <!-- 景点简介部分 -->
    <view class="megs_box mar_bottom">
      <view class="header">
        <view class="title mar_bottom">
          <view>{{goodDetail.good_name}}</view>
          <view class="tags" v-for="(item,index) in goodDetail.tags" :key="index">
            <view>{{item}}</view>
          </view>
        </view>
        <!-- 商品收藏 -->
        <view
          :class="isCollect ==1?' icon-guanzhu1 icon_select_color':'icon-guanzhu2'"
          class="iconfont"
          style="font-size:40rpx;"
          @tap="handleCollect"
        ></view>
      </view>
      <view class="middle">
        <view class="price mar_bottom">{{goodDetail.introduce}}</view>
        <view style="color:#00a2ff; font-size:28rpx;" @tap="log=!log">
          {{traevlLength}}条点评
          <text style="color:#00a2ff;font-size:24rpx" class="iconfont icon-arrowRight"></text>
        </view>
      </view>
      <view class="bottom">
        <view
          class="place mar_bottom"
          v-if="goodDetail.address==null"
          style="
        color: #7a7e83;
        "
        >地址：暂无地址信息</view>
        <view
          class="place mar_bottom"
          v-if="goodDetail.address!=null"
          style="
        width: 500rpx;
        color: #7a7e83;
        "
        >地址：{{goodDetail.address}}</view>
        <view
          class="place mar_bottom"
          v-if="goodDetail.good_price==undefined"
          style="color:var(--priceColor)"
        >门票价：--元/起</view>
        <view
          class="place mar_bottom"
          v-if="goodDetail.good_price!=undefined"
          style="color:var(--priceColor)"
        >门票价：{{goodDetail.good_price}}元/起</view>
      </view>
    </view>
    <!-- 门票信息-使用自定义滑动组件 -->
    <!-- <swiper-action @swiperAction="handleSwiperAction">
      <view class="TicketMegs">
        <view class="title">门票信息</view>
        <view class="TicketPrice">
          <view class="PriceTitle">
            成人票
            <view
              v-if="goodDetail.good_price==undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor); "
            >￥--元/起</view>
            <view
              v-if="goodDetail.good_price!=undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor); "
            >￥{{goodDetail.good_price}}元/起</view>
          </view>
        </view>
        <view class="TicketPrice">
          <view class="PriceTitle">
            儿童票
            <view
              v-if="goodDetail.childTicket==undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >￥--元/起</view>
            <view
              v-if="goodDetail.childTicket!=undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >￥{{goodDetail.childTicket}}元/起</view>
          </view>
        </view>
        <view class="selMorePrice">详情可到景区售票处询问</view>
      </view>
    </swiper-action>-->
    <view v-if="!log">
      <!-- 门票信息 -->
      <view class="TicketMegs">
        <view class="title">门票信息</view>
        <!-- 门票价格 -->
        <view class="TicketPrice">
          <view class="PriceTitle">
            成人票
            <view
              v-if="goodDetail.good_price==undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >￥--元/起</view>
            <view
              v-if="goodDetail.good_price!=undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor); "
            >￥{{goodDetail.good_price}}元/起</view>
          </view>
        </view>
        <view class="TicketPrice">
          <view class="PriceTitle">
            儿童票
            <view
              v-if="goodDetail.childTicket==undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >￥--元/起</view>
            <view
              v-if="goodDetail.childTicket!=undefined"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >￥{{goodDetail.childTicket}}元/起</view>
          </view>
        </view>
        <!-- 详情咨询提示 -->
        <view class="selMorePrice">详情可到景区售票处询问</view>
      </view>
      <!-- 美食推荐列表 -->
      <view
        style="margin:20rpx;border-radius: 20rpx;overflow: hidden;box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);"
      >
        <view class="scrollTitle">蓬莱美食推荐</view>
        <scroll-view class="foodScroll" scroll-y="true" @scrolltolower="refrechFoodList">
          <view v-for="(item,index) in foodList" :key="index">
            <view class="foodTitle">{{item.food_name}}</view>
          </view>
        </scroll-view>
      </view>
      <!-- 附近酒店信息 -->
      <view class="TicketMegs">
        <view class="title">附近酒店信息</view>
        <view class="TicketPrice" v-if="hotelList.length==0" style="text-align:center;">暂无可推荐酒店</view>

        <!-- 酒店信息价格 -->
        <view class="TicketPrice" v-for="(item,index) in hotelList" :key="index">
          <view class="PriceTitle" @tap="hotelDetail(item.id)">
            <view v-if="item.hotel_name==undefined" style="font-size:32rpx;">--</view>
            <view v-if="item.hotel_name!=undefined" style="font-size:32rpx;">{{item.hotel_name}}</view>
            <view
              v-if="item.hotel_price==null"
              style="ffont-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >{{item.hotel_price}}</view>
            <view
              v-if="item.hotel_price!=null"
              style="font-size:24rpx;font-weight:bolder;color: var(--priceColor);"
            >¥{{item.hotel_price}}元/起</view>
            <!--   <view
            v-if="item.hotel_name==undefined"
            style="font-size:24rpx;font-weight:bolder;color: var(--priceColor); "
          >--</view>
          <view
            v-if="item.hotel_name!=undefined"
            style="font-size:24rpx;font-weight:bolder;color: var(--priceColor); "
            >￥{{item.hotel_name}}元/起</view>-->
          </view>
        </view>
        <!-- 详情咨询提示 -->
      </view>
      <van-popup :show="showHotelDetail" @close="showHotelDetail=false" @catchtouchmove="move">
        <view class="handlehotelMegs" :key="index">
          <swiper
            class="img-container"
            indicator-dots="true"
            indicator-color="var(--detailColor)"
            indicator-active-color="var(--themeColor)"
            circular
            autoplay
          >
            <block v-for="(item1, index1) in hotelDetailMegs.src" :key="index1">
              <swiper-item class="item">
                <image
                  class="itemImg"
                  :class="{active:currentIndex==index}"
                  :src="item1"
                  @tap="previewImage(hotelDetailMegs.src,item1,index)"
                />
              </swiper-item>
            </block>
          </swiper>
          <view class="hotelName">{{hotelDetailMegs.hotel_name}}</view>
          <view class="bottom">
            <view class="hotelAddress">酒店地址：{{hotelDetailMegs.hotel_address}}</view>
            <view
              class="hotelPrice"
              style="color:var(--priceColor)"
            >¥{{hotelDetailMegs.hotel_price}}元/起</view>
          </view>
          <view class="hotelPhone"></view>
        </view>
      </van-popup>
    </view>
    <view v-if="log" :class="log?'animated fadeIn':''">
      <view class="logTitle">
        <text class="iconfont icon-zuixin"></text>最新热评
      </view>
      <view v-if="!traevlLength" style="background-color:#fff;text-align:center">赶紧来占个沙发吧！</view>
      <view class="logContent" v-for="(item,index) in traevlList" :key="index">
        <view v-if="traevlLength" class="logContentHead">
          <view class="userHeadImage">
            <image :src="item.user_head" mode="widthFix" />
          </view>
          <view class="userMegs">
            <view>{{item.user_name}}</view>
            <view style="color:#7a7e83;font-size:18rpx">
              {{item.time}}
              <text style="font-size:20rpx">发表</text>
            </view>
          </view>
        </view>
        <scroll-view scroll-y="true" class="logContentNav">
          <view>{{item.article}}</view>
        </scroll-view>
        <!-- <view class="logContentNav">
        </view>-->
      </view>
    </view>
    <!-- 分享好友、生成海报功能 -->
    <view class="share">
      <button hover-class="none" open-type="share" class="moudle" style="margin-right:20rpx">分享好友</button>
      <view
        @click="createPoster"
        class="moudle"
        style="background-color: var(--themeColor);color: #fff;border:none;"
      >生成海报</view>
    </view>
    <!-- 用户日志发布区域 -->
    <view
      v-if="log==1"
      @tap="toWriteLog"
      class="iconfont icon-tianxie"
      style="color:var(--themeColor);font-size:80rpx;position: fixed;top: 80%;left: 86%;background-color: var(--contentBgc);border-radius: 100%;background: rgba(0,0,0,0);}"
    ></view>
    <van-popup :show="writeLog" position="bottom" @close="writeLog=false">
      <view class="travellog" v-if="writeLog">
        <view class="title">旅游日志</view>
        <view style="padding:0 20rpx">
          <textarea
            class="sugs"
            cursor-spacing="100"
            placeholder-style="padding-left:20rpx"
            placeholder="请输入内容"
            maxlength="-1"
            @input="onInput"
          ></textarea>
        </view>
        <view class="sumbit" @tap="confirm">提交</view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import { swiperAction } from "@/components/swiperAction";
import moment from "moment";
moment.locale("zh-cn");
export default {
  components: {
    swiperAction
  },
  data() {
    return {
      islogOpen: false,
      page: 1, //食物列表的页数
      isCollect: "", //是否被用户收藏
      writeLog: false, //是否显示日志页面
      log: 0, //判断是否显示日志
      user_id: "", //用户id
      good_id: "", //景点id
      good_name: "", //景点名称
      goodDetail: "", //商品详情
      hotelList: [], //附近酒店列表
      showHotelDetail: false, //获取用户点击的酒店详情
      hotelDetailMegs: [], //酒店详情
      foodList: [], //获取美食推荐列表
      traevlList: [], //获取旅游日志列表
      traevlLength: null, //日志总条数
      imgArr: "", //轮播图
      isCollect: "", //是否收藏
      suggests: null, //用户日志到发表内容
      posterPath: "",
      closeCanvas: false, //是否显示海报
      cardmg: "" //海报图片路径
    };
  },
  onPullDownRefresh() {
    let t = this;
    t.page = 1;
    t.goodDetail = "";
    t.hotelList = [];
    t.foodList = [];
    t.getGoodDetail();
    t.getHotelList();
    t.getFoodList();
    if (t.log) {
      t.traevlList = [];
      t.getTravelLog();
    }
    uni.stopPullDownRefresh();
  },
  /* 触底判断加载下一页 */
  onReachBottom(options) {
    let t = this,
      traevlList = t.traevlList;
    /* 判断是否加载下一页 */
    if (traevlList.length < 5) {
      console.log(111);
      return;
    } else if (traevlList.length >= 5) {
      t.page++;
      t.getTravelLog();
    }
  },
  created() {
    let t = this;
    t.user_id = uni.getStorageSync("UserId");
    t.goodDerail = {
      childTicket: "--",
      good_price: "--"
    };
  },
  onLoad(options) {
    let t = this;

    console.log(options);
    if (!options.log) {
    } else if (options.log == 1) {
      t.log = options.log;
      t.$utils.setAppTitile(options.good_name);
    }
    if (options.log == 0) {
      t.$utils.setAppTitile(options.name);
    } else {
      t.$utils.setAppTitile(options.name);
    }
    t.good_id = options.id;
    t.getGoodDetail();
    t.getHotelList();
    t.intoFooterList();
    t.getFoodList();
    t.getTravelLog();
  },
  methods: {
    /* 获取商品详情 */
    getGoodDetail() {
      let t = this;
      let data = {
        user_id: t.user_id,
        good_id: t.good_id
      };
      t.$utils.ajax(t.$api.getSwiper, "get", data, res => {
        console.log(res);
        t.cardImg = res[0].src;
        t.goodDetail = res[0];
        t.imgArr = res[0].swipeArr;
        if (t.user_id) {
          t.isCollect = res[1].iscollect;
        }
      });
    },
    /* 获取景点关联的酒店列表 */
    getHotelList() {
      let t = this;
      let data = {
        good_id: t.good_id
      };
      t.$utils.ajax(t.$api.getHotelList, "get", data, res => {
        console.log(res);
        t.hotelList = res;
        getApp().globalData.hotelList = res;
        console.log(getApp().globalData.hotelList);
      });
    },
    /* 获取用户查看的具体酒店信息 */
    hotelDetail(id) {
      let t = this,
        hotelList = t.hotelList;
      console.log(t.hotelDetailMegs, "hotelDetailMegs");
      if (t.hotelDetailMegs) {
        if (!t.hotelDetailMegs.src) {
          hotelList.some(v => {
            if (v.id == id) {
              console.log(v, "vvvvvvv");
              let hotelimgArr = v.src.split(",");
              v.src = hotelimgArr;
              t.hotelDetailMegs = v;
              return v;
            }
          });
        }
      }
      console.log(t.hotelDetailMegs, "酒店信息");
      if (t.hotelDetailMegs) {
        t.showHotelDetail = true;
      }
    },
    closeHotelDetail() {
      let t = this;
      t.showHotelDetail = false;
      t.hotelDetailMegs = [];
    },
    /* 获取美食推荐列表 */
    getFoodList() {
      let t = this,
        list = t.foodList,
        page = t.page;
      let data = {
        page: page,
        limit: 3
      };
      t.$utils.ajax(t.$api.getFoodList, "get", data, res => {
        list = [...list, ...res];
        console.log(list, "美食推荐列表");
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
        t.foodList = list;
      });
    },
    /* 加载美食列表 */
    refrechFoodList() {
      let t = this,
        foodList = t.foodList;
      /* 判断是否加载下一页 */
      if (foodList.length < 3) {
        console.log(111);
        return;
      } else if (foodList.length >= 3) {
        t.page++;
        t.getFoodList();
      }
    },
    /* 获取旅游日志推荐表 */
    getTravelLog(page1) {
      let t = this,
        list = t.traevlList,
        page = t.page;
      if (page1) page = page1;
      let data = {
        page: page,
        limit: 5,
        good_id: t.good_id
      };

      t.$utils.ajax(t.$api.getTravelLog, "get", data, res => {
        console.log(res, "旅游日志后端返回值");
        t.traevlLength = res.length;
        console.log(res.length);

        console.log(res.log, "旅游日志数组");
        res.log.map(v => {
          v.time = moment(v.time).format("YYYY-M-DD HH:mm:ss");
          console.log(v.time, "相对时间");
          return v;
        });
        /* 数组拼接 */
        if (t.log) {
          list = list.concat(res.log);
          console.log(list, "旅游日志列表");
          if (list.length == 0 && t.page == 1) {
            console.log(111);
          }
          if (res.log.length == 0 && t.page > 1) {
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
          t.traevlList = list;
          return;
          console.log(t.traevlList, "map之后的旅游日志");
        }
        t.traevlList = res.log;
        t.traevlLength = res.length;
      });
    },
    /* 记录用户足迹 */
    intoFooterList() {
      let t = this;
      let data = {
        user_id: t.user_id,
        good_id: t.good_id
      };
      t.$utils.ajax(t.$api.userFooter, "post", data, res => {
        console.log(res);
      });
    },
    /* 用户点击收藏 */
    handleCollect() {
      let t = this,
        good_id = t.good_id,
        user_id = t.user_id;
      console.log(good_id, "good_id");
      console.log(user_id, "user_id");

      if (!user_id) {
        t.$utils.checkLogin();
        return;
      }
      let data = {
        good_id: good_id,
        user_id: user_id
      };
      if (!user_id) {
        t.$utils.checkLogin();
        return;
      }
      t.$utils.ajax(t.$api.userCollect, "post", data, res => {
        console.log(res);
        console.log(res[1], "收藏字段");
        if (res.msg == "取消收藏成功") {
          t.isCollect = 0;
          setTimeout(() => {
            t.$utils.showToast("已取消收藏");
          }, 300);
        } else if (res.msg == "添加收藏成功") {
          t.isCollect = 1;
          setTimeout(() => {
            t.$utils.showToast("收藏成功");
          }, 300);
          console.log(t.isCollect);
        }
        if (t.isCollect == 1) {
        } else if (t.isCollect == 0) {
        }
      });
    },
    /* 轮播图点击预览 */
    previewImage(arr, item, index) {
      let t = this,
        imgSrc = arr;
      uni.previewImage({
        current: index,
        urls: imgSrc
      });
    },
    /* 用户对日志内容 */
    onInput(e) {
      let t = this,
        user_id = t.userid;
      t.suggests = e.detail.value;
    },
    /* 日志提交点击事件 */
    confirm() {
      let t = this,
        user_id = t.user_id,
        good_id = t.goodDetail.id,
        article = t.suggests;
      if (article == null) {
        t.$utils.showToast("请确认您是否已输入内容");
        return;
      }
      console.log(user_id, "useriduseriduserid");
      let userInfo = uni.getStorageSync("userInfo");
      let data = {
        good_id: good_id,
        user_id: user_id,
        user_head: userInfo.avatarUrl,
        user_name: userInfo.nickName,
        article: article
      };
      t.$utils.ajax(t.$page.submitFeedback, "post", data, res => {
        console.log(res);
        t.$utils.showToast("点评成功！");
        setTimeout(() => {
          t.traevlList = [];
          t.getTravelLog(1);
          t.writeLog = false;
          console.log(1111);
          // uni.switchTab({
          //   url: "./index"
          // });
        }, 1000);
      });
    },
    /* 生成海报 */
    createPoster() {
      let t = this;
      t.closeCanvas = true;
      t.getAvaterInfo(t.codeImg);
    },
    /* 下载图片 */
    getAvaterInfo: function() {
      uni.showLoading({
        title: "生成中...",
        mask: true
      });
      let t = this;
      uni.downloadFile({
        url: t.cardImg,
        success: function(res) {
          uni.hideLoading();
          if (res.statusCode === 200) {
            t.cardImg = res.tempFilePath;
            t.getCanvas(t.cardImg, res.tempFilePath);
          } else {
            uni.showToast({
              title: "未找到图片",
              icon: "none",
              duration: 2000
              // success: function() {
              //   t.cardImg = "";
              //   t.getCanvas(t.cardImg, res.tempFilePath);
              // }
            });
          }
        }
      });
    },
    /*用canvas绘制分享海报*/
    getCanvas(cardImg, codeImg) {
      let text = this.goodDetail.title;
      var t = this;
      uni
        .createSelectorQuery()
        .select("#canvas-container")
        .boundingClientRect(function(rect) {
          console.log(rect, "+++++++++++++++++++++++++++++++++++");
          // let content = t.goodDetail.title;
          let canvasWidth = rect.width;
          let canvasHeight = rect.height;
          // let textareaWidth = Math.ceil((canvasWidth - 40) / 16); //画布宽度除以字号
          // console.log(textareaWidth, "textareaWidth");
          const ctx = uni.createCanvasContext("myCanvas");
          ctx.setFillStyle("#f6f9fe");
          ctx.fillRect(0, 0, 350, 500);
          // ctx.setFillStyle("#8e8e92");
          ctx.setFillStyle("#8e8e92");
          ctx.setFontSize(12);
          ctx.setFillStyle("#000");
          ctx.fillText(t.goodDetail.introduce, 0, 218);
          ctx.setFillStyle("#fff"); // 文字颜色
          if (cardImg) {
            ctx.drawImage(cardImg, 0, 0, 350, 200);
          }
          ctx.draw(true, function() {
            t.saveShareImg();
          });
        })
        .exec();
    },
    /* 存入相册时设置的画布大小 */
    saveShareImg: function() {
      console.log(234234);
      var t = this;
      const ctx = uni.createCanvasContext("myCanvas");
      console.log(ctx, "cyxx");
      setTimeout(() => {
        uni.canvasToTempFilePath(
          {
            width: 350,
            height: 225,
            destWidth: 350,
            destHeight: 225,
            canvasId: "myCanvas",
            success: function(res) {
              console.log(res, "生成了");
              t.posterPath = res.tempFilePath;
              console.log(t.posterPath, "t.posterPatht.posterPatht.posterPath");
            },
            fail: function(fail) {
              console.log(fail, "失败");
              t.$utils.showToast("生成失败");
            },
            complete: function(res) {
              uni.hideLoading();
            }
          },
          this
        );
      }, 1000);
    },
    /* 保存到相册按钮 */
    saveImg() {
      let t = this;
      let tempFilePath = t.posterPath;
      console.log(tempFilePath, "21212112");
      uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success(res) {
          console.info(res);
          uni.showModal({
            content: "图片已保存到相册，赶紧晒一下吧~",
            showCancel: false,
            confirmText: "好的",
            confirmColor: "#333",
            success: function(res) {
              if (res.confirm) {
              }
            },
            fail: function(res) {}
          });
        },
        fail: function(res) {
          console.log(res);
          if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
            console.log("打开设置窗口");
            uni.openSetting({
              success(settingdata) {
                console.log(settingdata);
                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                  console.log("获取权限成功，再次点击图片保存到相册");
                } else {
                  console.log("获取权限失败");
                }
              }
            });
          }
        }
      });
    },
    toCloseCanvas() {
      let t = this;
      if (t.closeCanvas) t.closeCanvas = !t.closeCanvas;
    },
    toWriteLog() {
      let t = this,
        user_id = t.user_id;
      console.log(user_id, "user_id");
      if (!user_id) {
        t.$utils.checkLogin();
        return;
      } else {
        t.writeLog = true;
      }
    },
    /* 滑动组件事件 */
    handleSwiperAction(e) {
      // 获取子组件传递的数据
      console.log(e);
    }
  }
};
</script>

<style lang="less">
.content {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 150rpx;
  background-color: var(--contentBgc);
  .icon-guanzhu1 {
    color: #dd524d !important;
  }
  .mar_bottom {
    margin-bottom: 20rpx;
  }
  .dots {
    position: absolute;
    left: calc(50% - 80rpx);
    bottom: 10rpx;
    .isDots {
      display: inline-block;
      margin: 0 10rpx;
      font-size: 16rpx;
      width: 15rpx;
      height: 15rpx;
      line-height: 15rpx;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  /* 轮播图 */
  .img-container {
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
        /* z-index: 5; */
      }
    }
  }

  /* 景点简介 */
  .megs_box {
    width: 100%;
    background-color: #fff;

    /* 景点名称 */
    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 20rpx 20rpx 0 20rpx;
      box-sizing: border-box;

      /* 用户已收藏的显示图标 */
      .icon_select_color {
        color: #000;
      }

      .title {
        display: flex;
        flex-direction: row;
        font-size: var(--navFontSize);
        font-weight: bolder;

        .tags {
          margin: auto 0;

          view {
            margin-left: 10rpx;
            padding: 5rpx 20rpx;
            height: 20rpx;
            line-height: 20rpx;
            color: var(--themeColor);
            font-size: var(--stateBtnSize);
            border: 2rpx solid #0ea391;
            border-radius: 20rpx;
          }
        }
      }
    }

    .middle {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 20rpx;
      width: 100%;
      box-sizing: border-box;

      .price {
        width: 500rpx;
        color: #7a7e83;
        font-size: var(--smallFontSize);
        font-weight: bolder;
        box-sizing: border-box;
      }
    }

    .bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-right: 20rpx;
      font-size: 24upx;
      box-sizing: border-box;

      .place {
        padding-left: 20rpx;
        box-sizing: border-box;
      }
    }
  }

  /* 门票信息 */
  .TicketMegs {
    margin: 0 20rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

    .title {
      padding: 30rpx 0 20rpx 20rpx;
      color: var(--themeColor);
      font-size: var(--titleSize);
      font-weight: bolder;
      border-bottom: 2rpx solid #ededed;
    }

    /* 门票价格样式 */
    .TicketPrice {
      font-size: var(--navFontSize);
      height: 100rpx;
      line-height: 100rpx;

      .PriceTitle {
        margin: 0 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 2rpx solid #ededed;
      }
    }

    /* 详情咨询提示 */
    .selMorePrice {
      height: 80rpx;
      line-height: 80rpx;
      color: #00a2ff;
      font-size: 26rpx;
      text-align: center;
    }
  }

  /*  用户点击的酒店信息 */
  .handlehotelMegs {
    display: flex;
    flex-direction: column;
    padding: 20rpx;
    width: 650rpx;

    .hotelName {
      padding: 20rpx 0 20rpx 0;
      font-size: var(--navFontSize);
      font-weight: bolder;
    }

    .bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 24rpx;

      .hotelAddress {
        width: 500rpx;
        color: #7a7e83;
        font-weight: bolder;
        box-sizing: border-box;
      }

      .hotelPrice {
        box-sizing: border-box;
      }
    }
  }

  /* 美食推荐列表 */
  .scrollTitle {
    padding: 30rpx 0 20rpx 20rpx;
    color: var(--themeColor);
    font-size: var(--titleSize);
    font-weight: bolder;
    border-bottom: 2rpx solid #ededed;
    background-color: #fff;
  }

  /* 美食列表scroll标签 */
  .foodScroll {
    height: 300rpx;
    background-color: #fff;

    .foodTitle {
      margin: 0 20rpx;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: var(--navFontSize);
      height: 100rpx;
      line-height: 100rpx;
      border-bottom: 2rpx solid #ededed;
    }
  }

  /* 旅游日志列表-区域标题 */

  .logTitle {
    padding: 10rpx;
    font-size: 28rpx;
    height: 50rpx;
    line-height: 50rpx;
    background-color: #fff;

    .iconfont {
      padding-right: 10rpx;
      color: var(--themeColor);
      font-size: 36rpx !important;
    }
  }

  .logContent {
    border-bottom: 4rpx solid #f8f8f8;
    background-color: #fff;

    .logContentHead {
      display: flex;
      flex-direction: row;

      .userHeadImage {
        padding-top: 10rpx;
        padding-left: 20rpx;

        image {
          width: 100rpx;
          height: 100rpx;
          border-radius: 100%;
        }
      }

      .userMegs {
        margin: auto 0;
        padding-left: 20rpx;
      }
    }

    .logContentNav {
      padding-left: 140rpx;
      max-height: 160rpx;
      color: #292c32;
      font-size: 28rpx;
      box-sizing: border-box;
    }

    .openTag {
      position: absolute;
      bottom: 0rpx;
      right: 5rpx;
      color: #00a2ff;
      box-shadow: -30rpx 0rpx 10rpx rgba(255, 255, 255, 0.8);
      background-color: rgb(255, 255, 255);
    }

    .open {
      position: relative;
      padding-left: 100rpx;
      font-size: 28rpx;
    }
  }

  /* 页面分享模块 */
  .share {
    z-index: 100;
    position: fixed;
    bottom: 0rpx;
    padding-bottom: 20rpx;
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    padding: 0 20rpx;
    width: 100%;
    height: 150rpx;
    background-color: #fff;
    box-sizing: border-box;

    button {
      border: none !important;
      border-radius: 0 !important;
    }

    button::after {
      width: 0 !important;
      height: 0 !important;
      border: none !important;
      border-radius: 0 !important;
    }

    .moudle {
      flex: 1;
      margin-top: 20rpx;
      text-align: center;
      border: 2rpx solid #f7f7f7;
      height: 80rpx;
      line-height: 80rpx;
    }
  }

  /* 旅游日志 */
  /* 日志发表区域 */
  .travellog {
    margin-bottom: 20rpx;

    .title {
      padding: 30rpx 0 20rpx 20rpx;
      color: var(--themeColor);
      font-size: var(--titleSize);
      font-weight: bolder;
      border-top-left-radius: 20rpx;
      border-top-right-radius: 20rpx;
      border-bottom: 2rpx solid #ededed;
      background-color: #fff;
    }

    .sugs {
      margin-bottom: 40rpx;
      width: 100%;
      background-color: #f5f6fa;
      padding: 20rpx;
      box-sizing: border-box;
      border-bottom: 2rpx solid #ededed;
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
}
</style>
