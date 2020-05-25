// import * as api from '../siteinfo/siteinfo'

const utils = {
  getSetting: (fn) => {
    let t = this;
    uni.getSetting({
      success: result => {
        console.log(result, '6666666');
        let {
          "scope.userInfo": a
        } = result.authSetting;
        if (a === undefined) return;
        uni.setStorageSync("authSetting.userInfo", a);
        fn(result)
      },
      fail: () => {},
      complete: () => {}
    });
  },
  /* 动态设置标题 */
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
  /* 一键复制 */
  setClipboardData(str) {
    console.log(str, 'strstr');
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
  showLoading: (str = '加载中') => {
    uni.showLoading({
      title: str
    });
  },
  // ajax请求
  ajax: function (url, method, data, resolve) {
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
        console.log('请求数据打印---------');

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
  // 接口不加载loading
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
  // 检查是否已经登陆
  checkLogin(fn) {
    // let us = uni.getStorageSync('userInfo')
    let us = uni.getStorageSync('UserId');

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

}

export default utils