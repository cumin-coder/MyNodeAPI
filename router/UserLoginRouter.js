const express = require("express")

// 操作路由
const router = express.Router()
let { sendCode } = require("../util/nodemailer")
const JWT = require("../util/jwt")


/* 
对象模型
 {
   username : String
   password : String
}
*/
const profileModel = require("../model/UserLoginModel")
const VerificationCode = require("../model/VerificationCodeModel")


// 用户名是否存在
router.post("/userIsExist", (req, res) => {
  let { username } = req.body
  profileModel.find({ username }).then(data => {
    // if (!data.length) {
    //   // 不存在
    //   return res.send({ status: true })

    // } else {
    //   // 存在
    //   return res.send({ status: false })
    // }

    return res.send({ status: data.length, message: data.length ? `此用户名(${username})已存在` : `此用户名(${username})可使用` })
  })
})

// QQ邮箱是否存在
router.post("/emailIsExist", (req, res) => {
  let { email } = req.body
  profileModel.find({ email }).then(data => {
    return res.send({ status: data.length, message: data.length ? `此QQ邮箱(${email})已存在` : `此QQ邮箱${email}可使用` })
    // console.log(data)
    /**
     * 简写：
     * return !data.length ? res.send({ status: true }) : res.send({ status: false })
     * true表示可以使用，false反之
     * return res.send({ status: !data.length })
     * 
     * 
     */
    // if (!data.length) {
    //   console.log(data.length)
    //   // QQ邮箱号不存在：可以使用此QQ邮箱号注册
    //   return res.send({ status: true })
    // } else {
    //   console.log(!data.length)
    //   // QQ邮箱号存在: 不能使用此QQ邮箱号注册
    //   return res.send({ status: false })
    // }
  })
})

// 验证码请求接口
router.post("/getcode", (req, res) => {
  let { email } = req.body

  // 生成1000 - 9999 之间的随机数
  let codeEamil = Math.floor(Math.random() * (9999 - 1000) + 1000)

  // 向指定的qq邮箱发送一个验证码，并存入数据库中
  sendCode(email, codeEamil)
    .then(() => {
      return VerificationCode.find({ email }).then(data => {
        if (data.length) {
          VerificationCode.updateMany({ email }, { $set: { Coded: codeEamil } }).then(() => {
            return res.send({ status: 1, msg: "更新验证码成功" })
          })
        } else {
          VerificationCode.insertMany({ email, Coded: codeEamil }).then(() => {
            return res.send({ status: 0, msg: "首次获取验证码成功" })
          })
        }
      })
    }).catch(err => {
      return res.send({ code: 0, msg: err })
    })

})

// 注册接口 用户注册不能重复
// router.post("/userRegisterIfRepetition", (req, res) => {
//   let { username, password, email, code } = req.body
//   console.log(req.body)
//   profileModel.find({ email }).then(data => {
//     console.log(data)
//     if (!data.length) {
//       VerificationCode.find({}).then(data => {
//         if (data[data.length - 1].Coded === parseInt(code)) {
//           // http://127.0.0.1:2003/public/img/default-header.png
//           profileModel.insertMany({ username, password, email, code }, { upsert: true })
//             .then(() => {
//               return res.send({ status: 1, msg: "注册成功" })
//             }).catch(err => {
//               return res.send({ status: 0, msg: err })
//             })
//         } else {
//           return res.send({ status: 0, msg: "验证码错误" })
//         }
//       })
//     } else {
//       return res.send({ status: 0, msg: "用户名或邮箱已存在" })
//     }
//   })
// })

router.post("/userRegisterIfRepetition", (req, res) => {
  let { username, password, email, code } = req.body
  VerificationCode.find({}).then(data => {
      console.log(data)
    if (data[data.length - 1].Coded === parseInt(code)) {
      // http://127.0.0.1:2003/public/img/default-header.png
      profileModel.insertMany({ username, password, email, code }, { upsert: true })
        .then(() => {
          return res.send({ status: 1, msg: "注册成功" })
        }).catch(err => {
          return res.send({ status: 0, msg: err })
        })
    } else {
      return res.send({ status: 0, msg: "验证码错误" })
    }
  })
})

// 登录接口
router.post("/userLogin", (req, res) => {
  let { username, password } = req.body
  profileModel.find({ username, password }).then(data => {
    console.log(data)
    if (!data.length) {
      return res.send({ status: 0, msg: "请输入正确账号或密码" })
    } else {
      let { changename, urlheader } = data[0]
      JWT.createToken(username).then(token => {
        return res.send({
          status: 1,
          msg: "登录成功",
          result: {
            username,
            token,
            changename,
            urlheader
          }
        })
      })
    }
  })
})

// 验证token是否存在
router.post("/token", (req, res) => {
  let { token } = req.body
  // 验证token是否通过
  JWT.checkToken(token).then(() => {
    return res.send({ status: 1, msg: "token通过" })
  }).catch(err => {
    return res.send(err)
  })
})


// 获取所有人的登录信息
router.post("/all", (req, res) => {
  profileModel.find({}).then(data => {
    return res.send({ status: 1, msg: data })
  })
})


module.exports = router