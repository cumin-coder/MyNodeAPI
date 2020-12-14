const jwt = require("jsonwebtoken")

// 私钥
const scrict = "lzwxl-2020";

function createToken(username) {
  return new Promise((resolve, reject) => {
    // 返回一个加密token
    const token = jwt.sign({
      username,
    }, scrict)
    resolve(token)
  })

}


function checkToken(token) {
  return new Promise((resolve, reject) => {
    // 判断token是否有效
    jwt.verify(token, scrict, (err, data) => {
      if (err) reject({ status: 0, message: "token 验证错误" })
      resolve(data)
    })
  })
}

module.exports = {
  createToken,
  checkToken
}

