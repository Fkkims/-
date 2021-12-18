let express = require('express');
let {createProxyMiddleware:proxy} = require('http-proxy-middleware');
let mysql = require('mysql');

let con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'gz2110'
})

con.connect();

let app = express();

app.use(express.static('./'));

app.use('/aa',proxy({
    target:'https://muse.huaban.com/',
    changeOrigin:true,
    pathRewrite:{
        '^/aa' : '/',
    }
}));

// 注册接口
app.get('/get',(req,res) => {
    const {username,tel,password} = req.query;
    console.log(username,tel,password);
    con.query(`SELECT * FROM huaban WHERE username='${username}'`,(err,data) => {
        if(data != ''){
            const fact = {code:false,msg:'用户名存在'}
            res.send(fact)
            return;
        }
        con.query(`INSERT INTO huaban VALUES (${null},'${username}','${tel}','${password}')`,(err1,data1) => {
            const fact = {code:true,msg:'注册成功'};
            res.send(fact);
        })
    })
})

// 登录验证接口
app.get('/login',(req,res) => {
    const {username,password} = req.query;
    console.log(username,password)
    con.query(`SELECT * FROM huaban WHERE username='${username}' AND password='${password}'`,(err,data) => {
        if(data == ''){
            const fact = {code:false,msg:'用户名或密码错误'};
            res.send(fact);
            return;
        };
        const fact = {code:true,msg:'登录成功'};
        res.send(fact);
    })
})

app.listen(8030,() => {000
    console.log('running port 8030')
})