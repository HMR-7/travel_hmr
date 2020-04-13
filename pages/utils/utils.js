import * as api from '../siteinfo/siteinfo'

const utils = {
  getSetting: (fn) => {
    let t = this;
    uni.getSetting({
      success: result => {
        console.log(result, '6666666');
        let {
          "scope.userInfo": a
        } = result.authSetting;
        console.log(a, 'aaaaaaaaaaaaaaa');
        if (a === undefined) return;
        uni.setStorageSync("authSetting.userInfo", a);
        fn(result)
      },
      fail: () => {},
      complete: () => {}
    });
  },

  setAppTitile: (str) => {
    uni.setNavigationBarTitle({
      title: str
    });
  },
  showToast: (str, img, status) => {
    let icon = 'success'
    if (status == status) icon = status
    if (!status || status == undefined) icon = 'none';

    uni.showToast({
      title: str,
      icon: icon,
      image: img,
      duration: 2000
    });
  },
  showModal(str, fn, cancel) {
    cancel = cancel ? cancel : ''
    uni.showModal({
      title: '温馨提示',
      content: str,
      success: (res) => {
        if (res.confirm) {
          fn()
        } else if (res.cancel) {
          if (cancel) {
            cancel()
          }
        }
      }
    })
  },
  // 二维码格式化
  getURLComponent(object) {
    let r = decodeURIComponent(object).split('&')
    var newArr = {}
    for (let i = 0; i < r.length; i++) {
      let kye = r[i].split('=')[0]
      let value = r[i].split('=')[1]
      newArr[kye] = value
    }
    return newArr
  },
  /* 一键复制 */
  setClipboardData(str) {
    uni.setClipboardData({
      data: str,
      success: function () {
        uni.showToast({
          title: "复制成功",
          icon: "success",
          duration: 1000
        });
        console.log(str, 'str');
      }
    });
  },
  /* 函数节流，防止多次点击 */
  throttle(fn, gapTime) {
    console.log(fn, gapTime);
    if (gapTime == null || gapTime == undefined) {
      gapTime = 2000;
    }
    let lastTime = null;
    console.log(lastTime, 'lastTime');
    return function () {
      let nowTime = +new Date();
      if (nowTime - lastTime > gapTime || !lastTime) {
        fn();
        lastTime = nowTime;
      }
    }
  },
  showLoading: (str = '加载中') => {
    uni.showLoading({
      title: str
    });
  },
  // ajax请求
  /* ajax: function (url, method, data, resolve) {
    var f = utils.apiCannotLoading(url)
    if (!f) {
      utils.showLoading()
    }
    if (!data) {
      data = {}
    }
    let userInfo = uni.getStorageSync('userInfo')
    console.log('userInfo', userInfo)
    if (userInfo) {
      data.user_id = userInfo.id
      data.sign = userInfo.sign
      data.openid = userInfo.openid
    }
    console.log('请求开始数据打印---------------')
    console.log(data)
    uni.request({
      url: api.config.url + url, //仅为示例，并非真实接口地址。
      method: method,
      data: data,
      header: {
        "Yuyuan-Api": "yuyuan-api",
        "content-type": "application/x-www-form-urlencoded",
        "request-header": "YuYuanApi"
      },
      success: (res) => {
        // uni.hideLoading();
        let statusCode = res.statusCode
        if (statusCode === 500) {
          if (url == 'userLogin') {
            resolve()
            return
          }
          utils.showToast('网络异常, 请稍后重试', false)
          return
        }
        let r = res.data,
          code = r.code
        console.log('请求结束数据返回---------------', res)
        console.log("code", code);
        if (code == 40001) {
          utils.showToast(r.msg, false)
          return

        }
        if (code == 100000) {
          utils.showToast(r.msg, false)
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/page/login/login',
              complete: function (res) {
                console.log(res)
              }
            })
          }, 1100)
        }
        if (code == 0) {
          utils.showToast(r.msg, false)
        } else {
          if (resolve) {
            resolve(r.data, code, r.msg)
          }
        }
      },
    });
  }, */
  ajax: function (url, method, data, resolve) {
    console.log(url, 'uel');
    console.log(method, 'method');
    console.log(data, 'data');
    console.log(resolve, 'resolve');
    if (!data) {
      data = {}
    }
    uni.request({
      url: url, //仅为示例，并非真实接口地址。
      method: method,
      data: data,
      header: {
        "custom-header": "application/x-www-form-urlencoded" //自定义请求头信息
      },
      success: (res) => {
        console.log(res.data);
        if (resolve) {
          resolve(res.data)
        }
      },
      fail: (err) => {
        console.log(err);

      }
    });
  },

  // 不加载loading
  apiCannotLoading: (url) => {
    console.log(url, 'url');

    var flag = false,
      urls = [
        'favoriteGood',
        'indexGoodList',
        'indexGoodCateList',
        'goodDetail',
        'cateGoodsList',
        'getKeywords',
        'systemInfo',
        'userInfo',
        'searchGoodsList',
        'tagsList',
        'bannerList',
        'viewGoodList',
        'favoriteGoodList',
        'allGoodCateList',
        'getGoodNumber',
        'numberSearchGoodsList'
      ]
    let f = utils.mapIndex(urls, url)

    if (f >= 0) {
      flag = true
    }
    return flag
  },
  // 手机号验证
  checkPhone(phone) {
    const reg = /^[1][3-9][0-9]{9}$/;
    if ((!reg.test(phone)) && phone) {
      utils.showToast('请输入正确的手机号')
      return false
    }
    return true
  },
  // 身份证验证
  checkIdcard(Idcard) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if ((!reg.test(Idcard)) && Idcard != '') {
      utils.showToast('请输入正确的身份证')
      return false
    }
    return true

  },
  //验证码校验
  checkCode(code) {
    const reg = /^[0-9]*$/;
    if ((!reg.test(code)) && code) {
      utils.showToast('请输入正确的验证码')
      return false
    }
    return true
  },
  // 姓名验证
  checkName(name) {
    const reg = /^[\u4e00-\u9fa5]+$/;
    if ((!reg.test(name)) && name) {
      utils.showToast('请输入正确的用户名')
      return false
    }
    return true
  },
  // 邮箱验证
  checkMail(mail) {
    const reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
    if ((!reg.test(mail)) && mail) {
      utils.showToast('请输入正确的邮箱')
      return false
    }
    return true

  },
  // 获取用户信息
  getSystemInfo() {
    return uni.getSystemInfo({
      success: function (res) {
        uni.setStorageSync('decevice', res)
      }
    })
  },
  checkLogin(fn) {
    let us = uni.getStorageSync('userInfo')
    // if(us){
    //   if(us.login_pay==0&&us.is_login_pay==1){
    //     uni.redirectTo({
    //       url:'/pages/appointment/login/index'
    //     })
    //   }
    // }
    if (!us) {
      utils.showToast('请先登录', false)
      setTimeout(() => {
        uni.redirectTo({
          url: '/pages/page/login/login',
          complete: function (res) {
            console.log(res)
          }
        })
      }, 1100)
      return false;
    } else {
      // fn(us)
      return true;
    }
  },
  getTime() {
    let d = new Date()
    let nd = d.getDate() // 今日
    let month = d.getMonth() + 1 // 月份
    let y = d.getFullYear()
    let h = utils.formate(d.getHours())
    let m = utils.formate(d.getMinutes())
    let s = utils.formate(d.getSeconds())
    let date = y + '-' + month + '-' + nd + ' ' + h + ':' + m + ':' + s
    return date
  },
  formate(time) {
    if (time >= 10) {
      return time
    } else {
      return `0${time}`
    }
  },
  formatDate: function (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return year + '-' + month + '-' + day
  },
  formatYear: function (date) {
    const year = date.getFullYear()
    return year
  },
  /*  富文本解析 */
  formatRichText: function (html) {
    let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
      match = match.replace(/style=""/gi, '').replace(/style=''+'/gi, '');
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
    });
    newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
      match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
    });
    newContent = newContent.replace(/<br[^>]*\/>/gi, '');
    newContent = newContent.replace(/\<img/gi, `<img style="max-width:100%!important;height:auto!important;display:block!important;margin-top:0!important;margin-bottom:0!important;"`);

    return newContent;
  },
  mapIndex(arr, key) {
    // console.log(arr, key)    
    const idxMap = new Map()
    arr.forEach((v, i) => {
      idxMap.set(v, i)
    })
    return idxMap.has(key) ? idxMap.get(key) : -1
  },
  // 上传
  upLoad(url, filePath, name, formData, resolve) {
    // let userInfo = uni.getStorageSync('userInfo')
    /* let formData = {}
    if (userInfo) {
      formData.user_id = userInfo.id
      formData.openid = userInfo.openid
      formData.sign = userInfo.sign
    } */
    // console.log(formData)
    const uploadTask = uni.uploadFile({
      url: api.config.url + url,
      filePath: filePath,
      name: name,
      formData: formData,
      header: {
        "Yuyuan-Api": "yuyuan-api",
        "content-type": "application/x-www-form-urlencoded",
        "request-header": "YuYuanApi"
      },

      complete: (res) => {
        resolve(res)
      }
    })
    uploadTask.onProgressUpdate((res) => {
      if (name == 'files') {
        let videoLength = (res.totalBytesSent) / 1024 / 1024
        if (videoLength > 8) {
          uploadTask.abort()
          utils.showToast('视频大小超过80MB, 请重新上传', false)
        }
      } else if (name == 'image') {
        let imgLength = (res.totalBytesSent) / 1024 / 8
        console.log(imgLength, 'imgLengthimgLengthimgLength');
        if (imgLength > 2048) {
          uploadTask.abort()
          utils.showToast('图片超过100KB, 请重新上传')
        }
      }
    })
  },
  /* 输入框输入当前年月日 */
  getnowDate(y, m, d) {
    let year = y,
      month = m,
      nowDate = Number(d);
    if (String(year).length == 4) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        if (month == 2 && nowDate > 29) {
          console.log("闰年");
          nowDate = 29;
        }
      } else {
        if (month == 2 && nowDate > 28) {
          console.log("非闰年");
          nowDate = 28;
        }
      }
    }
    let month_31 = [1, 3, 5, 7, 8, 10, 12];
    let month_30 = [4, 6, 9, 11];
    month_31.some((v, i, arr) => {
      if (month == v && month != 2) {
        if (nowDate > 31) {
          nowDate = 31;
        }
        return true;
      }
    });
    month_30.some((v, i, arr) => {
      if (month == v && month != 2) {
        if (nowDate > 30) {
          nowDate = 30;
        }
        return true;
      }
    });
    if (nowDate == 0) {
      return ''
    } else {
      return nowDate
    }
  },
  getMonth(y, m, d) {
    let
      year = y,
      month = Number(m),
      nowDate = d;

    if (month > 12) {
      month = 12;
    }
    if (String(year).length == 4) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        console.log("闰年");
        if (month == 2 && nowDate > 29) {
          nowDate = 29;

        }
      } else {
        console.log("非闰年");
        if (month == 2 && nowDate > 28) {
          nowDate = 28;

        }
      }
      let month_31 = [1, 3, 5, 7, 8, 10, 12];
      let month_30 = [4, 6, 9, 11];
      month_31.some((v, i, arr) => {
        if (month == v && month != 2) {
          if (nowDate > 31) {
            nowDate = 31;
          }
          console.log("31天");
          return true;
        }
      });
      month_30.some((v, i, arr) => {
        if (month == v && month != 2) {
          if (nowDate > 30) {
            nowDate = 30;
          }
          console.log("30天");
          return true;
        }
      });
    }
    if (month == 0) {
      month = ''
      return {
        month,
        nowDate
      };
    } else {
      return {
        month,
        nowDate
      };
    }
  },
  getYear(y, m, d) {
    let
      year = Number(y),
      month = m,
      nowDate = d;
    if (String(year).length == 4) {
      console.log(year, "年份");
      console.log(month, "月份");
      console.log(nowDate, "日期");
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        console.log("闰年");
        if (month == 2 && nowDate > 29) {
          nowDate = 29;

        }
      } else {
        if (month == 2 && nowDate > 28) {
          console.log("非闰年");
          nowDate = 28;

        }
      }
    }
    if (year == 0) {
      year = '';
      return {
        year,
        nowDate
      }
    } else {
      return {
        year,
        nowDate
      }
    }
  },
  /* <view class="selDate">
      <input type="number" v-model="Year" @input="getyear(Year,Month,nowDate)" maxlength="4" />年
      <input type="number" v-model="Month" maxlength="2" @input="getmonth(Year,Month,nowDate)" />月
      <input type="number" v-model="nowDate" maxlength="2" @input="getnowdate(Year,Month,nowDate)" />日
    </view> */
  /* Echats图 */
  showColumn(e, canvasId, chartData) {
    var chart = new uCharts({
      $this: e,
      canvasId: canvasId,
      type: "area",
      fontSize: 11,
      legend: true,
      dataLabel: false,
      dataPointShape: true,
      background: "#FFFFFF",
      pixelRatio: e.pixelRatio,
      categories: chartData.categories,
      series: chartData.series,
      animation: true,
      enableScroll: true, //开启图表拖拽功能
      xAxis: {
        type: "grid",
        gridType: "dash",
        itemCount: 6, //x轴单屏显示数据的数量，默认为5个
        scrollShow: true, //新增是否显示滚动条，默认false
        scrollAlign: "left", //滚动条初始位置
        scrollBackgroundColor: "#F7F7FF", //默认为 #EFEBEF
        scrollColor: "#0ea391" //默认为 #A6A6A6
      },
      yAxis: {
        title: '单位/伏特',
        gridType: "dash",
        gridColor: "#CCCCCC",
        //   dashLength: 5,
        splitNumber: 5,
        format: val => {
          return val.toFixed(0) + "V";
        }
        // min: 1,
        // max: 30
      },
      width: e.cWidth * e.pixelRatio,
      height: e.cHeight * e.pixelRatio,
      /* 配置用户点击显示事件 */
      extra: {
        area: {
          type: "straight",
          opacity: 0.2,
          addLine: true,
          width: 2
        },
        tooltip: {
          showBox: true, //是否显示半透明黑色的提示区域
          bgColor: "#000000", //主体背景颜色
          bgOpacity: 0.7, //背景颜色透明度
          gridType: "dash", //辅助线类型（虚线）
          dashLength: 5, //虚线单段长度
          gridColor: "#1890ff", //辅助线颜色
          fontColor: "#FFFFFF", //主体文字颜色
          horizentalLine: true, //是否显示横向辅助线
          xAxisLabel: true, //是否显示X轴辅助标签
          yAxisLabel: true, //是否显示Y轴辅助标签
          labelBgColor: "#DFE8FF", //标签背景颜色
          labelBgOpacity: 0.95, //背景颜色透明度
          labelFontColor: "#666666" //标签文字颜色
        }
      }
    });
    return chart
  },

}

export default utils