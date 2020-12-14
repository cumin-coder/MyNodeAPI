// 导入mongoose
const mongoose = require("mongoose")
// 创建文档模型
const Schema = mongoose.Schema

// 限制可使用模型对象
const ContentScheam = new Schema({
  name: String,
  content: String,
  goodCount: Number,
  commentCount: Number,
  commentContent: Array,
  time: String,
  header: String,
  nickname: String
})

// 创建集合
const ContentModel = mongoose.model("content", ContentScheam)

module.exports = ContentModel

