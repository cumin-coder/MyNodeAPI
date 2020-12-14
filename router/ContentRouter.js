const express = require("express")
const router = express.Router()
const WebSokcet = require("ws")
const { sendEamil } = require("../util/nodemailer")

// 设置端口
const wss = new WebSokcet.Server({ port: 8081 })

// 引入数据库文档模型对象 用于添加到数据库
const ContentModel = require("../model/ContentModel")
wss.on("connection", (client) => {
  console.log("连接成功WebSocket")

  // 接收来自前端的数据
  client.on("message", data => {
    let { content, name, goodCount, commentCount, commentContent, time, header, nickname } = JSON.parse(data)

    ContentModel.insertMany({
      name,
      content,
      goodCount,
      commentCount,
      commentContent,
      time,
      header,
      nickname
    }).then((data) => {
      // 给1254348304@qq.com发送信息
      let { name, content } = data[0]
      sendEamil(name, content)

      // 后端将数据发送至前端
      client.send(JSON.stringify(data[0]))
    }).catch(err => {
      console.log(err)
    })

  })
})

//同时修改昵称
router.post("/targetnickname", (req, res) => {
  let { newName, oldName } = req.body
  ContentModel.updateMany({ nickname: oldName }, {
    nickname: newName
  }).then(data => {
    console.log(data)
    res.send("isok")
  })
})

// 追加评论数据
router.post("/addCommentContent", (req, res) => {
  let { _id, content } = req.body
  ContentModel.findByIdAndUpdate({ _id }, {
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
  ContentModel.find({ _id })
    .then(data => {
      return res.send({ status: 1, msg: data[0].commentContent })
    }).catch(err => {
      console.log(err)
    })
})

// 更新数据 点赞+1
router.post("/updatainfo", (req, res) => {
  let { _id } = req.body
  ContentModel.findByIdAndUpdate({ _id }, {
    $inc: {
      goodCount: 1
    }
  }
  ).then(data => {
    res.send({ status: 1, data })
  })
})

// 更新数据 评论+1
router.post("/updatacommentcount", (req, res) => {
  let { _id } = req.body
  ContentModel.findByIdAndUpdate({ _id }, {
    $inc: {
      commentCount: 1
    }
  }
  ).then(data => {
    console.log(data)
    res.send({ status: 1, data })
  })

})

router.post("/getinfo", (req, res) => {
  ContentModel.find({}).then(data => {
    return res.send({ status: 1, msg: data })
  }).catch(err => {
    console.log(err)
  })

})

router.post("/delinfo", (req, res) => {
  let { _id } = req.body
  ContentModel.findByIdAndRemove(_id).then(data => {
    console.log(data)
    return res.send({ status: 1, msg: data })
  }).catch(err => {
    console.log(err)
  })

})

// 查找指定的内容
router.post("/profileUser", (req, res) => {
  let { nickname } = req.body
  console.log(nickname)
  ContentModel.find({ nickname }).then(data => {
    if (data.length < 1) return res.send({ msg: "暂无" })
    return res.send({ status: 1, data })
  })
})

// 个人删除
router.post("/delprofile",(req,res)=>{
  let {nickname} = req.body
  ContentModel.deleteOne({nickname}).then(data=>{
    console.log(data)
    res.send({status:1,msg:"删除成功"})
  })
})

module.exports = router
