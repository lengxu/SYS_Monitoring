"use strict";
var WechatUserModel = require('../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var OAuth = require('co-wechat-oauth');
let config = require('../../config');
var client = new OAuth(config.wechatinfo.appid, config.wechatinfo.appsecret);
var baserender=require('../../lib/middlewares/baserender');
var iphelper = require('../../lib/util/iphelper.js');

//登录
exports.getwechatlogin = function*() {
    yield baserender(this,"wechatlogin", {
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
    console.log(info);

    wechatuser.openid = openid;

    if (config.wechatinfo.scope == 'snsapi_userinfo') {

        let options = {
            "openid": openid, // 必须
            "lang": "zh_CN" // zh_CN 简体，zh_TW 繁体，en 英语
        };
        wechatuser = yield client.getUser(options);

    }

    wechatuser.addip=iphelper.address(this);
    //检查是否存在该用户
    var result = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(wechatuser.openid);

    if (result) {
        console.log('1111111');

        result.updatetime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

        this.session.wechatUserInfo = result;

        result = yield thunkify(result.update, result)(result);


    }
    else {
        console.log('22222222');

        wechatuser = new WechatUserModel(wechatuser);

        yield thunkify(new WechatUserModel(wechatuser).save, wechatuser);

        this.session.wechatUserInfo = wechatuser;
    }

    if (info.returnurl && info.returnurl != '') {

        this.redirect(info.returnurl);

    } else {
        this.body = result;
    }

    return;

}



exports.settestlogin = function*() {

    let info = this.query;

    var wechatuser = new WechatUserModel();

    wechatuser.openid = info.openid||'testopenid1';

    wechatuser.nickname = info.nickname||'testnickname';


    //检查是否存在该用户
    var result = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(wechatuser.openid);

    if (result) {

        result.updatetime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

        this.session.wechatUserInfo = wechatuser;

        result = yield thunkify(result.update, result)(result);

    }
    else {

        wechatuser = new WechatUserModel(wechatuser);

        yield thunkify(new WechatUserModel(wechatuser).save, wechatuser);

        this.body = wechatuser;

        this.session.wechatUserInfo = wechatuser;
    }

    this.body = '模拟登录成功';
}