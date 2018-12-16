const Sequelize = require('sequelize');
const db = require('./config').db;
const redis = require('redis');
const redisConfid = require('./config').redisConfid;
const moment = require('moment');

const sequelize = new Sequelize(db.db, db.name, db.password, {
  host: db.host,
  dialect: db.dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00'
});

sequelize.authenticate().then(res => {
  console.log('数据库链接成功！')
}).catch(e => {
  console.log('数据库链接失败!' + e)
})

// 定义redis
const client = redis.createClient(redisConfid); 

module.exports = {
  sequelize,
  client,
  moment
}