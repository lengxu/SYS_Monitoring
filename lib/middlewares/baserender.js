"use strict";

let WechatAPI = require('../Wechat/wechatapi');

let config = require('../../config');

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
    yield ctx.render(path, opts);
}