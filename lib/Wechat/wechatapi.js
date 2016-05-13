var WechatAPI = require('co-wechat-api'),

    config = require('../../config'),

    api = new WechatAPI(config.wechatinfo.appid, config.wechatinfo.appsecret);

module.exports = api;
