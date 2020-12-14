// 导入mongoose
const mongoose = require("mongoose")

// 创建模型
const Schema = mongoose.Schema

// 限制可使用的模型
const picSchema = new Schema({
  userUrl:{ type: String, required: true },
  userText:{ type: String, required: true },
})

// 创建集合
const picModel = mongoose.model("pic", picSchema)

module.exports = picModel