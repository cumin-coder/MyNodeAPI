const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const request = require('request')
// 登录注册接口
const userLoginRouter = require("./router/UserLoginRouter.js")
// 上传图片接口
const uploadedPricture = require("./router/UploadedPicture")
const contentRouter = require("./router/ContentRouter")
const switchHeaderRouter = require("./router/SwitchHeaderRouter")

// const cookieParser = require("cookie-parser")
// const session = require("express-session")




// 邮箱
const sendEmail = require("./util/nodemailer")

// 导入数据库
require("./server")
const app = express()

app.use("/public", express.static(path.join(__dirname, "./data")))

// session整体配置
// app.use(session({
//   secret : "lzwxl", //为了安全性的考虑设置secret属性
//   cookie: {maxAge: 60 * 1000}, //设置过期时间
//   resave: true,// 即使 session 没有修改，也保存 session 值，默认为 true
//   saveUninitialized: false // 无论有没有session cookie，每次请求都设置个 session cookie，默认给个标识为 connect.sid
// }))

// 代理解决跨域
// app.get("/cors", (req, res) => {
//   request("http://localhost:2003/uploaded/fileimg", (err, response, body) => {
//     // console.log(body)
//     res.send("is ok")
//   })
// })

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with, X-Custom-Header, HaiYi-Access-Token")
  next();
});



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())


// 使用中间件
app.use("/login", userLoginRouter)

app.use("/uploaded", uploadedPricture)

app.use("/contentwall", contentRouter)
app.use("/switch", switchHeaderRouter)


// // 接收邮箱接口
// app.post("/regEmail", (req, res) => {
//   // 生成随机验证码
//   let random = Math.floor(Math.random() * 99999)
//   /**
//    * email 对方邮箱号
//    * code 验证码
//    */
//   // 发送验证码
//   // 3119862364
//   sendEmail("3119862364@qq.com", random).then((data) => {
//     res.send({ status: 1, res: "成功接收到验证码", data })
//   }).catch(err => {
//     res.send({ status: 1, res: "验证码发送失败", err })
//   })
// })

// // HTML文件
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html")
// })



app.listen(2003, err => {
  if (!err) console.log("浏览器解析成功 (可用) ...")
})