/* 公司地址 */
const http = 'http://192.168.88.121:3000/'
// const http = 'http://192.168.1.106:3000/'
const api = {
    userInfo: http + 'userInfo', //用户登录
    detail: http + 'detail', // 用户登录
    getKeywords: http + 'getKeywords', //获取联想词
    getSwiper: http + 'getSwiper', //获取轮播图
    submitFeedback: http + 'submitFeedback', //旅游日志填写
    getSearchResult: http + 'getSearchResult', //搜索结果
}

export default api