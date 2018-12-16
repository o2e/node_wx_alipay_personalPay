const router = require('koa-router')();
const islogin = require('../../middleware/isLogin');
const goods = require('../../controller/goods')
const nanoid = require('nanoid');
const visitors = require('../../middleware/count')

router.post('/api/goodadd', islogin, async (ctx, next) => {
    // 添加商品
    try {
        let params = ctx.request.body;
        if (params.goods_name == '') {
            throw ('商品名称不能为空!')
        }  else if (!(/^\d+(\.\d{1,2})?$/.test(params.price)) || params.price <= 0){
            throw('价格必须为整数!')
        } else if (params.content == '') {
            throw('商品描述不能为空!')
        } else if (params.goodsKey == '') {
            throw('自动发货内容不能为空!')
        }
        params.nanoid = nanoid();
        let result = await goods.goods_add(params);
        ctx.body = {
            code: 0,
            data: result,
            msg: '添加成功!'
        }
    } catch (e) {
        ctx.body = {
            code: -1,
            data: '',
            msg: e
        }
    }
})

router.get('/api/goodsfindone', visitors, async (ctx, next) => {
    try {
        let nanoid = ctx.query.nanoid
        if (nanoid == '') {
            throw('商品id不能为空!')
        }
        let result = await goods.goods_find_nanoid(nanoid);
        if (result) {
            ctx.body = {
                code: 0,
                data: result,
                msg: '获取成功!'
            }
        } else {
            throw('商品已下架或不存在!')
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