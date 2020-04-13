const express = require("express");
const mysql = require("mysql");
// const cors = require("cors")
var app = express();
// app.use(cors({
//     origin: ['http://localhost:8081'],
//     methods: ['get', 'post'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }))
//连接数据库
var conn = mysql.createConnection({
    host: "192.168.1.106",
    port: "3306",
    user: "root",
    password: "123456",
    database: "travel"
});
//2.发送请求(查询)
app.post('/userInfo', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        const insertsql = 'insert into userInfo(user_name,user_phone) values(?,?)';
        conn.query(insertsql, [data.userName, data.userPhone], function (err) {
            if (err) {
                res.send({ msg: "注册失败!!", flag: 'no' });
            } else {
                res.send({ msg: "注册成功", flag: 'yes' });
            }
        })
        return
        // let limit = Number(data.page - 1) * Number(data.limit);
        // console.log(limit);
        // const sql = "SELECT * FROM detail limit " + limit + "," + data.limit;
        // conn.query(sql, function (err, result) {
        //     if (err) {
        //         console.log("连接失败", err);
        //     } else {
        //         let _res = JSON.stringify(result)
        //         let data = JSON.parse(_res)
        //         res.send(data);
        //     }
        // })
    })
})
app.get("/detail", function (req, res) {
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
app.post("/detail", function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        let limit = Number(data.page - 1) * Number(data.limit);
        console.log(limit);
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
    })
});
app.get("/about", function (req, res) {

    console.log(req.query, '获得前端数据');
    console.log(req.query.id, 'id');
    const getSql = 'SELECT * FROM img';
    //用于存储结果的空string
    conn.query(getSql, function (err, result) {
        console.log(result, '获取结果');
        if (err) {
            console.log('SELECT ERROR: ' + err);
        } else {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            res.send(data);

        }
    });

});

app.listen(3000, () => {
    console.log('服务器已启动');

});