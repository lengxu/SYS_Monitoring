'use strict';

var WechatUserModel = require('../../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var baserender = require('../../../lib/middlewares/baserender');
let koaMongoosePagination = require('koa-mongoose-pagination'),
    config = require('../../../config');

//添加项目
exports.showadd = function*() {
    yield baserender(this, "member/info/add", {
        title: '保存用户信息'
    });
}
exports.doadd = function*() {
    var info = this.request.body;

    var wechatuser = this.session.wechatUserInfo;

    wechatuser.userinf=info;

    console.log('1111111111111111111');
    yield thunkify(WechatUserModel.updateUserInfoByOpenID,WechatUserModel)(wechatuser.openid,info);
    console.log('22222222222222222222');
    // yield thunkify(wechatuser.save, wechatuser);

    this.send(null, 0, "保存成功");

}
