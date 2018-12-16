const router = require('koa-router')();
const request = require('request');
const client = require('../addons/baiduOcr');
const jsQR = require("jsqr");
const Jimp = require('jimp');
const qrcode = require('../../controller/qrcode');
const islogin = require('../../middleware/isLogin')

const readTxt = (url) => {
    return new Promise((res, rej) => {
        client.generalBasicUrl(url).then(function(result) {
           res(JSON.stringify(result));
        }).catch(function(err) {
            // 如果发生网络错误
            rej(err);
        });
    })
}

router.post('/api/qrcodeadd', islogin, async (ctx, next) => {
    try {
        let params = ctx.request.body
        if (params.url == '') {
            throw ('参数丢失!')
        }
        let data = JSON.parse(await readTxt(params.url))

        let payData = {type: 'wechat', price: 0, pay_url: '',}

        data.words_result.forEach(element => { // 识别付款码文字信息
            if (element.words.indexOf('支付就用支付宝') != -1) {
                payData.type = 'alipay'
            }
            if (element.words.indexOf('￥') != -1) {
                console.log(element.words)
                payData.price = element.words.substring(1)
            }
        });
        if (payData.price <=0 ) {
            throw ('二维码有误，请上传支付宝或微信收款二维码!')
        }
        // 识别付款码支付url
        let imgData = (url) => {
            return new Promise((res, rej) => {
                request.get({
                    url: url,
                    encoding: null // 指定编码
                }, function (error, response, body) {
                    if (error) {
                        rej('请求图片url失败')
                    } else {
                        // res(body.toString('base64'))
                        res(body)
                    }
                })
            })
        }

        let imageDataBase64 = await imgData(params.url)

        // 提取二维码中的url
        
        const qrdecode = (file) => {
            return new Promise(async (resolve,reject) => {
                await Jimp.read(await file, (err, image) => {
                    if (err) {
                        return reject(err)
                    }
                    const qrCodeImageArray = new Uint8ClampedArray(image.bitmap.data.buffer)
                    const qrCodeResult = jsQR(
                        qrCodeImageArray,
                        image.bitmap.width,
                        image.bitmap.height,
                    )
                
                    if (qrCodeResult) {
                        return resolve(qrCodeResult.data)
                    } else {
                        return reject('二维码识别失败！')
                    }
                })
            })
        }

        let url = await qrdecode(imageDataBase64);
            payData.pay_url = url;

        let result = await qrcode.qr_code_add(payData);
        ctx.body = {
            code: 1,
            data: result.dataValues,
            msg: '上传成功!'
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            msg: e,
            data: ''
        }
    }

})
    
router.get('/api/qrcodeall', islogin, async (ctx, next) => {
    try {
        let params = ctx.query;
        if (parseInt(params.page) != params.page && parseInt(params.num) != params.num) {
            throw ('参数有误!')
        }
        let result = await qrcode.get_code_all(params.page, params.num);
        ctx.body = {
            code: 1,
            data: result,
            msg: '获取成功!'
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})

router.delete('/api/qrcodedel', islogin, async (ctx, next) => {
    try{
        let params = ctx.request.body;
        if (parseInt(params.id) != params.id) {
            throw('参数有误!')
        }
        let result = await qrcode.del_code_id(params.id);
        if (!result) throw ('二维码暂时无法删除!')
        ctx.body = {
            code: 0,
            data: '',
            msg: '删除成功!'
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})
module.exports = router;