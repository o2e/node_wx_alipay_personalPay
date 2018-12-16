// 统计访问次数
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const { sequelize, moment} = require('../../com/bd')

const visitors = sequelize.define('visitor', {
    ip: { // 访问者ip
        type: Sequelize.STRING(50)
    },
    location: { // 访问者地区
        type: Sequelize.STRING(255),
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

visitors.sync({fore: false})
    .then(() => {
        console.log('创建visitors表成功!')
    })
    .catch(e => {
        console.error('创建visitors表失败!')
    })

visitors.create_ips = async (data) => {
    return visitors.create(data)
}

visitors.find_id = async (ip) => {
    return visitors.findOne({
        where: {
        	ip: ip
        }
    })
}

module.exports = visitors;

