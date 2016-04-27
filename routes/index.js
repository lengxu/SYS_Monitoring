var UserModel = require('../viewmodels/user');
var $ = require('../lib/util/md5');
var baserender=require('../lib/middlewares/baserender');

var http = require('http');

//登录
exports.index = function *(){

    var qrcode = require('node-qrcode');

    qrcode({
        text: 'http://weibo.com',
        size: 200,
        qrcodePath: './public/upload/qrcode/qrcode22.png'
    }).then(function(qrcodePath) {
        console.log(qrcodePath);  // balabala/node-qrcode/qrcode.png
    });

    this.body='111111';
}
