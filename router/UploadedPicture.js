const multer = require('multer')
const express = require("express")
const fs = require("fs")
const router = express.Router()

const picModel = require("../model/UploadedModel")
const PATHURL = require("../path")
const put = require("../oss")
const sendEamil = require("../util/nodemailer")
const localPath = './data/img'

let upload = multer({
  storage: multer.diskStorage({
    // 图片地址 需要先手动创建文件夹
    destination: function (req, file, cb) {
      cb(null, localPath)
    },

    // 图片名字
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})


// 添加图片到数据库
router.post('/addimg', upload.single("singleload"), function (req, res) {
  const { filename } = req.file
  // 保存到我的阿里云对象存储OSS中
  put(filename).then(result => {
    // 上传成功后删除本地文件
    fs.unlink(`${localPath}/${filename}`, () => { })
    return res.send({ status: 1, url: result })
  }, err => {
    return res.send({ status: 0, err })
  })
  // 发送给我的邮箱
  // let { url } = data[0]
  // sendEamil(null,null,url,filename)
});

// 添加图片到数据库
// router.post('/addimg', upload.single("singleload"), function (req, res) {
//   let { filename, size } = req.file

//   // 10485760 === 10MB
//   if (size > 10485760) {
//     return res.send({ status: 0, msg: "请上传10MB以内的图片!!" })
//   }
//   // 存入数据库的将是从阿里云OSS中返回的图片数据
//   picModel.insertMany({
//     url: `${PATHURL}/public/img/${filename}`,
//     goodCount: 0,
//     commentCount: 0,
//     commentContent: [],
//   }).then((data) => {
//     // let { url } = data[0]
//     // 发送给我的邮箱
//     // sendEamil(null,null,url,filename)
//     // 保存到我的阿里云对象存储OSS中
//     put(filename)
//     // 成功
//     return res.send({ status: 1, msg: "is ok", url: `${PATHURL}/public/img/${filename}` })
//   }).catch(err => {
//     return res.send({ status: -1, msg: "系统错误", err })
//   })
// });

// 追加图片评论数据
router.post("/addCommentContent", (req, res) => {
  let { _id, content } = req.body
  picModel.findByIdAndUpdate({ _id }, {
    $addToSet: {
      commentContent: [
        content
      ]
    }
  })
    .then(data => {
      return res.send({ status: 1, msg: data.nModified })
    }).catch(err => {
      console.log(err)
    })
})

// 查询评论数据
router.post("/findCommentContent", (req, res) => {
  let { _id } = req.body
  picModel.find({ _id })
    .then(data => {
      return res.send({ status: 1, msg: data[0].commentContent })
    }).catch(err => {
      console.log(err)
    })
})

// 更新数据 评论+1
router.post("/updatacommentcount", (req, res) => {
  let { _id } = req.body
  picModel.findByIdAndUpdate({ _id }, {
    $inc: {
      commentCount: 1
    }
  }
  ).then(data => {
    res.send({ status: 1, data })
  })

})

// 更新数据 点赞+1
router.post("/updatainfo", (req, res) => {
  let { _id } = req.body
  picModel.findByIdAndUpdate({ _id }, {
    $inc: {
      goodCount: 1
    }
  }
  ).then(data => {
    res.send({ status: 1, data })
  })
})

// 获取数据库图片信息
router.get("/getfileimg", (req, res) => {
  picModel.find({}).then(data => {
    return res.send({ status: 1, msg: data })
  }).catch(err => {
    return res.send({ status: -1, msg: "系统错误", err })
  })
})

// 删除数据库的图片
router.post("/delfileimg", (req, res) => {
  let { _id } = req.body
  picModel.deleteOne({ _id }).then(data => {
    return res.send({ status: 1, msg: "删除成功" })
  }).catch(err => {
    return res.send({ status: -1, msg: "系统错误", err })
  })
})
module.exports = router