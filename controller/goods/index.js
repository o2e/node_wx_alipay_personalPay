const Sequelize = require('sequelize')
const { sequelize, moment} = require('../../com/bd')

const goods = sequelize.define('good', {
    nanoid: { // 商品id
        type: Sequelize.STRING(50)
    },
    price: { // 商品价格
        type: Sequelize.DECIMAL(10,2),
    },
    goods_name: {
        type: Sequelize.STRING(50)
    },
    content: { // 商品描述
        type: Sequelize.STRING(),
    },
    goodsKey: { // 自动发货内容
        type: Sequelize.STRING()
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
        }
    }
},{
    paranoid: true,
})

goods.sync({fore: false})
    .then(() => {
        console.log('创建goods表成功!')
    })
    .catch(e => {
        console.error('创建goods表失败!')
    })

goods.goods_add = async (data) => {
    return goods.create(data);
}

goods.goods_find_nanoid = async (nanoid) => {
    return goods.findOne({
        where: {
            nanoid: nanoid
        },
        attributes: ['content','goods_name','nanoid', 'price']
    })
}

goods.goods_find_goodsKey = async (nanoid) => {
    return goods.findOne({
        where: {
            nanoid: nanoid
        },
        attributes: ['goodsKey']
    })
}

module.exports = goods;

