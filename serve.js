const express = require("express");
const mysql = require("mysql");
// const cors = require("cors")
var app = express();
var conn = mysql.createConnection({
    multipleStatements: true
});
// app.use(cors({
//     origin: ['http://localhost:8081'],
//     methods: ['get', 'post'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))
/* 家用数据库 */
/* var conn = mysql.createConnection({
    host: "192.168.1.106",
    port: "3306",
    user: "root",
    password: "123456",
    database: "travel"
}); */
//连接数据库
var conn = mysql.createConnection({
    host: "192.168.88.121",
    port: "3306",
    user: "root",
    password: "123456",
    database: "travel"
});
//2.发送请求(查询)
/* 查询用户是否已经注册完毕， */
app.get("/userInfo", function (req, res) {
    console.log(req.query, 'get请求前端传递到后端的参数')
    let Sqldata = req.query;
    const sql = "SELECT openid,id FROM userInfo"
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        console.log(Sqldata, '传递的数据');

        console.log(data, '数据库');
        data.some(value => {
            if (value.openid == Sqldata.openid) {
                res.send(value)
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
    var a = [];
    console.log(reData, '前端参数');
    console.log(reData.class == 0);

    const sql = "SELECT good_name FROM detail where good_name like '%" + reData.keyword + "%' "
    const sql1 = "SELECT food_name as good_name FROM food where food_name like '%" + reData.keyword + "%' "
    const sql2 = "SELECT hotel_name as good_name FROM hotel where hotel_name like '%" + reData.keyword + "%' "
    if (reData.class == 1) {
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            data.map(v => {
                v.class = 0;
            })
            res.send(data);
            return
        })
    } else {
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            data.map(v => {
                v.class = 0;
            })
            a = [...data];
            console.log(a, 'resultresult1');
        })
        conn.query(sql1, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            data.map(v => {
                v.class = 1;
            })
            a = [...a, ...data];
            console.log(a, 'resultresult2');
        })
        conn.query(sql2, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            data.map(v => {
                v.class = 2;
            })
            a = [...a, ...data];
            console.log(a, 'resultresult3');
            res.send(a);
        })
    }


});
/* 写日志时，获取景区联想词 */
app.get("/getScenicwords", function (req, res) {
    let reData = req.query;
    const sql = "SELECT good_name FROM detail where good_name like '%" + reData.keyword + "%' "
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        a = [...data];
        console.log(a, 'resultresult1');
    })


});
/* 详情页获取轮播图数据 */
app.get("/getSwiper", function (req, res) {
    let Sqldata = req.query;
    console.log(Sqldata, 'get获取的前端参数');
    // const sql = "SELECT swipeArr FROM detail where id =" + req.query.good_id + ""
    const sql = "select * from detail where id =" + req.query.good_id + ""
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        let swiperArr = data[0].swipeArr.split(",");
        let tags = data[0].tags.split(",");
        data[0].swipeArr = swiperArr;
        data[0].tags = tags;

        // console.log(swiperArr, 'swiperArrswiperArrswiperArr');
        res.send(data[0]);
        console.log(data[0], 'resultresult');
    })
});

/* 获取用户上传日志、照片 */
app.post("/submitFeedback", function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        const insertsql = 'insert into travellog(user_id,user_head,user_name,article) values(?,?,?,?)';
        conn.query(insertsql, [data.user_id, data.user_head, data.user_name, data.article], function (err) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "注册失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "提交成功",
                    flag: 'yes'
                });
            }
        })
        return
    })

})

/* 根据关键词查询 */
app.get("/getSearchResult", function (req, res) {
    let Sqldata = req.query;
    console.log(Sqldata, 'get获取的前端参数');
    
    const sql = "select * from detail where good_name ='" + Sqldata.good_name + "'"
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        res.send(data);
    })
})
app.listen(3000, () => {
    console.log('服务器已启动');

});