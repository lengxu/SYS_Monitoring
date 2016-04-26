"use strict";
var util = require('util');
let config = require('../../config');
var thunkify = require('thunkify-wrap');

exports.view = function() {
    return function*(next) {
        // //判断终端
        // if (!this.session || !this.session.wechatUserInfo) {
        //
        //     var url = client.getAuthorizeURL(config.wechatinfo.redirectUrl + '?returnurl=' + this.url, 'state', config.wechatinfo.scope);
        //
        //     this.redirect(url);
        //     /* yield this.render("login", {
        //          title: 'login',
        //          "layout": "template"
        //      });*/
        //     return;
        // }

        yield next;
    }
}

