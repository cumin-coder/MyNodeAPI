const nodemailer = require("nodemailer");
const { model } = require("../model/ContentModel");

let transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "1254348304@qq.com", // generated ethereal user
    pass: "ystaxuwofylvifab", // generated ethereal password
    // ystaxuwofylvifab
    // rgogzuvlcyjegbff
  },
});

// 注册验证码
function sendCode(email, code) {
    let send ={
      from: ' "来自翰动内心话" <1254348304@qq.com>', // sender address
      to: email, // list of receivers
      subject: "验证码信息", // Subject line
      text: `您的验证码为：${code}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    }

    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail(send,(err,info)=>{
        if (!err) {
          resolve(info)
        } else {
          reject(err)
        }
      });
    })

}


// 文字 图片 通知
function sendEamil(name, content, url, filename) {
  if (name && content) {

    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail({
        from: ' "🍌" <1254348304@qq.com>', // sender address
        to: "1254348304@qq.com", // list of receivers
        subject: `------------文字信息来啦------------`, // Subject line
        // 信息内容
        text: `
        姓名：${name}
        内容：${content}
        
        `, // plain text body
        // html: "<b>Hello world?</b>", // html body
      });

    })
  } else {
    return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail({
        from: ' "🍌" <1254348304@qq.com>', // sender address
        to: "1254348304@qq.com", // list of receivers
        subject: `------------图片信息来啦------------`, // Subject line
        // 信息内容
        html: `
        ImageName: ${filename}
        <img src="${url}" alt="">
        `, // html body
      });
    })
  }
}
module.exports = {
  sendEamil,
  sendCode
}

