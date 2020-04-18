/* 公司地址 */
// const http = 'http://192.168.88.121:3000/'
/* 家用地址 */
const http = 'http://192.168.1.106:3000/'

const api = {
    userInfo: http + 'userInfo', //用户登录
    insertuserInfo : http + 'insertuserInfo' ,
    detail: http + 'detail', // 用户登录
    getKeywords: http + 'getKeywords', //获取联想词
    getSwiper: http + 'getSwiper', //获取轮播图
    submitFeedback: http + 'submitFeedback', //旅游日志填写
    getSearchResult: http + 'getSearchResult', //搜索结果
    keyWordSearchList:http +'keyWordSearchList',//关键词搜索结构列表
    userCollect:http+'userCollect',//添加、移除用户收藏表
    userFooter:http + 'userFooter', //添加、更新用户足迹表
    getCollectList:http + 'getCollectList' , //查看用户收藏列表详情
    getFooterList : http + 'getFooterList' , //查看用户足迹列表详情

}

export default api