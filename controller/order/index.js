const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize , moment} = require('../../com/bd');

// 订单状态管理
const order = sequelize.define('order', {
    goods_id: { // 绑定的商品id 非商品主键
        type: Sequelize.STRING(50)
    },
    order_id: { // 订单id
        type: Sequelize.STRING(50)
    },
    goods_name: { // 商品名字
        type: Sequelize.STRING(255)
    },
    price: { // 商品价格
        type: Sequelize.DECIMAL(10,2)
    },
    pay_price: { // 实际支付的价格
        type: Sequelize.DECIMAL(10,2)
    },
    pay_ip: { // 下单者的ip，防止恶意下单
        type: Sequelize.STRING(50)
    },
    pay_type: { // 订单支付type
        type: Sequelize.ENUM('wechat','alipay'),
        defaultValue: 'wechat',
    },
    email: { // 收货 email
        type:Sequelize.STRING(50)
    },
    pay_url: { // 支付url地址
        type:Sequelize.STRING(50)
    },
    status: { // 支付状态 ok 和 no
        type: Sequelize.ENUM('ok','no'),
        defaultValue: 'no'
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
    paranoid: true
})

order.sync({force: false})
    .then(() => {
        console.log('创建order表成功!')
    })
    .catch(e => {
        console.error('创建order表失败!')
    })


order.create_order = async (data) => {
    return order.create(data)
}


order.inspect_order = async (data) => {
    return order.findAll({
        where: {
            [Op.or]: data,
            [Op.and]:[
                {
                    createdAt: {[Op.gt]: new Date(new Date() - 5 * 60 * 1000)}
                },
                {
                    status: 'no'
                }     
            ]
        }
    })
}

order.find_order_id = async (order_id) => {
    return order.findOne({
        where: {
            order_id: order_id
        }
    })
}

order.pay_send_to_cont = async (pay_price, pay_type) => {
    return order.findOne({
        where: {
            pay_price: pay_price,
            pay_type: pay_type,
            status: 'no',
            createdAt: {
                [Op.gt]: +new Date() -5 * 60 * 1000
            }
        }
    })
}

order.pay_order_ok = async (pay_price, pay_type) => {
    // 处理订单支付状态 没有把超时的订单写入数据库，务必判断订单超时问题
    return order.update({
        status: 'ok',
    },{
        where: {
            pay_price: pay_price,
            pay_type: pay_type,
            status: 'no',
            createdAt: {
                [Op.gt]: +new Date() -5 * 60 * 1000
            }
        }
    })
}

order.find_order_status = async (order_id) => {
    return order.findOne({
        where: {
            order_id: order_id,
            createdAt: {
                [Op.gt]: +new Date() -5 * 60 * 1000
            }
        },
        attributes: ['status']
    })
}

order.find_all = async (page,num,where) => {
    return order.findAndCount({
        offset: page * num - num,
        limit: parseInt(num),
        where: where
    })
}

order.find_count_price = async () => {
    return order.sum('pay_price',{
        where: {
            status: 'ok'
        }
    })
}

module.exports = order