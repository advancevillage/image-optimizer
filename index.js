const querystring = require('querystring');
const aws = require('aws-sdk');
const sharp = require('sharp');
const crypto = require('crypto');
const s3 = new aws.S3({signatureVersion: 'v4'});
/**
 *const bucket = 'azazietestimg'; 测试环境
 *const bucket = 'azazieimg';     正式环境
 */
const bucket = 'azazieimg';
const origin = '/origin';

/**
 * @breif: Lambda main
 */
exports.handler = (event, context, callback) =>
{
    let response = event.Records[0].cf.response;
    /**
     * @breif: https://docs.aws.amazon.com/zh_cn/lambda/latest/dg/lambda-edge.html
     * @event: Origin Response
     * @note:
     *   response.status == "404"
     *   not
     *   response.status === "404"
     * 这里只要求值相同,不要求类型相同,避免AWS修改API导致脚本异常
     */
    if (response.status == 404) {
        const request = event.Records[0].cf.request;
        const uri = request.uri;
        const options = querystring.parse(request.querystring);
        const maxsize = 2000;
        let width = Math.min(options.width || maxsize, maxsize);
        let height = Math.min(options.height || maxsize, maxsize);
        /**
         * @breif: 解析URI
         * @param: prefix  like upimg,upvide,pla,upics,uppdf,userfiles
         * @param: watermark  是控制是否进入水印图逻辑的开关
         * @param: thumbname
         * @param: tail
         * eg:
         *  /upimg/azazie/s600//b1//62/6744f702b85f2ccf7b3496367ef9b162.jpg
         *  prefix:  upimg
         *  watermark: azazie
         *  thumbname: s600
         *  tail: /b1//62/6744f702b85f2ccf7b3496367ef9b162.jpg
         *
         *  /upimg/s600//b1//62/6744f702b85f2ccf7b3496367ef9b162.jpg
         *  prefix: upimg
         *  watermark:
         *  thumbname: s600
         *  tail: /upimg/azazie/s600//b1//62/6744f702b85f2ccf7b3496367ef9b162.jpg
         *
         *  //////upimg////20190403113819230229278////s600//////b1//62/6744f702b85f2ccf7b3496367ef9b162.jpg
         *  "20190403113819230229278".length === 23
         */
        let i = 0, j =0, k = 0, flag = 0;
        let len = uri.length;
        let prefix = "", watermark = "", thumbname = "",tail = "", format = "", key = "", renew = 0;
        while (i < len){
            let value = uri[i].charCodeAt(0);
            if((value >= 48 && value <= 57) || (value>=65 && value <=90) || (value>=97 && value<=122) || value == 95 || value == 45){
                j = i;
                i++;
                while(i < len ){
                    value = uri[i].charCodeAt(0);
                    if ((value >= 48 && value <= 57) || (value>=65 && value <=90) || (value>=97 && value<=122) || value == 46 || value == 95 || value == 45){
                        i++;
                    }else {
                        break;
                    }
                }
                let str = uri.substring(j,i);
                switch(k){
                    case 0:
                        prefix = str;
                        break;
                    case 1:
                        if (str.length === 23) {
                            renew = 1;
                            k--;
                        }else if(str === "azazie" || str === "loveprom" || str === "ppml"){
                            watermark = str;
                            k--;
                        }else{
                            thumbname = str;
                        }
                        break;
                    default:
                        tail = tail + "/" + str;
                }
                k++;
            }else {
                i++;
            }
        }
        len = tail.length;
        i = len;
        while(i > 0 && tail[i-1] !== '.') i--;
        format = tail.substring(i,len);
        format = format === "jpg" ? "jpeg" : format;
        key = (watermark === "") ? prefix + "/" + thumbname + tail :  prefix + "/" + watermark + "/" + thumbname + tail;
        /**
         *@breif: 逻辑处理部分
         */
        if (prefix === "upimg") {
            switch (thumbname) {
                case 'o':
                    //原始图片宽高不确定，需要在后面动态获取并且设置
                    flag = 2;
                    break;
                case 'c1000':
                    width = 1000;
                    height = 1000;
                    flag = 2;
                    break;
                case 'c800':
                    width = 800;
                    height = 800;
                    flag = 2;
                    break;
                case 'h':
                    width = 1140;
                    height = 1578;
                    flag = 2;
                    break;
                case 'l':
                    width = 237;
                    height = 320;
                    flag = 2;
                    break;
                case 'm':
                    width = 270;
                    height = 370;
                    flag = 2;
                    break;
                case 'm179':
                    width = 179;
                    height = 248;
                    flag = 2;
                    break;
                case 'o390':
                    width = 390;
                    height = 540;
                    flag = 2;
                    break;
                case 'o400':
                    width = 400;
                    height = 400;
                    flag = 2;
                    break;
                case 'o430':
                    width = 430;
                    height = 595;
                    flag = 2;
                    break;
                case 'o500':
                    width = 500;
                    height = 500;
                    flag = 2;
                    break;
                case 'o530':
                    width = 530;
                    height = 734;
                    flag = 2;
                    break;
                case 'o540':
                    width = 540;
                    height = 900;
                    flag = 2;
                    break;
                case 'o600':
                    width = 600;
                    height = 600;
                    flag = 2;
                    break;
                case 'o800':
                    width = 800;
                    height = 1107;
                    flag = 2;
                    break;
                case 's':
                    width = 228;
                    height = 228;
                    flag = 2;
                    break;
                case 's128':
                    width = 128;
                    height = 128;
                    flag = 2;
                    break;
                case 's160':
                    width = 160;
                    height = 160;
                    flag = 2;
                    break;
                case 's171':
                    width = 171;
                    height = 284;
                    flag = 2;
                    break;
                case 's179':
                    width = 179;
                    height = 278;
                    flag = 2;
                    break;
                case 's240':
                    width = 240;
                    height = 332;
                    flag = 2;
                    break;
                case 'm240':
                    width = 240;
                    height = 400;
                    flag = 2;
                    break;
                case 's290':
                    width = 290;
                    height = 401;
                    flag = 2;
                    break;
                case 's318':
                    width = 318;
                    height = 531;
                    flag = 2;
                    break;
                case 's360':
                    width = 360;
                    height = 498;
                    flag = 2;
                    break;
                case 's42':
                    width = 42;
                    height = 42;
                    flag = 2;
                    break;
                case 's480':
                    width = 480;
                    height = 664;
                    flag = 2;
                    break;
                case 's50':
                    width = 50;
                    height = 83;
                    flag = 2;
                    break;
                case 's600':
                    width = 600;
                    height = 830;
                    flag = 2;
                    break;
                case 's66':
                    width = 66;
                    height = 110;
                    flag = 2;
                    break;
                case 's74':
                    width = 74;
                    height = 102;
                    flag = 2;
                    break;
                case 's800':
                    width = 800;
                    height = 800;
                    flag = 2;
                    break;
                case 's85':
                    width = 85;
                    height = 85;
                    flag = 2;
                    break;
                case 's96':
                    width = 96;
                    height = 160;
                    flag = 2;
                    break;
                case 'b800':
                    width = 800;
                    height = 800;
                    flag = 2;
                    break;
                default:
                    flag = 3;
                    break;
            }
        }else {
            flag = 1;
        }
        /**
         * @param:  flag 标志位
         *  flag = 0  初始化
         *  flag = 1  匹配错误
         *  flag = 2  系统自定义缩略图名称
         *  flag = 3  动态切图
         */
        // debug info
        // console.log(prefix);
        // console.log(watermark);
        // console.log(thumbname);
        // console.log(tail);
        // console.log(format);
        // console.log(flag);
        // console.log(width);
        // console.log(height);
        // console.log(uri);
        // console.log(bucket);
        // console.log(key);
        // console.log(renew);

        if (flag === 1 || flag === 0 || flag === 3) {
            //debug
            console.log(flag);
            callback(null, response);
        } else {
            // get the source image file
            s3.getObject({Bucket: bucket, Key: prefix + origin + tail}).promise()
            .then(
                /**
                 * @doc: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Request.html#promise-property
                 */
                async(data) => {
                    const image = await sharp(data.Body);
                    if(watermark) {
                        if(thumbname === 'o') {
                            const metadata = await image.metadata();
                            width = metadata.width;
                            height = metadata.height;
                            width = (width <= 1710) ? width : 1710;
                            height = (height <= 2367) ? height : 2367;

                        }
                        /**
                         * @note: 水印说缩略图必须与原图等比(1140/1578=1710/2367=1/1.384)
                         */
                        const watermarkBuffer = await sharp(watermark + '.png').resize(width,height).toBuffer();
                        return image
                            .resize(width, height)
                            .composite([{ input: watermarkBuffer, top: 0, left: 0 }])
                            .toFormat(format)
                            .toBuffer()
                    } else {
                        /**
                         * @breif:
                         * height <= 1.384*width -> 高为准
                         * height >  1.384*width -> 宽为准
                         *
                         * 1.38 <= height/width <= 1.387 判定为等比
                         */
                        let h = 1387*width - 1000*height;
                        let w = 1000*height - 1380*width;
                        if (h >= 0 && w >= 0){
                            return image
                                .resize(width,height)
                                .toFormat(format)
                                .toBuffer()
                        }else {
                            h = ((height*1000) <= (1384*width)) ? height : null;
                            w = ((height*1000) <= (1384*width)) ? null : width;
                            const imgageBuffer = await image.resize(w, h).toBuffer();
                            return sharp('background.png')
                                .resize(width,height)
                                .composite([{input: imgageBuffer, gravity: 'north'}])
                                .toFormat(format)
                                .toBuffer()
                        }
                    }
                },
                function (error) {
                    console.log(error);
                    callback(null, response);
                }
            )
            .then(buffer => {
                s3.putObject({
                    ACL: "public-read",
                    Body: buffer,
                    Bucket: bucket,
                    ContentType: 'image/' + format,
                    CacheControl: 'max-age=31536000',
                    Key: key,
                    StorageClass: 'STANDARD'
                }).promise().catch(err => { console.log(err);});
                try {
                    // generate a binary response with resized image
                    response.status = 200;
                    response.body = buffer.toString('base64');
                    response.bodyEncoding = 'base64';
                    response.headers['content-type'] = [{key: 'Content-Type', value: 'image/' + format}];
                    response.headers['accept-ranges'] = [{key: 'Accept-Ranges', value: 'bytes'}];
                    response.headers['last-modified'] = [{key: 'Last-Modified', value: new Date().toUTCString()}];
                    response.headers['etag'] = [{key: 'Etag', value: '\"' + crypto.createHash('md5').update(buffer).digest('hex') + '\"'}];
                    response.headers['cache-control'] = [{key: 'Cache-Control', value: 'public, max-age=31536000'}];
                }catch (err){
                    console.log(err);
                }
                callback(null, response);
            })
            .catch(err => {console.log(err);});
        }
    } else {
        // allow the response to pass through
        callback(null, response);
    }
};