// 导入mongoose
const mongoose = require("mongoose")
// 创建文档模型
const Schema = mongoose.Schema

// 限制可使用模型对象
const CodeScheam = new Schema({
  email : String,
  Coded: Number
})

// 创建集合
const CodeModel = mongoose.model("code", CodeScheam)

module.exports = CodeModel

