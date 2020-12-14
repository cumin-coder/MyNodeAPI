// 导入mongoose
const mongoose = require("mongoose")

// 创建模型
const Schema = mongoose.Schema

// 限制可使用的模型
const picSchema = new Schema({
  url: { type: String, required: true },
  goodCount: Number,
  commentCount: Number,
  commentContent: Array,
})

// 创建集合
const picModel = mongoose.model("pic", picSchema)

module.exports = picModel