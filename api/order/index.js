const router = require('koa-router')();
const order = require('../../controller/order');
const goods = require('../../controller/goods');
const qrcode = require('../../controller/qrcode');
const nanoid = require('nanoid');
const islogin = require('../../middleware/isLogin');

router.post('/api/orderadd', async (ctx, next) => {
    try {
        // 1.下单ip中没有有效期订单数据 2.下单邮箱中没有有效期订单数据 3. 当前金额下的二维码有未使用的
        let ip = ctx.ip
        let params = ctx.request.body
        let re = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/

        // 将所有超时的二维码重置为0
        await qrcode.reest_status()

        if (params.nanoid == '')  throw ('商品参数有误!')
        if (!re.test(params.email)) throw('邮箱格式不正确!')
        if (params.pay_type == '') throw('支付方式有误!')

        // 获取商品信息
        let order_price = await goods.goods_find_nanoid(params.nanoid);
        if(!order_price) throw ('下单商品不存在!')
        // 判断下单者ip和邮箱有没有未支付且未超时的订单

        let inspectip = await order.inspect_order(
            {
                pay_ip: ip,
                email: params.email,
            }
        )
        
        if (inspectip.length != 0) throw ('您有订单尚未支付，请稍后再试!')
        
        // 进入下单流程，查询商品金额二维码是否被使用
        let qrCpdePrice = await qrcode.find_code_price(order_price.price, params.pay_type)
        let tempPrice = order_price.price
        if (qrCpdePrice.length == 0) {
            //  触发随机立减
            let newPrice = []
            for (let i = 0; i < 10; i++) {
                newPrice.push((tempPrice -= 0.01).toFixed(2))
            }
            let QrCodeResult = await qrcode.find_code_more_price(newPrice, params.pay_type)
            if (QrCodeResult.length == 0) {
                throw ('系统火爆，请过1-3分钟后下单!')
            }

            let data = {
                goods_id: order_price.nanoid,
                goods_name: order_price.goods_name,
                price: order_price.price,
                pay_price: QrCodeResult[0].dataValues.price,
                pay_url: QrCodeResult[0].dataValues.pay_url,
                pay_type: QrCodeResult[0].dataValues.type,
                pay_ip: ip,
                order_id: nanoid(),
                email: params.email,
                status: 'no',
            }
            await qrcode.update_status(data.pay_price,'1', params.pay_type)
            let createResult = await order.create_order(data)
            ctx.body = {
                code: 0,
                data: createResult.dataValues,
                msg: '订单创建成功!',
            }
        } else {
            let data = {
                goods_id: order_price.nanoid,
                goods_name: order_price.goods_name,
                price: order_price.price,
                pay_price: qrCpdePrice[0].dataValues.price,
                pay_url: qrCpdePrice[0].dataValues.pay_url,
                pay_type: qrCpdePrice[0].dataValues.type,
                pay_ip: ip,
                order_id: nanoid(),
                email: params.email,
                status: 'no'
            }
            await qrcode.update_status(data.pay_price,'1', params.pay_type)
            let createResult = await order.create_order(data)
            ctx.body = {
                code: 0,
                data: createResult.dataValues,
                msg: '订单创建成功!',
            }
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})

router.get('/api/getorderid', async (ctx, next) => {
    try {
        let params = ctx.query;
        if (params.order_id == '') throw ('订单号有误!');
        let result = await order.find_order_id(params.order_id);
        if (!result) throw('订单不存在!')

        if (+ new Date(result.createdAt) < (+new Date() -5 * 60 * 1000)) throw ('订单已失效!')
        
        let exire = +new Date(result.createdAt) - ((+new Date()) - 5 * 60 * 1000)
        ctx.body = {
            code: 0,
            data: result,
            time: exire,
            msg: ''
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})

router.get('/api/orderstatus', async (ctx, next) => {
    try{
        let params = ctx.query
        if (params.order_id == '') throw('订单号错误!')
        let result = await order.find_order_status(params.order_id)
        if(!result) throw('订单已经失效!')
        ctx.body = {
            code: 0,
            data: result,
            msg: ''
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})

router.get('/api/getfindorder', async (ctx, next) => {
    try {
        // 必要的参数 page num 非必要的参数 where 
        let params = ctx.query
        if (parseInt(params.page) != params.page && parseInt(params.num) != params.num) {
            throw ('参数有误!')
        }
        
        let where = {}
        if (params.pay_type != '') {
            where.pay_type = params.pay_type 
        }
        if (params.status != '') {
            where.status = params.status
        }
        if (params.order_id != '') {
            where.order_id = params.order_id
        }
        
        let result = await order.find_all(params.page, params.num, where)
        if (!result) throw('没有数据!')
        ctx.body = {
            code: 0,
            data: result,
            msg: ''
        } 
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})
module.exports = router