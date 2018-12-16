const Sequelize = require('sequelize');
const {sequelize, moment} = require('../../com/bd');
const tools = require('../../com/tools');
const adminInfo = require('../../com/config').admin

const admin = sequelize.define('admin', {
    username: {
      type: Sequelize.STRING(20)
    },
    password: {
      type: Sequelize.STRING(50)
    },
    last_login: {
      type: Sequelize.STRING(50)
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
  paraonid: true
})

admin.sync({force: false})
    .then(() => {
        admin.findAll({
            where: {
                username: adminInfo.username
            }
        }).then(res => {
            if(res.length ==0 ) {
                admin.create({
                    username: adminInfo.username,
                    password: adminInfo.password
                })
            }
        })
    })
    .catch(e => {
        console.log('创建admin表失败!')
    })

admin.login = async (name,password) => {
    return admin.findOne({
      where: {
        username: name,
        password: password
      },
      attributes: ['id', 'username']
    })
}

admin.last_login = async (id) => {
    return admin.update({
      last_login: tools.getNowFormatDate()
    },{
      where: {
        id: id
      }
    }
)}

module.exports = admin;
