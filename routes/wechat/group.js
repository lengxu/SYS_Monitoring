"use strict";
let WechatAPI = require('../../lib/Wechat/wechatapi');

//获取分组列表
exports.getGroups = function*() {

    var result = yield * WechatAPI.getGroups();

    this.body = result;
}

//查询用户在哪个分组
exports.getWhichGroup = function*() {

    let openid = '';
    var result = yield * WechatAPI.getWhichGroup(openid);

    this.body = result;
}

//创建分组
exports.createGroup = function*() {

    var result = yield * WechatAPI.createGroup('groupname');

    this.body = result;
}