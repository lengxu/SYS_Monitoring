"use strict";
let config = require('../../config'),
    baserender = require('../../lib/middlewares/baserender'),
    WechatAPI = require('../../lib/Wechat/wechatapi'),
    fs = require('co-fs'),
    uploadhelper = require('../../lib/util/uploadhelper');


//创建临时二维码
exports.createTmpQRCode = function*() {

    //场景ID
    let sceneId=100;
    //过期时间，单位秒。最大不超过1800
    let expire=1800;

    var result=yield * WechatAPI.createTmpQRCode(sceneId, expire);

    this.body=result;
}

//创建临时二维码
exports.createLimitQRCode = function*() {

    //场景ID。ID不能大于100000
    let sceneId=100;
    var result=yield * WechatAPI.createLimitQRCode(sceneId);

    this.body=result;
}

//生成显示二维码的链接
exports.showQRCodeURL = function*() {

    //场景ID。ID不能大于100000
    let sceneId=100;
    //过期时间，单位秒。最大不超过1800
    var result=yield * WechatAPI.createLimitQRCode(sceneId);

    console.log(result);

    var qrcodeurl= WechatAPI.showQRCodeURL(result.ticket);

    console.log(qrcodeurl);

    this.body=qrcodeurl;
}
