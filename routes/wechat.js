"use strict";
var WechatUserModel = require('../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var OAuth = require('co-wechat-oauth');
let config = require('../config');
var client = new OAuth(config.wechatinfo.appid, config.wechatinfo.appsecret);
var baserender = require('../lib/middlewares/baserender');


//登录
exports.getwechatlogin = function*() {
    yield baserender(this, "wechatlogin", {
        title: 'wechatlogin',
        returnurl: this.query['returnurl']
    });
}


//登录
exports.callback = function*() {
    let info = this.query;
    let token = yield client.getAccessToken(info.code);
    let accessToken = token.data.access_token;
    let openid = token.data.openid;

    var wechatuser = new WechatUserModel();

    wechatuser.openid = openid;

    console.log(info);

    if (config.wechatinfo.scope == 'snsapi_userinfo') {

        let options = {
            "openid": openid, // 必须
            "lang": "zh_CN" // zh_CN 简体，zh_TW 繁体，en 英语
        };
        wechatuser = yield client.getUser(options);

    }
    //检查是否存在该用户
    var result = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(wechatuser.openid);

    console.log(result);

    if (result) {

        console.log('111111');
        wechatuser.updatetime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

        this.session.wechatUserInfo = wechatuser;

        result = yield thunkify(result.update, result)(wechatuser);

        if (info.returnurl && info.returnurl != '') {

            this.redirect(info.returnurl);

        } else {
            this.body = wechatuser;
        }

        return;
    }

    console.log('2222222');

    wechatuser = new WechatUserModel(wechatuser);

    yield thunkify(new WechatUserModel(wechatuser).save, wechatuser);

    this.body = wechatuser;

    this.session.wechatUserInfo = wechatuser;

}
