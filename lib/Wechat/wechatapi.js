var WechatAPI = require('co-wechat-api'),

    config = require('../../config.js'),

    api = new WechatAPI(config.wechatinfo.appid, config.wechatinfo.appsecret);

module.exports = api;
