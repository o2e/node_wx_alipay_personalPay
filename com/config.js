module.exports = {
    db: {
        host: '127.0.0.1', // 数据库地址
        db: 'dbname', // 数据库名称
        name: 'user', // 数据库账号
        password: 'password', // 数据库密码
        dialect: 'mysql', // 数据库类型
    },
    sessionConfig: {
        key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
        /** (number || 'session') maxAge in ms (default is 1 days) */
        /** 'session' will result in a cookie that expires when session/browser is closed */
        /** Warning: If a session cookie is stolen, this cookie will never expire */
        maxAge: 86400000,
        overwrite: true, /** (boolean) can overwrite or not (default true) */
        httpOnly: true, /** (boolean) httpOnly or not (default true) */
        signed: true, /** (boolean) signed or not (default true) */
        rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
        renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    },
    redisConfid: { // redis数据库信息
        'port': 6379, // 端口
        'host': '127.0.0.1', // 主机
        'password': 'pass', // 密码
        'db': 0, // 数据
        'ttl': 10000000  
    },
    secretkey: 123456 , // 重要这里是客户端链接支付接口已经后续支付所需的密匙
    qiniu: { // 七牛云储存信息
        accessKey: 'accessKey',
        secretKey: 'secretKey',
        bucket_lists: {
            static: 'ad'
        }
    },
    baidu: { // 百度识图key
        APP_ID: "xx",
        API_KEY: "xx",
        SECRET_KEY: "xxx"
        
    },
    admin: { // 设置管理员用户密码
        username: 'admin',
        password: 'admin'
    }
}