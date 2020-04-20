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
// var conn = mysql.createConnection({
//     host: "192.168.88.121",
//     port: "3306",
//     user: "root",
//     password: "123456",
//     database: "travel"
// });
/* 连接个人服务器数据库 */
var conn = mysql.createConnection({
    host: "120.55.93.29",
    port: "3306",
    user: "hmr",
    password: "101216",
    database: "hmr"
});
//2.发送请求(查询)
/* 查询用户是否已经注册完毕， */
app.get("/userInfo", function (req, res) {
    let Sqldata = req.query;
    console.log(req.query, '用户登录get请求前端传递到后端的参数')
    const sql = "SELECT openid,id FROM userinfo where openid = '" + Sqldata.openid + "'"
    if (Sqldata.id) {
        const sql = "SELECT openid,id FROM userinfo where id = '" + Sqldata.id + "'"
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            data.some(value => {
                if ((value.openid == Sqldata.openid) || (value.id == Sqldata.id)) {
                    const selcollectsql = "select iscollect from collect where user_id =" + value.id + " and iscollect = 1"
                    console.log(selcollectsql, 'selcollectsqlselcollectsqlselcollectsqlselcollectsql');

                    conn.query(selcollectsql, function (err, result) {
                        let _res = JSON.stringify(result);
                        let data = JSON.parse(_res);
                        console.log(data, '已收藏列表');
                        let list = data.length;
                        value.CollectList = list;
                    })
                    const selfootersql = "select good_id from footer where user_id =" + value.id
                    conn.query(selfootersql, function (err, result) {
                        let _res = JSON.stringify(result);
                        let data = JSON.parse(_res);
                        console.log(data, '足迹列表');
                        let list = data.length;
                        value.FooterList = list;
                        res.send(value)
                    })
                }
            })
        })
    } else {
        conn.query(sql, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            console.log(Sqldata, '传递的数据');
            console.log(data, '数据库');
            if (data.length == 0) {
                res.send({
                    msg: false
                })
                return
            } else {
                data.some(value => {
                    if ((value.openid == Sqldata.openid) || (value.id == Sqldata.id)) {
                        const selcollectsql = "select iscollect from collect where user_id =" + value.id + " and iscollect = 1"
                        console.log(selcollectsql, 'selcollectsqlselcollectsqlselcollectsqlselcollectsql');

                        conn.query(selcollectsql, function (err, result) {
                            let _res = JSON.stringify(result);
                            let data = JSON.parse(_res);
                            console.log(data, '已收藏列表');
                            let list = data.length;
                            value.CollectList = list;
                        })
                        const selfootersql = "select good_id from footer where user_id =" + value.id
                        conn.query(selfootersql, function (err, result) {
                            let _res = JSON.stringify(result);
                            let data = JSON.parse(_res);
                            console.log(data, '足迹列表');
                            let list = data.length;
                            value.FooterList = list;
                            res.send(value)
                        })
                    }
                })
            }
        })
    }
});
/* 用户注册插入表 */
app.post('/insertuserInfo', function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        const insertsql = 'insert into userinfo(nickName,userPhone,openid) values(?,?,?)';
        conn.query(insertsql, [data.userName, data.userPhone, data.openid], function (err) {
            if (err) {
                console.log(err);

                res.send({
                    msg: "注册失败!!",
                    flag: 'no'
                });
            } else {
                const sql = "SELECT id FROM userinfo where openid = '" + data.openid + "'"
                conn.query(sql, function (err, result) {
                    let _res = JSON.stringify(result)
                    let data = JSON.parse(_res)
                    res.send(data);
                })

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
/* 用户主页搜索获取结果 */
app.get("/getKeyWordSearchList", function (req, res) {
    let reData = req.query;
    console.log(reData, '商品详情的前端参数');
    let limit = Number(reData.page - 1) * Number(reData.limit);
    const sql = "SELECT * FROM detail where good_name like '%" + reData.keyword + "%' limit " + limit + "," + reData.limit;
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
/* 根据商品id获取商品详情 */
app.get("/getSwiper", function (req, res) {
    let Sqldata = req.query;
    console.log(Sqldata, '商品详情get获取的前端参数');
    // const sql = "SELECT swipeArr FROM detail where id =" + req.query.good_id + ""
    const sql = "select * from detail where id =" + req.query.good_id
    const sqlcollect = "SELECT iscollect from collect WHERE user_id=" + req.query.user_id + "  AND good_id=" + req.query.good_id
    var theRes = ""
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        let swiperArr = data[0].swipeArr.split(",");
        let tags = data[0].tags.split(",");
        data[0].swipeArr = swiperArr;
        data[0].tags = tags;
        if (!Sqldata.user_id) {
            theRes = [data[0]]
            res.send(theRes)
            return
        } else if (Sqldata.user_id) {
            theRes = [data[0]]
        }
        // console.log(data[0], 'resultresult');
    })
    if (Sqldata.user_id) {
        conn.query(sqlcollect, function (err, result) {
            let _res = JSON.stringify(result)
            let data = JSON.parse(_res)
            if (data.length == 0) {
                data = [{
                    iscollect: 0
                }];
            }
            theRes = [...theRes, ...data]
            // console.log(theRes, 'theRes222222');
            res.send(theRes)
        })
    }
});
/* 获取用户上传日志 */
app.post("/submitFeedback", function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        const insertsql = 'insert into travellog(good_id,user_id,user_head,user_name,article) values(?,?,?,?,?)';
        conn.query(insertsql, [data.good_id, data.user_id, data.user_head, data.user_name, data.article], function (err) {
            if (err) {
                console.log(err);
                res.send({
                    msg: "发布失败!!",
                    flag: 'no'
                });
            } else {
                res.send({
                    msg: "发布成功",
                    flag: 'yes'
                });
            }
        })
        return
    })

})

/* 写日志时，搜索按钮的点击事件查询 */
app.get("/getSearchResult", function (req, res) {
    let Sqldata = req.query;
    console.log(Sqldata, 'get获取的前端参数');
    const sql = "select * from detail where good_name like '%" + Sqldata.good_name + "%'"
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        data.forEach((v, i, arr) => {
            arr[i].swipeArr = arr[i].swipeArr.split(",");
        });
        console.log(data, 'data');
        res.send(
            data
        );
    })
})
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
/* 添加、移除用户收藏表 */
app.post("/userCollect", function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data)
        console.log(data, 'post请求接受前端传递的参数');
        if (!data.user_id) {
            return
        }
        // let data = JSON.parse(_res)
        const sqlcollect = "SELECT iscollect from collect WHERE user_id='" + data.user_id + "'  AND good_id=" + data.good_id
        conn.query(sqlcollect, function (err, result) {
            // console.log(result, '------');
            let _res = JSON.stringify(result)
            let _data = JSON.parse(_res)
            if (_data.length == 0) {
                const sqlinsert = "insert into  collect (user_id,good_id,iscollect) values (" + data.user_id + "," + data.good_id + ",1)"
                conn.query(sqlinsert, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            msg: "操作失败",
                            flag: 'no'
                        });
                    } else {
                        res.send({
                            msg: "添加收藏成功",
                            flag: 'yes'
                        });
                    }
                })
            } else {
                let [{
                    iscollect
                }] = _data;
                // console.log({
                //     iscollect
                // }, '111111111111');
                // console.log(iscollect, '22222222222222');
                if (iscollect == 0) {
                    const sql = "UPDATE collect SET iscollect = '1' WHERE user_id=" + data.user_id + " AND good_id=" + data.good_id
                    conn.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send({
                                msg: "操作失败",
                                flag: 'no'
                            });
                        } else {
                            res.send({
                                msg: "添加收藏成功",
                                flag: 'yes'
                            });
                        }
                    })
                } else if (iscollect == 1) {
                    const sql = "UPDATE collect SET iscollect = '0' WHERE user_id=" + data.user_id + " AND good_id=" + data.good_id
                    conn.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.send({
                                msg: "操作失败",
                                flag: 'no'
                            });
                        } else {
                            res.send({
                                msg: "取消收藏成功",
                                flag: 'yes'
                            });
                        }
                    })
                }
            }
        })
    })
})
/* 查看用户收藏列表 */
app.get("/getCollectList", function (req, res) {
    let reData = req.query;
    let limit = Number(reData.page - 1) * Number(reData.limit);
    console.log(req.query, 'get请求前端传递到后端的参数')
    const selcollectsql = "SELECT good_id FROM collect where user_id =" + reData.user_id + " and iscollect = 1 limit " + limit + "," + reData.limit
    console.log(selcollectsql, '--------------------------------')
    conn.query(selcollectsql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        console.log(data, '查询出来的数据');
        if (data.length == 0) {
            res.send(data)
            return
        }
        var dataArr = [];
        var i = 0;
        (function run() {
            const seldetailsql = "SELECT * FROM detail where id =" + data[i].good_id
            conn.query(seldetailsql, function (err, result) {
                let _res = JSON.stringify(result)
                let _data = JSON.parse(_res)
                dataArr.push(_data[0])
                console.log(_data, '循环中的查找数据');
                if (i <= data.length) {
                    i++;
                    if (i == data.length) {
                        console.log(dataArr, '循环完毕');
                        res.send(dataArr)
                    } else {
                        run();
                    }

                }
            })
        }())
    })

})
/* 添加、更新
用户足迹表 */
app.post("/userFooter", function (req, res) {
    var data = "";
    req.on('data', function (chunk) {
        data += chunk;
    })
    req.on('end', function () {
        data = JSON.parse(data);
        console.log(data, '足迹列表post请求接受前端传递的参数');
        if (!data.user_id) {
            return;
        }
        const selectsql = "select id from footer where user_id=" + data.user_id + " and good_id = " + data.good_id;
        conn.query(selectsql, function (err, result) {
            /* 去除RowData */
            let _res = JSON.stringify(result)
            let _data = JSON.parse(_res)
            console.log(_data, '足迹表内容');
            /* 向上取整，将ms转换为m,存储在足迹表中 */
            let nowtime = Math.floor(new Date().getTime() / 1000);
            console.log(nowtime, 'time');

            if (_data.length == 0) {
                const insertsql = "insert into footer(user_id,good_id,time) values(" + data.user_id + "," + data.good_id + "," + nowtime + ")"
                conn.query(insertsql, function (err, result) {
                    if (err) {
                        res.send({
                            msg: "足迹添加失败"
                        })
                    } else {
                        res.send({
                            msg: "足迹添加成功"
                        })
                    }
                })
            } else if (_data.length != 0) {
                let [{
                    id
                }] = _data;
                console.log(id);

                console.log('已经在足迹列表中');
                let nowtime = Math.floor(new Date().getTime() / 1000);
                const updatesql = "update footer set time = " + nowtime + " where id=" + id
                console.log(updatesql);

                conn.query(updatesql, function (err, result) {
                    if (err) {
                        res.send({
                            msg: "足迹时间戳更改失败"
                        })
                    } else {
                        res.send({
                            msg: "足迹时间戳更改成功"
                        })
                    }
                })
            }

        })

    })
})
/* 查看用户足迹列表 */
app.get("/getFooterList", function (req, res) {
    let reData = req.query;
    if (!reData.user_id) {
        return
    }
    let limit = Number(reData.page - 1) * Number(reData.limit);
    console.log(req.query, 'get请求前端传递到后端的参数')
    const selcollectsql = "SELECT good_id FROM footer where user_id =" + reData.user_id + " order by time desc" + " limit " + limit + "," + reData.limit
    console.log(selcollectsql, '--------------------------------')
    conn.query(selcollectsql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        console.log(data, '查询出来的数据');
        if (data.length == 0) {
            res.send(data)
            return
        }
        var dataArr = [];
        var i = 0;
        (function run() {
            const seldetailsql = "SELECT * FROM detail where id =" + data[i].good_id
            conn.query(seldetailsql, function (err, result) {
                let _res = JSON.stringify(result)
                let _data = JSON.parse(_res)
                dataArr.push(_data[0])
                console.log(_data, '循环中的查找数据');
                if (i <= data.length) {
                    i++;
                    if (i == data.length) {
                        console.log(dataArr, '循环完毕');
                        res.send(dataArr)
                    } else {
                        run();
                    }

                }
            })
        }())
    })
})
/* 酒店推荐表 */
app.get("/getHotelList", function (req, res) {
    let reData = req.query;
    const sql = 'select * from hotel where good_id=' + reData.good_id;
    conn.query(sql, function (err, result) {
        let _res = JSON.stringify(result)
        let data = JSON.parse(_res)
        res.send(data)
    })

})
app.listen(3000, () => {
    console.log('服务器已启动');

});