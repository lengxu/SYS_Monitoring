"use strict";
var util = require('util');
var OAuth = require('co-wechat-oauth');
let config = require('../../config');
var client = new OAuth(config.wechatinfo.appid, config.wechatinfo.appsecret);

/*
 * 校验会话
 */
exports.api = function() {
    return function*(next) {
        if (!this.session || !this.session.wechatUserInfo) {
            this.send(null, 999, "会话失效");
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
        yield next;
    }
}
