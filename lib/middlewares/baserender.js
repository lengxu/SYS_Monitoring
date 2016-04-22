"use strict";

let WechatAPI = require('../Wechat/wechatapi');

let config = require('../../config');

var WechatUserModel = require('../../viewmodels/wechatuser');

var thunkify = require('thunkify-wrap');

module.exports = function*(ctx, path, opts) {

    opts = opts || {};

    var param = {

        debug: config.wechatinfo.jssdk.debug,

        jsApiList: config.wechatinfo.jssdk.jsApiList,

        url: config.siteinfo.host + ctx.url
    };

    opts.wechatconfig = JSON.stringify(yield * WechatAPI.getJsConfig(param));

    var wechatUserInfo = ctx.session.wechatUserInfo;

    if (!opts.layout) {

        opts.layout = 'layout';

    }
    opts.wechatUserInfo = wechatUserInfo;

    var result = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(wechatUserInfo.openid);

    if (result && result.userinfo.tel)
    {
        opts.wechatUserInfo.userinfo=result.userinfo;
    }
    yield ctx.render(path, opts);
}