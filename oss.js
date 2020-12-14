
let OSS = require('ali-oss');

let client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4G3ZKdsRrPFs1VDJs52T',
    accessKeySecret: 'ZIa3rapzhxJFk3ZQlhuqRpkWrVlmGI',
    bucket: "picwei"
});


/**
 * 
 * @param {*} filename 存储的图片路径
 * @param {*} file 存储的图片
 */
module.exports = async function put(filename) {
    try {
        //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
        /**
         * put()方法的第三个参数mime指定为 'image/jpg' 则图片地址可以在浏览器中打开而不会立即下载
         */
        let result = await client.put(`images/${filename}`, `data/img/${filename}`, { mime: 'image/jpg' });
        return result.url
    } catch (e) {
       return e
    }
}