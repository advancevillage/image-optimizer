### 项目说明

 * 将切图脚本部署到AWS Lambda
 
### 目录结构
 * index.js Lambda 实时处理脚本
 * watermark.png 不同尺码的水印图
 * .gitignore

### 部署开发环境
 *  mkdir node_modules
 *  npm install sharp
 
### 依赖
 * sharp >= 0.22.0
 * nodejs 8.10 
 
### 构建zip压缩包
 * index.js
 * azazie-*.png
 * node_modules
 
### 参考文档
 * [案例一] https://www.vividbytes.io/lambda-edge-image-optimizer/  
 * [原理说明] http://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html

### 注意事项
 * AWS Lambda 服务角色配置,配置错误可能直接导致CDN服务错误

### 配置AWS
 * IAM
     * Roles -> Create Roles
        * name: 
            * image-optimizer
        * policies: 
            * AWSLambdaExecute
            * S3 List Write 
 * Lambda
    * 调整超时时间 20s
    * 调整内存大小 1024MB
 
 ### Lambda 测试用例
 ```json
 {
  "Records": [
    {
      "cf": {
        "config": {
          "distributionId": "E1QTUVDVO01P4M"
        },
        "request": {
          "headers": {
            "host": [
              {
                "key": "Host",
                "value": "d13z8129ep2sgc.cloudfront.net"
              }
            ],
            "user-name": [
              {
                "key": "User-Name",
                "value": "CloudFront"
              }
            ]
          },
          "clientIp": "2001:cdba::3257:9652",
          "uri": "/upimg/azazie/h/05/ce/3126fe9a7d7291f4fba23c1563a005ce.jpg",
          "method": "GET"
        },
        "response": {
          "status": "404",
          "statusDescription": "OK",
          "headers": {
            "x-cache": [
              {
                "key": "X-Cache",
                "value": "Hello from Cloudfront"
              }
            ]
          }
        }
      }
    }
  ]
}
 ```         

### 图像压缩
  * [imagecompressor](https://imagecompressor.com/ "图像在线压缩")
  * [tinypng](https://tinypng.com/ "图片压缩")
  * [compressor](https://compressor.io/compress "图片压缩")
  * [图像压缩工具](https://blog.csdn.net/yong_wuqing/article/details/81626351)
  * [Facebook Spectrum](https://www.oschina.net/news/103782/facebook-releases-spectrum-make-uploading-photos-more-efficient "Spectrum")
