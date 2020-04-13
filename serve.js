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
    host: "localhost",
    port: "3306",
    user: "root",
    password: "123456",
    database: "travel"
});
//2.发送请求(查询)
app.get("/detail", function (req, res) {
    console.log(req.query, 'get请求前端传递到后端的参数')
    const sql = "SELECT * FROM detail limit 0,10"
    conn.query(sql, function (err, result) {
        if (err) {
            console.log("连接失败", err);
        } else {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            res.send({
                "res": data
            });
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

app.listen(3000, () => {
    console.log('服务器已启动');

});