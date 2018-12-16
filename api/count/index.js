const router = require('koa-router')();
const islogin = require('../../middleware/isLogin');
const visitorsNum = require('../../controller/visitors')
const orderNum = require('../../controller/order')
const goodsNum = require('../../controller/goods')

router.get('/api/count', islogin, async (ctx, next) => {
    let visitorsCount = await visitorsNum.count(),
        orderCount = await orderNum.count(),
        goodsCount = await goodsNum.count(),
        orderPrice = await orderNum.find_count_price();
    ctx.body = {
        code: 1,
        data: {
            visitorsCount: visitorsCount,
            orderCount: orderCount,
            goodsCount: goodsCount,
            orderPrice: orderPrice
        },
        msg: ''
    }
})


module.exports = router