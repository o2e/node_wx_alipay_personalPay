const router = require('koa-router')()
const admin = require('../../controller/login')
const { client } = require('../../com/bd')

router.post('/api/login', async (ctx, next) => {
    let params = ctx.request.body,
        username = params.username,
        password = params.password;
    if (!params.username || !params.password) {
        ctx.body = {
            code: -1,
            data: '',
            msg: '参数有误!'
        }
    }
    let loginNum = false

    const cclogin = () => {
        return new Promise((rej) => {
            client.get(ctx.ip,  async (err, result) => { // 防止爆破登录
                if (parseInt(result) > 3 && result != undefined) {
                    loginNum = true
                    rej()
                } else {
                    loginNum = false
                    rej()
                }
            })
        })
    }

    await cclogin()

    if (loginNum) {
        ctx.body = {
            code: -1,
            data: '',
            msg: '禁止登录，请稍后再试!'
        }
        return false
    }

    let data = await admin.login(username,password);
    if (data) {
        ctx.session.name = data.id
        await admin.last_login(data.id)
        ctx.body = {
            code: 1,
            data: data,
            msg: '登录成功!'
        }
    } else {
        client.get(ctx.ip, (err, result) => {
            if (result == undefined) {
                client.set(ctx.ip,1,'EX',86400)
            } else {
                client.set(ctx.ip,++result,'EX',86400)
            }
        });

        ctx.body = {
            code: -1,
            data: '',
            msg: '账号或密码不正确!'
        }
    }
})

router.post('/api/login/out', async (ctx, next) => {
    ctx.session.name = undefined
    if (!ctx.session.name) {
        ctx.body = {
            code: 1,
            data: '',
            msg: '退出成功!'
        }
    } else {
        ctx.body = {
            code: -1,
            data: '',
            msg: '退出失败!'
        }
    }
})
module.exports = router