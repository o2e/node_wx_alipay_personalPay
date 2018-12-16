const request = require('request')
const visitorsContorller = require('../../controller/visitors')

const visitors = async (ctx, next) => {
    try{
        let ip = ctx.ip
        let data
        let header = {
        	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          	'Host': 'ip.taobao.com',
            'Pragma': 'no-cache',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
        
        request.get({
            url: 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip,
          	header:header,
        }, async (error, response, body) => {
          if (error) {
            throw('请求ip地址失败!')
          } else {
            data = body
            await visitorsContorller.create_ips({
              ip: ip,
              location: data
            })
          }
        })
       await next()
    } catch (e) {
       console.log(e)
       await next()
    }
} 

module.exports = visitors