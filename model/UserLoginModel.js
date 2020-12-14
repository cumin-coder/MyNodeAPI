var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  email :{ type: String, require: true },
  urlheader: String,
  changename: String,
  code: { type: Number, require: true },
});

const profileModel = mongoose.model("profile", ProfileSchema)

module.exports = profileModel
