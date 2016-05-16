"use strict";
var util = require('util');
var OAuth = require('co-wechat-oauth');
let config = require('../../config');
var client = new OAuth(config.wechatinfo.appid, config.wechatinfo.appsecret);
var WechatUserModel = require('../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');

/*
 * 校验会话
 */
exports.api = function() {
    return function*(next) {
        if (!this.session || !this.session.wechatUserInfo) {
            this.send(null, 999, "会话失效");
            return;
        }

        //判断是否关注过公众号
        var result = client.getUser(this.session.wechatUserInfo.openid);

        if (!result|| result.subscribe==0)
        {
            this.send(null, 999, "请先关注公众号");
            return;
        }



        yield next;
    }
}

exports.infoapi = function() {
    return function*(next) {
        if (!this.session || !this.session.wechatUserInfo) {
            this.send(null, 999, "会话失效");
            return;
        }

        //判断是否关注过公众号
        var result = client.getUser(this.session.wechatUserInfo.openid);

        if (!result|| result.subscribe==0)
        {
            this.send(null, 999, "请先关注公众号");
            return;
        }


        var result = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(this.session.wechatUserInfo.openid);
        if (!result || !result.userinfo.tel)
        {
            this.send(null, 999, "请先完善信息");

            return;
        }
        yield next;
    }
}

exports.view = function() {
    return function*(next) {
        if (!this.session || !this.session.wechatUserInfo) {

            var url = client.getAuthorizeURL(config.wechatinfo.redirectUrl + '?returnurl=' + this.url, 'state', config.wechatinfo.scope);

            this.redirect(url);
            /* yield this.render("login", {
                 title: 'login',
                 "layout": "template"
             });*/
            return;
        }

        //判断是否关注过公众号
        var result = client.getUser(this.session.wechatUserInfo.openid);

        if (!result|| result.subscribe==0)
        {
            this.redirect('/member/wechat/index');

            return;
        }


        yield next;
    }
}

exports.infoview = function() {
    return function*(next) {
        if (!this.session || !this.session.wechatUserInfo) {

            var url = client.getAuthorizeURL(config.wechatinfo.redirectUrl + '?returnurl=' + this.url, 'state', config.wechatinfo.scope);

            this.redirect(url);
            /* yield this.render("login", {
             title: 'login',
             "layout": "template"
             });*/
            return;
        }

        //判断是否关注过公众号
        var result = client.getUser(this.session.wechatUserInfo.openid);

        if (!result|| result.subscribe==0)
        {
            this.redirect('/member/wechat/index');
            return;
        }



        var result = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(this.session.wechatUserInfo.openid);
 
        if (!result || !result.userinfo.tel)
        {
            this.redirect('/member/info/add');

            return;
        }
        yield next;
    }
}