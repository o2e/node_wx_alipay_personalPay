const router = require('koa-router')()
const md5 = require('../../com/tools').md5
const secretkey = require('../../com/config').secretkey
const order = require('../../controller/order')
const sendEmail = require('../../com/email')
const goods = require('../../controller/goods')

const errSign = (msg) => { // 客户端错误码
    return {
        code: 0,
        msg: msg,
        data: '',
        url: '',
        wait: 3
    }
}
/**
 * 验证客户端
 */
router.get('/addons/pay/api/setting', async (ctx, next) => {
    let params = ctx.query;
   	if (!params.sign && !params.apiurl) {
    	ctx.statusCode = 404;
      	return false;
    }
    // 验证签名
    if(params.sign != md5(md5(params.apiurl) + secretkey)) {
        ctx.body = errSign('密匙不正确!');
    } else {
        ctx.body = {
            code: 1,
            msg: '配置成功!',
            data: '',
            url: '',
            wait: 3
        }
    }
    
})

/**
 * 安卓支付端通知
 */
router.get('/addons/pay/api/notify', async (ctx, next) => {
    let params = ctx.query;
    if (!params.sign && !params.price && !params.type) {
    	ctx.statusCode = 404;
      	return false;
    }
    // 验证签名 签名加密方法 md5(md5(params.price + params.type) + secretkey)
    if (params.sign != md5(md5(params.price + params.type) + secretkey)) {
        ctx.body = errSign('签名错误');
    } else {
        let OrderId = await order.pay_send_to_cont(params.price,params.type) // 查出订单号的商品id和收件信箱
        // 查出商品的收货信息
        let resultCont = await goods.goods_find_goodsKey(OrderId.goods_id)

        // 处理订单支付状态
        let result = await order.pay_order_ok(params.price,params.type)
        //发送购买物品

        sendEmail(OrderId.dataValues.email,resultCont.dataValues.goodsKey)

        let msg = ''
        if (!result) {
            msg = params.type == 'wechat' ? '微信支付收款处理成功，订单未处理!' : '支付宝收款处理成功，订单未处理!'
        } else {
            msg = params.type == 'wechat' ? '微信支付收款处理成功' : '支付宝收款处理成功'
        }
        ctx.body = {
            code: 1,
            msg: msg,
            data: '',
            url: '/aip/notify.html',
            wait: 3
        }
    }
})

module.exports = router