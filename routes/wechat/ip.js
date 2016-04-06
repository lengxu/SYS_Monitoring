"use strict";
 let   WechatAPI = require('../../lib/Wechat/wechatapi');
 
//获取微信服务器IP地址
exports.getIp  = function*() {

    var result=yield * WechatAPI.getIp();

    this.body=result;
}
