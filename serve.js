const express = require("express");
const mysql = require("mysql");
// const cors = require("cors")
var app = express();
// app.use(cors({
//     origin: ['http://localhost:8081'],
//     methods: ['get', 'post'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))
/* 家用数据库 */
var conn = mysql.createConnection({
    host: "192.168.1.106",
    port: "3306",
    user: "root",
    password: "123456",
    database: "travel"
});
//连接数据库
/* var conn = mysql.createConnection({
    host: "192.168.88.121",
    port: "3306",
    user: "root",
    password: "123456",
    database: "travel"
}); */
//2.发送请求(查询)
/* 查询用户是否已经注册完毕， */
app.get("/userInfo", function (req, res) {
    console.log(req.query, 'get请求前端传递到后端的参数')
    let Sqldata = req.query;
    const sql = "SELECT openid FROM userInfo"
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        console.log(Sqldata, '传递的数据');

        console.log(data, '数据库');
        data.some(value => {
            if (value.openid == Sqldata.openid) {
                res.send(true)
                return true;
            }
        })
        // if (err) {
        //     console.log("连接失败", err);
        // } else {
        //     
        //     res.send(data);
        // }
    })
});
/* 用户注册插入表 */
app.post('/userInfo', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        const insertsql = 'insert into userInfo(nickName,userPhone,openid) values(?,?,?)';
        conn.query(insertsql, [data.userName, data.userPhone, data.openid], function (err) {
            if (err) {
                console.log(err);

                res.send({
                    msg: "注册失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "注册成功",
                    flag: 'yes'
                });
            }
        })
        return
    })
})
/* 获取首页推荐列表内容 */
app.get("/detail", function (req, res) {
    // let data = req.query;
    // const sql = "SELECT good_name FROM detail where good_name like '%" + data.title + "%' "
    // conn.query(sql, function (err, result) {
    //     console.log(sql);
    //     console.log(result,'resultresult');
    // })
    console.log(req.query, 'get请求前端传递到后端的参数')
    let data = req.query;
    let limit = Number(data.page - 1) * Number(data.limit);
    const sql = "SELECT * FROM detail limit " + limit + "," + data.limit;
    conn.query(sql, function (err, result) {
        if (err) {
            console.log("连接失败", err);
        } else {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            res.send(data);
        }
    })
});
/* 获取搜索联想词 */
app.get("/getKeywords", function (req, res) {
    let reData = req.query;
    const sql = "SELECT good_name FROM detail where good_name like '%" + reData.keyword + "%' "
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        res.send(data);
        console.log(data, 'resultresult');
    })
});
/* 详情页获取轮播图数据 */
app.get("/getSwiper", function (req, res) {
    let Sqldata = req.query;
    const sql = "SELECT swipeArr FROM detail where id =" + req.query.good_id + ""
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        var swiperArr = data[0].swipeArr.split(",");
        console.log(swiperArr, 'swiperArrswiperArrswiperArr');
        res.send(swiperArr);
        console.log(data, 'resultresult');
    })
});

app.listen(3000, () => {
    console.log('服务器已启动');

});