nodeJS版个人支付免签系统
技术栈 Koa2 + Vue + Mysql + Redis 

主要用来解决没有营业执照，想使用微信和支付宝收款，收款的逻辑在/api/addons/pay.js文件里，不需要后台等功能的同学可以根据此文件单独写自己的功能，可我不喜欢nodeJS啊，那你可以使用你喜欢的任何语言进行开发；

特点：支付回调通知，0手续费实时到账，全部服务端源代码，随意接入其他系统；

实现原理： 监听支付宝客户端推送信息，最安全的一种方式；

后台Demo地址: pay.yio.me 账号密码 admin
支付Demo地址: http://pay.yio.me/#/goods/DwnNGCW4VLk1CjemIiUqf
安装方式
    !!! 依赖nodeJS + mysql + redis 环境
    1.下载全部源码；
    2.修改 /com目录中 config.js 和 email.js 文件；
    3.在根目录中运行 npm install 安装依赖；
    4.在根目录中运行 node app.js 没有错误信息,访问ip:80即可访问;
    5.监听运行建议使用 pm2 ;
    
----------
使用方法
    1.添加商品
    ![添加商品][1]


  注意，这里的价格设置的是一元
  
  2.上传收款二维码
    ![收款二维码][2]

   收款二维码和商品价格的关系：
        用户付款后 -> 客户端通知后台 微信 或者 支付宝，收到多少金额，后台做相应的处理;

        为了避免同一金额在同一时间被支付，订单有效期为5分钟，在商品的金额上随机下调,范围0.10元，那么一个1元的商品需要上传 1.00、0.99、0.98 ... 0.92 、0.91 十个微信+支付宝收款二维码；

3.商品的地址统一是
    http://localhost/#/goods/DwnNGCW4VLk1CjemIiUqf

    "DwnNGCW4VLk1CjemIiUqf"是商品nanoid
4.客户端配置说明
    api 地址填写： http(s)://localhost/addons/pay/

    签名密匙填写： config.js里的 secretkey 值

5.请把支付宝/微信/收款客户端加入手机清理白名单，并保持网络畅通；

6.全部代码是开源的，客户端需要赞助使用；

最后：
    客户端需赞助地址        

     http://pay.yio.me/#/goods/74ct1zBzZBW8YGFBKe-Yf

    史上最低价格，只需20元啊，等什么呢！
    
    第一次价格20元，后面会持续涨价2018年12月16日。
    
  [1]: http://static.yio.me/1544963117843.png
  [2]: http://static.yio.me/1544963317220.png
  