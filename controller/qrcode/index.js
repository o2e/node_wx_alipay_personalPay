const Sequelize = require('sequelize');
const {sequelize, moment} = require('../../com/bd');
const Op = Sequelize.Op;

const qrcode = sequelize.define('qrcode', {
    type: {
        type: Sequelize.ENUM('wechat','alipay'),
        defaultValue: 'wechat',
    },
    price: {
        type: Sequelize.DECIMAL(10,2),
    },
    pay_url: {
        type: Sequelize.STRING(255),
    },
    status: {
        type: Sequelize.ENUM('1','0'), // 0 二维码未使用，1二维码已经被使用
        defaultValue: '0'
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
    attributes: ['id','type','pay_url','status']
})

qrcode.sync({fore:false})
    .then(res => {
        console.log('创建qrcode表成功!');
    })
    .catch(e => {
        console.log('创建qrcode表失败') + e;
    })

qrcode.qr_code_add = async (data) => {
    return qrcode.create(data)
}

qrcode.get_code_all = async (page,num) => {
    return qrcode.findAndCountAll({
        offset: page * num - num,
        limit: parseInt(num)
    })
}

qrcode.del_code_id = async (id) => {
    return qrcode.destroy({
        where: {
            id: id,
            status: '0'
        }
    })
}

qrcode.find_code_price = async (price,type) => {
    return qrcode.findAll({
        where: {
            price: price,
            type: type,
            status: '0'
        }
    })
}

qrcode.find_code_more_price = async (data,type) => {
    return qrcode.findAll({
        where: {
            price: {
                [Op.or]: data
            },
            type: type,
            status: '0'
        }
    })
}

qrcode.update_status = async (price,status,type) => {
    return qrcode.update({
        status: status,
        },{
        where: {
            type: type,
            price: price,
        }
    })
}

qrcode.reest_status = async () => {
    return qrcode.update({
        status: '0'
    },{
        where: {
            updatedAt: {[Op.lt]: new Date(new Date() - 5 * 60 * 1000)}
        }
    })
}

module.exports = qrcode