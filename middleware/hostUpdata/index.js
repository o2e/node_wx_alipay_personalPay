const fs = require('fs');
const path = require('path')
// 储存在本地的图， 中间件的形式，返回的是文件路径

const hostupdata = async (ctx,next) => {
  try {
        const imgType  = type => {
            let result 
            switch (type) {
                case 'image/png':
                    result = '.png'
                    break;
                case 'image/jpg':
                    result = '.jpg'
                    break;
                case 'image/jpeg':
                    result = '.jpeg'
                    break
                default: 
                    result = 'no'
            }
            return result
        }
        // 上传单个文件
        const file = ctx.request.files; // 获取上传文件
        // 创建可读流
        let imgTypes = imgType(file.file.type)
        if(imgTypes == 'no') {
            throw('上传文件类型有误!')
        }
        const reader = fs.createReadStream(file.file.path);
        let filePath = path.join(__dirname, '../../updata/') + +new Date() + imgTypes;
        // 创建可写流
        const upStream = fs.createWriteStream(filePath);
        // 可读流通过管道写入可写流
        reader.pipe(upStream);
        ctx.state.file = {
            code: 0,
            data: filePath,
            msg: '上传成功'
        }
        next()
        
    }catch (e) {
       ctx.state.file = {
            code: -1,
            data: '',
            msg: e
        }
        next()
    }
}
module.exports = hostupdata