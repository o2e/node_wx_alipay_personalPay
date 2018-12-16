const islogin = async (ctx, next) => {
    try {
        if(!ctx.session.name) {
            ctx.body = {
                code: -1,
                msg: '未登录!',
                data: ''
            }
        }
        await next();
    } catch(e) {
        throw ('登录失效!')
    }
}

module.exports = islogin