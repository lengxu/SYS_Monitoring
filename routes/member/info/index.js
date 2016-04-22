'use strict';

var WechatUserModel = require('../../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var baserender = require('../../../lib/middlewares/baserender');
let koaMongoosePagination = require('koa-mongoose-pagination'),
    config = require('../../../config');

//个人信息页面
exports.detail = function*() {
    yield baserender(this, "member/info/detail", {
        title: '用户信息',
        menuinfo:{index:"active"}
    });
}
//完善个人信息
exports.showadd = function*() {
    yield baserender(this, "member/info/add", {
        title: '保存用户信息',
        menuinfo:{index:"active"}
    });
}
exports.doadd = function*() {
    var info = this.request.body;

    var wechatuser = this.session.wechatUserInfo;

    wechatuser.userinfo=info;

    wechatuser.userinf.updatetime=new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

    yield thunkify(WechatUserModel.updateUserInfoByOpenID,WechatUserModel)(wechatuser.openid,info);

    this.send(null, 0, "保存成功");
}


//修改个人信息页面
exports.edit = function*() {
    console.log('444444');
    yield baserender(this, "member/info/edit", {
        title: '修改用户信息',
        menuinfo:{index:"active"}
    });
}

exports.doedit = function*() {

    var info = this.request.body;

    var wechatuser = this.session.wechatUserInfo;

    wechatuser.userinf=info;

    wechatuser.userinf.updatetime=new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

    yield thunkify(WechatUserModel.updateUserInfoByOpenID,WechatUserModel)(wechatuser.openid,info);

    this.send(null, 0, "保存成功");
}