var multer = require('multer')
const express = require("express")
const router = express.Router()
const UserLoginModel = require("../model/UserLoginModel")
const PATH = require("../path")

let upload = multer({
  storage: multer.diskStorage({
    // 图片地址 需要先手动创建文件夹
    destination: function (req, file, cb) {
      cb(null, './data/img')
    },

    // 图片名字
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}.jpg`)
    }
  })
})

router.post("/setheaderurl", upload.single("changeurl"), (req, res) => {
  let { originalname, filename } = req.file

  let newurlheader = { urlheader: `${PATH}/public/img/${filename}` }
  UserLoginModel.findByIdAndUpdate({ _id: originalname }, newurlheader).then(data => {
    res.send({ status: 1, msg: data })
  })
})


router.post("/getheader", (req, res) => {
  let { _id } = req.body
  UserLoginModel.findById({ _id: _id }).then(data => {
    res.send({ status: 1, msg: data })
  })
})


// 获取到默认的昵称的接口
router.post("/getchangename", (req, res) => {
  let { username } = req.body
  UserLoginModel.findOne({ username }).then(message => {
    res.send({ status: 1, msg: message })
  })
})

// 改变昵称的接口
router.post("/changname", (req, res) => {
  let { id, newName } = req.body
  UserLoginModel.findByIdAndUpdate({ _id: id }, { changename: newName }).then(data => {
    res.send({ status: 1, msg: "修改成功" })
  })
})







module.exports = router
