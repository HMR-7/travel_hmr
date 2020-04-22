// /* 公司地址 */
// const http = 'http://192.168.88.121:3000/'
// const http = 'https://120.53.93.29:3000/'
/* 家用地址 */
const http = 'https://hmr.nbxinyitec.com/'

const api = {
    userInfo: http + 'userInfo', //用户登录
    insertuserInfo: http + 'insertuserInfo',
    detail: http + 'detail', // 用户登录
    getKeywords: http + 'getKeywords', //获取联想词
    getSwiper: http + 'getSwiper', //获取轮播图
    submitFeedback: http + 'submitFeedback', //旅游日志填写
    getSearchResult: http + 'getSearchResult', //搜索结果
    getKeyWordSearchList: http + 'getKeyWordSearchList', //关键词搜索结果列表
    userCollect: http + 'userCollect', //添加、移除用户收藏表
    userFooter: http + 'userFooter', //添加、更新用户足迹表
    getCollectList: http + 'getCollectList', //查看用户收藏列表详情
    getFooterList: http + 'getFooterList', //查看用户足迹列表详情
    getHotelList: http + 'getHotelList', //获取景点到酒店推荐
    getFoodList: http + 'getFoodList', //获取本地美食推荐
    getTravelLog: http + 'getTravelLog', //获取旅游日志
    isAdminCheck: http + 'isAdminCheck', //管理员查询
    addFoodMegs :http + 'addFoodMegs' //管理员添加食物信息
}

export default api