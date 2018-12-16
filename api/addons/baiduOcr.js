const AipOcrClient = require("baidu-aip-sdk").ocr;
const config = require('../../com/config').baidu;

// 设置APPID/AK/SK
// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(config.APP_ID, config.API_KEY, config.SECRET_KEY);

module.exports = client;
