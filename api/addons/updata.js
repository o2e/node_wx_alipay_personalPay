const qiniu = require('qiniu');
const config = require('../../com/config').qiniu;
const router = require('koa-router')();
const islogin = require('../../middleware/isLogin')

const mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);

router.post('/api/updata', islogin, async (ctx, next) => {
    let options = {
        scope: config.bucket_lists.static, // 空间名
        expires: 7200
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    
    let data = {
        code: 1,
        data: {
            toKen: uploadToken,
        },
        msg: '请求成功!'
    }
    ctx.body = data;
});

module.exports = router