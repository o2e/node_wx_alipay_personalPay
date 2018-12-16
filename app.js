const koa = require('koa');
const serve = require('koa-static');
const session = require('koa-session');
const bodyParams = require('koa-bodyparser');
const config = require('./com/config')
const login = require('./api/login'); // 登录 退出 
const pay = require('./api/addons/pay'); // 支付
const updata = require('./api/addons/updata'); // 上传图片
const qrcode = require('./api/qrcode'); // 获取二维码信息
const googs = require('./api/goods'); // 商品管理
const order = require('./api/order'); // 订单信息
const count = require('./api/count'); // 各种统计数据展示
const app = new koa();

app.proxy = true; 
app.keys = ['some secret hurr'];
app.use(session(config.sessionConfig,app))
app.use(bodyParams())
app.use(login.routes())
app.use(pay.routes())
app.use(updata.routes())
app.use(googs.routes())
app.use(qrcode.routes())
app.use(order.routes())
app.use(count.routes())
app.use(serve(__dirname + '/www'));

app.listen(80);


