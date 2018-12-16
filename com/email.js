const email = require("emailjs");
const server = email.server.connect({
    user: "xxx@qq.com", // 你的QQ用户
    password: "xxx", // 注意，不是QQ密码，而是刚才生成的授权码
    host: "smtp.qq.com", // 主机，不改
    ssl: true // 使用ssl
});

//开始发送邮件
const sendMeail = async (toMeail,cont) => {
    server.send({
        text: cont, //邮件内容
        from: "xxx@qq.com", //谁发送的
        to: toMeail, //发送给谁的
        subject: '自动发货提醒' //邮件主题
    }, function (err, message) {
        //回调函数
        console.log(err || message);
    })
}

module.exports = sendMeail
